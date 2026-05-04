import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import InputField from "../../../components/forms/InputField";
import SelectField from "../../../components/forms/SelectField";
import Card from "../../../components/ui/Card";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { APP_ROUTES } from "../../../constants/routes";
import {
  getTripDetails,
  getTripFormOptions,
  updateTrip,
} from "../services/tripsService";

const INITIAL_FORM_STATE = {
  tripName: "",
  departureDate: "",
  arrivalDate: "",
  departureAt: "",
  arrivalAt: "",
  price: "",
  vehicleId: "",
  routeId: "",
  isActive: true,
  status: "1",
  description: "",
  imagePath: "",
  imageFile: null,
};

const STATUS_OPTIONS = [
  { value: "1", label: "Published" },
  { value: "0", label: "Draft" },
];

const ACTIVE_OPTIONS = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

const validateForm = (values) => {
  const nextErrors = {};

  if (!String(values.tripName).trim()) {
    nextErrors.tripName = "Trip name is required.";
  }

  if (!String(values.routeId).trim()) {
    nextErrors.routeId = "Route is required.";
  }

  if (!String(values.vehicleId).trim()) {
    nextErrors.vehicleId = "Vehicle is required.";
  }

  if (!String(values.departureDate).trim()) {
    nextErrors.departureDate = "Departure date is required.";
  }

  if (!String(values.arrivalDate).trim()) {
    nextErrors.arrivalDate = "Arrival date is required.";
  }

  if (!String(values.departureAt).trim()) {
    nextErrors.departureAt = "Departure time is required.";
  }

  if (!String(values.arrivalAt).trim()) {
    nextErrors.arrivalAt = "Arrival time is required.";
  }

  if (!String(values.price).trim()) {
    nextErrors.price = "Price is required.";
  }

  return nextErrors;
};

export default function TripEditPage() {
  const { tripId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: tripDetails,
    isLoading: isTripLoading,
    error: tripError,
  } = useApi({
    queryKey: ["reports", "trip-details", tripId],
    queryFn: () => getTripDetails(tripId),
    enabled: Boolean(tripId),
  });

  const {
    data: formOptions,
    isLoading: areOptionsLoading,
    error: optionsError,
  } = useApi({
    queryKey: ["reports", "trip-form-options"],
    queryFn: getTripFormOptions,
  });

  useEffect(() => {
    if (!tripDetails) {
      return;
    }

    setFormValues({
      tripName: tripDetails.tripName ?? "",
      departureDate: tripDetails.departureDate ?? "",
      arrivalDate: tripDetails.arrivalDate ?? "",
      departureAt: tripDetails.departureAt ?? "",
      arrivalAt: tripDetails.arrivalAt ?? "",
      price: tripDetails.price ?? "",
      vehicleId: tripDetails.vehicleId ?? "",
      routeId: tripDetails.routeId ?? "",
      isActive: Boolean(tripDetails.isActive),
      status: tripDetails.status ?? "1",
      description: tripDetails.description ?? "",
      imagePath: tripDetails.imagePath ?? "",
      imageFile: null,
    });
    setFormErrors({});
  }, [tripDetails]);

  const updateTripMutation = useMutation({
    mutationFn: (values) => updateTrip(tripId, values),
    onSuccess: (response) => {
      toast.success(response?.message || "Trip updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["reports", "trips"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "trip-details", tripId] });
      navigate(APP_ROUTES.trips, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to update the trip.");
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleActiveChange = (event) => {
    const { value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      isActive: value === "1",
    }));
  };

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0] ?? null;

    setFormValues((currentValues) => ({
      ...currentValues,
      imageFile: nextFile,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      toast.error("Please complete the required fields before saving.");
      return;
    }

    updateTripMutation.mutate(formValues);
  };

  const routeOptions = formOptions?.routeOptions ?? [{ value: "", label: "Select a route" }];
  const vehicleOptions = formOptions?.vehicleOptions ?? [{ value: "", label: "Select a vehicle" }];
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/trips/{tripId}/edit</span>
              <h2 className="page-title">Edit trip</h2>
              <p className="text-secondary mb-0">
                Update trip scheduling, route assignment, vehicle booking, pricing, and media.
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Trip ID</span>
                <strong>#{tripId}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Route</span>
                <strong>{formValues.routeId || "Not selected"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-3">
            <div className="col-12 col-xl-8">
              <Card
                title="Trip form"
                subtitle="This screen loads route and vehicle dropdown data, hydrates the current trip, and submits the update payload."
                className="trip-performance-card border-0"
              >
                {isTripLoading || areOptionsLoading ? (
                  <div className="text-secondary">Loading trip editor...</div>
                ) : tripError || optionsError ? (
                  <div className="text-danger">
                    {(tripError || optionsError)?.message || "Unable to load trip editing data."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <InputField
                        className="col-12"
                        label="Trip name"
                        name="tripName"
                        placeholder="Grand trip to Cox's Bazer"
                        value={formValues.tripName}
                        onChange={handleInputChange}
                        error={formErrors.tripName}
                      />

                      <SelectField
                        className="col-12 col-md-6"
                        label="Route"
                        name="routeId"
                        value={formValues.routeId}
                        onChange={handleInputChange}
                        options={routeOptions}
                      />
                      {formErrors.routeId ? <div className="col-12 text-danger small">{formErrors.routeId}</div> : null}

                      <SelectField
                        className="col-12 col-md-6"
                        label="Vehicle"
                        name="vehicleId"
                        value={formValues.vehicleId}
                        onChange={handleInputChange}
                        options={vehicleOptions}
                      />
                      {formErrors.vehicleId ? (
                        <div className="col-12 text-danger small">{formErrors.vehicleId}</div>
                      ) : null}

                      <InputField
                        className="col-12 col-md-6"
                        label="Departure date"
                        name="departureDate"
                        type="date"
                        value={formValues.departureDate}
                        onChange={handleInputChange}
                        error={formErrors.departureDate}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Arrival date"
                        name="arrivalDate"
                        type="date"
                        value={formValues.arrivalDate}
                        onChange={handleInputChange}
                        error={formErrors.arrivalDate}
                      />

                      <InputField
                        className="col-12 col-md-6"
                        label="Departure at"
                        name="departureAt"
                        placeholder="12:00 PM"
                        value={formValues.departureAt}
                        onChange={handleInputChange}
                        error={formErrors.departureAt}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Arrival at"
                        name="arrivalAt"
                        placeholder="12:50 PM"
                        value={formValues.arrivalAt}
                        onChange={handleInputChange}
                        error={formErrors.arrivalAt}
                      />

                      <InputField
                        className="col-12 col-md-4"
                        label="Price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="7000.00"
                        value={formValues.price}
                        onChange={handleInputChange}
                        error={formErrors.price}
                      />
                      <SelectField
                        className="col-12 col-md-4"
                        label="Active state"
                        value={formValues.isActive ? "1" : "0"}
                        onChange={handleActiveChange}
                        options={ACTIVE_OPTIONS}
                      />
                      <SelectField
                        className="col-12 col-md-4"
                        label="Status"
                        name="status"
                        value={formValues.status}
                        onChange={handleInputChange}
                        options={STATUS_OPTIONS}
                      />

                      <div className="col-12">
                        <label className="form-label" htmlFor="trip-description">
                          Description
                        </label>
                        <textarea
                          id="trip-description"
                          name="description"
                          className="form-control"
                          rows={5}
                          placeholder="Trip details, itinerary notes, or booking guidance"
                          value={formValues.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label" htmlFor="trip-image">
                          Replace image
                        </label>
                        <input
                          id="trip-image"
                          name="image"
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <div className="form-hint mt-2">
                          Leave this empty to keep the current image path.
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                      <Button type="submit" isLoading={updateTripMutation.isPending}>
                        Save changes
                      </Button>
                      <Link to={APP_ROUTES.trips} className="btn btn-outline-primary">
                        Cancel
                      </Link>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            <div className="col-12 col-xl-4">
              <Card
                title="Current trip snapshot"
                subtitle="Quick confirmation of the loaded trip detail payload before you save."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Trip</span>
                    <strong>{formValues.tripName || "Not loaded"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Vehicle ID</span>
                    <strong>{formValues.vehicleId || "Not selected"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Route ID</span>
                    <strong>{formValues.routeId || "Not selected"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Fare</span>
                    <strong>{formValues.price || "0.00"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Departure</span>
                    <strong>{formValues.departureDate || "Not set"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Arrival</span>
                    <strong>{formValues.arrivalDate || "Not set"}</strong>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-secondary small mb-2">Current image</div>
                  {tripDetails?.imageUrl ? (
                    <a href={tripDetails.imageUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                      {tripDetails.imagePath}
                    </a>
                  ) : (
                    <div className="text-secondary">No image attached.</div>
                  )}
                </div>

                {formValues.imageFile ? (
                  <div className="mt-3 text-secondary small">
                    Replacement selected: {formValues.imageFile.name}
                  </div>
                ) : null}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
