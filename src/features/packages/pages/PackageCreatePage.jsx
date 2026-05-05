import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import InputField from "../../../components/forms/InputField";
import SelectField from "../../../components/forms/SelectField";
import Card from "../../../components/ui/Card";
import { APP_ROUTES } from "../../../constants/routes";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import {
  createEmptyPackagePricing,
  createPackage,
  getPackageFormOptions,
} from "../services/packagesService";

const BOOLEAN_OPTIONS = [
  { value: "1", label: "Included" },
  { value: "0", label: "Not included" },
];

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  includesMeal: true,
  includesHotel: true,
  includesBus: false,
  tripId: "",
  guideId: "",
  imageUrl: "",
  inclusions: [""],
  exclusions: [""],
  pricing: [createEmptyPackagePricing()],
};

const validateForm = (values) => {
  const errors = {};

  if (!String(values.name).trim()) {
    errors.name = "Package name is required.";
  }

  if (!String(values.description).trim()) {
    errors.description = "Package description is required.";
  }

  if (!String(values.tripId).trim()) {
    errors.tripId = "Trip is required.";
  }

  if (!String(values.guideId).trim()) {
    errors.guideId = "Guide is required.";
  }

  if (!String(values.imageUrl).trim()) {
    errors.imageUrl = "Image URL is required.";
  }

  return errors;
};

const getNestedValidationMessage = (values) => {
  const hasInclusion = (values.inclusions ?? []).some((item) => String(item ?? "").trim());
  const hasExclusion = (values.exclusions ?? []).some((item) => String(item ?? "").trim());

  if (!hasInclusion) {
    return "Add at least one inclusion before creating the package.";
  }

  if (!hasExclusion) {
    return "Add at least one exclusion before creating the package.";
  }

  if (!(values.pricing ?? []).length) {
    return "Add at least one pricing row before creating the package.";
  }

  for (const [index, item] of (values.pricing ?? []).entries()) {
    if (!String(item.adultPrice).trim()) {
      return `Pricing row ${index + 1}: adult price is required.`;
    }

    if (!String(item.childPrice).trim()) {
      return `Pricing row ${index + 1}: child price is required.`;
    }
  }

  return null;
};

export default function PackageCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const {
    data: formOptions,
    isLoading: areOptionsLoading,
    error: optionsError,
  } = useApi({
    queryKey: ["reports", "package-form-options"],
    queryFn: getPackageFormOptions,
  });

  const packageMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: (response) => {
      toast.success(response?.message || "Package created successfully.");
      queryClient.invalidateQueries({ queryKey: ["reports", "packages"] });
      navigate(APP_ROUTES.packages, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to create the package.");
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

  const handleBooleanChange = (field, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value === "1",
    }));
  };

  const handleListChange = (field, index, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: currentValues[field].map((item, currentIndex) =>
        currentIndex === index ? nextValue : item
      ),
    }));
  };

  const addListItem = (field) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: [...currentValues[field], ""],
    }));
  };

  const removeListItem = (field, index) => {
    setFormValues((currentValues) => {
      const nextItems = currentValues[field].filter((_, currentIndex) => currentIndex !== index);

      return {
        ...currentValues,
        [field]: nextItems.length ? nextItems : [""],
      };
    });
  };

  const handlePricingChange = (index, field, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      pricing: currentValues.pricing.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: nextValue,
            }
          : item
      ),
    }));
  };

  const addPricing = () => {
    setFormValues((currentValues) => ({
      ...currentValues,
      pricing: [...currentValues.pricing, createEmptyPackagePricing()],
    }));
  };

  const removePricing = (index) => {
    setFormValues((currentValues) => {
      const nextPricing = currentValues.pricing.filter((_, currentIndex) => currentIndex !== index);

      return {
        ...currentValues,
        pricing: nextPricing.length ? nextPricing : [createEmptyPackagePricing()],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    const nestedValidationMessage = getNestedValidationMessage(formValues);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      toast.error("Please complete the required package fields before saving.");
      return;
    }

    if (nestedValidationMessage) {
      toast.error(nestedValidationMessage);
      return;
    }

    packageMutation.mutate(formValues);
  };

  const tripOptions = formOptions?.tripOptions ?? [{ value: "", label: "Select a trip" }];
  const guideOptions = formOptions?.guideOptions ?? [{ value: "", label: "Select a guide" }];
  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/packages/create</span>
              <h2 className="page-title">Create package</h2>
              <p className="text-secondary mb-0">
                Bundle trip inventory into a sellable package with guide assignment, coverage flags, and pricing.
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Mode</span>
                <strong>Create new</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Pricing rows</span>
                <strong>{formValues.pricing.length}</strong>
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
                title="Package form"
                subtitle="This form posts the same package create payload structure used by the admin API."
                className="trip-performance-card border-0"
              >
                {areOptionsLoading ? (
                  <div className="text-secondary">Loading package form options...</div>
                ) : optionsError ? (
                  <div className="text-danger">
                    {optionsError.message || "Unable to load package dropdown options."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <InputField
                        className="col-12"
                        label="Package name"
                        name="name"
                        placeholder="Grand Package to Cox's Bazar"
                        value={formValues.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                      />

                      <div className="col-12">
                        <label className="form-label" htmlFor="package-description">
                          Description
                        </label>
                        <textarea
                          id="package-description"
                          name="description"
                          className="form-control"
                          rows={5}
                          placeholder="Describe what the package offers and why travelers should book it."
                          value={formValues.description}
                          onChange={handleInputChange}
                        />
                        {formErrors.description ? (
                          <div className="invalid-feedback d-block">{formErrors.description}</div>
                        ) : null}
                      </div>

                      <SelectField
                        className="col-12 col-md-6"
                        label="Trip"
                        name="tripId"
                        value={formValues.tripId}
                        onChange={handleInputChange}
                        options={tripOptions}
                      />
                      {formErrors.tripId ? <div className="col-12 text-danger small">{formErrors.tripId}</div> : null}

                      <SelectField
                        className="col-12 col-md-6"
                        label="Guide"
                        name="guideId"
                        value={formValues.guideId}
                        onChange={handleInputChange}
                        options={guideOptions}
                      />
                      {formErrors.guideId ? <div className="col-12 text-danger small">{formErrors.guideId}</div> : null}

                      <InputField
                        className="col-12"
                        label="Image URL"
                        name="imageUrl"
                        placeholder="https://example.com/images/package.jpg"
                        value={formValues.imageUrl}
                        onChange={handleInputChange}
                        error={formErrors.imageUrl}
                      />

                      <SelectField
                        className="col-12 col-md-4"
                        label="Meal coverage"
                        value={formValues.includesMeal ? "1" : "0"}
                        onChange={(event) => handleBooleanChange("includesMeal", event.target.value)}
                        options={BOOLEAN_OPTIONS}
                      />
                      <SelectField
                        className="col-12 col-md-4"
                        label="Hotel coverage"
                        value={formValues.includesHotel ? "1" : "0"}
                        onChange={(event) => handleBooleanChange("includesHotel", event.target.value)}
                        options={BOOLEAN_OPTIONS}
                      />
                      <SelectField
                        className="col-12 col-md-4"
                        label="Bus coverage"
                        value={formValues.includesBus ? "1" : "0"}
                        onChange={(event) => handleBooleanChange("includesBus", event.target.value)}
                        options={BOOLEAN_OPTIONS}
                      />

                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <div>
                            <div className="form-label mb-1">Inclusions</div>
                            <div className="form-hint">List the services or items covered by the package.</div>
                          </div>
                          <Button variant="outline" onClick={() => addListItem("inclusions")}>
                            Add inclusion
                          </Button>
                        </div>

                        <div className="d-grid gap-2">
                          {formValues.inclusions.map((item, index) => (
                            <div key={`inclusion-${index}`} className="d-flex gap-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Breakfast"
                                value={item}
                                onChange={(event) =>
                                  handleListChange("inclusions", index, event.target.value)
                                }
                              />
                              <Button
                                variant="outline"
                                onClick={() => removeListItem("inclusions", index)}
                                disabled={formValues.inclusions.length === 1}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <div>
                            <div className="form-label mb-1">Exclusions</div>
                            <div className="form-hint">Call out anything travelers should arrange on their own.</div>
                          </div>
                          <Button variant="outline" onClick={() => addListItem("exclusions")}>
                            Add exclusion
                          </Button>
                        </div>

                        <div className="d-grid gap-2">
                          {formValues.exclusions.map((item, index) => (
                            <div key={`exclusion-${index}`} className="d-flex gap-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Ride sharing"
                                value={item}
                                onChange={(event) =>
                                  handleListChange("exclusions", index, event.target.value)
                                }
                              />
                              <Button
                                variant="outline"
                                onClick={() => removeListItem("exclusions", index)}
                                disabled={formValues.exclusions.length === 1}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <div>
                            <div className="form-label mb-1">Pricing</div>
                            <div className="form-hint">Set adult and child prices for the package.</div>
                          </div>
                          <Button variant="outline" onClick={addPricing}>
                            Add pricing
                          </Button>
                        </div>

                        <div className="d-grid gap-3">
                          {formValues.pricing.map((item, index) => (
                            <div key={`pricing-${index}`} className="border rounded p-3">
                              <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                                <div className="fw-semibold">Pricing row {index + 1}</div>
                                <Button
                                  variant="outline"
                                  onClick={() => removePricing(index)}
                                  disabled={formValues.pricing.length === 1}
                                >
                                  Remove pricing
                                </Button>
                              </div>

                              <div className="row g-3">
                                <InputField
                                  className="col-12 col-md-6"
                                  label="Adult price"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="15000.00"
                                  value={item.adultPrice}
                                  onChange={(event) =>
                                    handlePricingChange(index, "adultPrice", event.target.value)
                                  }
                                />
                                <InputField
                                  className="col-12 col-md-6"
                                  label="Child price"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="10000.00"
                                  value={item.childPrice}
                                  onChange={(event) =>
                                    handlePricingChange(index, "childPrice", event.target.value)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                      <Button type="submit" isLoading={packageMutation.isPending}>
                        Create package
                      </Button>
                      <Link to={APP_ROUTES.packages} className="btn btn-outline-primary">
                        Cancel
                      </Link>
                    </div>
                  </form>
                )}
              </Card>
            </div>

            <div className="col-12 col-xl-4">
              <Card
                title="Current package snapshot"
                subtitle="Quick confirmation of the outbound package payload before submitting."
                className="trip-performance-card border-0 h-100"
              >
                <div className="trip-performance-summary-grid">
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Package</span>
                    <strong>{formValues.name || "Draft package"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Trip ID</span>
                    <strong>{formValues.tripId || "Not selected"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Guide ID</span>
                    <strong>{formValues.guideId || "Not selected"}</strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Coverage</span>
                    <strong>
                      {[
                        formValues.includesMeal ? "Meal" : null,
                        formValues.includesHotel ? "Hotel" : null,
                        formValues.includesBus ? "Bus" : null,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Custom"}
                    </strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Inclusions</span>
                    <strong>
                      {formValues.inclusions.filter((item) => String(item ?? "").trim()).length}
                    </strong>
                  </div>
                  <div className="trip-performance-summary-grid__item">
                    <span className="trip-performance-summary-grid__label">Pricing rows</span>
                    <strong>{formValues.pricing.length}</strong>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="fw-semibold mb-2">Image preview</div>
                  {formValues.imageUrl ? (
                    <a href={formValues.imageUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                      {formValues.imageUrl}
                    </a>
                  ) : (
                    <div className="text-secondary small">No image URL added yet.</div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
