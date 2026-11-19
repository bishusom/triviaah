export default function CategoryLoading() {
  return (
    <main
      className="min-h-screen bg-[#faf8f2] px-4 py-10 text-[#203b3a] sm:px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Preparing your trivia questions…</span>

      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <div
            className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#cdd8cf] border-t-[#17675b]"
            aria-hidden="true"
          />
          <p className="font-serif text-2xl font-bold text-[#203b3a]">
            Preparing your questions…
          </p>
          <p className="mt-2 text-sm text-[#627065]">A fresh round of trivia is almost ready.</p>
        </header>

        <section
          className="rounded-2xl border border-[#d8ddd2] bg-[#fffefb] p-5 shadow-[0_18px_48px_rgba(32,59,58,0.07)] sm:p-7"
          aria-hidden="true"
        >
          <div className="mb-6 flex flex-wrap gap-2">
            <div className="h-7 w-16 animate-pulse rounded-full bg-[#347a58]/25" />
            <div className="h-7 w-28 animate-pulse rounded-full bg-[#17675b]/20" />
            <div className="h-7 w-24 animate-pulse rounded-full bg-[#765384]/20" />
          </div>

          <div className="mb-7 space-y-3">
            <div className="h-6 w-full animate-pulse rounded-lg bg-[#e3e7de]" />
            <div className="h-6 w-4/5 animate-pulse rounded-lg bg-[#e3e7de]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl border border-[#d8ddd2] bg-[#f2f3ec]"
              />
            ))}
          </div>

          <div className="mt-7 h-3 overflow-hidden rounded-full bg-[#e3e7de]">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-[#17675b]/45" />
          </div>
        </section>
      </div>
    </main>
  );
}
