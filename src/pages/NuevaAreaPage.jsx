import { useNavigate } from "react-router-dom";
import { AreaForm } from "../components/areas/AreaForm";

export function NuevaAreaPage() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/areas");
  };

  return <AreaForm onSubmit={handleSubmit} />;
}
