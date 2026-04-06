import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAuthToken } from "./api";
import { normalizeComment } from "../utils/apiMappers";

const API_URL = import.meta.env.VITE_API_URL ?? "https://exquisite-creativity-production.up.railway.app/api";
const WS_URL = import.meta.env.VITE_WS_URL ?? API_URL.replace(/\/api\/?$/, "/ws");

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.globalListeners = new Set();
    this.commentListeners = new Map();
    this.commentSubscriptions = new Map();
    this.globalSubscriptions = [];
  }

  connect() {
    if (this.client?.active || this.connected) return;

    this.client = new Client({
      reconnectDelay: 5000,
      beforeConnect: () => {
        const token = getAuthToken();
        if (!token) return;

        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`,
          authorization: `Bearer ${token}`,
          token,
        };
      },
      webSocketFactory: () => {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Missing auth token for websocket connection.");
        }

        return new SockJS(buildSocketUrl(token));
      },
      debug: () => {},
      onConnect: () => {
        this.connected = true;
        this.subscribeGlobalTopics();
        this.resubscribeCommentTopics();
      },
      onDisconnect: () => {
        this.connected = false;
      },
      onStompError: () => {
        this.connected = false;
      },
      onWebSocketClose: () => {
        this.connected = false;
      },
    });

    this.client.activate();
  }

  disconnect() {
    this.connected = false;
    this.globalSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.globalSubscriptions = [];

    this.commentSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.commentSubscriptions.clear();

    if (this.client?.active) {
      this.client.deactivate();
    }

    this.client = null;
  }

  addGlobalListener(listener) {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  subscribeToTicketComments(ticketId, listener) {
    const ticketKey = String(ticketId);
    const listeners = this.commentListeners.get(ticketKey) ?? new Set();
    listeners.add(listener);
    this.commentListeners.set(ticketKey, listeners);

    if (this.connected && !this.commentSubscriptions.has(ticketKey)) {
      this.subscribeCommentTopic(ticketKey);
    }

    return () => {
      const current = this.commentListeners.get(ticketKey);
      if (!current) return;

      current.delete(listener);
      if (current.size === 0) {
        this.commentListeners.delete(ticketKey);
        const subscription = this.commentSubscriptions.get(ticketKey);
        if (subscription) {
          subscription.unsubscribe();
          this.commentSubscriptions.delete(ticketKey);
        }
      }
    };
  }

  subscribeGlobalTopics() {
    if (!this.client || !this.connected) return;

    this.globalSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.globalSubscriptions = [];

    const destinations = [
      "/topic/tickets/nuevo",
      "/topic/tickets/actualizacion",
      "/topic/tickets/cerrado",
      "/user/queue/asignacion",
      "/user/queue/comentarios",
    ];

    destinations.forEach((destination) => {
      const subscription = this.client.subscribe(destination, (message) => {
        const payload = parseSocketPayload(message.body);
        this.emitGlobalEvent({
          destination,
          payload,
        });
      });

      this.globalSubscriptions.push(subscription);
    });
  }

  subscribeCommentTopic(ticketId) {
    if (!this.client || !this.connected || this.commentSubscriptions.has(ticketId)) return;

    const subscription = this.client.subscribe(`/topic/tickets/${ticketId}/comentarios`, (message) => {
      const payload = normalizeComment(parseSocketPayload(message.body));
      const listeners = this.commentListeners.get(String(ticketId));
      if (!listeners?.size) return;

      listeners.forEach((listener) => listener(payload));
    });

    this.commentSubscriptions.set(String(ticketId), subscription);
  }

  resubscribeCommentTopics() {
    this.commentSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.commentSubscriptions.clear();

    this.commentListeners.forEach((_, ticketId) => {
      this.subscribeCommentTopic(ticketId);
    });
  }

  emitGlobalEvent(event) {
    this.globalListeners.forEach((listener) => listener(event));
  }
}

function parseSocketPayload(body) {
  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    return { message: body };
  }
}

function buildSocketUrl(token) {
  const separator = WS_URL.includes("?") ? "&" : "?";
  return `${WS_URL}${separator}token=${encodeURIComponent(token)}`;
}

export const websocketService = new WebSocketService();
