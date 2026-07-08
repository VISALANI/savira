"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";

const TrendChart = dynamic<{ data: any[] }>(() => import("@/components/admin/TrendChart"), { ssr: false, loading: () => <div className="h-[260px] bg-gray-50 rounded-xl animate-pulse" /> });
const CategoryPie = dynamic(() => import("@/components/admin/CategoryPie"), { ssr: false, loading: () => <div className="h-[200px] bg-gray-50 rounded-xl animate-pulse" /> });
const AvgOrderChart = dynamic<{ data: any[] }>(() => import("@/components/admin/AvgOrderChart"), { ssr: false, loading: () => <div className="h-[200px] bg-gray-50 rounded-xl animate-pulse" /> });

const MOCK_DATA = {
  totalRevenue: 284500, totalOrders: 142, totalProducts: 68, totalUsers: 312,
  monthlySales: [
    { month: "Jan", revenue: 18000, orders: 12 }, { month: "Feb", revenue: 22000, orders: 15 },
    { month: "Mar", revenue: 31000, orders: 21 }, { month: "Apr", revenue: 28000, orders: 18 },
    { month: "May", revenue: 45000, orders: 30 }, { month: "Jun", revenue: 38000, orders: 25 },
  ],
  topProducts: [
    { name: "Floral Anarkali Kurti", sold: 48, revenue: 62352 },
    { name: "Festive Silk Co-ord Set", sold: 35, revenue: 87465 },
    { name: "Cotton Straight Kurti", sold: 62, revenue: 55738 },
    { name: "Office Wear Kurti Set", sold: 29, revenue: 52171 },
    { name: "Block Print Kurti", sold: 41, revenue: 45039 },
  ],
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"6m" | "12m">("6m");

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(MOCK_DATA))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="font-poppins text-sm text-gray-400 animate-pulse">Loading analytics...</div>;
  if (!data) return null;

  const conversionData = data.monthlySales.map((m: any) => ({
    ...m,
    avgOrder: m.orders > 0 ? Math.round(m.revenue / m.orders) : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl text-charcoal">Analytics</h1>
          <p className="font-poppins text-xs text-gray-400 mt-0.5">Detailed performance insights</p>
        </div>
        <div className="flex gap-2">
          {(["6m", "12m"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`font-poppins text-xs px-4 py-2 rounded-full transition-colors ${period === p ? "bg-sage text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              {p === "6m" ? "6 Months" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatPrice(data.totalRevenue), sub: "All time" },
          { label: "Avg Order Value", value: formatPrice(data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders) : 0), sub: "Per order" },
          { label: "Conversion Rate", value: "3.2%", sub: "Visitors to buyers" },
          { label: "Return Rate", value: "2.1%", sub: "Orders returned" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="font-poppins text-xs text-gray-400 mb-1">{label}</p>
            <p className="font-playfair text-2xl font-semibold text-charcoal">{value}</p>
            <p className="font-poppins text-[10px] text-gray-300 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Orders trend */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-playfair text-base text-charcoal mb-5">Revenue & Orders Trend</h2>
        <TrendChart data={conversionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-playfair text-base text-charcoal mb-5">Sales by Category</h2>
          <CategoryPie />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-playfair text-base text-charcoal mb-5">Avg Order Value Trend</h2>
          <AvgOrderChart data={conversionData} />
        </div>
      </div>

      {/* Product performance table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-playfair text-base text-charcoal">Product Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                {["#", "Product", "Units Sold", "Revenue", "Share"].map((h) => (
                  <th key={h} className="font-poppins text-[11px] text-gray-400 text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.topProducts.map((p: any, i: number) => {
                const totalRev = data.topProducts.reduce((s: number, x: any) => s + x.revenue, 0);
                const share = totalRev > 0 ? ((p.revenue / totalRev) * 100).toFixed(1) : "0";
                return (
                  <tr key={p.name} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-poppins text-xs text-gray-300">{i + 1}</td>
                    <td className="px-5 py-3 font-poppins text-sm text-charcoal">{p.name}</td>
                    <td className="px-5 py-3 font-poppins text-sm text-gray-600">{p.sold}</td>
                    <td className="px-5 py-3 font-poppins text-sm font-semibold text-charcoal">{formatPrice(p.revenue)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[80px]">
                          <div className="h-full bg-sage rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="font-poppins text-xs text-gray-400">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
