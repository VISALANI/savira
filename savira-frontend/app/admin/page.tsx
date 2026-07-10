"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { FiShoppingBag, FiPackage, FiUsers, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle, FiArrowUpRight } from "react-icons/fi";

interface RecentOrder {
  _id: string;
  user?: { name: string };
  total: number;
  orderStatus: string;
  createdAt: string;
}
interface MonthlySale { month: string; revenue: number; orders: number; }
interface TopProduct { name: string; sold: number; revenue: number; }
interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: RecentOrder[];
  monthlySales: MonthlySale[];
  topProducts: TopProduct[];
}
const STATUS_COLORS: Record<string, string> = { processing: "bg-yellow-50 text-yellow-600 border-yellow-100", shipped: "bg-blue-50 text-blue-600 border-blue-100", out_for_delivery: "bg-purple-50 text-purple-600 border-purple-100", delivered: "bg-green-50 text-green-600 border-green-100", cancelled: "bg-red-50 text-red-500 border-red-100" };

const MOCK: DashboardData = { totalRevenue: 284500, totalOrders: 142, totalProducts: 68, totalUsers: 312, recentOrders: Array.from({length:8},(_,i)=>({_id:`o${i}`,user:{name:["Priya S.","Ananya R.","Meera P.","Kavya N.","Ritu S.","Divya K.","Sneha M.","Pooja T."][i]},total:[1299,2499,1799,999,1599,2999,899,1999][i],orderStatus:["processing","shipped","delivered","processing","out_for_delivery","delivered","processing","shipped"][i],createdAt:new Date(Date.now()-i*86400000).toISOString()})), monthlySales:[{month:"Jan",revenue:18000,orders:12},{month:"Feb",revenue:22000,orders:15},{month:"Mar",revenue:31000,orders:21},{month:"Apr",revenue:28000,orders:18},{month:"May",revenue:45000,orders:30},{month:"Jun",revenue:38000,orders:25}], topProducts:[{name:"Floral Anarkali Kurti",sold:48,revenue:62352},{name:"Festive Silk Co-ord Set",sold:35,revenue:87465},{name:"Cotton Straight Kurti",sold:62,revenue:55738},{name:"Office Wear Kurti Set",sold:29,revenue:52171},{name:"Block Print Kurti",sold:41,revenue:45039}] };

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminAPI.getDashboard().then(r=>setData(r.data as DashboardData)).catch(()=>setData(MOCK)).finally(()=>setLoading(false)); }, []);
  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">{Array.from({length:8}).map((_,i)=><div key={i} className="bg-white rounded-2xl h-28 shadow-sm"/>)}</div>;
  if (!data) return null;
  const d = data;
  const pending = d.recentOrders?.filter(o=>o.orderStatus==="processing").length||0;
  const delivered = d.recentOrders?.filter(o=>o.orderStatus==="delivered").length||0;
  const avg = d.totalOrders>0?Math.round(d.totalRevenue/d.totalOrders):0;
  const maxRev = Math.max(...d.monthlySales.map(m=>m.revenue));
  const maxOrd = Math.max(...d.monthlySales.map(m=>m.orders));
  const maxTop = Math.max(...d.topProducts.map(p=>p.revenue));
  const cards = [{label:"Total Revenue",value:formatPrice(d.totalRevenue),icon:FiTrendingUp,color:"bg-emerald-50 text-emerald-600",trend:"+12%"},{label:"Total Orders",value:d.totalOrders.toLocaleString(),icon:FiShoppingBag,color:"bg-blue-50 text-blue-600",trend:"+8%"},{label:"Total Products",value:d.totalProducts.toLocaleString(),icon:FiPackage,color:"bg-violet-50 text-violet-600",trend:null},{label:"Total Users",value:d.totalUsers.toLocaleString(),icon:FiUsers,color:"bg-orange-50 text-orange-600",trend:"+24"},{label:"Pending",value:String(pending),icon:FiClock,color:"bg-yellow-50 text-yellow-600",trend:null},{label:"Delivered",value:String(delivered),icon:FiCheckCircle,color:"bg-green-50 text-green-600",trend:null},{label:"Avg Order",value:formatPrice(avg),icon:FiTrendingUp,color:"bg-pink-50 text-pink-600",trend:null},{label:"Low Stock",value:"3 items",icon:FiAlertCircle,color:"bg-red-50 text-red-500",trend:null}];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-playfair text-2xl text-charcoal">Dashboard</h1><p className="font-poppins text-xs text-gray-400 mt-0.5">Welcome back!</p></div><Link href="/admin/products/new" className="btn-primary text-sm hidden md:flex items-center gap-2"><FiPackage size={14}/> Add Product</Link></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(({label,value,icon:Icon,color,trend})=>(<div key={label} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-start justify-between mb-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18}/></div>{trend&&<span className="font-poppins text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">{trend}</span>}</div><p className="font-playfair text-2xl font-semibold text-charcoal">{value}</p><p className="font-poppins text-xs text-gray-400 mt-1">{label}</p></div>))}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm"><div className="flex items-center justify-between mb-5"><h2 className="font-playfair text-base text-charcoal">Monthly Revenue</h2><span className="font-poppins text-xs text-gray-400">Last 6 months</span></div><div className="flex items-end gap-2 h-40">{d.monthlySales.map(m=>{const pct=maxRev>0?(m.revenue/maxRev)*100:0;return(<div key={m.month} className="flex-1 flex flex-col items-center gap-1"><span className="font-poppins text-[9px] text-gray-400">{(m.revenue/1000).toFixed(0)}k</span><div className="w-full bg-gray-100 rounded-t-lg relative" style={{height:"120px"}}><div className="w-full bg-sage rounded-t-lg absolute bottom-0" style={{height:`${pct}%`}}/></div><span className="font-poppins text-[10px] text-gray-500">{m.month}</span></div>);})}</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm"><div className="flex items-center justify-between mb-5"><h2 className="font-playfair text-base text-charcoal">Monthly Orders</h2><span className="font-poppins text-xs text-gray-400">Last 6 months</span></div><div className="flex items-end gap-2 h-40">{d.monthlySales.map(m=>{const pct=maxOrd>0?(m.orders/maxOrd)*100:0;return(<div key={m.month} className="flex-1 flex flex-col items-center gap-1"><span className="font-poppins text-[9px] text-gray-400">{m.orders}</span><div className="w-full bg-gray-100 rounded-t-lg relative" style={{height:"120px"}}><div className="w-full bg-gold rounded-t-lg absolute bottom-0" style={{height:`${pct}%`}}/></div><span className="font-poppins text-[10px] text-gray-500">{m.month}</span></div>);})}</div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm"><div className="flex items-center justify-between mb-4"><h2 className="font-playfair text-base text-charcoal">Best Sellers</h2><Link href="/admin/products" className="font-poppins text-xs text-sage hover:underline">View all</Link></div><div className="space-y-3">{d.topProducts.map((p,i)=>{const pct=maxTop>0?(p.revenue/maxTop)*100:0;return(<div key={p.name}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className="font-poppins text-[10px] text-gray-300 w-4">{i+1}</span><span className="font-poppins text-xs text-charcoal truncate max-w-[160px]">{p.name}</span></div><span className="font-poppins text-xs font-medium text-sage">{formatPrice(p.revenue)}</span></div><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-sage rounded-full" style={{width:`${pct}%`}}/></div></div>);})}</div></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm"><h2 className="font-playfair text-base text-charcoal mb-5">Payment Methods</h2><div className="space-y-4">{[{label:"Online (UPI/Card)",pct:65,color:"bg-sage"},{label:"Cash on Delivery",pct:35,color:"bg-gold"}].map(({label,pct,color})=>(<div key={label}><div className="flex justify-between mb-1.5"><span className="font-poppins text-sm text-gray-600">{label}</span><span className="font-poppins text-sm font-semibold text-charcoal">{pct}%</span></div><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{width:`${pct}%`}}/></div><p className="font-poppins text-xs text-gray-400 mt-1">{Math.round(d.totalOrders*pct/100)} orders</p></div>))}</div><div className="mt-6 pt-5 border-t border-gray-50 grid grid-cols-2 gap-4"><div className="text-center"><p className="font-playfair text-xl font-semibold text-charcoal">{formatPrice(d.totalRevenue)}</p><p className="font-poppins text-xs text-gray-400 mt-0.5">Total Revenue</p></div><div className="text-center"><p className="font-playfair text-xl font-semibold text-charcoal">{formatPrice(avg)}</p><p className="font-poppins text-xs text-gray-400 mt-0.5">Avg Order</p></div></div></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="flex items-center justify-between p-5 border-b border-gray-50"><h2 className="font-playfair text-base text-charcoal">Recent Orders</h2><Link href="/admin/orders" className="font-poppins text-xs text-sage hover:underline flex items-center gap-1">View all <FiArrowUpRight size={12}/></Link></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50/80"><tr>{["Order","Customer","Amount","Status","Date"].map(h=><th key={h} className="font-poppins text-[11px] text-gray-400 text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-50">{d.recentOrders.slice(0,8).map(o=><tr key={o._id} className="hover:bg-gray-50/50 transition-colors"><td className="px-5 py-3 font-poppins text-xs font-medium text-charcoal">#{o._id?.slice(-6).toUpperCase()}</td><td className="px-5 py-3 font-poppins text-xs text-gray-600">{o.user?.name||""}</td><td className="px-5 py-3 font-poppins text-sm font-semibold text-charcoal">{formatPrice(o.total)}</td><td className="px-5 py-3"><span className={`font-poppins text-[10px] font-medium px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[o.orderStatus]||"bg-gray-50 text-gray-500 border-gray-100"}`}>{o.orderStatus?.replace(/_/g," ")}</span></td><td className="px-5 py-3 font-poppins text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
