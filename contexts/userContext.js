"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as authLogin,
  logout as authLogout,
  refresh as authRefresh,
} from "@/lib/Auth";

/* =========================================================
   CONTEXT
========================================================= */

const UserContext = createContext(null);

/* =========================================================
   FIRST ACCESSIBLE ROUTES
   ---------------------------------------------------------
   Access key yang dikembalikan backend getUserAccess_():

   - dashboard
   - pengaturan

   master_data dan laporan belum tersedia
   pada backend saat ini.
========================================================= */

const FIRST_ACCESSIBLE_ROUTES = [
  {
    route: "/dashboard",
    accessKey: "dashboard",
  },
  {
    route: "/pengaturan",
    accessKey: "pengaturan",
  },
];

/* =========================================================
   GET FIRST ACCESSIBLE ROUTE
========================================================= */

export function getFirstAccessibleRoute(access = {}) {
  const route = FIRST_ACCESSIBLE_ROUTES.find(
    (item) => access[item.accessKey] === true
  );

  return route?.route || null;
}

/* =========================================================
   USER PROVIDER
========================================================= */

export function UserProvider({ children }) {
  /* =======================================================
     AUTH STATE
     -------------------------------------------------------
     credentials menjadi sumber data autentikasi selama
     aplikasi berjalan.

     Perpindahan route tidak menghapus state ini karena
     UserProvider berada di RootLayout.
  ======================================================= */

  const [credentials, setCredentials] = useState(null);

  const [authStatus, setAuthStatus] =
    useState("initializing");

  /* =======================================================
     RESTORE SESSION
     -------------------------------------------------------
     Hanya dijalankan ketika UserProvider pertama kali
     dibuat.

     Kondisi ini terjadi ketika:
     - Aplikasi pertama kali dibuka
     - Browser di-refresh
     - Browser ditutup lalu dibuka kembali

     Tidak dijalankan setiap perpindahan route.
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const result = await authRefresh();

      if (!mounted) return;

      if (
        result?.success &&
        result?.authenticated &&
        result?.credentials
      ) {
        setCredentials(result.credentials);
        setAuthStatus("authenticated");
      } else {
        setCredentials(null);
        setAuthStatus("unauthenticated");
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOGIN
     -------------------------------------------------------
     Alur:
     1. Auth.login() mengirim username dan password
     2. Backend mengembalikan credentials
     3. Auth.js menyimpan session ke localStorage
     4. UserContext langsung menyimpan credentials ke state
     5. RouteGuard dapat langsung melanjutkan navigasi

     TIDAK memanggil authRefresh() setelah login berhasil.
  ======================================================= */

  async function login(username, password) {
    const result = await authLogin(
      username,
      password
    );

    if (
      result?.success &&
      result?.credentials
    ) {
      setCredentials(result.credentials);
      setAuthStatus("authenticated");
    } else {
      setCredentials(null);
      setAuthStatus("unauthenticated");
    }

    return result;
  }

  /* =======================================================
     LOGOUT
     -------------------------------------------------------
     Auth.js menangani penghapusan session lokal dan
     pemberitahuan logout ke backend.

     UserContext menghapus state autentikasi.
  ======================================================= */

  async function logout() {
    const result = await authLogout();

    setCredentials(null);
    setAuthStatus("unauthenticated");

    return result;
  }

  /* =======================================================
     REFRESH
     -------------------------------------------------------
     Validasi ulang session secara manual.

     Fungsi ini TIDAK dipanggil oleh perpindahan route.
     Hanya dipanggil jika ada kebutuhan eksplisit untuk
     mengambil credentials terbaru dari server.
  ======================================================= */

  async function refresh() {
    const result = await authRefresh();

    if (
      result?.success &&
      result?.authenticated &&
      result?.credentials
    ) {
      setCredentials(result.credentials);
      setAuthStatus("authenticated");
    } else {
      setCredentials(null);
      setAuthStatus("unauthenticated");
    }

    return result;
  }

  /* =======================================================
     AUTHENTICATION STATE
  ======================================================= */

  const authenticated =
    authStatus === "authenticated";

  /* =======================================================
     ACCESS
     -------------------------------------------------------
     Access berasal dari credentials yang tersimpan
     di React state.

     Selama UserProvider tidak remount, perpindahan route
     tidak mengulang proses getCredentials.
  ======================================================= */

  const access =
    credentials?.access || {};

  /* =======================================================
     FIRST ACCESSIBLE ROUTE
  ======================================================= */

  const firstAccessibleRoute =
    authenticated
      ? getFirstAccessibleRoute(access)
      : null;

  /* =======================================================
     HAS ACCESS
     -------------------------------------------------------
     Hanya true jika:
     1. User authenticated
     2. Access key bernilai true
  ======================================================= */

  function hasAccess(accessKey) {
    return (
      authenticated &&
      access[accessKey] === true
    );
  }

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    /* -----------------------------------------------
       RAW CREDENTIALS
    ----------------------------------------------- */

    credentials,

    /* -----------------------------------------------
       USER IDENTIFIERS
    ----------------------------------------------- */

    userId:
      credentials?.user_id || null,

    sessionId:
      credentials?.session_id || null,

    username:
      credentials?.username || "",

    /* -----------------------------------------------
       USER PROFILE
    ----------------------------------------------- */

    nama:
      credentials?.nama || "",

    role:
      credentials?.role ||
      access?.role ||
      "",

    /* -----------------------------------------------
       ACCESS
    ----------------------------------------------- */

    access,

    firstAccessibleRoute,

    hasAccess,

    /* -----------------------------------------------
       AUTH STATE
    ----------------------------------------------- */

    authenticated,

    authStatus,

    isInitializing:
      authStatus === "initializing",

    /* -----------------------------------------------
       AUTH ACTIONS
    ----------------------------------------------- */

    login,
    logout,
    refresh,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/* =========================================================
   USE USER
========================================================= */

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser harus digunakan di dalam UserProvider."
    );
  }

  return context;
}

/* =========================================================
   USE AUTH
   ---------------------------------------------------------
   Alias compatibility.
========================================================= */

export function useAuth() {
  return useUser();
}