export default function BakiyeYuklePage() {
  return (
    <div className="mx-auto max-w-[760px] space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-hero text-xl font-bold text-gray-900">Bakiye yukle</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ucretli tekliflerde kullanmak uzere cuzdana bakiye yukleyin.
        </p>

        <form className="mt-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Yukleme tutari (TRY)</label>
            <input
              type="number"
              min={1}
              step={1}
              placeholder="Orn: 10000"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Kart sahibi</label>
            <input
              type="text"
              placeholder="Ad Soyad"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Kart numarasi</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Son kullanma / CVV</label>
              <input
                type="text"
                placeholder="AA/YY - 000"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-pink-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-pink-700"
          >
            Bakiye yukle
          </button>
        </form>
      </section>
    </div>
  );
}
