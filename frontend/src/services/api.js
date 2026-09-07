const BASE_URL = import.meta.env.VITE_API_URL || "https://learnwitheasebackend.onrender.com";
const BASE = `${BASE_URL.replace(/\/+$/, "")}/api`;
export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res
    .json()
    .catch(() => ({ success: false, message: "Invalid server response" }));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data.data ?? data;
}
export const get = (p) => api(p);
export const post = (p, body) =>
  api(p, { method: "POST", body: JSON.stringify(body || {}) });
export const patch = (p, body) =>
  api(p, { method: "PATCH", body: JSON.stringify(body || {}) });
