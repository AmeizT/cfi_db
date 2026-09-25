export function UploadIllustration({ formats }: { formats: string[] }) {
  const primaryFormat = formats[0];
  const secondaryFormat = formats[1] ?? primaryFormat;

  return (
    <div className="pointer-events-none relative h-44 w-56" aria-hidden="true">
      <div className="absolute left-8 top-8 h-36 w-28 -rotate-[8deg] rounded-[1.4rem] border border-white/50 bg-linear-to-br from-amber-100/90 via-yellow-100/70 to-emerald-100/80 shadow-lg backdrop-blur" />
      <div className="absolute left-[4.6rem] top-5 h-36 w-28 rotate-[2deg] rounded-[1.4rem] border border-white/60 bg-linear-to-br from-violet-100 via-blue-100 to-sky-200 shadow-lg">
        <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">{secondaryFormat}</span>
      </div>
      <div className="absolute left-[7.6rem] top-3 h-36 w-28 rotate-[8deg] rounded-[1.4rem] border border-white/60 bg-linear-to-br from-amber-100 via-orange-200 to-rose-200 shadow-xl">
        <div className="absolute inset-x-3 bottom-3 h-12 rounded-full bg-white/30 blur-xl" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">{primaryFormat}</span>
      </div>
      <div className="absolute bottom-0 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-black/10 blur-xl" />
    </div>
  );
}
