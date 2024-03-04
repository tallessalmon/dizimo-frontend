import axios from "axios";
import { getUserLocalStorage, setUserLocalStorage } from "../context/AuthProvider/util";
import { message } from "antd";
const api = axios.create({
  baseURL:
    ("http://dizimo-backend.us-east-1.elasticbeanstalk.com"),
      headers: {
        "Authorization": `Bearer ${getUserLocalStorage()}`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/json;charset=UTF-8"
      }
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getUserLocalStorage()}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      message.warning("Tempo de login inspirado")
      setUserLocalStorage({})
      window.location.reload()
      
    }
    return Promise.reject(error);
  }
);

export default api;
