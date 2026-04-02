import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { CustomTimePicker } from "../ui/CustomTimePicker";

const ESTADO_OPTIONS = [
  { value: "Activa", label: "Activa" },
  { value: "Desactivada", label: "Desactivada" },
];

export function SucursalForm({ initialData, onSubmit }) {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    nombre: initialData?.nombre || "",
    zona: initialData?.zona || "",
    direccion: initialData?.direccion || "",
    telefono: initialData?.telefono || "",
    horaApertura: initialData?.horaApertura || "",
    horaCierre: initialData?.horaCierre || "",
    estado: initialData?.estado || "Activa",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre.trim()) {
      setError("El nombre de la sucursal es obligatorio");
      return;
    }

    if (!form.zona.trim()) {
      setError("La zona o colonia es obligatoria");
      return;
    }

    try {
      if (onSubmit) {
        await Promise.resolve(onSubmit(form));
      }
      navigate("/sucursales");
    } catch (err) {
      setError(err.response?.data?.message ?? (isEditing ? "Error al actualizar la sucursal" : "Error al crear la sucursal"));
    }
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

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
          <h1 className="text-3xl font-bold text-text-primary">
            {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
          </h1>
          <p className="text-text-secondary mt-1">
            {isEditing
              ? "Modifica los datos de la sucursal seleccionada"
              : "Registra los datos de una nueva sede operativa"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-accent-pink/20 border border-accent-pink/30 text-accent-pink px-4 py-3 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre de la sucursal" required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Sucursal Centro"
                    required
                  />
                </FormField>

                <FormField label="Zona / Colonia" required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.zona}
                    onChange={(e) => handleChange("zona", e.target.value)}
                    placeholder="Centro Historico"
                    required
                    disabled={isEditing}
                  />
                </FormField>
              </div>

              <FormField label="Direccion fisica exacta">
                <textarea
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 resize-none"
                  value={form.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  rows={2}
                  placeholder="Calle, numero, referencias..."
                  disabled={isEditing}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Telefono Directo / Movil">
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    placeholder="Para emergencias si cae la red"
                    disabled={isEditing}
                  />
                </FormField>

                <FormField label="Horario de Operacion">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <CustomTimePicker
                        value={form.horaApertura}
                        onChange={(value) => handleChange("horaApertura", value)}
                        placeholder="Apertura"
                        disabled={isEditing}
                      />
                    </div>
                    <span className="text-gray-400">a</span>
                    <div className="flex-1">
                      <CustomTimePicker
                        value={form.horaCierre}
                        onChange={(value) => handleChange("horaCierre", value)}
                        placeholder="Cierre"
                        disabled={isEditing}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-purple-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Formato de 24 horas</span>
                  </div>
                </FormField>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-8 py-3 w-auto">
                  {isEditing ? "Guardar Cambios" : "Crear Sucursal"}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Configuracion
              </h3>

              <FormField label="Estado">
                <Select
                  value={form.estado}
                  onChange={(value) => handleChange("estado", value)}
                  options={ESTADO_OPTIONS}
                  className="w-full"
                  disabled={isEditing}
                />
              </FormField>

              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                <p>
                  {isEditing
                    ? "Por ahora el backend solo permite actualizar el nombre de la sucursal desde esta vista."
                    : "Podras completar la configuracion de esta sucursal despues de crearla."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
