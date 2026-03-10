import { Package, Tag, Layers, ChevronRight } from 'lucide-react';

export default function PartsList({ parts, isSearching }: { parts: any[], isSearching: boolean }) {
    if (isSearching) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6 h-48">
                        <div className="h-6 bg-border/50 rounded w-1/3 mb-4"></div>
                        <div className="h-8 bg-border/50 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-border/50 rounded w-full mb-2"></div>
                        <div className="h-4 bg-border/50 rounded w-5/6"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!parts || parts.length === 0) {
        return (
            <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-foreground/30">
                    <Package size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบรายการอะไหล่</h3>
                <p className="text-foreground/60 max-w-sm">ลองปรับเงื่อนไขการค้นหาใหม่ หรือตรวจสอบรุ่นรถและปีที่เลือกอีกครั้ง</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((part) => (
                <div
                    key={part.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                    <div className="flex justify-between items-start mb-2 gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-foreground mb-1">{part.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium border border-border">
                                    {part.partNumber}
                                </span>
                                {part.partBrand && (
                                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold border border-primary/20">
                                        {part.partBrand}
                                    </span>
                                )}
                                {part.alternativeNumbers && part.alternativeNumbers.length > 0 && part.alternativeNumbers.map((alt: any) => (
                                    <span key={alt.id} title={alt.note || "รหัสเทียบ"} className="inline-block bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-md text-[10px] sm:text-xs font-mono border border-secondary/20">
                                        {alt.number}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {part.category && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground/70">
                                <Layers size={12} />
                                {part.category.name}
                            </span>
                        )}
                    </div>


                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                        {part.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                    </p>

                    {/* Dimensions Row */}
                    {(part.width || part.length || part.height || part.innerDiameter || part.outerDiameter) && (
                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                            {part.width && <span className="bg-muted/50 text-foreground/80 text-[10px] px-2 py-1 rounded">A: {part.width}</span>}
                            {part.length && <span className="bg-muted/50 text-foreground/80 text-[10px] px-2 py-1 rounded">B: {part.length}</span>}
                            {part.height && <span className="bg-muted/50 text-foreground/80 text-[10px] px-2 py-1 rounded">C: {part.height}</span>}
                            {part.innerDiameter && <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] px-2 py-1 rounded">ID: {part.innerDiameter}</span>}
                            {part.outerDiameter && <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] px-2 py-1 rounded">OD: {part.outerDiameter}</span>}
                        </div>
                    )}

                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
                        <div>
                            <p className="text-xs text-foreground/50 mb-1">ราคา</p>
                            <p className="text-2xl font-extrabold text-foreground">
                                {part.price ? `฿${part.price.toLocaleString()}` : "ติดต่อสอบถาม"}
                            </p>
                        </div>

                        <button className="h-10 w-10 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
