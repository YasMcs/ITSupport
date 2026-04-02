import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AreaForm } from "../components/areas/AreaForm";
import { areaService } from "../services/areaService";
import { sucursalService } from "../services/sucursalService";

export function EditarAreaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [areaExistente, setAreaExistente] = useState(null);
  const [sucursalOptions, setSucursalOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [areaData, sucursales] = await Promise.all([
          areaService.getById(id),
          sucursalService.getAll(),
        ]);

        if (!cancelled) {
          setAreaExistente(areaData);
          setSucursalOptions(
            sucursales.map((sucursal) => ({
              value: String(sucursal.id),
              label: sucursal.nombre,
            }))
          );
        }
      } catch (error) {
        if (!cancelled) {
          toast.error("No pudimos cargar el area", {
            description: error.response?.data?.message ?? "Intenta nuevamente.",
          });
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    await areaService.update(id, payload);
    navigate("/areas");
  };

  if (!areaExistente) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Cargando area...</p>
      </div>
    );
  }

  return <AreaForm initialData={areaExistente} onSubmit={handleSubmit} sucursalOptions={sucursalOptions} />;
}
