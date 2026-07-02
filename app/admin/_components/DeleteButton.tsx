"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { config } from "@/lib/config";

interface DeleteButtonProps {
  id: number;
  endpoint: string;
  label?: string;
}

export default function DeleteButton({ id, endpoint, label = "العنصر" }: DeleteButtonProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await fetch(`${config.apiUrl}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });
      setConfirm(false);
      router.refresh();
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setConfirm(true)} className="admin-btn admin-btn--danger admin-btn--sm">
        <Trash2 size={14} /> حذف
      </button>

      {confirm && (
        <div className="admin-modal-overlay" onClick={() => setConfirm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal__title">تأكيد الحذف</h3>
            <p className="admin-modal__body">
              هل أنت متأكد من حذف {label}؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="admin-modal__actions">
              <button onClick={() => setConfirm(false)} className="admin-btn admin-btn--outline">
                إلغاء
              </button>
              <button onClick={handleDelete} className="admin-btn admin-btn--danger" disabled={loading}>
                {loading ? <span className="admin-spinner" /> : <Trash2 size={16} />}
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
