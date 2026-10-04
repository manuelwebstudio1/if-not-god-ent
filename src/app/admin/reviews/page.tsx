export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase">Reviews</h1>
        <p className="mt-2 text-sm text-muted">
          Product pages show sample customer reviews. When PostgreSQL is connected,
          moderate submissions via the <code className="text-xs">Review</code> model
          in Prisma.
        </p>
      </div>
      <div className="border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
        <p className="font-semibold text-black">Moderation queue</p>
        <p className="mt-2 text-muted">No pending reviews.</p>
      </div>
    </div>
  );
}
