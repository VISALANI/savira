export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
        <p className="font-poppins text-xs text-gray-400 tracking-widest uppercase">Loading...</p>
      </div>
    </div>
  );
}
