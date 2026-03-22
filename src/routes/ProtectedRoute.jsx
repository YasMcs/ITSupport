import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../components/layout/AppLayout";

export function ProtectedRoute({ children, allowedRoles }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();
  const isForbidden = Boolean(isAuthenticated && allowedRoles && !allowedRoles.includes(role));

  useEffect(() => {
    if (!isForbidden) return;

    toast.error("No tienes permisos para realizar esta accion", {
      description: "Intentamos proteger esta ruta porque no corresponde a tu rol actual.",
      id: `rbac:${location.pathname}`,
    });
  }, [isForbidden, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isForbidden) {
    return <Navigate to="/acceso-denegado" replace state={{ from: location.pathname }} />;
  }

  return <AppLayout>{children}</AppLayout>;
}
