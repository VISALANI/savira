"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4F6F52", "#C8A96B"];

export default function PaymentChart({ totalOrders }: { totalOrders: number }) {
  const data = [
    { name: "Online", value: Math.round(totalOrders * 0.65) },
    { name: "COD", value: Math.round(totalOrders * 0.35) },
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-3">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
              <span className="font-poppins text-xs text-gray-500">{item.name}</span>
            </div>
            <span className="font-poppins text-xs font-medium text-charcoal">{item.value} orders</span>
          </div>
        ))}
      </div>
    </>
  );
}
