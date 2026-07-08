"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-playfair text-3xl text-charcoal mb-3">Order Placed!</h1>
        <p className="font-poppins text-sm text-gray-500 mb-2">
          Thank you for shopping with SAVIRA ATTIRES. Your order has been confirmed.
        </p>
        {orderId && (
          <p className="font-poppins text-xs text-gray-400 mb-8">
            Order ID: <span className="font-medium text-charcoal">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/account/orders/${orderId}`} className="btn-primary flex items-center justify-center gap-2">
            <FiPackage size={16} /> Track Order
          </Link>
          <Link href="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
