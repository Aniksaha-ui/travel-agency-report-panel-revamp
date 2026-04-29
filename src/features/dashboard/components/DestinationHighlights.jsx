import Card from "../../../components/ui/Card";

export default function DestinationHighlights({ destinations }) {
  return (
    <div className="row g-3">
      {destinations.map((destination) => (
        <div key={destination.id} className="col-md-6 col-xl-12">
          <Card className="h-100 destination-card" bodyClassName="d-flex flex-column gap-3">
            <img
              src={destination.image}
              alt={destination.name}
              className="img-fluid rounded-3 destination-card-image"
            />
            <div>
              <div className="text-secondary small">{destination.region}</div>
              <h3 className="card-title mb-1">{destination.name}</h3>
              <p className="text-secondary mb-0">{destination.blurb}</p>
            </div>
            <div className="mt-auto">
              <span className="badge bg-primary-lt text-primary">{destination.demand}</span>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
