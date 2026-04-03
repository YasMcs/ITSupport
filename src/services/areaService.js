import { api, extractData } from "./api";
import { buildAreaPayload, normalizeArea } from "../utils/apiMappers";

export const areaService = {
  async getAll() {
    const response = await api.get("/areas");
    const areas = extractData(response);
    return (Array.isArray(areas) ? areas : []).map(normalizeArea);
  },

  async getById(id) {
    const response = await api.get(`/areas/${id}`);
    return normalizeArea(extractData(response));
  },

  async create(payload) {
    const response = await api.post("/areas", buildAreaPayload(payload));
    return normalizeArea(extractData(response));
  },

  async getBySucursal(id) {
    const response = await api.get(`/areas/sucursal/${id}`);
    const areas = extractData(response);
    return (Array.isArray(areas) ? areas : []).map(normalizeArea);
  },

  async update(id, payload) {
    const normalizedName = String(payload.nombreArea || "").trim();
    const originalName = String(payload.originalNombreArea || "").trim();
    const nextSucursalId = payload.sucursalId ? Number(payload.sucursalId) : null;
    const originalSucursalId = payload.originalSucursalId ? Number(payload.originalSucursalId) : null;
    const nameChanged = normalizedName && normalizedName !== originalName;
    const branchChanged = nextSucursalId !== null && nextSucursalId !== originalSucursalId;
    let branchUpdated = false;

    if (branchChanged) {
      await api.put(`/areas/${id}/sucursal`, {
        sucursalId: nextSucursalId,
      });
      branchUpdated = true;
    }

    try {
      if (nameChanged) {
        await api.put(`/areas/${id}`, null, {
          params: { nuevoNombre: normalizedName },
        });
      }
    } catch (error) {
      if (branchUpdated && originalSucursalId !== null) {
        try {
          await api.put(`/areas/${id}/sucursal`, {
            sucursalId: originalSucursalId,
          });
        } catch {
          error.partialUpdate = true;
        }
      }

      if (!error.response?.data?.message) {
        error.response = {
          ...error.response,
          data: {
            ...error.response?.data,
            message: error.partialUpdate
              ? "No se completo la edicion del area y no se pudo restaurar la sucursal anterior."
              : "No se completo la edicion del area. La sucursal anterior fue restaurada.",
          },
        };
      }
      throw error;
    }

    if (!nameChanged && !branchChanged) {
      return normalizeArea({
        ...payload,
        id,
      });
    }

    const response = await api.get(`/areas/${id}`);
    return normalizeArea(extractData(response));
  },

  async deactivate(id) {
    const response = await api.put(`/areas/${id}/desactivar`);
    return normalizeArea(extractData(response));
  },

  async activate(id) {
    const response = await api.put(`/areas/${id}/activar`);
    return normalizeArea(extractData(response));
  },
};
