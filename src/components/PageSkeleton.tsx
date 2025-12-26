export function PageSkeleton() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-24 pb-10 text-zinc-50">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header skeleton */}
        <div className="mb-10 flex flex-col gap-2 text-center">
          <div className="flex justify-center">
            <div className="h-4 w-48 animate-pulse rounded bg-zinc-800/50" />
          </div>
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-zinc-800/50" />
          <div className="mx-auto h-4 w-96 animate-pulse rounded bg-zinc-800/30" />
        </div>

        {/* Card skeleton */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-6 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur md:p-8">
            <div className="space-y-4">
              <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-800/50" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-zinc-800/30" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800/30" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-800/30" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="h-32 animate-pulse rounded-xl bg-zinc-800/30" />
                <div className="h-32 animate-pulse rounded-xl bg-zinc-800/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
