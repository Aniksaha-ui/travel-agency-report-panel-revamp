import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import CheckboxField from "../../../components/forms/CheckboxField";
import Card from "../../../components/ui/Card";
import { APP_ROUTES } from "../../../constants/routes";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import { getVisaCountryDropdown } from "../../visaCountries/services/visaCountriesService";
import {
  createVisaType,
  getVisaTypeDetails,
  normalizeVisaTypeFormState,
  updateVisaType,
} from "../services/visaTypesService";

const INITIAL_FORM_STATE = normalizeVisaTypeFormState();

const validateForm = (values) => {
  const errors = {};

  if (!String(values.countryId).trim()) {
    errors.countryId = "Country is required.";
  }

  if (!String(values.visaName).trim()) {
    errors.visaName = "Visa name is required.";
  }

  if (!String(values.processingDays).trim()) {
    errors.processingDays = "Processing days are required.";
  }

  if (!String(values.fee).trim()) {
    errors.fee = "Fee is required.";
  }

  return errors;
};

export default function VisaTypeFormPage() {
  const { visaTypeId = "" } = useParams();
  const isEditMode = Boolean(visaTypeId);
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const visaTypeSummary = routerLocation.state?.visaType ?? null;
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: visaTypeDetails,
    isLoading: isVisaTypeLoading,
    error: visaTypeError,
  } = useApi({
    queryKey: ["reports", "visa-type-details", visaTypeId],
    queryFn: () => getVisaTypeDetails(visaTypeId),
    enabled: isEditMode,
  });

  const {
    data: countries = [],
    isLoading: isCountriesLoading,
    error: countriesError,
  } = useApi({
    queryKey: ["reports", "visa-country-options"],
    queryFn: getVisaCountryDropdown,
  });

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(INITIAL_FORM_STATE);
      setFormErrors({});
      return;
    }

    if (!visaTypeDetails) {
      return;
    }

    setFormValues(normalizeVisaTypeFormState({ ...visaTypeSummary, ...visaTypeDetails }));
    setFormErrors({});
  }, [isEditMode, visaTypeDetails, visaTypeSummary]);

  const visaTypeMutation = useMutation({
    mutationFn: (values) => (isEditMode ? updateVisaType(visaTypeId, values) : createVisaType(values)),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          (isEditMode ? "Visa type updated successfully." : "Visa type created successfully."),
      );
      queryClient.invalidateQueries({ queryKey: ["reports", "visa-types"] });

      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["reports", "visa-type-details", visaTypeId] });
      }

      navigate(APP_ROUTES.visaTypes, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || `Unable to ${isEditMode ? "update" : "create"} the visa type.`);
    },
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      toast.error("Please complete the required visa type fields before saving.");
      return;
    }

    visaTypeMutation.mutate(formValues);
  };

  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {isEditMode ? `/admin/visa/types/update/${visaTypeId}` : APP_ROUTES.visaTypeCreate}
              </span>
              <h2 className="page-title">{isEditMode ? "Edit visa type" : "Create visa type"}</h2>
              <p className="text-secondary mb-0">
                {isEditMode
                  ? "Update the destination, fee, and processing time used in the visa package catalog."
                  : "Add a new visa package record using the same fields as the legacy admin flow."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">{isEditMode ? "Visa type ID" : "Mode"}</span>
                <strong>{isEditMode ? `#${visaTypeId}` : "Add flow"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Country</span>
                <strong>
                  {countries.find((country) => String(country.id) === String(formValues.countryId))?.name ??
                    "Not selected"}
                </strong>
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
                title={isEditMode ? "Visa type form" : "New visa type form"}
                subtitle="Keep the payload aligned with the source app's country, fee, description, and status fields."
                className="trip-performance-card border-0"
              >
                {isCountriesLoading || (isEditMode && isVisaTypeLoading) ? (
                  <div className="text-secondary">Loading visa type editor...</div>
                ) : countriesError ? (
                  <div className="text-danger">
                    {countriesError.message || "Unable to load visa country options."}
                  </div>
                ) : visaTypeError ? (
                  <div className="text-danger">
                    {visaTypeError.message || "Unable to load visa type editing data."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label">Country</label>
                        <select
                          className={`form-select ${formErrors.countryId ? "is-invalid" : ""}`}
                          name="countryId"
                          value={formValues.countryId}
                          onChange={handleInputChange}
                        >
                          <option value="">Select country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.countryId ? (
                          <div className="invalid-feedback d-block">{formErrors.countryId}</div>
                        ) : null}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Visa name</label>
                        <input
                          className={`form-control ${formErrors.visaName ? "is-invalid" : ""}`}
                          name="visaName"
                          placeholder="Enter visa name"
                          value={formValues.visaName}
                          onChange={handleInputChange}
                        />
                        {formErrors.visaName ? (
                          <div className="invalid-feedback d-block">{formErrors.visaName}</div>
                        ) : null}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Processing days</label>
                        <input
                          className={`form-control ${formErrors.processingDays ? "is-invalid" : ""}`}
                          type="number"
                          min="0"
                          name="processingDays"
                          placeholder="Enter processing days"
                          value={formValues.processingDays}
                          onChange={handleInputChange}
                        />
                        {formErrors.processingDays ? (
                          <div className="invalid-feedback d-block">{formErrors.processingDays}</div>
                        ) : null}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Fee</label>
                        <input
                          className={`form-control ${formErrors.fee ? "is-invalid" : ""}`}
                          type="number"
                          step="0.01"
                          min="0"
                          name="fee"
                          placeholder="Enter fee amount"
                          value={formValues.fee}
                          onChange={handleInputChange}
                        />
                        {formErrors.fee ? (
                          <div className="invalid-feedback d-block">{formErrors.fee}</div>
                        ) : null}
                      </div>

                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="description"
                          placeholder="Enter description"
                          value={formValues.description}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12">
                        <CheckboxField
                          name="status"
                          checked={formValues.status}
                          onChange={handleInputChange}
                          label="Active"
                          description="Inactive visa types stay visible historically but should not be offered in new flows."
                        />
                      </div>

                      <div className="col-12 d-flex flex-wrap align-items-center gap-2 pt-2">
                        <Button type="submit" isLoading={visaTypeMutation.isPending}>
                          {isEditMode ? "Update visa type" : "Create visa type"}
                        </Button>
                        <Link to={APP_ROUTES.visaTypes} className="btn btn-outline-primary">
                          Back to visa types
                        </Link>
                      </div>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            <div className="col-12 col-xl-4">
              <Card
                title="Form notes"
                subtitle="This form mirrors the source module's editable fields."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Required</span>
                    <strong>Country, visa name, processing days, fee</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Optional</span>
                    <strong>Description and active status</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Submit route</span>
                    <strong>{isEditMode ? `/admin/visa/types/update/${visaTypeId}` : "/admin/visa/types"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Return page</span>
                    <strong>/admin/visa/types</strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
