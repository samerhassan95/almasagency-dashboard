import { notFound } from "next/navigation";
import BlogForm from "../../../_components/BlogForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

import { getApiUrl, getApiKey } from "@/lib/config";

async function getBlog(id: string) {
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/blogs/${id}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) notFound();

  return (
    <div>
      <Link href="/admin/blogs" className="admin-back-link">
        <ChevronRight size={16} /> العودة للمدونات
      </Link>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">تعديل المقال</h1>
          <p className="admin-page-subtitle">{blog.title_ar}</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card__body">
          <BlogForm
            mode="edit"
            initialData={{
              id: blog.id,
              title_ar: blog.title_ar, title_en: blog.title_en,
              subtitle_ar: blog.subtitle_ar || "", subtitle_en: blog.subtitle_en || "",
              content_ar: blog.content_ar, content_en: blog.content_en,
              image_url: blog.image_url || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
