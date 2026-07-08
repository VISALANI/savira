"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F6F52" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#4F6F52" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#4F6F52" strokeWidth={2.5}
          fill="url(#revGrad)" dot={{ fill: "#4F6F52", r: 4 }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
