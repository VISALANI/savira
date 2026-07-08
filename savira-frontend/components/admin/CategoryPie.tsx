"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4F6F52", "#C8A96B", "#6b8f6e", "#d4b97e", "#3d5740", "#e8d5a3"];
const data = [
  { name: "Kurtis", value: 38 }, { name: "Co-ord Sets", value: 22 },
  { name: "Festive Wear", value: 18 }, { name: "Office Wear", value: 12 },
  { name: "Cotton Kurtis", value: 7 }, { name: "Daily Wear", value: 3 },
];

export default function CategoryPie() {
  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width="50%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ fontFamily: "Poppins", fontSize: 12, borderRadius: 12, border: "none" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="font-poppins text-xs text-gray-600">{item.name}</span>
            </div>
            <span className="font-poppins text-xs font-medium text-charcoal">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
