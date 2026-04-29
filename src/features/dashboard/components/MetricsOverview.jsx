import StatCard from "../../../components/ui/StatCard";

export default function MetricsOverview({ metrics }) {
  return (
    <div className="row g-3">
      {metrics.map((metric) => (
        <div key={metric.id} className="col-12 col-md-6 col-xl-3">
          <StatCard
            label={metric.label}
            value={metric.value}
            change={metric.change}
            changeTone={metric.changeTone}
          />
        </div>
      ))}
    </div>
  );
}
