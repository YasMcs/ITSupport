import { useEffect, useState } from "react";
import { decodeId } from "../utils/cryptoUtils";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { UsuarioForm } from "../components/usuarios/UsuarioForm";
import { areaService } from "../services/areaService";
import { userService } from "../services/userService";
import { getFeedbackMessage } from "../utils/feedback";

export function EditarUsuarioPage() {
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // 🔍 DEBUG: Información completa del ID
    console.group('%c[EditarUsuarioPage - DEBUG]', 'color: #FF6B6B; font-weight: bold; font-size: 12px;');
    console.table({
      'URL encodedId': encodedId,
      'Tipo de encodedId': typeof encodedId,
      'Es null o undefined': encodedId === null || encodedId === undefined,
      'Valor es "null"': encodedId === 'null',
      'Valor es "undefined"': encodedId === 'undefined',
    });
    console.table({
      'Decoded ID': id,
      'Tipo de ID decodificado': typeof id,
      '¿Es Number?': typeof id === 'number',
      'Es null?': id === null,
      'Es NaN?': Number.isNaN(id),
      'Es positivo?': id > 0,
      'Valor es string "null"': id === 'null',
    });
    console.groupEnd();

    // Guardia: Validar que el ID sea válido
    if (!id || id === "null" || id === "undefined") {
      console.error('%c[EditarUsuarioPage] ❌ GUARDIA ACTIVADA - ID Inválido', 'color: #FF6B6B; font-weight: bold;', {
        id,
        encodedId,
        razon: !id ? 'ID es falsy' : `ID es string "${id}"`,
      });
      toast.error("El ID del usuario no es válido o ha expirado.");
      navigate("/usuarios");
      return;
    }

    console.log('%c[EditarUsuarioPage] ✅ Guardia pasada - ID válido, llamando API con:', 'color: #51CF66; font-weight: bold;', { id, tipo: typeof id });

    async function loadData() {
      try {
        console.log(`%c[EditarUsuarioPage] 📡 GET /usuarios/${id}`, 'color: #4C6EF5; font-style: italic;');
        const [userData, areaData] = await Promise.all([
          userService.getById(id),
          areaService.getAll(),
        ]);

        if (!cancelled) {
          console.log('%c[EditarUsuarioPage] ✅ Datos cargados correctamente', 'color: #51CF66;', { userData, areaCount: areaData.length });
          setUsuario(userData);
          setAreas(areaData);
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error('%c[EditarUsuarioPage] ❌ Error al cargar usuario', 'color: #FF6B6B;', {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url,
          });
          setLoadError(getFeedbackMessage(error, "No pudimos abrir el usuario seleccionado."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    await userService.updateByAdmin(id, payload);
    navigate("/usuarios");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Cargando usuario...</p>
      </div>
    );
  }

  if (loadError || !usuario) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Editar Usuario</h1>
            <p className="text-text-secondary mt-1">No fue posible recuperar el registro solicitado.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-accent-pink">{loadError || "No encontramos informacion para este usuario."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate("/usuarios")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Editar Usuario</h1>
          <p className="text-text-secondary mt-1">Actualiza la informacion del usuario y ajusta sus permisos si es necesario.</p>
        </div>
      </div>

      <UsuarioForm
        usuario={usuario}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/usuarios")}
        isEditing
        areaOptions={areas}
      />
    </div>
  );
}
