export default function TrendAnaliziPage() {
  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-hero text-2xl font-bold text-gray-900">Trend Analizi</h2>
        <p className="mt-2 text-sm text-gray-600">Yukselen formatlar, sesler ve hashtag ozetleri.</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="rounded-xl bg-gray-50 px-3 py-2">UGC formati +%34 haftalik</li>
          <li className="rounded-xl bg-gray-50 px-3 py-2">Kisa hook + altyazi daha yuksek tamamlanma</li>
          <li className="rounded-xl bg-gray-50 px-3 py-2">Challenge + remix Gen Z agirlikli</li>
        </ul>
      </div>
    </div>
  );
}
