import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: base,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default api;
