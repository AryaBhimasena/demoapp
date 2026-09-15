"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Code2,
  Database,
  Layers3,
  MessageCircle,
  Settings,
  UserRound,
  Clock3,
  LayoutDashboard,
  LockKeyhole,
  ArrowUpRight,
} from "lucide-react";

import { useUser } from "@/contexts/userContext";
import "@/styles/pages/dashboard.css";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "account",
    label: "Akun",
    icon: UserRound,
  },
  {
    id: "technology",
    label: "Infrastruktur",
    icon: Layers3,
  },
  {
    id: "access",
    label: "Hak Akses",
    icon: ShieldCheck,
  },
];

export default function DashboardPage() {
  const { user, credentials } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const currentUser = user || credentials || {};
  const access = currentUser.access || {};

  const username = currentUser.username || "-";
  const role = currentUser.role || access.role || "-";
  const userId = currentUser.user_id || "-";
  const sessionId = currentUser.session_id || "-";

  const normalizedRole = String(role)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  const isSuperAdmin = normalizedRole === "super admin";
  const isAdmin = normalizedRole === "admin";

  const whatsappMessage = encodeURIComponent(
    "Halo, saya ingin konsultasi pembuatan aplikasi custom untuk perusahaan atau bisnis saya."
  );

  const whatsappUrl = `https://wa.me/6285745407653?text=${whatsappMessage}`;

  const activeTabData = TABS.find((tab) => tab.id === activeTab);

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-brand">
          <div className="dashboard-brand-content">
            <div className="dashboard-brand-mark">ROLE</div>

            <div className="dashboard-brand-title">
              <span>ACCESS</span>
              <strong>-DEMO</strong>
            </div>

            <p className="dashboard-brand-description">
              Demonstrasi Role Level Management
            </p>

            <div className="dashboard-brand-divider" />

            <div className="dashboard-brand-status">
              <span className="status-dot" />
              <span>SESSION ACTIVE</span>
            </div>

            <p className="dashboard-brand-tagline">
              Anda telah berhasil login. Gunakan halaman ini
              untuk melihat informasi akun, hak akses, dan
              konsep infrastruktur aplikasi.
            </p>
          </div>

          <div className="dashboard-brand-decoration">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="dashboard-panel">
          <header className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">DEMO APLIKASI</p>

              <h1>Selamat datang di Dashboard</h1>

              <p className="dashboard-description">
                Informasi autentikasi, session, infrastruktur,
                dan pembatasan akses pengguna.
              </p>
            </div>

            <div className="dashboard-user-badge">
              <div className="dashboard-user-avatar">
                <UserRound size={18} strokeWidth={1.8} />
              </div>

              <div>
                <strong>{username}</strong>
                <span>{role}</span>
              </div>
            </div>
          </header>

          <div className="dashboard-tabs-wrapper">
            <div className="dashboard-tabs" role="tablist">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`dashboard-tab ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dashboard-tab-heading">
            <div>
              <span>{activeTabData?.label}</span>

              <h2>
                {activeTab === "overview" &&
                  "Ringkasan aplikasi"}

                {activeTab === "account" &&
                  "Informasi akun Anda"}

                {activeTab === "technology" &&
                  "Infrastruktur aplikasi"}

                {activeTab === "access" &&
                  "Pengaturan hak akses"}
              </h2>
            </div>

            <div className="dashboard-tab-indicator">
              <CheckCircle2 size={15} />
              Aktif
            </div>
          </div>

          <div className="dashboard-tab-content">
            {activeTab === "overview" && (
              <OverviewTab
                username={username}
                role={role}
                access={access}
                isAdmin={isAdmin}
                onConsult={() => window.open(
                  whatsappUrl,
                  "_blank",
                  "noopener,noreferrer"
                )}
              />
            )}

            {activeTab === "account" && (
              <AccountTab
                username={username}
                role={role}
                userId={userId}
                sessionId={sessionId}
              />
            )}

            {activeTab === "technology" && <TechnologyTab />}

			{activeTab === "access" && (
			  <AccessTab
				role={role}
				isAdmin={isAdmin}
				isSuperAdmin={isSuperAdmin}
				access={access}
			  />
			)}
          </div>

          <footer className="dashboard-footer">
            <span>ACCESS-DEMO</span>
            <span className="footer-dot">•</span>
            <span>Next.js + React</span>
            <span className="footer-dot">•</span>
            <span>Google Apps Script + Sheets</span>
          </footer>
        </section>
      </div>
    </main>
  );
}

function OverviewTab({
  username,
  role,
  access,
  isAdmin,
  onConsult,
}) {
  return (
    <div className="overview-layout">
      <div className="overview-main">
        <div className="success-card">
          <div className="success-card-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <h3>Login berhasil</h3>

            <p>
              Session untuk akun <strong>{username}</strong>{" "}
              sedang aktif dan dapat digunakan untuk mengakses
              halaman sesuai hak akses yang diberikan.
            </p>
          </div>
        </div>

        <div className="overview-grid">
          <div className="overview-item">
            <span className="overview-item-label">Username</span>
            <strong>{username}</strong>
          </div>

          <div className="overview-item">
            <span className="overview-item-label">Role</span>
            <strong>{role}</strong>
          </div>

          <div className="overview-item">
            <span className="overview-item-label">
              Dashboard
            </span>

            <strong className="allowed-text">
              {access.dashboard ? "Diizinkan" : "Ditolak"}
            </strong>
          </div>

          <div className="overview-item">
            <span className="overview-item-label">
              Pengaturan
            </span>

            <strong
              className={
                access.pengaturan
                  ? "allowed-text"
                  : "denied-text"
              }
            >
              {access.pengaturan ? "Diizinkan" : "Ditolak"}
            </strong>
          </div>
        </div>
      </div>

      <div className="promotion-card">
        <div className="promotion-icon">
          <Settings size={23} />
        </div>

        <div>
          <span className="promotion-label">
            CUSTOM APPLICATION
          </span>

          <h3>
            Ingin dibuatkan aplikasi khusus?
          </h3>

          <p>
            Konsultasikan kebutuhan aplikasi perusahaan atau
            bisnis Anda, mulai dari HRIS, absensi, inventaris,
            penjualan, keuangan, hingga dashboard laporan.
          </p>

          <button
            type="button"
            className="promotion-button"
            onClick={onConsult}
          >
            <MessageCircle size={16} />
            Konsultasikan Kebutuhan
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountTab({
  username,
  role,
  userId,
  sessionId,
}) {
  return (
    <div className="account-layout">
      <div className="account-intro">
        <div className="account-intro-icon">
          <UserRound size={22} />
        </div>

        <div>
          <h3>Detail akun yang sedang digunakan</h3>

          <p>
            Data berikut berasal dari session autentikasi
            yang berhasil dibuat setelah proses login.
          </p>
        </div>
      </div>

      <div className="account-data-grid">
        <InfoCard
          icon={<UserRound size={19} />}
          label="Username"
          value={username}
        />

        <InfoCard
          icon={<ShieldCheck size={19} />}
          label="Role"
          value={role}
        />

        <InfoCard
          icon={<Database size={19} />}
          label="User ID"
          value={userId}
        />

        <InfoCard
          icon={<Clock3 size={19} />}
          label="Session ID"
          value={sessionId}
          compact
        />
      </div>
    </div>
  );
}

function TechnologyTab() {
  return (
    <div className="technology-layout">
      <div className="technology-grid">
        <TechnologyCard
          icon={<Code2 size={22} />}
          title="Next.js dan React"
          description="Membangun antarmuka modern, cepat, responsif, dan mudah dikembangkan menjadi aplikasi dengan banyak modul."
        />

        <TechnologyCard
          icon={<Database size={22} />}
          title="Google Sheets"
          description="Menyediakan penyimpanan data operasional, administrasi, master data, laporan, dan kebutuhan bisnis yang fleksibel."
        />

        <TechnologyCard
          icon={<Layers3 size={22} />}
          title="Google Apps Script"
          description="Berfungsi sebagai backend ringan untuk API, autentikasi, session, validasi akses, dan integrasi Google Sheets."
        />
      </div>

      <div className="advantages-box">
        <div className="advantages-heading">
          <CheckCircle2 size={18} />
          <strong>Kelebihan utama</strong>
        </div>

        <div className="advantages-list">
          <span>Biaya infrastruktur relatif terjangkau</span>
          <span>Mudah dikembangkan dan dipelihara</span>
          <span>Data dapat dikelola melalui Google Sheets</span>
          <span>Frontend dan backend dapat dipisahkan</span>
          <span>Mendukung berbagai kebutuhan bisnis</span>
          <span>Mendukung role dan hak akses</span>
        </div>
      </div>
    </div>
  );
}

function AccessTab({
  role,
  isAdmin,
  isSuperAdmin,
  access,
}) {
  const canAccessSettings =
    isSuperAdmin || Boolean(access.pengaturan);

  return (
    <div className="access-layout">
      <div
        className={`access-alert ${
          canAccessSettings ? "success" : "warning"
        }`}
      >
        <div className="access-alert-icon">
          {canAccessSettings ? (
            <ShieldCheck size={21} />
          ) : (
            <LockKeyhole size={21} />
          )}
        </div>

        <div>
          <h3>
            {canAccessSettings
              ? "Akses Pengaturan diizinkan"
              : "Akses Pengaturan dibatasi"}
          </h3>

          <p>
            {canAccessSettings
              ? isSuperAdmin
                ? `Akun dengan role ${role} memiliki hak akses penuh terhadap halaman Pengaturan.`
                : `Akun dengan role ${role} dapat mengakses halaman Pengaturan berdasarkan konfigurasi hak akses yang diberikan.`
              : `Akun dengan role ${role} tidak diberikan akses ke halaman Pengaturan. Menu pada navbar dan akses melalui direct URL akan ditolak oleh sistem.`}
          </p>
        </div>
      </div>

      <div className="permission-list">
        <PermissionRow
          label="Dashboard"
          description="Halaman utama aplikasi"
          allowed={isSuperAdmin || Boolean(access.dashboard)}
        />

        <PermissionRow
          label="Pengaturan"
          description="Halaman pengaturan aplikasi"
          allowed={canAccessSettings}
        />
      </div>

      <div className="access-note">
        <ShieldCheck size={17} />

        <span>
          Sistem memvalidasi hak akses pada sisi frontend dan tetap
          menolak route yang tidak diizinkan.
        </span>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  compact = false,
}) {
  return (
    <div className="info-card">
      <div className="info-card-icon">{icon}</div>

      <div className="info-card-content">
        <span>{label}</span>

        <strong className={compact ? "compact-value" : ""}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function TechnologyCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="technology-card">
      <div className="technology-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

function PermissionRow({
  label,
  description,
  allowed,
}) {
  return (
    <div className="permission-row">
      <div className="permission-icon">
        {allowed ? (
          <CheckCircle2 size={19} />
        ) : (
          <LockKeyhole size={18} />
        )}
      </div>

      <div className="permission-description">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>

      <span
        className={
          allowed
            ? "permission-status allowed"
            : "permission-status denied"
        }
      >
        {allowed ? "DIIZINKAN" : "DITOLAK"}
      </span>
    </div>
  );
}