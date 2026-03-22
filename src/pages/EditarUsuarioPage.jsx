import { useNavigate, useParams } from "react-router-dom";
import { UsuarioForm } from "../components/usuarios/UsuarioForm";
import { getMockUserById, mockUsers } from "../utils/mockUsers";
import { maskSecret } from "../utils/security";

export function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = getMockUserById(id);

  const handleSubmit = (payload) => {
    const index = mockUsers.findIndex((user) => user.id === Number(id));
    if (index >= 0) {
      mockUsers[index] = {
        ...mockUsers[index],
        ...payload,
        contrasena_hash: maskSecret(payload.contrasena_hash) || mockUsers[index].contrasena_hash,
      };
    }
    navigate("/usuarios");
  };

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
          <p className="text-text-secondary mt-1">Actualiza el mock sin salirte del contrato SQL</p>
        </div>
      </div>

      <UsuarioForm
        usuario={usuario}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/usuarios")}
        isEditing
      />
    </div>
  );
}
