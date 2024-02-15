import axios from "axios";
import { getUserLocalStorage, setUserLocalStorage } from "../context/AuthProvider/util";

const api = axios.create({
  baseURL:
    ("http://localhost:3000"),
      headers: {
        "Cache-Control": "no-cache",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Headers": "Authorization", 
        // "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE" ,
        "Content-Type": "application/json;charset=UTF-8"
      }
});

export default api;