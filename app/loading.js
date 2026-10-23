export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner: border-t-blue-600 এর জায়গায় তোমার থিম কালার (যেমন: border-t-[#ff5722]) দিবে */}
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--accent)]"></div>

        {/* Text: text-blue-600 এর জায়গায় তোমার থিম কালার দিবে */}
        <div className="animate-pulse text-lg font-bold tracking-widest text-[var(--primary)] uppercase">
          Learning Cave
        </div>
      </div>
    </div>
  );
}
