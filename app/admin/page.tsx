import Link from "next/link";
import { FileText, FolderOpen, Briefcase, Inbox, ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

import { getApiUrl, getApiKey } from "@/lib/config";

async function getDashboardData() {
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/dashboard`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return null;
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData() || {
    blogsCount: 0,
    projectsCount: 0,
    servicesCount: 0,
    submissionsCount: 0,
    latestSubmissions: []
  };

  const stats = [
    {
      label: "المدونات",
      value: data.blogsCount,
      icon: FileText,
      color: "#7c3aed",
      bg: "#ede9fe",
      href: "/admin/blogs",
    },
    {
      label: "المشاريع",
      value: data.projectsCount,
      icon: FolderOpen,
      color: "#0ea5e9",
      bg: "#e0f2fe",
      href: "/admin/projects",
    },
    {
      label: "الخدمات",
      value: data.servicesCount,
      icon: Briefcase,
      color: "#10b981",
      bg: "#d1fae5",
      href: "/admin/services",
    },
    {
      label: "رسائل العملاء",
      value: data.submissionsCount,
      icon: Inbox,
      color: "#f59e0b",
      bg: "#fef3c7",
      href: "/admin/submissions",
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">لوحة التحكم</h1>
          <p className="admin-page-subtitle">مرحباً بك في لوحة إدارة محتوى الماسة</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="admin-stat-card" style={{ cursor: "pointer" }}>
              <div
                className="admin-stat-card__icon"
                style={{ background: stat.bg }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="admin-stat-card__value" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="admin-stat-card__label">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Latest submissions */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">آخر رسائل العملاء</h2>
          <Link href="/admin/submissions" className="admin-btn admin-btn--outline admin-btn--sm">
            عرض الكل <ArrowLeft size={14} />
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>الرسالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {data.latestSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty">
                      <p>لا توجد رسائل بعد</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.latestSubmissions.map((sub: any) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600 }}>{sub.name}</td>
                    <td>{sub.email}</td>
                    <td>{sub.phone || "—"}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sub.message}
                    </td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {new Intl.DateTimeFormat("ar-EG", {
                        year: "numeric", month: "short", day: "numeric",
                      }).format(new Date(sub.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
