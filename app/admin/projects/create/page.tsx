import ProjectForm from "../../_components/ProjectForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CreateProjectPage() {
  return (
    <div>
      <Link href="/admin/projects" className="admin-back-link"><ChevronRight size={16} /> العودة للمشاريع</Link>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">إضافة مشروع جديد</h1></div>
      </div>
      <div className="admin-card"><div className="admin-card__body"><ProjectForm mode="create" /></div></div>
    </div>
  );
}
