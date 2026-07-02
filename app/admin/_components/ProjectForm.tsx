"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Save, X } from "lucide-react";

interface ProjectFormProps {
  initialData?: {
    id?: number;
    date?: string;
    title_ar: string; title_en: string;
    subtitle_ar?: string; subtitle_en?: string;
    description_ar: string; description_en: string;
    image_url?: string;
    pdf_url?: string;
  };
  mode: "create" | "edit";
}

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const mainDomain = apiUrl.replace('/api', '');
  return `${mainDomain}${url}`;
};

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Format initial ISO date to YYYY-MM-DD
  const formatInitialDate = (d?: string) => {
    if (!d) return "";
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const [form, setForm] = useState({
    date: formatInitialDate(initialData?.date),
    title_ar: initialData?.title_ar || "",
    title_en: initialData?.title_en || "",
    subtitle_ar: initialData?.subtitle_ar || "",
    subtitle_en: initialData?.subtitle_en || "",
    description_ar: initialData?.description_ar || "",
    description_en: initialData?.description_en || "",
    image_url: initialData?.image_url || "",
    pdf_url: initialData?.pdf_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'almasa_secret_key_2025';

    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${apiUrl}/upload`, { 
        method: "POST", 
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: fd 
      });
      const data = await res.json();
      if (data.success) setForm((p) => ({ ...p, image_url: data.url }));
      else setAlert({ type: "error", msg: "فشل رفع الصورة" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "حدث خطأ أثناء رفع الصورة" });
    } finally {
      setUploading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingPdf(true);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'almasa_secret_key_2025';

    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch(`${apiUrl}/upload`, { 
        method: "POST", 
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: fd 
      });
      const data = await res.json();
      if (data.success) setForm((p) => ({ ...p, pdf_url: data.url }));
      else setAlert({ type: "error", msg: "فشل رفع ملف PDF" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "حدث خطأ أثناء رفع ملف PDF" });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setAlert(null);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const apiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'almasa_secret_key_2025';

    const url = mode === "edit" ? `${apiUrl}/projects/${initialData?.id}` : `${apiUrl}/projects`;
    
    try {
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json(); 
      if (data.success) { 
        setAlert({ type: "success", msg: "تم الحفظ بنجاح!" }); 
        setTimeout(() => {
          router.push("/admin/projects");
          router.refresh();
        }, 1000); 
      }
      else setAlert({ type: "error", msg: data.message || "حدث خطأ ما" });
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
        <label className="admin-label">صورة المشروع</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        <div className="admin-upload-zone" onClick={() => fileInputRef.current?.click()}>
          {uploading ? <p style={{ color: "#7c3aed" }}>جارٍ الرفع...</p>
            : form.image_url ? (<><img src={getFullImageUrl(form.image_url)} alt="preview" className="admin-upload-preview" /><p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>اضغط لتغيير</p></>)
            : (<><Upload size={32} style={{ color: "#9ca3af", margin: "0 auto 8px" }} /><p style={{ color: "#6b7280", fontSize: 14 }}>اضغط لرفع صورة</p></>)}
        </div>
        <input type="text" name="image_url" placeholder="أو الصق رابط الصورة..." value={form.image_url} onChange={handleChange} className="admin-input" style={{ marginTop: 8 }} />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">ملف PDF للمشروع</label>
        <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
        <div className="admin-upload-zone" onClick={() => pdfInputRef.current?.click()}>
          {uploadingPdf ? <p style={{ color: "#7c3aed" }}>جارٍ رفع ملف PDF...</p>
            : form.pdf_url ? (
              <>
                <p style={{ fontSize: 14, color: "#111" }}>PDF مرفوع: <a href={form.pdf_url} target="_blank" rel="noreferrer" className="font-semibold underline">عرض / تحميل</a></p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>اضغط لتغيير الملف</p>
              </>
            ) : (
              <><Upload size={32} style={{ color: "#9ca3af", margin: "0 auto 8px" }} /><p style={{ color: "#6b7280", fontSize: 14 }}>اضغط لرفع ملف PDF</p></>)
          }
        </div>
        <input type="text" name="pdf_url" placeholder="أو الصق رابط PDF..." value={form.pdf_url} onChange={handleChange} className="admin-input" style={{ marginTop: 8 }} />
      </div>

      <div className="admin-form-group" style={{ maxWidth: 260 }}>
        <label className="admin-label">تاريخ المشروع</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="admin-input" />
      </div>

      <div className="admin-section-divider"><span>العنوان</span></div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">العنوان <span className="admin-label-lang admin-label-lang--ar">عربي</span></label>
          <input name="title_ar" value={form.title_ar} onChange={handleChange} required className="admin-input" placeholder="اسم المشروع بالعربية" dir="rtl" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Title <span className="admin-label-lang admin-label-lang--en">EN</span></label>
          <input name="title_en" value={form.title_en} onChange={handleChange} required className="admin-input" placeholder="Project name in English" dir="ltr" />
        </div>
      </div>

      <div className="admin-section-divider"><span>العنوان الفرعي</span></div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">عنوان فرعي <span className="admin-label-lang admin-label-lang--ar">عربي</span></label>
          <input name="subtitle_ar" value={form.subtitle_ar} onChange={handleChange} className="admin-input" dir="rtl" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Subtitle <span className="admin-label-lang admin-label-lang--en">EN</span></label>
          <input name="subtitle_en" value={form.subtitle_en} onChange={handleChange} className="admin-input" dir="ltr" />
        </div>
      </div>

      <div className="admin-section-divider"><span>الوصف</span></div>
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-label">الوصف <span className="admin-label-lang admin-label-lang--ar">عربي</span></label>
          <textarea name="description_ar" value={form.description_ar} onChange={handleChange} required className="admin-textarea" dir="rtl" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Description <span className="admin-label-lang admin-label-lang--en">EN</span></label>
          <textarea name="description_en" value={form.description_en} onChange={handleChange} required className="admin-textarea" dir="ltr" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Link href="/admin/projects" className="admin-btn admin-btn--outline"><X size={16} /> إلغاء</Link>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? <span className="admin-spinner" /> : <Save size={16} />}
          {mode === "edit" ? "حفظ التعديلات" : "إضافة المشروع"}
        </button>
      </div>
    </form>
  );
}
