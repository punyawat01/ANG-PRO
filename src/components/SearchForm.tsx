'use client'

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getBrands, getModelsByBrand, getYearsByModel } from '@/app/actions/vehicles';
import { searchParts, getCategories } from '@/app/actions/parts';
import PartsList from './PartsList';

export default function SearchForm() {
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Dimensions State
    const [width, setWidth] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [innerDiameter, setInnerDiameter] = useState<string>('');
    const [outerDiameter, setOuterDiameter] = useState<string>('');
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

    const [parts, setParts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Load Initial Categories
    useEffect(() => {
        getCategories().then(res => {
            if (res.success) setCategories(res.data || []);
        });
    }, []);

    // Load Brands (filtered by Category)
    useEffect(() => {
        const catId = selectedCategory ? Number(selectedCategory) : undefined;
        getBrands(catId).then(res => {
            if (res.success) setBrands(res.data || []);
        });
    }, [selectedCategory]);

    // Handle Model Change (Autocomplete, filtered by Category)
    useEffect(() => {
        setModels([]);
        const foundBrand = brands.find(b => b.name.toLowerCase() === selectedBrand.toLowerCase());
        const catId = selectedCategory ? Number(selectedCategory) : undefined;
        if (foundBrand) {
            getModelsByBrand(foundBrand.id, catId).then(res => {
                if (res.success) setModels(res.data || []);
            });
        }
    }, [selectedBrand, brands, selectedCategory]);

    // Handle Year Change (Autocomplete, filtered by Category)
    useEffect(() => {
        setYears([]);
        const foundModel = models.find(m => m.name.toLowerCase() === selectedModel.toLowerCase());
        const catId = selectedCategory ? Number(selectedCategory) : undefined;
        if (foundModel) {
            getYearsByModel(foundModel.id, catId).then(res => {
                if (res.success) setYears(res.data || []);
            });
        }
    }, [selectedModel, models, selectedCategory]);

    // Perform Search
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSearching(true);

        const res = await searchParts({
            brandName: selectedBrand || undefined,
            modelName: selectedModel || undefined,
            year: selectedYear || undefined,
            categoryId: selectedCategory ? Number(selectedCategory) : undefined,
            searchTerm: searchTerm || undefined,
            width: width ? parseFloat(width) : undefined,
            length: length ? parseFloat(length) : undefined,
            height: height ? parseFloat(height) : undefined,
            innerDiameter: innerDiameter ? parseFloat(innerDiameter) : undefined,
            outerDiameter: outerDiameter ? parseFloat(outerDiameter) : undefined,
        });

        if (res.success) {
            setParts(res.data || []);
        }

        setIsSearching(false);
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="bg-card shadow-sm border border-border rounded-xl p-6 md:p-8 w-full max-w-4xl mx-auto transition-all">
                <form onSubmit={handleSearch} className="flex flex-col gap-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* CATEGORY */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-foreground/80">หมวดหมู่ (Category)</label>
                            <select
                                className="p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">--- ทั้งหมด ---</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* BRAND */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-foreground/80">ยี่ห้อรถ (Brand)</label>
                            <input
                                list="searchBrandList"
                                placeholder="พิมพ์หรือเลือกยี่ห้อ"
                                className="p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                            />
                            <datalist id="searchBrandList">
                                {brands.map(b => (
                                    <option key={b.id} value={b.name} />
                                ))}
                            </datalist>
                        </div>

                        {/* MODEL */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-foreground/80">รุ่นรถ (Model)</label>
                            <input
                                list="searchModelList"
                                placeholder="พิมพ์หรือเลือกรุ่น"
                                className="p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            />
                            <datalist id="searchModelList">
                                {models.map(m => (
                                    <option key={m.id} value={m.name} />
                                ))}
                            </datalist>
                        </div>

                        {/* YEAR */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-foreground/80">ปี (Year)</label>
                            <input
                                list="searchYearList"
                                placeholder="พิมพ์หรือเลือกปี (เช่น 2001-2005)"
                                className="p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            />
                            <datalist id="searchYearList">
                                {years.map(y => (
                                    <option key={y.id} value={y.year} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="border-t border-border w-full my-2"></div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground/80">ค้นหาเพิ่มเติม (รหัส, ชื่ออะไหล่)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-foreground/40" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="พิมพ์คำค้นหา..."
                                    className="pl-10 p-3 w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSearching ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
                                <span>ค้นหาอะไหล่</span>
                            </button>
                        </div>
                    </div>

                    {/* Advanced Search Toggle & Panel */}
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-start">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {showAdvanced ? "- ซ่อนการค้นหาจากขนาด" : "+ ค้นหาเพิ่มเติมจากขนาด (เช่น A/B/C, ID/OD)"}
                            </button>
                        </div>

                        {showAdvanced && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-foreground/70">A - กว้าง</label>
                                    <input type="number" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="0.00" className="p-2 border border-border rounded-lg bg-background text-sm" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-foreground/70">B - ยาว</label>
                                    <input type="number" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="0.00" className="p-2 border border-border rounded-lg bg-background text-sm" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-foreground/70">C - สูง</label>
                                    <input type="number" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder="0.00" className="p-2 border border-border rounded-lg bg-background text-sm" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-blue-600 dark:text-blue-400">วงใน (ID)</label>
                                    <input type="number" step="0.01" value={innerDiameter} onChange={e => setInnerDiameter(e.target.value)} placeholder="0.00" className="p-2 border border-blue-200 dark:border-blue-900 rounded-lg bg-background text-sm" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-blue-600 dark:text-blue-400">วงนอก (OD)</label>
                                    <input type="number" step="0.01" value={outerDiameter} onChange={e => setOuterDiameter(e.target.value)} placeholder="0.00" className="p-2 border border-blue-200 dark:border-blue-900 rounded-lg bg-background text-sm" />
                                </div>
                            </div>
                        )}
                    </div>


                </form>
            </div>

            {/* RESULT LIST */}
            <div className="w-full">
                <PartsList parts={parts} isSearching={isSearching} />
            </div>
        </div>
    );
}
