import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWebSocket } from "../../context/WebSocketContext";
import logoIcono from "../../assets/logo_icono.png";
import logo from "../../assets/logo.png";
import { getUserDisplayName, getUserInitial } from "../../utils/userDisplay";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead } = useWebSocket();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isNotificationsOpen) return undefined;

    function handleOutsideClick(event) {
      if (!panelRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isNotificationsOpen]);

  const recentNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const toggleNotifications = () => {
    setIsNotificationsOpen((current) => {
      const next = !current;
      if (next) {
        markAllAsRead();
      }
      return next;
    });
  };

  const handleNotificationClick = (notification) => {
    setIsNotificationsOpen(false);
    if (notification.href) {
      navigate(notification.href);
    }
  };

  return (
    <nav className="z-50 w-full border-b border-white/[0.06] bg-white/[0.04] px-6 py-3 backdrop-blur-[22px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={logoIcono} 
            alt="Logo Icono" 
            className="h-10 w-auto"
          />
          <img 
            src={logo} 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={panelRef}>
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-text-secondary transition-all hover:border-purple-electric/25 hover:bg-white/[0.05] hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-electric/40"
              aria-label="Abrir notificaciones"
              aria-expanded={isNotificationsOpen}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-electric px-1.5 text-[10px] font-semibold text-white shadow-[0_0_18px_rgba(118,96,216,0.45)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#151221]/95 shadow-[0_24px_80px_rgba(5,4,12,0.55)] backdrop-blur-[24px]">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <p className="text-sm font-semibold text-text-primary">Actividad reciente</p>
                  <p className="mt-1 text-xs text-text-muted">Resumen breve de lo ultimo que ocurrio en tus tickets.</p>
                </div>

                {recentNotifications.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-text-secondary">
                    Aun no tienes notificaciones recientes.
                  </div>
                ) : (
                  <div className="max-h-[420px] space-y-1 overflow-y-auto px-2 py-2 scroll-area">
                    {recentNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="w-full rounded-2xl px-3 py-3 text-left transition-all hover:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-purple-electric/25"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                            <p className="mt-1 text-sm leading-6 text-text-secondary">{notification.description}</p>
                          </div>
                          <span className="shrink-0 pt-0.5 text-[11px] text-text-muted">
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-electric/20 bg-purple-electric/12">
                <span className="text-sm font-semibold text-purple-electric">
                  {getUserInitial(user)}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">{getUserDisplayName(user)}</p>
                <p className="text-xs text-text-muted">{user.rol}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
}
