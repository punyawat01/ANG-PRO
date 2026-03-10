'use client'

import { useState } from 'react'
import { Plus, Edit2, Check, X, Trash2, ArrowRight } from 'lucide-react'
import { saveBrand, deleteBrand, saveModel, deleteModel } from '@/app/actions/vehicles'

export default function VehicleManager({ initialBrands }: { initialBrands: any[] }) {
    const [brands, setBrands] = useState<any[]>(initialBrands);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);

    // Brand State
    const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
    const [editBrandName, setEditBrandName] = useState('');
    const [isAddingBrand, setIsAddingBrand] = useState(false);
    const [newBrandName, setNewBrandName] = useState('');

    // Model State
    const [editingModelId, setEditingModelId] = useState<number | null>(null);
    const [editModelName, setEditModelName] = useState('');
    const [isAddingModel, setIsAddingModel] = useState(false);
    const [newModelName, setNewModelName] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ---- BRANDS ----
    const handleAddBrand = async () => {
        if (!newBrandName.trim()) return;
        setLoading(true); setError('');
        const res = await saveBrand(null, newBrandName.trim());
        if (res.success) {
            setBrands([...brands, { ...res.data, models: [], _count: { models: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
            setIsAddingBrand(false);
            setNewBrandName('');
        } else {
            setError(res.error || 'Failed to add brand');
        }
        setLoading(false);
    };

    const handleUpdateBrand = async (id: number) => {
        if (!editBrandName.trim()) return;
        setLoading(true); setError('');
        const res = await saveBrand(id, editBrandName.trim());
        if (res.success && res.data) {
            setBrands(brands.map(b => b.id === id ? { ...b, name: res.data!.name } : b).sort((a, b) => a.name.localeCompare(b.name)));
            setEditingBrandId(null);

            // update selected if it was the one edited
            if (selectedBrand?.id === id) {
                setSelectedBrand({ ...selectedBrand, name: res.data!.name });
            }
        } else {
            setError(res.error || 'Failed to update brand');
        }
        setLoading(false);
    };

    const handleDeleteBrand = async (id: number, name: string) => {
        if (!confirm(`ยืนยันการลบยี่ห้อ "${name}" ? (หากมีรุ่นรถหรือถูกใช้งานอยู่จะลบไม่ได้)`)) return;
        setLoading(true); setError('');
        const res = await deleteBrand(id);
        if (res.success) {
            setBrands(brands.filter(b => b.id !== id));
            if (selectedBrand?.id === id) setSelectedBrand(null);
        } else {
            setError(res.error || 'Failed to delete brand');
        }
        setLoading(false);
    };

    // ---- MODELS ----
    const handleSelectBrand = (brand: any) => {
        setSelectedBrand(brand);
        setIsAddingModel(false);
        setEditingModelId(null);
        setError('');
    };

    const handleAddModel = async () => {
        if (!newModelName.trim() || !selectedBrand) return;
        setLoading(true); setError('');
        const res = await saveModel(null, selectedBrand.id, newModelName.trim());
        if (res.success) {
            const newModel = { ...res.data, _count: { vehicles: 0 } };
            const updatedBrands = brands.map(b => {
                if (b.id === selectedBrand.id) {
                    const newModels = [...b.models, newModel].sort((a, b) => a.name.localeCompare(b.name));
                    return { ...b, models: newModels, _count: { models: newModels.length } };
                }
                return b;
            });
            setBrands(updatedBrands);
            setSelectedBrand(updatedBrands.find(b => b.id === selectedBrand.id));
            setIsAddingModel(false);
            setNewModelName('');
        } else {
            setError(res.error || 'Failed to add model');
        }
        setLoading(false);
    };

    const handleUpdateModel = async (id: number) => {
        if (!editModelName.trim() || !selectedBrand) return;
        setLoading(true); setError('');
        const res = await saveModel(id, selectedBrand.id, editModelName.trim());
        if (res.success && res.data) {
            const updatedBrands = brands.map(b => {
                if (b.id === selectedBrand.id) {
                    const newModels = b.models.map((m: any) => m.id === id ? { ...m, name: res.data!.name } : m).sort((a: any, b: any) => a.name.localeCompare(b.name));
                    return { ...b, models: newModels };
                }
                return b;
            });
            setBrands(updatedBrands);
            setSelectedBrand(updatedBrands.find(b => b.id === selectedBrand.id));
            setEditingModelId(null);
        } else {
            setError(res.error || 'Failed to update model');
        }
        setLoading(false);
    };

    const handleDeleteModel = async (id: number, name: string) => {
        if (!confirm(`ยืนยันการลบรุ่น "${name}" ?`)) return;
        setLoading(true); setError('');
        const res = await deleteModel(id);
        if (res.success) {
            const updatedBrands = brands.map(b => {
                if (b.id === selectedBrand.id) {
                    const newModels = b.models.filter((m: any) => m.id !== id);
                    return { ...b, models: newModels, _count: { models: newModels.length } };
                }
                return b;
            });
            setBrands(updatedBrands);
            setSelectedBrand(updatedBrands.find(b => b.id === selectedBrand.id));
        } else {
            setError(res.error || 'Failed to delete model');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Error Banner */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg flex items-center gap-2">
                    <span className="block sm:inline">{error}</span>
                    <button onClick={() => setError('')}><X size={16} /></button>
                </div>
            )}

            {/* BRANDS LIST */}
            <div className="bg-card w-full md:w-1/3 border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[70vh]">
                <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                    <h2 className="font-bold">ยี่ห้อ (Brands)</h2>
                    <button
                        onClick={() => { setIsAddingBrand(true); setNewBrandName(''); }}
                        className="p-1 px-3 bg-primary text-primary-foreground text-xs rounded-lg flex items-center gap-1 hover:bg-primary/90"
                    >
                        <Plus size={14} /> เพิ่ม
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-2 flex flex-col gap-1">
                    {/* Add Brand Inline Form */}
                    {isAddingBrand && (
                        <div className="flex gap-2 p-2 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20 items-center">
                            <input
                                autoFocus
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                placeholder="ชื่อยี่ห้อ..."
                                className="flex-1 p-1 px-2 text-sm border rounded"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                            />
                            <button onClick={handleAddBrand} disabled={loading} className="text-emerald-600 hover:text-emerald-700 p-1"><Check size={16} /></button>
                            <button onClick={() => setIsAddingBrand(false)} disabled={loading} className="text-slate-400 hover:text-slate-600 p-1"><X size={16} /></button>
                        </div>
                    )}

                    {brands.map(b => (
                        <div
                            key={b.id}
                            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedBrand?.id === b.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted border border-transparent'}`}
                            onClick={() => { if (editingBrandId !== b.id) handleSelectBrand(b); }}
                        >
                            {editingBrandId === b.id ? (
                                <div className="flex gap-2 items-center w-full">
                                    <input
                                        autoFocus
                                        value={editBrandName}
                                        onChange={(e) => setEditBrandName(e.target.value)}
                                        className="flex-1 p-1 px-2 text-sm border rounded bg-background"
                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateBrand(b.id)}
                                    />
                                    <button onClick={(e) => { e.stopPropagation(); handleUpdateBrand(b.id); }} className="text-emerald-600"><Check size={16} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setEditingBrandId(null); }} className="text-slate-400"><X size={16} /></button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{b.name}</span>
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{b._count?.models || 0} รุ่น</span>
                                    </div>
                                    <div className="flex gap-1 text-muted-foreground">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditBrandName(b.name); setEditingBrandId(b.id); }}
                                            className="p-1.5 hover:bg-background hover:text-foreground rounded"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteBrand(b.id, b.name); }}
                                            className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <ArrowRight size={16} className={`ml-2 transition-transform ${selectedBrand?.id === b.id ? 'text-primary translate-x-1' : 'opacity-0'}`} />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* MODELS LIST */}
            <div className={`bg-card w-full md:w-2/3 border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[70vh] transition-opacity duration-300 ${selectedBrand ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                {selectedBrand ? (
                    <>
                        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2">
                                รุ่นรถของ <span className="text-primary">{selectedBrand.name}</span>
                            </h2>
                            <button
                                onClick={() => { setIsAddingModel(true); setNewModelName(''); }}
                                className="p-1 px-3 bg-primary text-primary-foreground text-xs rounded-lg flex items-center gap-1 hover:bg-primary/90"
                            >
                                <Plus size={14} /> เพิ่มรุ่น
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
                            {/* Add Model Inline Card */}
                            {isAddingModel && (
                                <div className="p-3 border-2 border-primary/30 border-dashed rounded-xl bg-primary/5 flex flex-col gap-2">
                                    <input
                                        autoFocus
                                        value={newModelName}
                                        onChange={(e) => setNewModelName(e.target.value)}
                                        placeholder="ชื่อรุ่นรถ..."
                                        className="w-full p-2 text-sm border rounded-lg bg-background"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddModel()}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setIsAddingModel(false)} disabled={loading} className="text-xs text-muted-foreground hover:text-foreground">ยกเลิก</button>
                                        <button onClick={handleAddModel} disabled={loading} className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">บันทึก</button>
                                    </div>
                                </div>
                            )}

                            {selectedBrand.models.length === 0 && !isAddingModel ? (
                                <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                                    <p>ยังไม่มีรุ่นรถสำหรับยี่ห้อนี้</p>
                                    <button
                                        onClick={() => setIsAddingModel(true)}
                                        className="mt-4 text-primary hover:underline"
                                    >
                                        เพิ่มรุ่นแรกของคุณ
                                    </button>
                                </div>
                            ) : null}

                            {selectedBrand.models.map((m: any) => (
                                <div key={m.id} className="p-4 border border-border rounded-xl bg-background shadow-sm hover:shadow transition-shadow group relative">
                                    {editingModelId === m.id ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                autoFocus
                                                value={editModelName}
                                                onChange={(e) => setEditModelName(e.target.value)}
                                                className="w-full p-1.5 text-sm border-b focus:border-primary outline-none bg-transparent"
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateModel(m.id)}
                                            />
                                            <div className="flex justify-end gap-2 mt-1">
                                                <button onClick={() => setEditingModelId(null)} className="text-xs text-muted-foreground hover:text-foreground">ยกเลิก</button>
                                                <button onClick={() => handleUpdateModel(m.id)} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">บันทึก</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="font-semibold text-lg">{m.name}</div>
                                            <div className="text-xs font-medium text-muted-foreground mt-1">
                                                {m._count?.vehicles || 0} แบบปีที่บันทึกไว้
                                            </div>

                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button
                                                    onClick={() => { setEditModelName(m.name); setEditingModelId(m.id); }}
                                                    className="p-1.5 bg-muted hover:bg-secondary text-foreground rounded-md shadow-sm"
                                                    title="แก้ไขรุ่น"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteModel(m.id, m.name)}
                                                    className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-md shadow-sm transition-colors"
                                                    title="ลบรุ่น"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <p>เลือกยี่ห้อทางด้านซ้ายเพื่อจัดการรุ่นรถ</p>
                    </div>
                )}
            </div>

        </div>
    );
}
