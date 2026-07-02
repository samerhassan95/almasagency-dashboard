"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import "../admin/admin.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-login-shell" dir="rtl">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-badge">
            <Lock size={22} />
          </div>
        </div>

        <h1 className="admin-login-title">تسجيل الدخول إلى لوحة التحكم</h1>
        <p className="admin-login-subtitle">أدخل بيانات الدخول الخاصة بك للوصول إلى إدارة المحتوى</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label className="admin-label" htmlFor="username">
              <Mail size={15} /> اسم المستخدم
            </label>
            <input
              id="username"
              className="admin-input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="admin-login-field">
            <label className="admin-label" htmlFor="password">
              <Lock size={15} /> كلمة المرور
            </label>
            <input
              id="password"
              className="admin-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}

          <button className="admin-btn admin-btn--primary admin-login-submit" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="admin-spinner" /> : <Lock size={16} />}
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
