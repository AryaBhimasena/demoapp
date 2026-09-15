"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  Settings,
  Code2,
  Database,
  Workflow,
  CheckCircle2,
  MessageCircle,
  ArrowUpRight,
  LayoutDashboard,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import "@/styles/pages/pengaturan.css";

const WHATSAPP_NUMBER = "6281234567890";

export default function PengaturanPage() {
  const router = useRouter();

  const {
    credentials,
    authenticated,
    authStatus,
    isInitializing,
  } = useUser();

  const role = credentials?.role || "";
  const normalizedRole = String(role).trim().toLowerCase();

  const isSuperAdmin =
    normalizedRole === "super admin" ||
    normalizedRole === "superadmin";

  const displayName =
    credentials?.nama ||
    credentials?.username ||
    credentials?.user_id ||
    "User";

  const whatsappMessage = encodeURIComponent(
    "Halo, saya tertarik untuk dibuatkan aplikasi custom sesuai kebutuhan bisnis atau organisasi saya."
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  useEffect(() => {
    if (
      !isInitializing &&
      (authStatus !== "authenticated" || !authenticated)
    ) {
      router.replace("/login");
    }
  }, [
    isInitializing,
    authStatus,
    authenticated,
    router,
  ]);

  if (
    isInitializing ||
    authStatus !== "authenticated" ||
    !authenticated
  ) {
    return null;
  }

  return (
    <main className="settings-page">
      <div className="settings-shell">
        <section className="settings-brand">
          <div className="settings-brand-content">
            <div className="settings-brand-mark">
              ROLE
            </div>

            <div className="settings-brand-title">
              <span>ACCESS</span>
              <strong>-DEMO</strong>
            </div>

            <p className="settings-brand-description">
              Demonstrasi Role Level Management
            </p>

            <div className="settings-brand-divider" />

            <div className="settings-brand-status">
              <span className="settings-status-dot" />
              <span>ADMINISTRATION AREA</span>
            </div>

            <p className="settings-brand-tagline">
              Halaman ini merupakan area khusus untuk
              pengguna dengan Role Super Admin.
              Konfigurasi aplikasi dapat dikembangkan
              sesuai kebutuhan sistem.
            </p>
          </div>

          <div className="settings-brand-decoration">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="settings-panel">
          <header className="settings-header">
            <div className="settings-header-copy">
              <p className="settings-eyebrow">
                AREA ADMINISTRASI
              </p>

              <h1>Pengaturan Aplikasi</h1>

              <p className="settings-description">
                Kelola konfigurasi dan kebutuhan administratif
                aplikasi melalui area khusus administrator.
              </p>
            </div>

            <div className="settings-user-badge">
              <div className="settings-user-avatar">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <strong>{displayName}</strong>
                <span>{role || "User"}</span>
              </div>
            </div>
          </header>

          <div className="settings-divider" />

          {isSuperAdmin ? (
            <SuperAdminContent
              displayName={displayName}
              whatsappUrl={whatsappUrl}
            />
          ) : (
            <AccessDeniedContent
              role={role}
              whatsappUrl={whatsappUrl}
            />
          )}

          <footer className="settings-footer">
            <span>ACCESS-DEMO</span>
            <span className="settings-footer-dot">•</span>
            <span>Next.js + React</span>
            <span className="settings-footer-dot">•</span>
            <span>Google Apps Script + Sheets</span>
          </footer>
        </section>
      </div>
    </main>
  );
}

function SuperAdminContent({
  displayName,
  whatsappUrl,
}) {
  return (
    <div className="settings-content">
      <section className="settings-success-card">
        <div className="settings-success-icon">
          <CheckCircle2
            size={22}
            strokeWidth={1.9}
          />
        </div>

        <div className="settings-success-copy">
          <span className="settings-card-label">
            AKSES TERVERIFIKASI
          </span>

          <h2>
            Selamat datang, {displayName}
          </h2>

          <p>
            Anda berhasil mengakses halaman ini
            menggunakan Role Super Admin. Area ini
            disediakan untuk pengelolaan konfigurasi
            dan administrasi aplikasi.
          </p>
        </div>
      </section>

      <div className="settings-section-heading">
        <div>
          <span className="settings-card-label">
            MODUL PENGATURAN
          </span>

          <h2>Kelola kebutuhan aplikasi</h2>
        </div>

        <span className="settings-section-caption">
          Fitur dapat disesuaikan
        </span>
      </div>

      <div className="settings-module-grid">
        <SettingsModule
          icon={<ShieldCheck size={21} strokeWidth={1.9} />}
          title="Manajemen Role"
          description="Atur role, hak akses, dan pembatasan halaman berdasarkan kebutuhan aplikasi."
        />

        <SettingsModule
          icon={<Database size={21} strokeWidth={1.9} />}
          title="Konfigurasi Data"
          description="Kelola sumber data, struktur tabel, parameter aplikasi, dan konfigurasi penyimpanan."
        />

        <SettingsModule
          icon={<Workflow size={21} strokeWidth={1.9} />}
          title="Integrasi Sistem"
          description="Hubungkan aplikasi dengan Google Sheets, Apps Script, API, atau layanan lain."
        />

        <SettingsModule
          icon={<Settings size={21} strokeWidth={1.9} />}
          title="Preferensi Aplikasi"
          description="Atur identitas aplikasi, tampilan, notifikasi, dan parameter operasional."
        />
      </div>

      <section className="settings-promotion">
        <div className="settings-promotion-icon">
          <Code2 size={23} strokeWidth={1.8} />
        </div>

        <div className="settings-promotion-content">
          <span className="settings-card-label">
            PEMBUATAN APLIKASI CUSTOM
          </span>

          <h2>
            Wujudkan aplikasi sesuai kebutuhan Anda
          </h2>

          <p>
            Kami dapat membantu membuat aplikasi custom
            untuk kebutuhan administrasi, manajemen
            karyawan, dashboard monitoring, pengolahan
            data, pelaporan, hingga integrasi Google
            Sheets dan Google Apps Script.
          </p>

          <div className="settings-promotion-list">
            <span>
              <CheckCircle2 size={15} />
              Tampilan modern dan responsif
            </span>

            <span>
              <CheckCircle2 size={15} />
              Hak akses berdasarkan role
            </span>

            <span>
              <CheckCircle2 size={15} />
              Integrasi API dan Google Apps Script
            </span>

            <span>
              <CheckCircle2 size={15} />
              Dapat disesuaikan dengan alur kerja
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="settings-promotion-button"
          >
            <MessageCircle
              size={16}
              strokeWidth={1.9}
            />

            Konsultasikan kebutuhan Anda

            <ArrowUpRight
              size={15}
              strokeWidth={1.9}
            />
          </a>
        </div>
      </section>
    </div>
  );
}

function AccessDeniedContent({
  role,
  whatsappUrl,
}) {
  return (
    <div className="settings-denied-wrapper">
      <section className="settings-denied-card">
        <div className="settings-denied-icon">
          <LockKeyhole
            size={27}
            strokeWidth={1.8}
          />
        </div>

        <span className="settings-card-label">
          AKSES TERBATAS
        </span>

        <h2>Akses halaman ditolak</h2>

        <p>
          Halaman Pengaturan hanya dapat diakses
          oleh pengguna dengan Role Super Admin.
          Role Anda saat ini adalah{" "}
          <strong>{role || "User"}</strong>.
        </p>

        <div className="settings-denied-note">
          <ShieldCheck
            size={16}
            strokeWidth={1.9}
          />

          <span>
            Sistem telah membatasi akses halaman ini
            berdasarkan role dan hak akses pengguna.
          </span>
        </div>

        <Link
          href="/dashboard"
          className="settings-back-button"
        >
          <LayoutDashboard
            size={16}
            strokeWidth={1.9}
          />

          Kembali ke Dashboard
        </Link>
      </section>

      <section className="settings-mini-promotion">
        <div className="settings-mini-promotion-icon">
          <Smartphone
            size={22}
            strokeWidth={1.8}
          />
        </div>

        <div className="settings-mini-promotion-content">
          <span className="settings-card-label">
            PEMBUATAN APLIKASI CUSTOM
          </span>

          <h3>
            Punya kebutuhan sistem yang berbeda?
          </h3>

          <p>
            Aplikasi custom dapat dibuat sesuai
            alur kerja, kebutuhan data, role pengguna,
            dashboard, dan integrasi yang Anda perlukan.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="settings-mini-promotion-link"
          >
            Konsultasi sekarang
            <ArrowUpRight
              size={15}
              strokeWidth={1.9}
            />
          </a>
        </div>
      </section>
    </div>
  );
}

function SettingsModule({
  icon,
  title,
  description,
}) {
  return (
    <div className="settings-module-card">
      <div className="settings-module-icon">
        {icon}
      </div>

      <div className="settings-module-copy">
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <span className="settings-module-status">
        Siap dikembangkan
      </span>
    </div>
  );
}