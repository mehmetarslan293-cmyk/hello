export default function PerformansPage() {
  const rows = [
    { k: "Toplam erişim (30g)", v: "4.1M", d: "+12% önceki döneme göre" },
    { k: "Ort. etkileşim oranı", v: "4.8%", d: "Sektör ort. 3.2%" },
    { k: "CPM (hesaplanmış)", v: "38 ₺", d: "Instagram / Reels ağırlıklı" },
    { k: "Dönüşüm tahmini", v: "2.240", d: "Demo attribution modeli" },
  ];
  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <p className="text-sm text-gray-600">Yatırım getirisi ve kanal kırılımı — raporları PDF/Excel olarak dışa aktarma üretimde eklenecek.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.k} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{r.k}</p>
            <p className="mt-2 font-hero text-2xl font-bold text-gray-900">{r.v}</p>
            <p className="mt-1 text-xs text-gray-500">{r.d}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-800 hover:bg-gray-50"
      >
        Rapor indir (demo)
      </button>
    </div>
  );
}
