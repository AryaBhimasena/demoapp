//lib/api.js

"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ==========================
   CORE REQUEST
========================== */

async function request(method, payload = {}) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  let url = API_URL;
  const options = {
    method,
    cache: "no-store",
  };

  if (method === "GET") {
    const params = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    url += `?${params.toString()}`;
  } else {
    options.headers = {
      "Content-Type": "text/plain;charset=utf-8",
    };
    options.body = JSON.stringify(payload);
  }

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request gagal.");
  }

  return data;
}

/* ==========================
   PUBLIC API
========================== */

export const api = {
  get: (payload) => request("GET", payload),
  post: (payload) => request("POST", payload),
};