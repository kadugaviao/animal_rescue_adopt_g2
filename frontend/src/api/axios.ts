import axios from "axios";

// Instância única do Axios. baseURL vem do .env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Injeta o token do localStorage no header de toda chamada.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 (token inválido/expirado): limpa a sessão e manda pro login.
// Exceto nas rotas /auth/, pra não redirecionar de forma estranha (ex: senha errada).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes("/auth/");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!isAuthRoute) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
