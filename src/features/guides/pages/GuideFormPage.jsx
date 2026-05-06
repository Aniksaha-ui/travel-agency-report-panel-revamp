import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import InputField from "../../../components/forms/InputField";
import Card from "../../../components/ui/Card";
import { APP_ROUTES } from "../../../constants/routes";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import {
  createGuide,
  getGuideDetails,
  normalizeGuideFormState,
  updateGuide,
} from "../services/guidesService";

const INITIAL_FORM_STATE = normalizeGuideFormState();

const validateForm = (values) => {
  const errors = {};

  if (!String(values.name).trim()) {
    errors.name = "Guide name is required.";
  }

  if (!String(values.email).trim()) {
    errors.email = "Guide email is required.";
  }

  if (!String(values.phone).trim()) {
    errors.phone = "Guide phone is required.";
  }

  if (!String(values.bio).trim()) {
    errors.bio = "Guide bio is required.";
  }

  return errors;
};

export default function GuideFormPage() {
  const { guideId = "" } = useParams();
  const isEditMode = Boolean(guideId);
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const guideSummary = routerLocation.state?.guide ?? null;
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const {
    data: guideDetails,
    isLoading: isGuideLoading,
    error: guideError,
  } = useApi({
    queryKey: ["reports", "guide-details", guideId],
    queryFn: () => getGuideDetails(guideId),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode) {
      setFormValues(INITIAL_FORM_STATE);
      setFormErrors({});
      return;
    }

    if (!guideDetails) {
      return;
    }

    setFormValues(normalizeGuideFormState({ ...guideSummary, ...guideDetails }));
    setFormErrors({});
  }, [guideDetails, guideSummary, isEditMode]);

  const guideMutation = useMutation({
    mutationFn: (values) => (isEditMode ? updateGuide(values) : createGuide(values)),
    onSuccess: (response) => {
      toast.success(
        response?.message || (isEditMode ? "Guide updated successfully." : "Guide created successfully."),
      );
      queryClient.invalidateQueries({ queryKey: ["reports", "guide-list"] });

      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["reports", "guide-details", guideId] });
      }

      navigate(APP_ROUTES.guide, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || `Unable to ${isEditMode ? "update" : "create"} the guide.`);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      toast.error("Please complete the required guide fields before saving.");
      return;
    }

    guideMutation.mutate({
      ...formValues,
      id: isEditMode ? guideId : formValues.id,
    });
  };

  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {isEditMode ? `/admin/guide/update/${guideId}` : APP_ROUTES.guideCreate}
              </span>
              <h2 className="page-title">{isEditMode ? "Edit guide" : "Create guide"}</h2>
              <p className="text-secondary mb-0">
                {isEditMode
                  ? "Update guide profile details, contact data, bio, and rating using the legacy admin flow."
                  : "Add a new guide profile with the same name, email, phone, bio, and rating fields used in the legacy admin."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  {isEditMode ? "Guide ID" : "Mode"}
                </span>
                <strong>{isEditMode ? `#${guideId}` : "Add flow"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Email</span>
                <strong>{formValues.email || "Not entered"}</strong>
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
                title={isEditMode ? "Guide form" : "New guide form"}
                subtitle={
                  isEditMode
                    ? "Load the current guide record, adjust profile details, and save back to the guide endpoint."
                    : "Capture the guide profile fields and create a new guide record."
                }
                className="trip-performance-card border-0"
              >
                {isEditMode && isGuideLoading ? (
                  <div className="text-secondary">Loading guide editor...</div>
                ) : guideError ? (
                  <div className="text-danger">
                    {guideError.message || "Unable to load guide editing data."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <InputField
                        className="col-12 col-md-6"
                        label="Guide name"
                        name="name"
                        placeholder="Enter guide name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="guide@example.com"
                        value={formValues.email}
                        onChange={handleInputChange}
                        error={formErrors.email}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Phone"
                        name="phone"
                        placeholder="01XXXXXXXXX"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        error={formErrors.phone}
                      />
                      <InputField
                        className="col-12 col-md-6"
                        label="Rating"
                        name="rating"
                        placeholder="4.5"
                        value={formValues.rating}
                        onChange={handleInputChange}
                        description="Leave 0 or blank if the guide is not rated yet."
                      />
                      <div className="col-12">
                        <label className="form-label">Bio</label>
                        <textarea
                          className={`form-control ${formErrors.bio ? "is-invalid" : ""}`}
                          name="bio"
                          rows="5"
                          placeholder="Write a short guide bio"
                          value={formValues.bio}
                          onChange={handleInputChange}
                        />
                        {formErrors.bio ? (
                          <div className="invalid-feedback d-block">{formErrors.bio}</div>
                        ) : null}
                      </div>

                      <div className="col-12 d-flex flex-wrap align-items-center gap-2 pt-2">
                        <Button type="submit" isLoading={guideMutation.isPending}>
                          {isEditMode ? "Update guide" : "Create guide"}
                        </Button>
                        <Link to={APP_ROUTES.guide} className="btn btn-outline-primary">
                          Back to guides
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
                subtitle="Keep the guide record aligned with the legacy admin contract."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Required</span>
                    <strong>Name, email, phone, bio</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Optional</span>
                    <strong>Rating and user ID</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Submit route</span>
                    <strong>{isEditMode ? "/admin/guide/update" : "/admin/guide"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Return page</span>
                    <strong>/admin/guide</strong>
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
