import AdminSidebar from "./_components/AdminSidebar";
import "./admin.css";

export const metadata = {
  title: "لوحة التحكم | الماسة",
  description: "لوحة إدارة محتوى موقع الماسة",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-body" dir="rtl">
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
