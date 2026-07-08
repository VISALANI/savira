"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AvgOrderChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${v}`} />
        <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Avg Order"]} />
        <Bar dataKey="avgOrder" fill="#4F6F52" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
