import { UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { getUserDisplayName, getUserInitial } from "../utils/userDisplay";

function InfoCard({ label, value }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <p className="mb-2 text-sm font-medium text-text-muted">{label}</p>
      <p className="font-medium text-text-primary">{value}</p>
    </div>
  );
}

export function PerfilPage() {
  const { user, role } = useAuth();

  const getRoleLabel = (rol) => {
    const labels = {
      [ROLES.ADMIN]: "Administrador",
      [ROLES.TECNICO]: "Tecnico",
      [ROLES.ENCARGADO]: "Encargado",
    };
    return labels[rol] || rol;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white">Perfil</h1>
        <p className="text-text-secondary">Consulta tu informacion, preferencias y detalles de acceso en un solo lugar.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="glass-card rounded-2xl p-8">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-start lg:text-left">
            {/* Hero Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full bg-purple-electric/12 blur-2xl" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-purple-electric/30 bg-dark-purple-800/85 text-5xl font-bold text-white backdrop-blur-xl shadow-2xl lg:h-36 lg:w-36">
                {getUserInitial(user)}
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-purple-electric p-1 text-white">
                  <UserRound className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Info Hero */}
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{getUserDisplayName(user)}</h1>
              <p className="text-xl text-text-secondary">{user?.email}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-purple-electric/20 bg-purple-electric/10 px-4 py-2 text-sm font-semibold text-purple-electric">
                  {getRoleLabel(role)}
                </span>
                <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
                  {user?.estado_cuenta === "suspendido" ? "Suspendido" : "Activo"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold text-text-primary">Información de la cuenta</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard label="Nombre Completo" value={getUserDisplayName(user)} />
              <InfoCard label="Correo Electrónico" value={user?.email || "Sin correo"} />
              <InfoCard label="Rol" value={getRoleLabel(role)} />
              <InfoCard label="Estado de Cuenta" value={user?.estado_cuenta === "suspendido" ? "Suspendido" : "Activo"} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
