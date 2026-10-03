import { listQuotes } from "@/lib/local-db";

export default async function AdminQuotesPage() {
  const quotes = await listQuotes();

  return (
    <div>
      <h1 className="text-xl font-black uppercase">Quote Requests</h1>
      <div className="mt-6 space-y-4">
        {quotes.length === 0 ? (
          <p className="text-sm text-muted">No quote requests yet.</p>
        ) : (
          quotes.map((q) => (
            <article key={q.id} className="border border-neutral-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <strong>{q.name}</strong>
                <span className="text-xs text-muted">{q.createdAt}</span>
              </div>
              <p className="mt-1 text-muted">
                {q.email} · {q.phone}
              </p>
              <p className="mt-3">{q.products}</p>
              {q.message && <p className="mt-2 text-muted">{q.message}</p>}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
