import Navbar from '@/components/Navbar'
import Link from 'next/link';
import { LayoutDashboard, List, Box } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4">

                {/* Admin Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0 mt-4 md:mt-8">
                    <nav className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 shadow-sm sticky top-24">
                        <div className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2 px-2">จัดการระบบ</div>

                        {/* Replaced existing links with the new structure */}
                        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg transition-colors text-foreground/70 hover:bg-muted hover:text-foreground">
                            <LayoutDashboard size={20} />
                            ระบบหลัก (Dashboard)
                        </Link>
                        <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg transition-colors text-foreground/70 hover:bg-muted hover:text-foreground">
                            <List size={20} />
                            จัดการหมวดหมู่
                        </Link>
                        <Link href="/admin/vehicles" className="flex items-center gap-3 p-3 rounded-lg transition-colors text-foreground/70 hover:bg-muted hover:text-foreground">
                            <Box size={20} />
                            ยี่ห้อและรุ่นรถ
                        </Link>
                        {/* End of replaced links */}

                        <div className="h-px bg-border my-2"></div>

                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 py-4 md:py-8 min-w-0">
                    {children}
                </main>

            </div>
        </div >
    )
}
