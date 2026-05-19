import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
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

async function getBlogs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = process.env.ADMIN_API_KEY || 'almasa_secret_key_2025';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/blogs`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const mainDomain = apiUrl.replace('/api', '');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">المدونات</h1>
          <p className="admin-page-subtitle">{blogs.length} مقال منشور</p>
        </div>
        <Link href="/admin/blogs/create" className="admin-btn admin-btn--primary">
          <Plus size={18} /> إضافة مقال جديد
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
              {blogs.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty"><p>لا توجد مقالات بعد</p></div></td></tr>
              ) : (
                blogs.map((blog: any) => (
                  <tr key={blog.id}>
                    <td>
                      {blog.image_url
                        ? <img src={getFullImageUrl(blog.image_url)} alt={blog.title_ar} className="admin-table-img" />
                        : <div className="admin-table-img-placeholder">{blog.title_ar[0]}</div>
                      }
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 220 }}>{blog.title_ar}</td>
                    <td style={{ color: "#6b7280", maxWidth: 200, direction: "ltr" }}>{blog.title_en}</td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>
                      {new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "short", day: "numeric" }).format(new Date(blog.createdAt))}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={`${mainDomain}/ar/blogs/${blog.id}`} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--outline admin-btn--sm" title="معاينة">
                          <Eye size={14} />
                        </a>
                        <Link href={`/admin/blogs/${blog.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">
                          <Pencil size={14} /> تعديل
                        </Link>
                        <DeleteButton id={blog.id} endpoint="blogs" label="المقال" />
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
