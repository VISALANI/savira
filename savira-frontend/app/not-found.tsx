import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-playfair text-8xl font-bold text-sage/20 mb-4">404</p>
      <h1 className="font-playfair text-3xl text-charcoal mb-3">Page Not Found</h1>
      <p className="font-poppins text-sm text-gray-400 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/shop" className="btn-outline">Browse Shop</Link>
      </div>
    </div>
  );
}
