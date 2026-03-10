import SearchForm from "@/components/SearchForm";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      <main className="w-full max-w-5xl px-4 py-8 flex flex-col gap-8">
        <section className="text-center space-y-4 pt-12 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            ค้นหาอะไหล่รถยนต์
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            ระบุรุ่นรถ หรือพิมพ์ชื่ออะไหล่ที่ต้องการ เพื่อตรวจสอบสินค้าคงคลังและราคา
          </p>
        </section>

        <section className="w-full">
          <SearchForm />
        </section>
      </main>
    </div>
  );
}
