"use client";
import { useState, useEffect } from "react";
import { Save, Phone, Mail, MapPin, Link2 } from "lucide-react";
import { config } from "@/lib/config";

export default function AdminContactPage() {
  const [form, setForm] = useState({
    phone: "", email: "",
    location_ar: "", location_en: "",
    facebook: "", instagram: "", linkedin: "", dribbble: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/contact`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setForm({
          phone: data.data.phone || "",
          email: data.data.email || "",
          location_ar: data.data.location_ar || "",
          location_en: data.data.location_en || "",
          facebook: data.data.facebook || "",
          instagram: data.data.instagram || "",
          linkedin: data.data.linkedin || "",
          dribbble: data.data.dribbble || "",
        });
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setAlert(null);
    
    try {
      const res = await fetch(`${config.apiUrl}/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json(); 
      setAlert(data.success ? { type: "success", msg: "تم حفظ بيانات التواصل بنجاح!" } : { type: "error", msg: "حدث خطأ أثناء الحفظ" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "فشل الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>جارٍ التحميل...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">بيانات التواصل</h1><p className="admin-page-subtitle">تحديث بيانات التواصل التي تظهر في الموقع</p></div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {alert && <div className={`admin-alert admin-alert--${alert.type}`}>{alert.msg}</div>}

        <div className="admin-card">
          <div className="admin-card__header"><h2 className="admin-card__title"><Phone size={18} style={{ display: "inline", marginLeft: 8, color: "#7c3aed" }} />معلومات الاتصال</h2></div>
          <div className="admin-card__body">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label"><Phone size={14} /> رقم الهاتف</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="admin-input" placeholder="+966 50 000 0000" dir="ltr" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label"><Mail size={14} /> البريد الإلكتروني</label>
                <input name="email" value={form.email} onChange={handleChange} className="admin-input" placeholder="info@almasa.com" dir="ltr" type="email" />
              </div>
            </div>
            <div className="admin-form-row" style={{ marginTop: 20 }}>
              <div className="admin-form-group">
                <label className="admin-label"><MapPin size={14} /> الموقع <span className="admin-label-lang admin-label-lang--ar">عربي</span></label>
                <input name="location_ar" value={form.location_ar} onChange={handleChange} className="admin-input" placeholder="الرياض، المملكة العربية السعودية" dir="rtl" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label"><MapPin size={14} /> Location <span className="admin-label-lang admin-label-lang--en">EN</span></label>
                <input name="location_en" value={form.location_en} onChange={handleChange} className="admin-input" placeholder="Riyadh, Saudi Arabia" dir="ltr" />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header"><h2 className="admin-card__title">روابط السوشيال ميديا</h2></div>
          <div className="admin-card__body">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-label"><Link2 size={14} /> Facebook</label>
                <input name="facebook" value={form.facebook} onChange={handleChange} className="admin-input" placeholder="https://facebook.com/..." dir="ltr" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label"><Link2 size={14} /> Instagram</label>
                <input name="instagram" value={form.instagram} onChange={handleChange} className="admin-input" placeholder="https://instagram.com/..." dir="ltr" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label"><Link2 size={14} /> LinkedIn</label>
                <input name="linkedin" value={form.linkedin} onChange={handleChange} className="admin-input" placeholder="https://linkedin.com/company/..." dir="ltr" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Dribbble</label>
                <input name="dribbble" value={form.dribbble} onChange={handleChange} className="admin-input" placeholder="https://dribbble.com/..." dir="ltr" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? <span className="admin-spinner" /> : <Save size={16} />}
            حفظ البيانات
          </button>
        </div>
      </form>
    </div>
  );
}
