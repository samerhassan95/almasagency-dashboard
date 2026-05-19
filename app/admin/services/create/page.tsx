import ServiceForm from "../../_components/ServiceForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
export default function CreateServicePage() {
  return (
    <div>
      <Link href="/admin/services" className="admin-back-link"><ChevronRight size={16} /> العودة للخدمات</Link>
      <div className="admin-page-header"><div><h1 className="admin-page-title">إضافة خدمة جديدة</h1></div></div>
      <div className="admin-card"><div className="admin-card__body"><ServiceForm mode="create" /></div></div>
    </div>
  );
}
