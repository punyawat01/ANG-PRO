'use client'

import { useState } from 'react';
import { Download, Upload, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { importPartsFromExcel } from '@/app/actions/excel';
import { useRouter } from 'next/navigation';

export default function ExcelActions() {
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const res = await fetch('/api/export-excel');

            if (!res.ok) throw new Error('Failed to download Excel file');

            // Create a blob from the response and trigger download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `autoparts_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('เกิดข้อผิดพลาดในการส่งออกไฟล์ Excel');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsImporting(true);
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const result = await importPartsFromExcel(jsonData);

            if (result.success) {
                alert(`นำเข้าข้อมูลสำเร็จ: ${result.importedCount} รายการ`);
                router.refresh();
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์หรือนำเข้าข้อมูล');
        } finally {
            setIsImporting(false);
            // Reset input so the same file can be selected again
            if (e.target) e.target.value = '';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div>
                <input
                    type="file"
                    id="excel-upload"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleImport}
                    disabled={isImporting}
                />
                <label
                    htmlFor="excel-upload"
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span className="text-sm font-medium">นำเข้าข้อมูล (Import)</span>
                </label>
            </div>

            <button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-background text-foreground border border-border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
            >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                <span className="text-sm font-medium">ส่งออกทั้งหมด (Export)</span>
            </button>
        </div>
    );
}
