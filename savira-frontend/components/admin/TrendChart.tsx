"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TrendChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
        <Legend wrapperStyle={{ fontFamily: "Poppins", fontSize: 12 }} />
        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4F6F52" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#C8A96B" strokeWidth={2.5} dot={{ r: 4 }} name="Orders" />
      </LineChart>
    </ResponsiveContainer>
  );
}
