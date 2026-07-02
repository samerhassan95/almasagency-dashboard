import { notFound } from "next/navigation";
import ServiceForm from "../../../_components/ServiceForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

import { getApiUrl, getApiKey } from "@/lib/config";

async function getService(id: string) {
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();

  try {
    const res = await fetch(`${apiUrl}/services/${id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      next: { revalidate: 0 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return (
    <div>
      <Link href="/admin/services" className="admin-back-link"><ChevronRight size={16} /> العودة للخدمات</Link>
      <div className="admin-page-header"><div><h1 className="admin-page-title">تعديل الخدمة</h1><p className="admin-page-subtitle">{service.title_ar}</p></div></div>
      <div className="admin-card"><div className="admin-card__body">
        <ServiceForm mode="edit" initialData={{ id: service.id, title_ar: service.title_ar, title_en: service.title_en, description_ar: service.description_ar, description_en: service.description_en, image_url: service.image_url || "" }} />
      </div></div>
    </div>
  );
}
