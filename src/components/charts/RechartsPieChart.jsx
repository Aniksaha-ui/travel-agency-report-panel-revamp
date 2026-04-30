import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DEFAULT_COLORS = ["#22c55e", "#38bdf8", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

export default function RechartsPieChart({
  centerValueFormatter,
  colors = DEFAULT_COLORS,
  height = 300,
  innerRadius = "64%",
  items,
  labelKey = "label",
  outerRadius = "80%",
  showLegend = true,
  showTotal = true,
  totalLabel = "Total",
  tooltipLabel = "Value",
  valueFormatter = (value) => value,
  valueKey = "value",
}) {
  const data = (items ?? [])
    .map((item, index) => ({
      ...item,
      color: item.color ?? colors[index % colors.length],
      [valueKey]: Number(item[valueKey]) || 0,
    }))
    .filter((item) => item[valueKey] > 0);

  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  const formatCenterValue = centerValueFormatter ?? valueFormatter;

  if (!data.length || total <= 0) {
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
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={labelKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            stroke="#ffffff"
            strokeWidth={2}
            animationDuration={1500}
          >
            {data.map((entry) => (
              <Cell key={entry.id ?? entry[labelKey]} fill={entry.color} />
            ))}
          </Pie>
          {showTotal ? (
            <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" className="recharts-pie-total">
                {formatCenterValue(total)}
              </tspan>
              <tspan x="50%" dy="1.55em" className="recharts-pie-total-label">
                {totalLabel}
              </tspan>
            </text>
          ) : null}
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [valueFormatter(value), tooltipLabel]}
          />
          {showLegend ? <Legend verticalAlign="bottom" height={36} iconType="circle" /> : null}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
