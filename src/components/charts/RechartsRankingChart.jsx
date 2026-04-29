import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function RechartsRankingChart({
  items,
  labelKey = "label",
  valueKey = "value",
  height = 300,
  valueFormatter = (value) => value,
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

  // Pre-process data to ensure values are numbers
  const data = items.map((item) => ({
    ...item,
    [valueKey]: Number(item[valueKey]),
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            formatter={(value) => [valueFormatter(value), "Occupancy"]}
          />
          <Bar dataKey={valueKey} radius={[0, 4, 4, 0]} barSize={12} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > 80 ? "#22c55e" : entry.value > 50 ? "#38bdf8" : "#f59e0b"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
