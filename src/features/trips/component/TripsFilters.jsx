import InputField from "../../../components/forms/InputField";

export default function TripsFilters({ isFetching, searchTerm, onSearchChange }) {
  return (
    <div className="row g-3 align-items-end">
      <InputField
        className="col-12"
        label="Search trips"
        name="search"
        placeholder="Search by trip, route, or vehicle"
        value={searchTerm}
        onChange={onSearchChange}
        description={isFetching ? "Searching..." : "Results update automatically after a short debounce."}
      />
    </div>
  );
}
