import Card from "../ui/Card";

export default function EmptyState({ title, description }) {
  return (
    <Card bodyClassName="py-5 text-center">
      <h3 className="mb-2">{title}</h3>
      <p className="text-secondary mb-0">{description}</p>
    </Card>
  );
}
