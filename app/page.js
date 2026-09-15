"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@/contexts/userContext";
import "@/styles/pages/login.css";

const USERNAME_PATTERN = /^[A-Za-z0-9._-]+$/;
const PASSWORD_FORBIDDEN_PATTERN = /[<>]/;

function isValidUsername(value) {
  return value.length > 0 && USERNAME_PATTERN.test(value);
}

function isValidPassword(value) {
  return value.length > 0 && !PASSWORD_FORBIDDEN_PATTERN.test(value);
}

export default function LoginPage() {
  const { login } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    const value = event.target.value;

    if (value && !USERNAME_PATTERN.test(value)) {
      setErrorMessage(
        "Username hanya boleh mengandung huruf, angka, titik, underscore, dan tanda hubung."
      );
      return;
    }

    setUsername(value);
    setErrorMessage("");
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;

    if (PASSWORD_FORBIDDEN_PATTERN.test(value)) {
      setErrorMessage(
        "Password mengandung karakter yang tidak diperbolehkan."
      );
      return;
    }

    setPassword(value);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setErrorMessage("");

    const normalizedUsername = username.trim();

    if (!isValidUsername(normalizedUsername)) {
      setErrorMessage("Username tidak valid.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Password tidak valid.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(normalizedUsername, password);

      if (!result?.success) {
        setErrorMessage(
          result?.message || "Username atau password salah."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error?.message ||
          "Terjadi kesalahan saat menghubungkan ke server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-brand">
		  <div className="brand-content">
			<div className="brand-mark">ROLE</div>

			<div className="brand-title">
			  <span>ACCESS</span>
			  <strong>-DEMO</strong>
			</div>

			<p className="brand-description">
			  Demonstrasi Role Level Management
			</p>

			<div className="brand-divider" />

			<div className="brand-specs">
			  <div className="brand-spec-row">
				<span>Platform</span>
				<strong>Next.js + React</strong>
			  </div>

			  <div className="brand-spec-row">
				<span>Front-end</span>
				<strong>UI & Application Logic</strong>
			  </div>

			  <div className="brand-spec-row">
				<span>Back-end</span>
				<strong>Google Apps Script</strong>
			  </div>

			  <div className="brand-spec-row">
				<span>Database</span>
				<strong>Google Sheets</strong>
			  </div>

			  <div className="brand-spec-row">
				<span>Access Control</span>
				<strong>Role-based Access</strong>
			  </div>
			</div>

			<p className="brand-tagline">
			  Demo aplikasi web dengan autentikasi dan pembatasan
			  akses berdasarkan role pengguna.
			</p>
		  </div>

		  <div className="brand-decoration">
			<span />
			<span />
			<span />
		  </div>
		</section>

        <section className="login-panel">
          <div className="login-form-wrapper">
            <div className="mobile-brand">
              <div className="mobile-brand-mark">ROLE</div>

              <div>
                <div className="mobile-brand-title">
                  ACCESS<span>-DEMO</span>
                </div>

                <p>Demonstrasi Role Level Management</p>
              </div>
            </div>

            <div className="login-header">
              <p className="login-eyebrow">DEMO APLIKASI</p>

              <h1>Masuk ke Demo</h1>

              <p>
                Lihat penerapan autentikasi dan pengaturan hak akses
                pengguna berdasarkan role.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>

                <div className="input-wrapper">
                  <UserRound size={19} strokeWidth={1.8} />

                  <input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={handleUsernameChange}
                    autoComplete="username"
                    disabled={isLoading}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      setErrorMessage(
                        "Silakan hubungi administrator demo untuk mendapatkan akun."
                      )
                    }
                    disabled={isLoading}
                  >
                    Bantuan akun?
                  </button>
                </div>

                <div className="input-wrapper">
                  <LockKeyhole size={19} strokeWidth={1.8} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    disabled={isLoading}
                    maxLength={256}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} strokeWidth={1.8} />
                    ) : (
                      <Eye size={19} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="login-error" role="alert">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                <span>
                  {isLoading ? "Memproses..." : "Masuk ke Demo"}
                </span>

                {!isLoading && (
                  <ArrowRight size={19} strokeWidth={2} />
                )}
              </button>
            </form>

            <div className="login-footer">
              <span>ACCESS-DEMO</span>
              <span className="footer-dot">•</span>
              <span>Next.js + React</span>
              <span className="footer-dot">•</span>
              <span>Google Apps Script + Sheets</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}