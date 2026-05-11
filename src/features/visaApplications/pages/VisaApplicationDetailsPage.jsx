import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import { APP_ROUTES } from "../../../constants/routes";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import {
  formatVisaStatusLabel,
  getPaymentStatusColor,
  getVisaStatusColor,
  VISA_APPLICATION_STATUS_OPTIONS,
  VISA_DOCUMENT_STATUS_OPTIONS,
} from "../constants/visaApplications.constants";
import {
  assignVisaApplication,
  getUsersDropdown,
  getVisaApplicationDetails,
  normalizeVisaApplicationDetails,
  printVisaApplication,
  updateVisaApplication,
  updateVisaApplicationStatus,
  verifyVisaDocument,
} from "../services/visaApplicationsService";

const defaultAssignmentData = {
  officerId: "",
  remarks: "Assigned to visa officer",
};

const defaultAdminUpdateData = {
  assignedTo: "",
  remarks: "",
};

const defaultStatusData = {
  status: "",
  remarks: "",
};

const InfoRow = ({ label, value }) => (
  <div className="col-12 col-md-6">
    <div className="text-secondary small text-uppercase fw-semibold">{label}</div>
    <div className="fw-semibold">{value || "-"}</div>
  </div>
);

export default function VisaApplicationDetailsPage() {
  const navigate = useNavigate();
  const { applicationId = "" } = useParams();
  const [assignmentData, setAssignmentData] = useState(defaultAssignmentData);
  const [adminUpdateData, setAdminUpdateData] = useState(defaultAdminUpdateData);
  const [statusData, setStatusData] = useState(defaultStatusData);
  const [documentReviews, setDocumentReviews] = useState({});
  const [activeAction, setActiveAction] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const {
    data: rawApplication,
    error: applicationError,
    isLoading: isApplicationLoading,
    refetch: refetchApplication,
  } = useApi({
    queryKey: ["reports", "visa-application-details", applicationId],
    queryFn: () => getVisaApplicationDetails(applicationId),
    enabled: Boolean(applicationId),
  });

  const {
    data: users = [],
    error: usersError,
    isLoading: isUsersLoading,
  } = useApi({
    queryKey: ["reports", "user-options", "visa-applications"],
    queryFn: getUsersDropdown,
  });

  const application = rawApplication ? normalizeVisaApplicationDetails(rawApplication) : null;
  const boardDate = formatBoardDate();

  useEffect(() => {
    if (!application) {
      return;
    }

    setAssignmentData({
      officerId: application.assigned_to ? String(application.assigned_to) : "",
      remarks: "Assigned to visa officer",
    });
    setAdminUpdateData({
      assignedTo: application.assigned_to ? String(application.assigned_to) : "",
      remarks: application.admin_note && application.admin_note !== "No admin note" ? application.admin_note : "",
    });
    setStatusData({
      status: application.status ?? "",
      remarks: application.admin_note && application.admin_note !== "No admin note" ? application.admin_note : "",
    });
    setDocumentReviews(
      (application.documents ?? []).reduce((accumulator, document) => {
        accumulator[document.id] = {
          status: document.verification_status || "pending",
          remarks: document.remarks || "",
        };
        return accumulator;
      }, {}),
    );
  }, [application]);

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;

    setAssignmentData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleAdminUpdateChange = (event) => {
    const { name, value } = event.target;

    setAdminUpdateData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleStatusChange = (event) => {
    const { name, value } = event.target;

    setStatusData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleDocumentReviewChange = (documentId, field, value) => {
    setDocumentReviews((currentValue) => ({
      ...currentValue,
      [documentId]: {
        ...currentValue[documentId],
        [field]: value,
      },
    }));
  };

  const runAction = async (actionKey, request, successMessage) => {
    setActiveAction(actionKey);

    try {
      await request();
      await refetchApplication();
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.message || "Unable to complete this visa workflow step.");
    } finally {
      setActiveAction("");
    }
  };

  const handleAssign = () => {
    if (!assignmentData.officerId) {
      toast.error("Please select an officer before assigning.");
      return;
    }

    runAction(
      "assign",
      () =>
        assignVisaApplication({
          visa_application_id: Number(applicationId),
          officer_id: Number(assignmentData.officerId),
          remarks: String(assignmentData.remarks ?? "").trim(),
        }),
      "Visa application assigned successfully.",
    );
  };

  const handleAdminUpdate = () => {
    if (!adminUpdateData.assignedTo) {
      toast.error("Please select an officer before saving the admin update.");
      return;
    }

    runAction(
      "update",
      () =>
        updateVisaApplication(applicationId, {
          assigned_to: Number(adminUpdateData.assignedTo),
          remarks: String(adminUpdateData.remarks ?? "").trim(),
        }),
      "Visa application updated successfully.",
    );
  };

  const handleStatusUpdate = () => {
    if (!statusData.status) {
      toast.error("Please select a status before updating.");
      return;
    }

    runAction(
      "status",
      () =>
        updateVisaApplicationStatus({
          visa_application_id: Number(applicationId),
          status: statusData.status,
          remarks: String(statusData.remarks ?? "").trim(),
        }),
      "Visa application status updated successfully.",
    );
  };

  const handleVerifyDocument = (documentId) => {
    const review = documentReviews[documentId];

    runAction(
      `document-${documentId}`,
      () =>
        verifyVisaDocument({
          visa_document_id: Number(documentId),
          status: review?.status || "pending",
          remarks: String(review?.remarks ?? "").trim(),
        }),
      "Visa document reviewed successfully.",
    );
  };

  const handlePrint = async () => {
    setIsPrinting(true);

    try {
      const blob = await printVisaApplication(applicationId);
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      toast.error(error.message || "Unable to open the visa application PDF.");
    } finally {
      setIsPrinting(false);
    }
  };

  if (isApplicationLoading) {
    return (
      <AdminLayout>
        <div className="page-body">
          <div className="container-xl">
            <div className="text-secondary">Loading visa application details...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (applicationError || !application) {
    return (
      <AdminLayout>
        <div className="page-body">
          <div className="container-xl">
            <Card title="Visa application unavailable" className="trip-performance-card border-0">
              <div className="text-danger">
                {applicationError?.message || "Unable to load the requested visa application."}
              </div>
              <div className="pt-3">
                <Button variant="outline" onClick={() => navigate(APP_ROUTES.visaApplications)}>
                  Back to visa applications
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                {`/admin/visa/applications/${applicationId}`}
              </span>
              <h2 className="page-title">{application.application_no}</h2>
              <p className="text-secondary mb-0">
                Review the full visa submission, assign officers, update workflow status, verify documents, and print the application PDF.
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Status</span>
                <strong>{application.statusLabel}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Payment</span>
                <strong>{application.paymentStatusLabel}</strong>
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
          <section className="dashboard-section">
            <Card
              title="Application header"
              subtitle="Use the actions on the right to return to the queue or open the PDF print view."
              className="trip-performance-card border-0"
              actions={
                <div className="d-flex flex-wrap gap-2">
                  <Badge color={getVisaStatusColor(application.status)}>{application.statusLabel}</Badge>
                  <Badge color={getPaymentStatusColor(application.payment_status)}>
                    {application.paymentStatusLabel}
                  </Badge>
                  <Button variant="outline" onClick={() => navigate(APP_ROUTES.visaApplications)}>
                    Back
                  </Button>
                  <Button onClick={handlePrint} isLoading={isPrinting}>
                    Print PDF
                  </Button>
                </div>
              }
            >
              <div className="row g-3">
                <InfoRow label="Applicant" value={application.full_name} />
                <InfoRow label="Passport" value={application.passport_no} />
                <InfoRow label="Country" value={application.country_name} />
                <InfoRow label="Package" value={application.package_title} />
                <InfoRow label="Assigned officer" value={application.assigned_officer_name} />
                <InfoRow label="Applied at" value={application.appliedAtLabel} />
              </div>
            </Card>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <Card
                  title="Applicant info"
                  subtitle="Identity and contact data carried into the visa application."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="row g-3">
                    <InfoRow label="Full name" value={application.full_name} />
                    <InfoRow label="Email" value={application.email} />
                    <InfoRow label="Phone" value={application.phone} />
                    <InfoRow
                      label="Date of birth"
                      value={application.date_of_birth || application.applicant_info?.date_of_birth || "-"}
                    />
                    <InfoRow label="Gender" value={formatVisaStatusLabel(application.gender)} />
                    <InfoRow
                      label="Nationality"
                      value={application.nationality || application.applicant_info?.nationality || "-"}
                    />
                    <InfoRow label="Passport no" value={application.passport_no} />
                    <InfoRow
                      label="Passport expiry"
                      value={
                        application.passport_expiry_date ||
                        application.applicant_info?.passport_expiry ||
                        "-"
                      }
                    />
                    <div className="col-12">
                      <div className="text-secondary small text-uppercase fw-semibold">Address</div>
                      <div className="fw-semibold">
                        {application.present_address || application.applicant_info?.address || "-"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-lg-4">
                <Card
                  title="Package info"
                  subtitle="Visa and travel context captured during submission."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="row g-3">
                    <InfoRow label="Country" value={application.country_name} />
                    <InfoRow label="Visa package" value={application.package_title} />
                    <InfoRow label="Visa type" value={application.visa_name} />
                    <InfoRow
                      label="Processing days"
                      value={application.processing_days_snapshot || "-"}
                    />
                    <InfoRow label="Travel date" value={application.travelDateLabel} />
                    <InfoRow label="Applied at" value={application.appliedAtLabel} />
                    <InfoRow label="Travel purpose" value={application.travel_purpose || "-"} />
                    <div className="col-12">
                      <div className="text-secondary small text-uppercase fw-semibold">
                        Package description
                      </div>
                      <div className="fw-semibold">{application.package_description || "-"}</div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-lg-4">
                <Card
                  title="Assignment info"
                  subtitle="Current ownership, payment state, and admin notes."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="row g-3">
                    <InfoRow label="Assigned officer" value={application.assigned_officer_name} />
                    <InfoRow label="User" value={application.user_name || "-"} />
                    <InfoRow label="User email" value={application.user_email || "-"} />
                    <InfoRow
                      label="Fee snapshot"
                      value={`${application.fee_snapshot || 0} ${application.currency_snapshot || ""}`}
                    />
                    <InfoRow label="Current status" value={application.statusLabel} />
                    <InfoRow label="Payment status" value={application.paymentStatusLabel} />
                    <div className="col-12">
                      <div className="text-secondary small text-uppercase fw-semibold">Admin note</div>
                      <div className="fw-semibold">{application.admin_note}</div>
                    </div>
                    <div className="col-12">
                      <div className="text-secondary small text-uppercase fw-semibold">
                        Required documents
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {application.required_documents?.length ? (
                          application.required_documents.map((document) => (
                            <Badge key={document.id} color="neutral">
                              {document.document_label}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-secondary small">No required documents listed.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Workflow actions"
              subtitle="Assign an officer, save admin notes, or move the application to the next status."
              className="trip-performance-card border-0"
            >
              {usersError ? (
                <div className="text-danger">
                  {usersError.message || "Unable to load officer options for workflow actions."}
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-12 col-lg-4">
                    <div className="border rounded-3 p-3 h-100">
                      <h3 className="h5 mb-3">Assign officer</h3>
                      <div className="mb-3">
                        <label className="form-label">Officer</label>
                        <select
                          className="form-select"
                          name="officerId"
                          value={assignmentData.officerId}
                          onChange={handleAssignmentChange}
                          disabled={isUsersLoading}
                        >
                          <option value="">Select officer</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="remarks"
                          value={assignmentData.remarks}
                          onChange={handleAssignmentChange}
                          placeholder="Enter remarks"
                        />
                      </div>
                      <Button onClick={handleAssign} isLoading={activeAction === "assign"}>
                        Assign officer
                      </Button>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="border rounded-3 p-3 h-100">
                      <h3 className="h5 mb-3">Admin update</h3>
                      <div className="mb-3">
                        <label className="form-label">Officer</label>
                        <select
                          className="form-select"
                          name="assignedTo"
                          value={adminUpdateData.assignedTo}
                          onChange={handleAdminUpdateChange}
                          disabled={isUsersLoading}
                        >
                          <option value="">Select officer</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Admin note</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="remarks"
                          value={adminUpdateData.remarks}
                          onChange={handleAdminUpdateChange}
                          placeholder="Enter remarks"
                        />
                      </div>
                      <Button onClick={handleAdminUpdate} isLoading={activeAction === "update"}>
                        Save admin update
                      </Button>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="border rounded-3 p-3 h-100">
                      <h3 className="h5 mb-3">Status update</h3>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={statusData.status}
                          onChange={handleStatusChange}
                        >
                          <option value="">Select status</option>
                          {VISA_APPLICATION_STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption.value} value={statusOption.value}>
                              {statusOption.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="remarks"
                          value={statusData.remarks}
                          onChange={handleStatusChange}
                          placeholder="Enter remarks"
                        />
                      </div>
                      <Button onClick={handleStatusUpdate} isLoading={activeAction === "status"}>
                        Update status
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </section>

          <section className="dashboard-section">
            <Card
              title="Documents"
              subtitle="Inspect uploaded files, adjust review status, and save each verification result."
              className="trip-performance-card border-0"
            >
              {application.documents?.length ? (
                <div className="table-responsive">
                  <table className="table table-vcenter card-table table-striped responsive-data-table">
                    <thead>
                      <tr>
                        <th>Document</th>
                        <th>Uploaded by</th>
                        <th>Status</th>
                        <th>Review</th>
                        <th>Updated</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {application.documents.map((document) => {
                        const review = documentReviews[document.id] ?? {
                          status: document.verification_status || "pending",
                          remarks: document.remarks || "",
                        };

                        return (
                          <tr key={document.id}>
                            <td data-label="Document">
                              <div className="fw-semibold">{document.documentLabel}</div>
                              <div className="text-secondary small">{document.originalName}</div>
                              <div className="text-secondary small">{document.sizeLabel}</div>
                            </td>
                            <td data-label="Uploaded by">
                              <div>{document.uploadedByName}</div>
                              <div className="text-secondary small">{document.createdAtLabel}</div>
                            </td>
                            <td data-label="Status">
                              <Badge color={getVisaStatusColor(document.verification_status)}>
                                {document.verificationStatusLabel}
                              </Badge>
                              {document.reviewedByName ? (
                                <div className="text-secondary small mt-1">By {document.reviewedByName}</div>
                              ) : null}
                            </td>
                            <td data-label="Review">
                              <div className="d-grid gap-2">
                                <select
                                  className="form-select form-select-sm"
                                  value={review.status}
                                  onChange={(event) =>
                                    handleDocumentReviewChange(document.id, "status", event.target.value)
                                  }
                                >
                                  {VISA_DOCUMENT_STATUS_OPTIONS.map((statusOption) => (
                                    <option key={statusOption.value} value={statusOption.value}>
                                      {statusOption.label}
                                    </option>
                                  ))}
                                </select>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows="2"
                                  value={review.remarks}
                                  onChange={(event) =>
                                    handleDocumentReviewChange(document.id, "remarks", event.target.value)
                                  }
                                  placeholder="Enter remarks"
                                />
                              </div>
                            </td>
                            <td data-label="Updated">{document.updatedAtLabel}</td>
                            <td data-label="Action">
                              <div className="d-flex flex-wrap gap-2">
                                {document.fileUrl ? (
                                  <a
                                    href={document.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline-primary btn-sm"
                                  >
                                    View file
                                  </a>
                                ) : null}
                                <Button
                                  className="btn-sm"
                                  onClick={() => handleVerifyDocument(document.id)}
                                  isLoading={activeAction === `document-${document.id}`}
                                >
                                  Verify
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-secondary">No documents uploaded yet.</div>
              )}
            </Card>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-lg-7">
                <Card
                  title="Status timeline"
                  subtitle="Review how the application moved between states."
                  className="trip-performance-card border-0 h-100"
                >
                  {application.status_logs?.length ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped responsive-data-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Changed by</th>
                            <th>Transition</th>
                            <th>Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {application.status_logs.map((log) => (
                            <tr key={log.id}>
                              <td data-label="Date">{log.createdAtLabel}</td>
                              <td data-label="Changed by">{log.changedByName}</td>
                              <td data-label="Transition">
                                <span className="text-secondary">{log.oldStatusLabel}</span>
                                {" -> "}
                                <span className="fw-semibold">{log.newStatusLabel}</span>
                              </td>
                              <td data-label="Note">{log.note || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-secondary">No status logs found.</div>
                  )}
                </Card>
              </div>

              <div className="col-12 col-lg-5">
                <Card
                  title="Payments"
                  subtitle="Review payment method, reference, and status history."
                  className="trip-performance-card border-0 h-100"
                >
                  {application.payments?.length ? (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table table-striped responsive-data-table">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Reference</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {application.payments.map((payment) => (
                            <tr key={payment.id}>
                              <td data-label="Amount">{payment.amountLabel}</td>
                              <td data-label="Method">{payment.methodLabel}</td>
                              <td data-label="Reference">{payment.referenceLabel}</td>
                              <td data-label="Status">
                                <Badge color={getPaymentStatusColor(payment.payment_status)}>
                                  {payment.statusLabel}
                                </Badge>
                              </td>
                              <td data-label="Date">{payment.createdAtLabel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-secondary">No payments found.</div>
                  )}
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
