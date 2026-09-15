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
  return Boolean(permission && access?.[permission] === true);
}

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

  const targetRoute = firstAccessibleRoute || LOGIN_ROUTE;

  useEffect(() => {
    if (isInitializing) return;

    if (isPublic) {
      if (
        isLogin &&
        authenticated &&
        authStatus === "authenticated" &&
        targetRoute !== normalizedPath
      ) {
        router.replace(targetRoute);
      }

      return;
    }

    if (
      !authenticated ||
      authStatus !== "authenticated"
    ) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (!requiredPermission || !currentRouteAllowed) {
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

  if (isInitializing) {
    return <RouteGuardLoading />;
  }

  if (isPublic) {
    if (
      isLogin &&
      authenticated &&
      authStatus === "authenticated"
    ) {
      return <RouteGuardLoading />;
    }

    return children;
  }

  if (
    !authenticated ||
    authStatus !== "authenticated"
  ) {
    return <RouteGuardLoading />;
  }

  if (!requiredPermission || !currentRouteAllowed) {
    return <RouteGuardLoading />;
  }

  return (
    <>
      <Navbar />
      <div className="app-content">{children}</div>
    </>
  );
}

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

export {
  normalizePathname,
  isPublicRoute,
  isLoginRoute,
  getRequiredPermission,
  hasPermission,
};