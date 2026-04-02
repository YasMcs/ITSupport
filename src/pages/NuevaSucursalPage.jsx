import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { sucursalService } from "../services/sucursalService";

export function NuevaSucursalPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await sucursalService.create(payload);
      navigate("/sucursales");
    } catch (error) {
      toast.error("No pudimos registrar la sucursal", {
        description: error.response?.data?.message ?? "Revisa la informacion e intenta nuevamente.",
      });
      throw error;
    }
  };

  return <SucursalForm onSubmit={handleSubmit} />;
}
