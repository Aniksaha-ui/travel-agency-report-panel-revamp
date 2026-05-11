import Badge from "../../../components/common/Badge";
import { getPaymentStatusColor, getVisaStatusColor } from "../constants/visaApplications.constants";

export const getVisaApplicationColumns = (onViewApplication) => [
  {
    key: "applicationNo",
    header: "Application",
    render: (application) => (
      <div>
        <div className="fw-semibold">{application.applicationNo}</div>
        <div className="text-secondary small">Passport {application.passportNo}</div>
      </div>
    ),
  },
  {
    key: "fullName",
    header: "Applicant",
    render: (application) => (
      <div>
        <div className="fw-semibold">{application.fullName}</div>
        <div className="text-secondary small">{application.email}</div>
      </div>
    ),
  },
  {
    key: "packageTitle",
    header: "Package",
    render: (application) => (
      <div>
        <div>{application.packageTitle}</div>
        <div className="text-secondary small">{application.visaType}</div>
      </div>
    ),
  },
  {
    key: "countryName",
    header: "Country",
    mobileLabel: "Country",
  },
  {
    key: "statusLabel",
    header: "Status",
    mobileLabel: "Status",
    render: (application) => (
      <Badge color={getVisaStatusColor(application.status)}>{application.statusLabel}</Badge>
    ),
  },
  {
    key: "paymentStatusLabel",
    header: "Payment",
    mobileLabel: "Payment",
    render: (application) => (
      <Badge color={getPaymentStatusColor(application.paymentStatus)}>
        {application.paymentStatusLabel}
      </Badge>
    ),
  },
  {
    key: "assignedOfficerName",
    header: "Assigned officer",
    mobileLabel: "Assigned officer",
  },
  {
    key: "createdAtLabel",
    header: "Submitted",
    mobileLabel: "Submitted",
  },
  {
    key: "actions",
    header: "Action",
    mobileLabel: "Action",
    render: (application) => (
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={() => onViewApplication(application)}
      >
        View
      </button>
    ),
  },
];
