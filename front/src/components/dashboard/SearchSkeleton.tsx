export default function SearchSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-2/3 rounded-md bg-slate-200" />
          <div className="mt-3 h-4 w-1/3 rounded-md bg-slate-100" />
          <div className="mt-4 h-4 w-1/2 rounded-md bg-slate-100" />
          <div className="mt-6 h-9 w-28 rounded-lg bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
