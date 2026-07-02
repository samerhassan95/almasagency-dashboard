import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "../_components/DeleteButton";
import { getApiUrl, getApiKey, getFullMediaUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

async function getProjects() {
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/projects`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Failed to fetch projects");
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">المشاريع</h1>
          <p className="admin-page-subtitle">{projects.length} مشروع</p>
        </div>
        <Link href="/admin/projects/create" className="admin-btn admin-btn--primary">
          <Plus size={18} /> إضافة مشروع
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>العنوان (عربي)</th>
                <th>Title (EN)</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty">
                      <p>لا توجد مشاريع بعد</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((p: any) => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <img
                          src={getFullMediaUrl(p.image_url)}
                          alt={p.title_ar}
                          className="admin-table-img"
                        />
                      ) : (
                        <div className="admin-table-img-placeholder">{p.title_ar[0]}</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.title_ar}</td>
                    <td style={{ color: "#6b7280", direction: "ltr" }}>{p.title_en}</td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {p.date ? new Date(p.date).toLocaleDateString("ar-EG") : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="admin-btn admin-btn--outline admin-btn--sm"
                        >
                          <Pencil size={14} /> تعديل
                        </Link>
                        <DeleteButton id={p.id} endpoint="projects" label="المشروع" />
                      </div>
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
