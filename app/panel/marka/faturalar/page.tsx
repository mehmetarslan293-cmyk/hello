export default function FaturalarPage() {
  const inv = [
    { no: "2026-0142", date: "15 Nis 2026", amount: "12.400 ₺", type: "Komisyon faturası" },
    { no: "2026-0098", date: "1 Nis 2026", amount: "3.200 ₺", type: "Ön ödeme" },
  ];
  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-600">Faturalarınızı indirin ve ödeme yöntemlerini yönetin (demo).</p>
        <button type="button" className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">
          + Bakiye yükle
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-5 py-3">No</th>
              <th className="px-5 py-3">Tarih</th>
              <th className="px-5 py-3">Tür</th>
              <th className="px-5 py-3 text-right">Tutar</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {inv.map((r) => (
              <tr key={r.no} className="border-b border-gray-50">
                <td className="px-5 py-4 font-mono text-xs text-gray-900">{r.no}</td>
                <td className="px-5 py-4 text-gray-800">{r.date}</td>
                <td className="px-5 py-4 text-gray-900">{r.type}</td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums text-gray-900">{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
