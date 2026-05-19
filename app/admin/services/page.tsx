import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "../_components/DeleteButton";

export const dynamic = 'force-dynamic';

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const mainDomain = apiUrl.replace('/api', '');
  return `${mainDomain}${url}`;
};

async function getServices() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = process.env.ADMIN_API_KEY || 'almasa_secret_key_2025';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/services`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Failed to fetch services");
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">الخدمات</h1><p className="admin-page-subtitle">{services.length} خدمة</p></div>
        <Link href="/admin/services/create" className="admin-btn admin-btn--primary"><Plus size={18} /> إضافة خدمة</Link>
      </div>
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>الصورة</th><th>الخدمة (عربي)</th><th>Service (EN)</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4}><div className="admin-empty"><p>لا توجد خدمات بعد</p></div></td></tr>
              ) : services.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.image_url ? <img src={getFullImageUrl(s.image_url)} alt={s.title_ar} className="admin-table-img" /> : <div className="admin-table-img-placeholder">{s.title_ar[0]}</div>}</td>
                  <td style={{ fontWeight: 600 }}>{s.title_ar}</td>
                  <td style={{ color: "#6b7280", direction: "ltr" }}>{s.title_en}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/admin/services/${s.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm"><Pencil size={14} /> تعديل</Link>
                      <DeleteButton id={s.id} endpoint="services" label="الخدمة" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
