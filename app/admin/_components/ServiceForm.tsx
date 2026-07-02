"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Save, X } from "lucide-react";
import { config } from "@/lib/config";

interface ServiceFormProps {
  initialData?: {
    id?: number;
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
    image_url?: string;
  };
  mode: "create" | "edit";
}

export default function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title_ar: initialData?.title_ar || "",
    title_en: initialData?.title_en || "",
    description_ar: initialData?.description_ar || "",
    description_en: initialData?.description_en || "",
    image_url: initialData?.image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${config.apiUrl}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: fd,
      });
      const data = await res.json();
      if (data.success)
        setForm((p) => ({ ...p, image_url: config.normalizeMediaPath(data.url) }));
      else setAlert({ type: "error", msg: "فشل رفع الصورة" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "حدث خطأ أثناء رفع الصورة" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const payload = {
      ...form,
      image_url: config.normalizeMediaPath(form.image_url),
    };

    const url =
      mode === "edit"
        ? `${config.apiUrl}/services/${initialData?.id}`
        : `${config.apiUrl}/services`;

    try {
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: "success", msg: "تم الحفظ بنجاح!" });
        setTimeout(() => {
          router.push("/admin/services");
          router.refresh();
        }, 1000);
      } else setAlert({ type: "error", msg: data.message || "حدث خطأ" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "فشل الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {alert && <div className={`admin-alert admin-alert--${alert.type}`}>{alert.msg}</div>}
      <div className="admin-form-group">
        <label className="admin-label">صورة الخدمة</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        <div className="admin-upload-zone" onClick={() => fileInputRef.current?.click()}>
          {uploading ? (
            <p style={{ color: "#7c3aed" }}>جارٍ الرفع...</p>
          ) : form.image_url ? (
            <img
              src={config.getFullImageUrl(form.image_url)}
              alt="preview"
              className="admin-upload-preview"
            />
          ) : (
            <>
              <Upload size={32} style={{ color: "#9ca3af", margin: "0 auto 8px" }} />
              <p style={{ color: "#6b7280", fontSize: 14 }}>اضغط لرفع صورة</p>
            </>
          )}
        </div>
        <input
          type="text"
          name="image_url"
          placeholder="أو الصق رابط الصورة..."
          value={form.image_url}
          onChange={handleChange}
          className="admin-input"
          style={{ marginTop: 8 }}
        />
      </div>
      <div className="admin-section-divider">
        <span>الاسم</span>
      </div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">
            اسم الخدمة <span className="admin-label-lang admin-label-lang--ar">عربي</span>
          </label>
          <input
            name="title_ar"
            value={form.title_ar}
            onChange={handleChange}
            required
            className="admin-input"
            dir="rtl"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">
            Service Name <span className="admin-label-lang admin-label-lang--en">EN</span>
          </label>
          <input
            name="title_en"
            value={form.title_en}
            onChange={handleChange}
            required
            className="admin-input"
            dir="ltr"
          />
        </div>
      </div>
      <div className="admin-section-divider">
        <span>الوصف</span>
      </div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">
            الوصف <span className="admin-label-lang admin-label-lang--ar">عربي</span>
          </label>
          <textarea
            name="description_ar"
            value={form.description_ar}
            onChange={handleChange}
            required
            className="admin-textarea"
            dir="rtl"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">
            Description <span className="admin-label-lang admin-label-lang--en">EN</span>
          </label>
          <textarea
            name="description_en"
            value={form.description_en}
            onChange={handleChange}
            required
            className="admin-textarea"
            dir="ltr"
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Link href="/admin/services" className="admin-btn admin-btn--outline">
          <X size={16} /> إلغاء
        </Link>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? <span className="admin-spinner" /> : <Save size={16} />}
          {mode === "edit" ? "حفظ التعديلات" : "إضافة الخدمة"}
        </button>
      </div>
    </form>
  );
}
