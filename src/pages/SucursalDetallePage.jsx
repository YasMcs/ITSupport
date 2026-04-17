import { useEffect, useState } from "react";
import { decodeId } from "../utils/cryptoUtils";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { sucursalService } from "../services/sucursalService";
import { getFeedbackMessage } from "../utils/feedback";

export function SucursalDetallePage() {
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);
  const navigate = useNavigate();
  const [sucursalData, setSucursalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // 🔍 DEBUG: Información completa del ID
    console.group('%c[SucursalDetallePage - DEBUG]', 'color: #9D84B7; font-weight: bold; font-size: 12px;');
    console.table({
      'URL encodedId': encodedId,
      'Tipo de encodedId': typeof encodedId,
      'Es null o undefined': encodedId === null || encodedId === undefined,
    });
    console.table({
      'Decoded ID': id,
      'Tipo de ID decodificado': typeof id,
      '¿Es Number?': typeof id === 'number',
      'Es null?': id === null,
      'Es positivo?': id > 0,
    });
    console.groupEnd();

    // Guardia: Validar que el ID sea válido
    if (!id || id === "null" || id === "undefined") {
      console.error('%c[SucursalDetallePage] ❌ GUARDIA ACTIVADA - ID Inválido', 'color: #FF6B6B; font-weight: bold;', { id, encodedId });
      toast.error("El ID de la sucursal no es válido o ha expirado.");
      navigate("/sucursales");
      return;
    }

    console.log('%c[SucursalDetallePage] ✅ ID válido, llamando API con:', 'color: #51CF66; font-weight: bold;', { id, tipo: typeof id });

    async function loadSucursal() {
      try {
        console.log(`%c[SucursalDetallePage] 📡 GET /sucursales/${id}`, 'color: #4C6EF5; font-style: italic;');
        const data = await sucursalService.getById(id);
        if (!cancelled) {
          console.log('%c[SucursalDetallePage] ✅ Datos cargados correctamente', 'color: #51CF66;', { data });
          setSucursalData(data);
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error('%c[SucursalDetallePage] ❌ Error al cargar sucursal', 'color: #FF6B6B;', {
            status: error.response?.status,
            message: error.message,
          });
          setLoadError(getFeedbackMessage(error, "No pudimos abrir la sucursal seleccionada."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSucursal();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Cargando sucursal...</p>
      </div>
    );
  }

  if (loadError || !sucursalData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/sucursales")}
            className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Visualizar Sucursal</h1>
            <p className="text-text-secondary mt-1">No fue posible recuperar la sucursal solicitada.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-accent-pink">{loadError || "No encontramos informacion para esta sucursal."}</p>
        </div>
      </div>
    );
  }

  return (
    <SucursalForm
      initialData={sucursalData}
      readOnly
      primaryActionLabel="Editar Sucursal"
      onPrimaryAction={() => navigate(`/sucursales/editar/${encodedId}`)}    />
  );
}
