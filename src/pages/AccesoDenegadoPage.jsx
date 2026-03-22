import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function AccesoDenegadoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const blockedPath = location.state?.from;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="glass-card max-w-xl rounded-3xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-pink/15 text-accent-pink">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm8.25-3a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Acceso denegado</h1>
        <p className="mt-3 text-text-secondary">
          No tienes permisos para abrir esta seccion. Si intentaste entrar manualmente por URL, la navegacion fue bloqueada.
        </p>
        {blockedPath && <p className="mt-3 text-sm text-text-muted">Ruta protegida: {blockedPath}</p>}
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={() => navigate("/dashboard", { replace: true })} className="w-auto px-6">
            Volver al dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
