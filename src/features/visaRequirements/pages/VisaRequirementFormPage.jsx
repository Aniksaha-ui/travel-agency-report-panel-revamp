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
import { getAllVisaTypes } from "../../visaTypes/services/visaTypesService";
import {
  createVisaRequirement,
  getVisaRequirementDetails,
  normalizeVisaRequirementFormState,
  updateVisaRequirement,
} from "../services/visaRequirementsService";

const INITIAL_FORM_STATE = normalizeVisaRequirementFormState();

const validateForm = (values) => {
  const errors = {};

  if (!String(values.visaTypeId).trim()) {
    errors.visaTypeId = "Visa type is required.";
  }

  if (!String(values.documentName).trim()) {
    errors.documentName = "Document name is required.";
  }

  return errors;
};

export default function VisaRequirementFormPage() {
  const { requirementId = "" } = useParams();
  const isEditMode = Boolean(requirementId);
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requirementSummary = routerLocation.state?.requirement ?? null;
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: requirementDetails,
    isLoading: isRequirementLoading,
    error: requirementError,
  } = useApi({
    queryKey: ["reports", "visa-requirement-details", requirementId],
    queryFn: () => getVisaRequirementDetails(requirementId),
    enabled: isEditMode,
  });

  const {
    data: visaTypes = [],
    isLoading: isVisaTypesLoading,
    error: visaTypesError,
  } = useApi({
    queryKey: ["reports", "visa-type-options"],
    queryFn: getAllVisaTypes,
  });

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(INITIAL_FORM_STATE);
      setFormErrors({});
      return;
    }

    if (!requirementDetails) {
      return;
    }

    setFormValues(normalizeVisaRequirementFormState({ ...requirementSummary, ...requirementDetails }));
    setFormErrors({});
  }, [isEditMode, requirementDetails, requirementSummary]);

  const requirementMutation = useMutation({
    mutationFn: (values) =>
      isEditMode ? updateVisaRequirement(requirementId, values) : createVisaRequirement(values),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          (isEditMode
            ? "Visa requirement updated successfully."
            : "Visa requirement created successfully."),
      );
      queryClient.invalidateQueries({ queryKey: ["reports", "visa-requirements"] });

      if (isEditMode) {
        queryClient.invalidateQueries({
          queryKey: ["reports", "visa-requirement-details", requirementId],
        });
      }

      navigate(APP_ROUTES.visaRequirements, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || `Unable to ${isEditMode ? "update" : "create"} the visa requirement.`);
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
      toast.error("Please complete the required visa requirement fields before saving.");
      return;
    }

    requirementMutation.mutate(formValues);
  };

  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {isEditMode
                  ? `/admin/visa/requirements/update/${requirementId}`
                  : APP_ROUTES.visaRequirementCreate}
              </span>
              <h2 className="page-title">
                {isEditMode ? "Edit visa requirement" : "Create visa requirement"}
              </h2>
              <p className="text-secondary mb-0">
                {isEditMode
                  ? "Update the document rule attached to a visa package, including upload behavior and sort order."
                  : "Add a new document requirement to the visa package checklist used in application reviews."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  {isEditMode ? "Requirement ID" : "Mode"}
                </span>
                <strong>{isEditMode ? `#${requirementId}` : "Add flow"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Visa type</span>
                <strong>
                  {visaTypes.find((visaType) => String(visaType.id) === String(formValues.visaTypeId))
                    ?.visaName ?? "Not selected"}
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
                title={isEditMode ? "Requirement form" : "New requirement form"}
                subtitle="Keep the payload aligned with the source app's visa type, instructions, flags, and sort order fields."
                className="trip-performance-card border-0"
              >
                {isVisaTypesLoading || (isEditMode && isRequirementLoading) ? (
                  <div className="text-secondary">Loading visa requirement editor...</div>
                ) : visaTypesError ? (
                  <div className="text-danger">
                    {visaTypesError.message || "Unable to load visa type options."}
                  </div>
                ) : requirementError ? (
                  <div className="text-danger">
                    {requirementError.message || "Unable to load visa requirement editing data."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Visa type</label>
                        <select
                          className={`form-select ${formErrors.visaTypeId ? "is-invalid" : ""}`}
                          name="visaTypeId"
                          value={formValues.visaTypeId}
                          onChange={handleInputChange}
                        >
                          <option value="">Select visa type</option>
                          {visaTypes.map((visaType) => (
                            <option key={visaType.id} value={visaType.id}>
                              {visaType.countryName ? `${visaType.countryName} - ${visaType.visaName}` : visaType.visaName}
                            </option>
                          ))}
                        </select>
                        {formErrors.visaTypeId ? (
                          <div className="invalid-feedback d-block">{formErrors.visaTypeId}</div>
                        ) : null}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Document name</label>
                        <input
                          className={`form-control ${formErrors.documentName ? "is-invalid" : ""}`}
                          name="documentName"
                          placeholder="Enter document name"
                          value={formValues.documentName}
                          onChange={handleInputChange}
                        />
                        {formErrors.documentName ? (
                          <div className="invalid-feedback d-block">{formErrors.documentName}</div>
                        ) : null}
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">Sort order</label>
                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          name="sortOrder"
                          placeholder="Enter sort order"
                          value={formValues.sortOrder}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Instructions</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="instructions"
                          placeholder="Enter instructions"
                          value={formValues.instructions}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <CheckboxField
                          name="isRequired"
                          checked={formValues.isRequired}
                          onChange={handleInputChange}
                          label="Required"
                          description="Required documents must be present before the application can move forward."
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <CheckboxField
                          name="allowMultiple"
                          checked={formValues.allowMultiple}
                          onChange={handleInputChange}
                          label="Allow multiple uploads"
                          description="Enable multiple files for this requirement when one upload is not enough."
                        />
                      </div>

                      <div className="col-12 d-flex flex-wrap align-items-center gap-2 pt-2">
                        <Button type="submit" isLoading={requirementMutation.isPending}>
                          {isEditMode ? "Update requirement" : "Create requirement"}
                        </Button>
                        <Link to={APP_ROUTES.visaRequirements} className="btn btn-outline-primary">
                          Back to requirements
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
                subtitle="This form mirrors the source module's requirement workflow."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Required</span>
                    <strong>Visa type and document name</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Optional</span>
                    <strong>Instructions, sort order, upload flags</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Submit route</span>
                    <strong>
                      {isEditMode
                        ? `/admin/visa/requirements/update/${requirementId}`
                        : "/admin/visa/requirements"}
                    </strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Return page</span>
                    <strong>/admin/visa/requirements</strong>
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
