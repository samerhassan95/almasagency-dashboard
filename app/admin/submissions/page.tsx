import { Inbox, Mail, Phone, User } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getSubmissions() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = process.env.ADMIN_API_KEY || 'almasa_secret_key_2025';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/submissions`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Failed to fetch submissions");
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">رسائل العملاء</h1><p className="admin-page-subtitle">{submissions.length} رسالة واردة</p></div>
      </div>

      {submissions.length === 0 ? (
        <div className="admin-card"><div className="admin-empty"><Inbox size={48} /><p>لا توجد رسائل بعد</p></div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {submissions.map((sub: any) => (
            <div key={sub.id} className="admin-card">
              <div className="admin-card__body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                      <User size={15} style={{ color: "#7c3aed" }} />
                      <span style={{ fontWeight: 600 }}>{sub.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#6b7280" }}>
                      <Mail size={15} /><a href={`mailto:${sub.email}`} style={{ color: "#7c3aed" }}>{sub.email}</a>
                    </div>
                    {sub.phone && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#6b7280" }}>
                        <Phone size={15} /><span dir="ltr">{sub.phone}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    {new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(sub.createdAt))}
                  </span>
                </div>
                <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px 18px", fontSize: 14, lineHeight: 1.8, color: "#374151", borderRight: "3px solid #7c3aed" }}>
                  {sub.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
