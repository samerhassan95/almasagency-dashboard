import BlogForm from "../../_components/BlogForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CreateBlogPage() {
  return (
    <div>
      <Link href="/admin/blogs" className="admin-back-link">
        <ChevronRight size={16} /> العودة للمدونات
      </Link>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">إضافة مقال جديد</h1>
          <p className="admin-page-subtitle">أضف مقالاً جديداً بالعربية والإنجليزية</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-card__body">
          <BlogForm mode="create" />
        </div>
      </div>
    </div>
  );
}
