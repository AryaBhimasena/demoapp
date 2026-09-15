"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import Navbar from "@/components/Navbar";

const PUBLIC_ROUTES = ["/"];
const LOGIN_ROUTE = "/";
const DEFAULT_ROUTE = "/dashboard";

const ROUTE_PERMISSIONS = {
  "/dashboard": "dashboard",
  "/pengaturan": "pengaturan",
};

/* =========================================================
   PATH HELPERS
========================================================= */

function normalizePathname(pathname) {
  if (!pathname) return "/";

  return pathname.length > 1
    ? pathname.replace(/\/+$/, "")
    : pathname;
}

function isPublicRoute(pathname) {
  const normalizedPath = normalizePathname(pathname);

  return PUBLIC_ROUTES.some(
    (route) => normalizedPath === normalizePathname(route)
  );
}

function isLoginRoute(pathname) {
  return normalizePathname(pathname) === LOGIN_ROUTE;
}

/* =========================================================
   ROUTE PERMISSION
========================================================= */

function getRequiredPermission(pathname) {
  const normalizedPath = normalizePathname(pathname);

  const matchedRoutes = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) => {
      const normalizedRoute = normalizePathname(route);

      return (
        normalizedPath === normalizedRoute ||
        normalizedPath.startsWith(`${normalizedRoute}/`)
      );
    })
    .sort((a, b) => b.length - a.length);

  return matchedRoutes.length
    ? ROUTE_PERMISSIONS[matchedRoutes[0]]
    : null;
}

function hasPermission(access, permission) {
  return Boolean(
    permission &&
      access &&
      access[permission] === true
  );
}

/* =========================================================
   ROUTE GUARD
========================================================= */

export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    access,
    authenticated,
    authStatus,
    isInitializing,
    firstAccessibleRoute,
  } = useUser();

  const normalizedPath = normalizePathname(pathname);

  const isPublic = isPublicRoute(normalizedPath);
  const isLogin = isLoginRoute(normalizedPath);

  const requiredPermission = getRequiredPermission(normalizedPath);

  const currentRouteAllowed = hasPermission(
    access,
    requiredPermission
  );

  /*
   * Prioritas halaman:
   * 1. Halaman pertama yang diizinkan berdasarkan access
   * 2. Halaman login jika tidak ada akses
   */
  const targetRoute =
    firstAccessibleRoute ||
    DEFAULT_ROUTE ||
    LOGIN_ROUTE;

  /* =======================================================
     REDIRECT LOGIC

     RouteGuard hanya membaca state dari UserContext.
     Tidak ada pemanggilan getCredentials/authRefresh
     pada perubahan route.
  ======================================================= */

  useEffect(() => {
    /*
     * Jangan melakukan redirect sebelum UserContext selesai
     * memulihkan session dari localStorage.
     */
    if (isInitializing) {
      return;
    }

    /*
     * User sudah login tetapi masih membuka halaman "/".
     * Arahkan ke halaman pertama yang memiliki akses.
     */
    if (isPublic) {
      if (
        isLogin &&
        authenticated &&
        authStatus === "authenticated"
      ) {
        if (targetRoute !== normalizedPath) {
          router.replace(targetRoute);
        }
      }

      return;
    }

    /*
     * Semua halaman selain public wajib authenticated.
     */
    if (
      !authenticated ||
      authStatus !== "authenticated"
    ) {
      if (normalizedPath !== LOGIN_ROUTE) {
        router.replace(LOGIN_ROUTE);
      }

      return;
    }

    /*
     * Halaman tidak terdaftar atau user tidak memiliki izin.
     * Arahkan ke halaman pertama yang diizinkan.
     */
    if (
      !requiredPermission ||
      !currentRouteAllowed
    ) {
      if (targetRoute !== normalizedPath) {
        router.replace(targetRoute);
      }
    }
  }, [
    isInitializing,
    isPublic,
    isLogin,
    authenticated,
    authStatus,
    requiredPermission,
    currentRouteAllowed,
    targetRoute,
    normalizedPath,
    router,
  ]);

  /* =======================================================
     RENDER STATE
========================================================= */

  /*
   * Saat UserContext masih memulihkan session.
   */
  if (isInitializing) {
    return <RouteGuardLoading />;
  }

  /*
   * Halaman public seperti halaman login.
   */
  if (isPublic) {
    /*
     * User authenticated tetapi masih berada di halaman login.
     * Tahan render sampai router menyelesaikan redirect.
     */
    if (
      isLogin &&
      authenticated &&
      authStatus === "authenticated"
    ) {
      return <RouteGuardLoading />;
    }

    return children;
  }

  /*
   * Halaman private tetapi user belum authenticated.
   */
  if (
    !authenticated ||
    authStatus !== "authenticated"
  ) {
    return <RouteGuardLoading />;
  }

  /*
   * Halaman private tanpa permission atau tidak diizinkan.
   * Tahan render sampai redirect selesai.
   */
  if (
    !requiredPermission ||
    !currentRouteAllowed
  ) {
    return <RouteGuardLoading />;
  }

  /*
   * Halaman private yang valid dan diizinkan.
   */
  return (
    <>
      <Navbar />

      <div className="app-content">
        {children}
      </div>
    </>
  );
}

/* =========================================================
   LOADING COMPONENT
========================================================= */

function RouteGuardLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Memuat aplikasi...
    </div>
  );
}

/* =========================================================
   EXPORT HELPERS
========================================================= */

export {
  normalizePathname,
  isPublicRoute,
  isLoginRoute,
  getRequiredPermission,
  hasPermission,
};