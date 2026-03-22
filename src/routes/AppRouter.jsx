import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LoginPage } from "../pages/auth/LoginPage";
import { HomePage } from "../pages/HomePage";
import { DashboardPage } from "../pages/DashboardPage";
import { EstadisticasPage } from "../pages/EstadisticasPage";
import { TicketsPage } from "../pages/TicketsPage";
import { TicketDetailPage } from "../pages/TicketDetailPage";
import { NuevoTicketPage } from "../pages/NuevoTicketPage";
import { PerfilPage } from "../pages/PerfilPage";
import { SucursalesPage } from "../pages/SucursalesPage";
import { NuevaSucursalPage } from "../pages/NuevaSucursalPage";
import { EditarSucursalPage } from "../pages/EditarSucursalPage";
import { AreasPage } from "../pages/AreasPage";
import { NuevaAreaPage } from "../pages/NuevaAreaPage";
import { EditarAreaPage } from "../pages/EditarAreaPage";
import { UsuariosPage } from "../pages/UsuariosPage";
import { NuevoUsuarioPage } from "../pages/NuevoUsuarioPage";
import { EditarUsuarioPage } from "../pages/EditarUsuarioPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROLES } from "../constants/roles";

function RouteTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<RouteTransition><LoginPage /></RouteTransition>} />
      <Route
        path="/dashboard"
        element={
          <RouteTransition>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <RouteTransition>
            <ProtectedRoute>
              <EstadisticasPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/sucursales"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <SucursalesPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/sucursales/nueva"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <NuevaSucursalPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/sucursales/editar/:id"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditarSucursalPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/areas"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AreasPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/areas/nueva"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <NuevaAreaPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/areas/editar/:id"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditarAreaPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/usuarios"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UsuariosPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/usuarios/nuevo"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <NuevoUsuarioPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/usuarios/editar/:id"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <EditarUsuarioPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/tickets"
        element={
          <RouteTransition>
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/tickets/nuevo"
        element={
          <RouteTransition>
            <ProtectedRoute allowedRoles={[ROLES.ENCARGADO]}>
              <NuevoTicketPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <RouteTransition>
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/perfil"
        element={
          <RouteTransition>
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route
        path="/"
        element={
          <RouteTransition>
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          </RouteTransition>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
