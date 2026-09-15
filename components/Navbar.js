"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  LogOut,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@/contexts/userContext";
import "@/styles/components/navbar.css";

/* =========================================================
   NAVIGATION CONFIGURATION
========================================================= */

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    accessKey: "dashboard",
    requiredRole: "Role yang memiliki akses Dashboard",
  },
];

const settingsNavigation = {
  label: "Pengaturan",
  href: "/pengaturan",
  icon: Settings,
  accessKey: "pengaturan",
  requiredRole: "Super Admin",
};

/* =========================================================
   HELPER
========================================================= */

function isPathActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/* =========================================================
   NAVBAR COMPONENT
========================================================= */

export default function Navbar() {
  const pathname = usePathname();

  const {
    credentials,
    authenticated,
    authStatus,
    isInitializing,
    hasAccess,
    logout,
  } = useUser();

  /* =======================================================
     USER MENU STATE
  ======================================================= */

  const [isUserOpen, setIsUserOpen] = useState(false);

  /* =======================================================
     CHANGE PASSWORD STATE
  ======================================================= */

  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* =======================================================
     ACCESS DENIED MODAL STATE
  ======================================================= */

  const [accessDenied, setAccessDenied] = useState({
    open: false,
    label: "",
    requiredRole: "",
  });

  const userMenuRef = useRef(null);

  /* =======================================================
     CLOSE USER MENU WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =======================================================
     CLOSE ACCESS DENIED MODAL WITH ESCAPE
  ======================================================= */

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        closeAccessDeniedModal();
      }
    }

    if (accessDenied.open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [accessDenied.open]);

  /* =======================================================
     USER DATA
  ======================================================= */

  const userId = credentials?.user_id || "";
  const username = credentials?.username || "";
  const idKaryawan = credentials?.id_karyawan || "";
  const role = credentials?.role || "";

  const displayName =
    credentials?.nama ||
    username ||
    userId ||
    "User";

  const avatarLetter =
    displayName.charAt(0).toUpperCase() || "?";

  /* =======================================================
     ACCESS DENIED MODAL HANDLERS
  ======================================================= */

  function openAccessDeniedModal(item) {
    setAccessDenied({
      open: true,
      label: item?.label || "Halaman ini",
      requiredRole:
        item?.requiredRole || "Role yang memiliki izin",
    });
  }

  function closeAccessDeniedModal() {
    setAccessDenied({
      open: false,
      label: "",
      requiredRole: "",
    });
  }

  /* =======================================================
     NAVIGATION HANDLER
  ======================================================= */

  function handleNavigation(event, item) {
    if (
      isInitializing ||
      authStatus !== "authenticated" ||
      !authenticated
    ) {
      event.preventDefault();
      return;
    }

    const allowed =
      !item.accessKey ||
      hasAccess(item.accessKey);

    if (allowed) {
      return;
    }

    event.preventDefault();

    setIsUserOpen(false);
    openAccessDeniedModal(item);
  }

  /* =======================================================
     CHANGE PASSWORD HANDLERS
  ======================================================= */

  function handlePasswordToggle(checked) {
    setChangePassword(checked);

    if (!checked) {
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    if (
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      return;
    }

    console.log("Update password:", {
      user_id: userId,
      password,
    });
  }

  /* =======================================================
     LOGOUT HANDLER
  ======================================================= */

  async function handleLogout() {
    setIsUserOpen(false);
    await logout();
  }

  /* =======================================================
     HIDE NAVBAR WHEN NOT AUTHENTICATED
  ======================================================= */

  if (
    isInitializing ||
    authStatus !== "authenticated" ||
    !authenticated
  ) {
    return null;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* =================================================
             BRAND
          ================================================= */}

          <Link
            href="/dashboard"
            className="navbar-brand"
            onClick={(event) =>
              handleNavigation(event, navigation[0])
            }
          >
            <div className="navbar-brand-mark">
              APP
            </div>

            <div className="navbar-brand-text">
              <span>APP</span>
              <strong>DEMO</strong>
            </div>
          </Link>

          {/* =================================================
             MAIN NAVIGATION
          ================================================= */}

          <nav
            className="navbar-menu"
            aria-label="Navigasi utama"
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              const active = isPathActive(
                pathname,
                item.href
              );

              const allowed =
                !item.accessKey ||
                hasAccess(item.accessKey);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`navbar-link ${
                    active ? "active" : ""
                  } ${!allowed ? "disabled" : ""}`}
                  onClick={(event) =>
                    handleNavigation(event, item)
                  }
                  aria-current={
                    active ? "page" : undefined
                  }
                  aria-disabled={!allowed}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.9}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* =================================================
             RIGHT NAVIGATION
          ================================================= */}

          <div className="navbar-right">
            {/* ===============================================
               USER MENU
            =============================================== */}

            <div
              className="navbar-user-wrapper"
              ref={userMenuRef}
            >
              <button
                type="button"
                className={`navbar-user ${
                  isUserOpen ? "active" : ""
                }`}
                onClick={() =>
                  setIsUserOpen((value) => !value)
                }
                aria-expanded={isUserOpen}
                aria-haspopup="menu"
              >
                <div className="navbar-user-avatar">
                  {avatarLetter}
                </div>

                <div className="navbar-user-info">
                  <strong>{displayName}</strong>
                  <span>{role || "User"}</span>
                </div>

                <ChevronDown
                  className={`navbar-user-chevron ${
                    isUserOpen ? "open" : ""
                  }`}
                  size={15}
                  strokeWidth={1.9}
                />
              </button>

              {isUserOpen && (
                <div
                  className="navbar-user-menu"
                  role="menu"
                >
                  {/* =========================================
                     USER MENU HEADER
                  ========================================= */}

                  <div className="user-menu-header">
                    <div className="user-menu-avatar">
                      {avatarLetter}
                    </div>

                    <div className="user-menu-heading">
                      <strong>{displayName}</strong>

                      <span>
                        <ShieldCheck
                          size={13}
                          strokeWidth={2}
                        />

                        {role || "User"}
                      </span>
                    </div>
                  </div>

                  <div className="user-menu-divider" />

                  {/* =========================================
                     USER INFORMATION
                  ========================================= */}

                  <div className="user-information">
                    <div className="user-field">
                      <span>ID User</span>
                      <strong>{userId || "-"}</strong>
                    </div>

                    <div className="user-field">
                      <span>ID Karyawan</span>
                      <strong>
                        {idKaryawan || "-"}
                      </strong>
                    </div>

                    <div className="user-field">
                      <span>Username</span>
                      <strong>
                        {username || "-"}
                      </strong>
                    </div>

                    <div className="user-field">
                      <span>Role</span>
                      <strong>{role || "-"}</strong>
                    </div>
                  </div>

                  <div className="user-menu-divider" />

                  {/* =========================================
                     CHANGE PASSWORD
                  ========================================= */}

                  <div className="password-section">
                    <label className="password-toggle-row">
                      <span className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={changePassword}
                          onChange={(event) =>
                            handlePasswordToggle(
                              event.target.checked
                            )
                          }
                        />

                        <span className="checkbox-box">
                          <Check size={12} />
                        </span>
                      </span>

                      <span className="password-toggle-label">
                        Ganti password
                      </span>
                    </label>

                    {changePassword && (
                      <form
                        className="password-form"
                        onSubmit={handlePasswordSubmit}
                      >
                        {/* ===================================
                           NEW PASSWORD
                        =================================== */}

                        <div className="password-field">
                          <label htmlFor="new-password">
                            Password baru
                          </label>

                          <div className="password-input">
                            <KeyRound
                              size={15}
                              strokeWidth={1.8}
                            />

                            <input
                              id="new-password"
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              value={password}
                              onChange={(event) =>
                                setPassword(
                                  event.target.value
                                )
                              }
                              placeholder="Password baru"
                            />

                            <button
                              type="button"
                              className="password-visibility-button"
                              onClick={() =>
                                setShowPassword(
                                  (value) => !value
                                )
                              }
                              aria-label={
                                showPassword
                                  ? "Sembunyikan password"
                                  : "Tampilkan password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={15} />
                              ) : (
                                <Eye size={15} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* ===================================
                           CONFIRM PASSWORD
                        =================================== */}

                        <div className="password-field">
                          <label htmlFor="confirm-password">
                            Konfirmasi password
                          </label>

                          <div className="password-input">
                            <KeyRound
                              size={15}
                              strokeWidth={1.8}
                            />

                            <input
                              id="confirm-password"
                              type={
                                showConfirmPassword
                                  ? "text"
                                  : "password"
                              }
                              value={confirmPassword}
                              onChange={(event) =>
                                setConfirmPassword(
                                  event.target.value
                                )
                              }
                              placeholder="Ulangi password"
                            />

                            <button
                              type="button"
                              className="password-visibility-button"
                              onClick={() =>
                                setShowConfirmPassword(
                                  (value) => !value
                                )
                              }
                              aria-label={
                                showConfirmPassword
                                  ? "Sembunyikan password"
                                  : "Tampilkan password"
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={15} />
                              ) : (
                                <Eye size={15} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* ===================================
                           PASSWORD ERROR
                        =================================== */}

                        {password &&
                          confirmPassword &&
                          password !== confirmPassword && (
                            <div className="password-error">
                              <X size={13} />

                              <span>
                                Password tidak sama.
                              </span>
                            </div>
                          )}

                        {/* ===================================
                           SAVE PASSWORD
                        =================================== */}

                        <button
                          type="submit"
                          className="password-save-button"
                          disabled={
                            !password ||
                            !confirmPassword ||
                            password !== confirmPassword
                          }
                        >
                          Simpan password
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="user-menu-divider" />

                  {/* =========================================
                     LOGOUT
                  ========================================= */}

                  <button
                    type="button"
                    className="navbar-logout-button"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LogOut
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="navbar-right-divider" />

            {/* =================================================
               SETTINGS NAVIGATION
            ================================================= */}

            <div className="navbar-settings">
              {(() => {
                const allowed =
                  !settingsNavigation.accessKey ||
                  hasAccess(
                    settingsNavigation.accessKey
                  );

                return (
                  <Link
                    href={settingsNavigation.href}
                    className={`navbar-settings-link ${
                      isPathActive(
                        pathname,
                        settingsNavigation.href
                      )
                        ? "active"
                        : ""
                    } ${!allowed ? "disabled" : ""}`}
                    onClick={(event) =>
                      handleNavigation(
                        event,
                        settingsNavigation
                      )
                    }
                    aria-disabled={!allowed}
                  >
                    <Settings
                      size={18}
                      strokeWidth={1.8}
                    />

                    <span>
                      {settingsNavigation.label}
                    </span>
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
         ACCESS DENIED MODAL
      ===================================================== */}

      {accessDenied.open && (
        <div
          className="access-denied-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAccessDeniedModal();
            }
          }}
        >
          <div
            className="access-denied-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-denied-title"
            aria-describedby="access-denied-description"
          >
            <div className="access-denied-icon">
              <AlertTriangle
                size={25}
                strokeWidth={1.9}
              />
            </div>

            <div className="access-denied-content">
              <span className="access-denied-eyebrow">
                Akses Ditolak
              </span>

              <h2 id="access-denied-title">
                Anda tidak memiliki akses
              </h2>

              <p id="access-denied-description">
                Menu{" "}
                <strong>
                  {accessDenied.label}
                </strong>{" "}
                hanya dapat diakses oleh pengguna
                dengan role{" "}
                <strong>
                  {accessDenied.requiredRole}
                </strong>
                .
              </p>
            </div>

            <button
              type="button"
              className="access-denied-close"
              onClick={closeAccessDeniedModal}
              aria-label="Tutup pemberitahuan akses ditolak"
            >
              <X
                size={17}
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              className="access-denied-button"
              onClick={closeAccessDeniedModal}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}