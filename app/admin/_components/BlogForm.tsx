"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Save, X } from "lucide-react";
import { config } from "@/lib/config";

interface BlogFormProps {
  initialData?: {
    id?: number;
    title_ar: string;
    title_en: string;
    subtitle_ar: string;
    subtitle_en: string;
    content_ar: string;
    content_en: string;
    image_url: string;
  };
  mode: "create" | "edit";
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title_ar: initialData?.title_ar || "",
    title_en: initialData?.title_en || "",
    subtitle_ar: initialData?.subtitle_ar || "",
    subtitle_en: initialData?.subtitle_en || "",
    content_ar: initialData?.content_ar || "",
    content_en: initialData?.content_en || "",
    image_url: initialData?.image_url || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (data.success) {
        setForm((prev) => ({
          ...prev,
          image_url: config.normalizeMediaPath(data.url),
        }));
      } else {
        setAlert({ type: "error", msg: "فشل رفع الصورة" });
      }
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
        ? `${config.apiUrl}/blogs/${initialData?.id}`
        : `${config.apiUrl}/blogs`;
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAlert({
          type: "success",
          msg: mode === "edit" ? "تم التحديث بنجاح!" : "تمت الإضافة بنجاح!",
        });
        setTimeout(() => {
          router.push("/admin/blogs");
          router.refresh();
        }, 1000);
      } else {
        setAlert({ type: "error", msg: data.message || "حدث خطأ ما" });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "فشل الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {alert && (
        <div className={`admin-alert admin-alert--${alert.type}`}>{alert.msg}</div>
      )}

      <div className="admin-form-group">
        <label className="admin-label">صورة المقال</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <div
          className="admin-upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <p style={{ color: "#7c3aed" }}>جارٍ الرفع...</p>
          ) : form.image_url ? (
            <>
              <img
                src={config.getFullImageUrl(form.image_url)}
                alt="preview"
                className="admin-upload-preview"
              />
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                اضغط لتغيير الصورة
              </p>
            </>
          ) : (
            <>
              <Upload size={32} style={{ color: "#9ca3af", margin: "0 auto 8px" }} />
              <p style={{ color: "#6b7280", fontSize: 14 }}>اضغط لرفع صورة المقال</p>
              <p style={{ color: "#9ca3af", fontSize: 12 }}>
                JPG, PNG, WebP — حد أقصى 5MB
              </p>
            </>
          )}
        </div>
        <input
          type="text"
          name="image_url"
          placeholder="أو الصق رابط الصورة مباشرة..."
          value={form.image_url}
          onChange={handleChange}
          className="admin-input"
          style={{ marginTop: 8 }}
        />
      </div>

      <div className="admin-section-divider">
        <span>العنوان</span>
      </div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">
            العنوان <span className="admin-label-lang admin-label-lang--ar">عربي</span>
          </label>
          <input
            name="title_ar"
            value={form.title_ar}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="عنوان المقال بالعربية"
            dir="rtl"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">
            Title <span className="admin-label-lang admin-label-lang--en">EN</span>
          </label>
          <input
            name="title_en"
            value={form.title_en}
            onChange={handleChange}
            required
            className="admin-input"
            placeholder="Blog post title in English"
            dir="ltr"
          />
        </div>
      </div>

      <div className="admin-section-divider">
        <span>العنوان الفرعي</span>
      </div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">
            العنوان الفرعي{" "}
            <span className="admin-label-lang admin-label-lang--ar">عربي</span>
          </label>
          <input
            name="subtitle_ar"
            value={form.subtitle_ar}
            onChange={handleChange}
            className="admin-input"
            placeholder="ملخص قصير للمقال"
            dir="rtl"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">
            Subtitle <span className="admin-label-lang admin-label-lang--en">EN</span>
          </label>
          <input
            name="subtitle_en"
            value={form.subtitle_en}
            onChange={handleChange}
            className="admin-input"
            placeholder="Short article summary"
            dir="ltr"
          />
        </div>
      </div>

      <div className="admin-section-divider">
        <span>المحتوى الكامل</span>
      </div>
      <div className="admin-form-group">
        <label className="admin-label">
          المحتوى الكامل <span className="admin-label-lang admin-label-lang--ar">عربي</span>
        </label>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          استخدم ## للعناوين الفرعية، واتركسطر فارغ بين الفقرات
        </p>
        <textarea
          name="content_ar"
          value={form.content_ar}
          onChange={handleChange}
          required
          className="admin-textarea admin-textarea--lg"
          placeholder="اكتب محتوى المقال بالعربية هنا..."
          dir="rtl"
        />
      </div>
      <div className="admin-form-group">
        <label className="admin-label">
          Full Content <span className="admin-label-lang admin-label-lang--en">EN</span>
        </label>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          Use ## for subheadings, leave blank line between paragraphs
        </p>
        <textarea
          name="content_en"
          value={form.content_en}
          onChange={handleChange}
          required
          className="admin-textarea admin-textarea--lg"
          placeholder="Write the full blog content in English here..."
          dir="ltr"
        />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Link href="/admin/blogs" className="admin-btn admin-btn--outline">
          <X size={16} /> إلغاء
        </Link>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? <span className="admin-spinner" /> : <Save size={16} />}
          {mode === "edit" ? "حفظ التعديلات" : "نشر المقال"}
        </button>
      </div>
    </form>
  );
}
