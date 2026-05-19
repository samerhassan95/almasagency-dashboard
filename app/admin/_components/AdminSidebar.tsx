"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  Phone,
  Inbox,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "المدونات", icon: FileText },
  { href: "/admin/projects", label: "المشاريع", icon: FolderOpen },
  { href: "/admin/services", label: "الخدمات", icon: Briefcase },
  { href: "/admin/contact", label: "بيانات التواصل", icon: Phone },
  { href: "/admin/submissions", label: "رسائل العملاء", icon: Inbox },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="admin-mobile-bar">
        <button onClick={() => setCollapsed(!collapsed)} className="admin-mobile-toggle">
          {collapsed ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="admin-mobile-title">الماسة - لوحة التحكم</span>
      </div>

      <aside className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}>
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <img src="/full-logo.svg" alt="الماسة" style={{ height: 32, width: 'auto' }} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="admin-sidebar__collapse-btn"
          >
            <ChevronLeft size={16} className={collapsed ? "rotate-180" : ""} />
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <a href="http://localhost:3000" className="admin-nav-item">
            <LogOut size={20} />
            {!collapsed && <span>الخروج للموقع</span>}
          </a>
        </div>
      </aside>
    </>
  );
}
