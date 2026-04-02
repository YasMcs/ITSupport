import { api, extractData } from "./api";
import { buildCommentPayload, normalizeComment } from "../utils/apiMappers";

export const commentService = {
  async getByTicket(ticketId) {
    const response = await api.get(`/comentarios/ticket/${ticketId}`);
    const comments = extractData(response);
    return (Array.isArray(comments) ? comments : []).map(normalizeComment);
  },

  async create(payload) {
    const response = await api.post("/comentarios", buildCommentPayload(payload));
    return normalizeComment(extractData(response));
  },
};
