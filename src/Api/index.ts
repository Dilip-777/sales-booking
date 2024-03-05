import axios from "axios";

console.log(process.env.BACKEND_URL);
export const BACKEND_URL = "https://sales-server-3mlq.onrender.com";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
