import axios from "axios";
import { config } from "../../config/env.js";

// Cliente HTTP Axios pré-configurado
export const api = axios.create({ baseURL: config.API_URL });

api.interceptors.request.use((reqConfig) => {
  reqConfig.headers.Authorization = `Bearer ${config.TOKEN}`;
  return reqConfig;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento global de falhas no Axios, se necessário
    return Promise.reject(error);
  }
);
