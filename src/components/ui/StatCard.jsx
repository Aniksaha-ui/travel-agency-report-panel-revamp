import Badge from "../common/Badge";
import Card from "./Card";

function StatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-chart-pie-2"
      width={26}
      height={26}
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3v9h9" />
      <path d="M12 12l-6.5 6.5" />
      <path d="M12 12h-9" />
      <path d="M12 12v9" />
      <path d="M21 12a9 9 0 1 0 -9 9" />
    </svg>
  );
}

export default function StatCard({ change, changeTone, label, value }) {
  return (
    <Card className="stat-card border-0 h-100" bodyClassName="h-100">
      <div className="stat-card__content">
        <div className="stat-card__icon">
          <StatIcon />
        </div>
        <div className="stat-card__details">
          <span className="stat-card__label">{label}</span>
          <div className="stat-card__meta">
            <h2 className="stat-card__value">{value}</h2>
            {change ? <Badge color={changeTone}>{change}</Badge> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
