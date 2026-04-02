import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { sucursalService } from "../services/sucursalService";

export function EditarSucursalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sucursalData, setSucursalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSucursal() {
      try {
        const data = await sucursalService.getById(id);
        if (!cancelled) setSucursalData(data);
      } catch (error) {
        if (!cancelled) {
          toast.error("No pudimos cargar la sucursal", {
            description: error.response?.data?.message ?? "Intenta nuevamente.",
          });
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

  const handleSubmit = async (payload) => {
    await sucursalService.update(id, payload);
    navigate("/sucursales");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Cargando sucursal...</p>
      </div>
    );
  }

  return <SucursalForm initialData={sucursalData} onSubmit={handleSubmit} />;
}
