import { notFound } from "next/navigation";
import ProjectForm from "../../../_components/ProjectForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getProject(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const apiKey = process.env.ADMIN_API_KEY || 'almasa_secret_key_2025';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${apiUrl}/projects/${id}`, {
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

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/projects" className="admin-back-link"><ChevronRight size={16} /> العودة للمشاريع</Link>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">تعديل المشروع</h1><p className="admin-page-subtitle">{project.title_ar}</p></div>
      </div>
      <div className="admin-card"><div className="admin-card__body">
        <ProjectForm mode="edit" initialData={{
          id: project.id, date: project.date || "",
          title_ar: project.title_ar, title_en: project.title_en,
          subtitle_ar: project.subtitle_ar || "", subtitle_en: project.subtitle_en || "",
          description_ar: project.description_ar, description_en: project.description_en,
          image_url: project.image_url || "",
          pdf_url: project.pdf_url || "",
        }} />
      </div></div>
    </div>
  );
}
