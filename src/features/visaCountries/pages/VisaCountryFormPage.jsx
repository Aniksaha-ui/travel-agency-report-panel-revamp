import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import CheckboxField from "../../../components/forms/CheckboxField";
import InputField from "../../../components/forms/InputField";
import Card from "../../../components/ui/Card";
import { APP_ROUTES } from "../../../constants/routes";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import {
  createVisaCountry,
  getVisaCountryDetails,
  normalizeVisaCountryFormState,
  updateVisaCountry,
} from "../services/visaCountriesService";

const INITIAL_FORM_STATE = normalizeVisaCountryFormState();

const validateForm = (values) => {
  const errors = {};

  if (!String(values.name).trim()) {
    errors.name = "Country name is required.";
  }

  if (!String(values.isoCode).trim()) {
    errors.isoCode = "ISO code is required.";
  }

  return errors;
};

export default function VisaCountryFormPage() {
  const { countryId = "" } = useParams();
  const isEditMode = Boolean(countryId);
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const countrySummary = routerLocation.state?.country ?? null;
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: countryDetails,
    isLoading: isCountryLoading,
    error: countryError,
  } = useApi({
    queryKey: ["reports", "visa-country-details", countryId],
    queryFn: () => getVisaCountryDetails(countryId),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(INITIAL_FORM_STATE);
      setFormErrors({});
      return;
    }

    if (!countryDetails) {
      return;
    }

    setFormValues(normalizeVisaCountryFormState({ ...countrySummary, ...countryDetails }));
    setFormErrors({});
  }, [countryDetails, countrySummary, isEditMode]);

  const countryMutation = useMutation({
    mutationFn: (values) => (isEditMode ? updateVisaCountry(countryId, values) : createVisaCountry(values)),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          (isEditMode ? "Visa country updated successfully." : "Visa country created successfully."),
      );
      queryClient.invalidateQueries({ queryKey: ["reports", "visa-countries"] });

      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["reports", "visa-country-details", countryId] });
      }

      navigate(APP_ROUTES.visaCountries, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || `Unable to ${isEditMode ? "update" : "create"} the visa country.`);
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
      toast.error("Please complete the required visa country fields before saving.");
      return;
    }

    countryMutation.mutate(formValues);
  };

  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {isEditMode ? `/admin/visa/countries/update/${countryId}` : APP_ROUTES.visaCountryCreate}
              </span>
              <h2 className="page-title">{isEditMode ? "Edit visa country" : "Create visa country"}</h2>
              <p className="text-secondary mb-0">
                {isEditMode
                  ? "Update the country label and ISO code used across visa packages and application records."
                  : "Add a new visa destination country with optional popularity, flag, and activation settings."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">{isEditMode ? "Country ID" : "Mode"}</span>
                <strong>{isEditMode ? `#${countryId}` : "Add flow"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">ISO code</span>
                <strong>{formValues.isoCode || "Not entered"}</strong>
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
                title={isEditMode ? "Country form" : "New country form"}
                subtitle={
                  isEditMode
                    ? "Load the selected country and update the same fields the legacy admin allows during edit."
                    : "Capture the visa country values used by the legacy admin create flow."
                }
                className="trip-performance-card border-0"
              >
                {isEditMode && isCountryLoading ? (
                  <div className="text-secondary">Loading visa country editor...</div>
                ) : countryError ? (
                  <div className="text-danger">
                    {countryError.message || "Unable to load visa country editing data."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <InputField
                        className="col-12 col-md-6"
                        label="Country name"
                        name="name"
                        placeholder="Enter country name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="ISO code"
                        name="isoCode"
                        placeholder="AE"
                        value={formValues.isoCode}
                        onChange={handleInputChange}
                        error={formErrors.isoCode}
                      />

                      {!isEditMode ? (
                        <>
                          <InputField
                            className="col-12"
                            label="Flag URL"
                            name="flag"
                            placeholder="https://example.com/flag.svg"
                            value={formValues.flag}
                            onChange={handleInputChange}
                            description="Optional. This matches the source app's create flow."
                          />
                          <div className="col-12 col-md-6">
                            <CheckboxField
                              name="isPopular"
                              checked={formValues.isPopular}
                              onChange={handleInputChange}
                              label="Popular country"
                              description="Mark this country as popular in the visa catalog."
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <CheckboxField
                              name="status"
                              checked={formValues.status}
                              onChange={handleInputChange}
                              label="Active"
                              description="Inactive countries stay available in history but should not be offered."
                            />
                          </div>
                        </>
                      ) : null}

                      <div className="col-12 d-flex flex-wrap align-items-center gap-2 pt-2">
                        <Button type="submit" isLoading={countryMutation.isPending}>
                          {isEditMode ? "Update country" : "Create country"}
                        </Button>
                        <Link to={APP_ROUTES.visaCountries} className="btn btn-outline-primary">
                          Back to countries
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
                subtitle="Keep the payload aligned with the original visa country workflow."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Required</span>
                    <strong>Name and ISO code</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Create only</span>
                    <strong>Flag URL, popular flag, active status</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Submit route</span>
                    <strong>
                      {isEditMode ? `/admin/visa/countries/update/${countryId}` : "/admin/visa/countries"}
                    </strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Return page</span>
                    <strong>/admin/visa/countries</strong>
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
