const coupons = [
  { code: "ING10", discount: "10% off entire cart", active: true },
  { code: "BUILD5", discount: "5% off entire cart", active: true },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase">Coupons</h1>
        <p className="mt-2 text-sm text-muted">
          Demo codes applied at checkout. Connect PostgreSQL{" "}
          <code className="text-xs">Coupon</code> model for full management.
        </p>
      </div>
      <ul className="space-y-3">
        {coupons.map((c) => (
          <li
            key={c.code}
            className="flex flex-wrap items-center justify-between gap-3 border border-neutral-200 bg-white px-5 py-4"
          >
            <div>
              <p className="font-mono text-lg font-black tracking-wide">{c.code}</p>
              <p className="text-sm text-muted">{c.discount}</p>
            </div>
            <span
              className={
                c.active
                  ? "text-xs font-bold uppercase text-green-700"
                  : "text-xs font-bold uppercase text-red-600"
              }
            >
              {c.active ? "Active" : "Inactive"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
