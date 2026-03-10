'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Check, X, Loader2 } from 'lucide-react'
import { saveCategory, deleteCategory } from '@/app/actions/category'

type CategoryWithCount = {
    id: number;
    name: string;
    _count: { parts: number };
}

export default function CategoryList({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
    const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);

    // State for Add New
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');

    // State for Edit
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddNew = async () => {
        if (!newName.trim()) return;
        setIsLoading(true);
        setError('');

        const res = await saveCategory(null, newName);
        if (res.success && res.data) {
            setCategories([...categories, { ...res.data, _count: { parts: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
            setIsAdding(false);
            setNewName('');
        } else {
            setError(res.error || 'Failed to add category');
        }
        setIsLoading(false);
    };

    const handleEditSave = async (id: number) => {
        if (!editName.trim()) return;
        setIsLoading(true);
        setError('');

        const res = await saveCategory(id, editName);
        if (res.success && res.data) {
            setCategories(categories.map(c => c.id === id ? { ...c, name: res.data.name } : c).sort((a, b) => a.name.localeCompare(b.name)));
            setEditingId(null);
        } else {
            setError(res.error || 'Failed to update category');
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number, name: string, count: number) => {
        if (count > 0) {
            if (!confirm(`หมวดหมู่นี้มีอะไหล่อยู่ ${count} รายการ หากลบหมวดหมู่นี้ อะไหล่จะถูกตั้งเป็น "ไม่ระบุ" หมวดหมู่แทน\n\nต้องการดำเนินการต่อหรือไม่?`)) {
                return;
            }
        } else {
            if (!confirm(`คุณต้องการลบหมวดหมู่ "${name}" ใช่หรือไม่?`)) {
                return;
            }
        }

        setIsLoading(true);
        setError('');
        const res = await deleteCategory(id);
        if (res.success) {
            setCategories(categories.filter(c => c.id !== id));
        } else {
            setError(res.error || 'Failed to delete category');
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 text-sm">
                    {error}
                </div>
            )}

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-muted/50 border-b border-border">
                        <th className="p-4 font-semibold text-foreground/80">ชื่อหมวดหมู่</th>
                        <th className="p-4 font-semibold text-foreground/80 text-center w-32">จำนวนสินค้า</th>
                        <th className="p-4 font-semibold text-foreground/80 text-center w-32">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Add New Row */}
                    {isAdding && (
                        <tr className="border-b border-border bg-primary/5">
                            <td className="p-4">
                                <input
                                    autoFocus
                                    placeholder="ชื่อหมวดหมู่ใหม่..."
                                    className="w-full p-2 border border-border rounded bg-background outline-none focus:border-primary"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                                    disabled={isLoading}
                                />
                            </td>
                            <td className="p-4 text-center text-foreground/40">-</td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={handleAddNew} disabled={isLoading} className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors disabled:opacity-50">
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                    </button>
                                    <button onClick={() => { setIsAdding(false); setError('') }} disabled={isLoading} className="text-foreground/50 hover:bg-muted p-2 rounded transition-colors disabled:opacity-50">
                                        <X size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}

                    {!isAdding && categories.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="p-8 text-center text-foreground/50">
                                ยังไม่มีรายการหมวดหมู่
                            </td>
                        </tr>
                    ) : categories.map(cat => (
                        <tr key={cat.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                            <td className="p-4 font-medium">
                                {editingId === cat.id ? (
                                    <input
                                        autoFocus
                                        className="w-full p-2 border border-border rounded bg-background outline-none focus:border-primary"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave(cat.id)}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    cat.name
                                )}
                            </td>
                            <td className="p-4 text-center">
                                <span className="bg-muted px-3 py-1 rounded-full text-xs font-semibold text-foreground/70">
                                    {cat._count.parts}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    {editingId === cat.id ? (
                                        <>
                                            <button onClick={() => handleEditSave(cat.id)} disabled={isLoading} className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors disabled:opacity-50">
                                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                            </button>
                                            <button onClick={() => { setEditingId(null); setError('') }} disabled={isLoading} className="text-foreground/50 hover:bg-muted p-2 rounded transition-colors disabled:opacity-50">
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setEditingId(cat.id); setEditName(cat.name); setError(''); setIsAdding(false); }}
                                                disabled={isLoading}
                                                className="text-foreground/60 hover:text-primary hover:bg-primary/10 p-2 rounded transition-colors disabled:opacity-50"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name, cat._count.parts)}
                                                disabled={isLoading}
                                                className="text-foreground/60 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {!isAdding && (
                <div className="p-4 border-t border-border bg-muted/10">
                    <button
                        onClick={() => { setIsAdding(true); setNewName(''); setEditingId(null); setError(''); }}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1"
                    >
                        <Plus size={16} />เพิ่มหมวดหมู่ใหม่
                    </button>
                </div>
            )}
        </div>
    )
}
