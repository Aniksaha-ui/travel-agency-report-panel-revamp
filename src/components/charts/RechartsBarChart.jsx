import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function RechartsBarChart({
  items,
  segments,
  labelKey = "label",
  height = 300,
}) {
  if (!items || items.length === 0) {
    return (
      <div
        className="d-flex align-items-center justify-content-center text-secondary"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={items}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey={labelKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 11 }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            cursor={{ fill: "transparent" }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          {segments.map((segment) => (
            <Bar
              key={segment.key}
              dataKey={segment.key}
              name={segment.label}
              stackId="a"
              fill={segment.color}
              radius={[0, 0, 0, 0]}
              barSize={20}
              animationDuration={1500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
