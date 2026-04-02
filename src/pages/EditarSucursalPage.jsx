import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { sucursalService } from "../services/sucursalService";

export function EditarSucursalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sucursalData, setSucursalData] = useState(null);

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

  return <SucursalForm initialData={sucursalData} onSubmit={handleSubmit} />;
}
