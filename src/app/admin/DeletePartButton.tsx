'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { deletePart } from '@/app/actions/admin'

export default function DeletePartButton({ id, name }: { id: number, name: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm(`คุณต้องการลบอะไหล่ "${name}" ใช่หรือไม่?\nการกระทำนี้ไม่สามารถกู้คืนได้`)) {
            setIsDeleting(true);
            const res = await deletePart(id);
            if (!res.success) {
                alert(res.error || 'Failed to delete part');
            }
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-foreground/60 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
            title="ลบอะไหล่"
        >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    );
}
