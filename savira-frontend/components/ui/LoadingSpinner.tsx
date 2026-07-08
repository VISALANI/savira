export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-7 h-7";
  return (
    <div className={`${s} border-2 border-sage/30 border-t-sage rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="font-poppins text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
