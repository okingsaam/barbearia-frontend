import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://diligent-transformation-production-4c42.up.railway.app";

export const API_REQUEST_STATUS_EVENT = "api:request-status";

let activeRequests = 0;

function emitApiRequestStatus(detail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(API_REQUEST_STATUS_EVENT, { detail }));
}

function startRequest() {
  activeRequests += 1;
  emitApiRequestStatus({
    type: "loading",
    activeRequests,
    isLoading: true,
  });
}

function finishRequest() {
  activeRequests = Math.max(0, activeRequests - 1);
  emitApiRequestStatus({
    type: "loading",
    activeRequests,
    isLoading: activeRequests > 0,
  });
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    startRequest();
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export function getApiErrorMessage(error) {
  if (error.response?.data) {
    const payload = error.response.data;

    if (typeof payload === "string") {
      return payload;
    }

    if (payload.message) {
      return payload.message;
    }

    return `Erro da API (${error.response.status}).`;
  }

  if (error.request) {
    return `Nao foi possivel conectar com a API em ${API_BASE_URL}.`;
  }

  return error.message || "Erro inesperado na requisicao.";
}

api.interceptors.response.use(
  (response) => {
    finishRequest();
    return response;
  },
  (error) => {
    finishRequest();
    const message = getApiErrorMessage(error);

    emitApiRequestStatus({
      type: "error",
      message,
      status: error.response?.status,
      resource: error.config?.url,
    });

    return Promise.reject(new Error(message));
  },
);

export function createEntityService(resource) {
  return {
    async list() {
      try {
        const response = await api.get(resource);
        return Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.content)
            ? response.data.content
            : [];
      } catch (error) {
        console.error(`[API] Falha ao listar ${resource}:`, error.message);
        throw error;
      }
    },
    async create(payload) {
      try {
        const response = await api.post(resource, payload);
        return response.data;
      } catch (error) {
        console.error(`[API] Falha ao criar em ${resource}:`, error.message);
        throw error;
      }
    },
    async getById(id) {
      try {
        const response = await api.get(`${resource}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`[API] Falha ao buscar ${resource}/${id}:`, error.message);
        throw error;
      }
    },
    async update(id, payload) {
      try {
        const response = await api.put(`${resource}/${id}`, payload);
        return response.data;
      } catch (error) {
        console.error(`[API] Falha ao atualizar ${resource}/${id}:`, error.message);
        throw error;
      }
    },
    async remove(id) {
      try {
        await api.delete(`${resource}/${id}`);
      } catch (error) {
        console.error(`[API] Falha ao remover ${resource}/${id}:`, error.message);
        throw error;
      }
    },
  };
}

export function getEntityId(entity) {
  return entity?.id ?? entity?.codigo ?? entity?.Id ?? entity?.ID;
}

export default api;
