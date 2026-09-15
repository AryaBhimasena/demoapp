"use client";

import { api } from "./api";

const STORAGE = {
  USER_ID: "auth_user_id",
  SESSION_ID: "auth_session_id",
};

const isBrowser = () => typeof window !== "undefined";

const saveSession = (userId, sessionId) => {
  if (!isBrowser() || !userId || !sessionId) return;

  localStorage.setItem(STORAGE.USER_ID, String(userId));
  localStorage.setItem(STORAGE.SESSION_ID, String(sessionId));
};

export const getStoredCredentials = () => {
  if (!isBrowser()) return null;

  const user_id = localStorage.getItem(STORAGE.USER_ID);
  const session_id = localStorage.getItem(STORAGE.SESSION_ID);

  if (!user_id || !session_id) return null;

  return { user_id, session_id };
};

export const clearCredentials = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(STORAGE.USER_ID);
  localStorage.removeItem(STORAGE.SESSION_ID);
};

export async function login(username, password) {
  try {
    const result = await api.post({
      action: "login",
      username,
      password,
    });

    if (!result?.success || !result?.credentials) {
      return {
        success: false,
        message: result?.message || "Login gagal.",
      };
    }

    const { user_id, session_id } = result.credentials;

    if (!user_id || !session_id) {
      return {
        success: false,
        message: "Response login tidak menyediakan session yang valid.",
      };
    }

    saveSession(user_id, session_id);

    return result;
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Terjadi kesalahan saat login.",
    };
  }
}

export async function refresh() {
  const session = getStoredCredentials();

  if (!session) {
    return {
      success: false,
      authenticated: false,
      credentials: null,
      message: "Session tidak ditemukan.",
    };
  }

  try {
    const result = await api.get({
      action: "getCredentials",
      ...session,
    });

    if (!result?.success || !result?.credentials) {
      clearCredentials();

      return {
        success: false,
        authenticated: false,
        credentials: null,
        message: result?.message || "Session tidak valid.",
      };
    }

    const { user_id, session_id } = result.credentials;

    if (!user_id || !session_id) {
      clearCredentials();

      return {
        success: false,
        authenticated: false,
        credentials: null,
        message: "Response credentials tidak valid.",
      };
    }

    saveSession(user_id, session_id);

    return {
      ...result,
      authenticated: true,
    };
  } catch (error) {
    clearCredentials();

    return {
      success: false,
      authenticated: false,
      credentials: null,
      message: error?.message || "Session tidak dapat divalidasi.",
    };
  }
}

export async function logout() {
  const session = getStoredCredentials();

  clearCredentials();

  if (!session) {
    return {
      success: true,
      authenticated: false,
    };
  }

  try {
    const result = await api.post({
      action: "logout",
      ...session,
    });

    return {
      ...result,
      authenticated: false,
    };
  } catch (error) {
    return {
      success: true,
      authenticated: false,
      message: error?.message || "Session lokal telah dihapus.",
    };
  }
}

export const checkAuth = refresh;
export const AUTH_KEYS = STORAGE;