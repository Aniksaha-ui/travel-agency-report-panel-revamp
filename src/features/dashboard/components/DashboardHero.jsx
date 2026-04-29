import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";

export default function DashboardHero({ hero }) {
  return (
    <Card className="dashboard-hero-card border-0">
      <div className="row align-items-center g-4">
        <div className="col-lg-7">
          <span className="badge bg-white text-primary mb-3">{hero.eyebrow}</span>
          <h2 className="display-6 text-white mb-3">{hero.title}</h2>
          <p className="text-white-50 mb-4">{hero.description}</p>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="secondary" className="bg-white text-primary border-0">
              New booking
            </Button>
            <Button variant="ghost" className="text-white border border-white">
              Export summary
            </Button>
          </div>
        </div>
        <div className="col-lg-5 text-center">
          <img src={hero.image} alt={hero.title} className="img-fluid dashboard-hero-image" />
        </div>
      </div>
    </Card>
  );
}
