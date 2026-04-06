import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ROLES } from "../constants/roles";


export function ProtectedRoute({ children, allowedRoles = null }) {
  const { role, isAuthenticated, logoutReason } = useAuth();

  if (!isAuthenticated) {
    if (logoutReason === "expired") {
      return <Navigate to="/sesion-expirada" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}
