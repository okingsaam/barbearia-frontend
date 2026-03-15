import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

function getApiErrorMessage(error) {
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
    return "Nao foi possivel conectar com a API em http://localhost:8080.";
  }

  return error.message || "Erro inesperado na requisicao.";
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(getApiErrorMessage(error))),
);

export function createCrudService(resource) {
  return {
    async list() {
      const response = await api.get(resource);
      return response.data;
    },
    async create(payload) {
      const response = await api.post(resource, payload);
      return response.data;
    },
    async update(id, payload) {
      const response = await api.put(`${resource}/${id}`, payload);
      return response.data;
    },
    async remove(id) {
      await api.delete(`${resource}/${id}`);
    },
  };
}

export function getEntityId(entity) {
  return entity?.id ?? entity?.codigo ?? entity?.Id ?? entity?.ID;
}

export default api;
