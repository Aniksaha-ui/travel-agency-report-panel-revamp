import { startTransition, useDeferredValue, useState } from "react";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatTravelDate } from "../../../utils/dateUtils";
import MetricsOverview from "../components/MetricsOverview";
import { DASHBOARD_COPY } from "../constants/dashboard.constants";
import useDashboard from "../hooks/useDashboard";

const STATUS_PROGRESS = {
  confirmed: 100,
  pending: 48,
  "awaiting-payment": 30,
};

const renderProgress = (booking) => {
  const progress = STATUS_PROGRESS[booking.status] ?? 0;
  const statusLabel = String(booking.status ?? "unknown").replaceAll("-", " ");

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center justify-content-between gap-2">
        <span className="fw-semibold">{progress}%</span>
        <span className="text-secondary small text-uppercase">{statusLabel}</span>
      </div>
      <div className="progress" style={{ height: "0.55rem" }}>
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progress}% Complete`}
        >
          <span className="visually-hidden">{progress}% Complete</span>
        </div>
      </div>
    </div>
  );
};

const bookingColumns = [
  {
    key: "traveler",
    header: "Traveler",
    render: (booking) => (
      <div>
        <div className="fw-semibold">{booking.traveler}</div>
        <div className="text-secondary small">{booking.id}</div>
      </div>
    ),
  },
  { key: "destination", header: "Destination" },
  { key: "agent", header: "Assigned agent", mobileLabel: "Agent" },
  {
    key: "departureDate",
    header: "Departure",
    render: (booking) => formatTravelDate(booking.departureDate),
  },
  {
    key: "amount",
    header: "Amount",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "status",
    header: "Progress",
    render: renderProgress,
  },
];

const parseCurrencyValue = (value) => Number(String(value ?? "").replace(/[^0-9.]/g, "")) || 0;
const formatStatusLabel = (status) => String(status ?? "unknown").replaceAll("-", " ");
const formatMobileDate = (value) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const copy = data?.copy ?? DASHBOARD_COPY;
  const metrics = data?.metrics ?? [];
  const bookings = data?.recentBookings ?? [];

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setSearchTerm(value);
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const normalizedSearch = deferredSearchTerm.toLowerCase();
    return (
      String(booking.traveler ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(booking.destination ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(booking.id ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  const confirmedCount = bookings.filter((booking) => booking.status === "confirmed").length;
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const awaitingCount = bookings.filter((booking) => booking.status === "awaiting-payment").length;
  const totalRevenue = bookings.reduce(
    (runningTotal, booking) => runningTotal + parseCurrencyValue(booking.amount),
    0
  );
  const mobileMetrics = metrics.slice(0, 3);
  const mobileFlow = filteredBookings.slice(0, 4);
  const mobileUpcoming = filteredBookings.slice(0, 2);
  const mobileSpotlightMetric = mobileMetrics[0];
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="d-md-none dashboard-mobile-app">
        <div className="container-xl">
          <div className="dashboard-mobile-app__screen">
            <section className="dashboard-mobile-card dashboard-mobile-card--hero">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__eyebrow">Travel command</div>
                  <h2 className="dashboard-mobile-card__title">{copy.pageTitle}</h2>
                  <p className="dashboard-mobile-hero__subtitle">
                    A mobile control board for bookings, approvals, and departures.
                  </p>
                </div>
                <span className="dashboard-mobile-card__more">{boardDate}</span>
              </div>

              <label className="dashboard-mobile-search">
                <span className="dashboard-mobile-search__icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                  </svg>
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search travelers or destinations"
                  aria-label="Search travelers or destinations"
                />
              </label>

              <div className="dashboard-mobile-spotlight">
                <div>
                  <div className="dashboard-mobile-spotlight__label">Revenue in focus</div>
                  <div className="dashboard-mobile-spotlight__value">
                    {mobileSpotlightMetric?.value ?? `$${totalRevenue.toLocaleString()}`}
                  </div>
                  <div className="dashboard-mobile-spotlight__meta">
                    {mobileSpotlightMetric?.change ?? `${bookings.length} bookings tracked today`}
                  </div>
                </div>
                <div className="dashboard-mobile-spotlight__stack">
                  <span>{confirmedCount} confirmed</span>
                  <span>{pendingCount} pending</span>
                </div>
              </div>

              <div className="dashboard-mobile-metrics">
                {mobileMetrics.map((metric) => (
                  <article
                    key={metric.id}
                    className={`dashboard-mobile-metric dashboard-mobile-metric--${metric.changeTone ?? "info"}`}
                  >
                    <div className="dashboard-mobile-metric__badge">{metric.label.charAt(0)}</div>
                    <div className="dashboard-mobile-metric__label">{metric.label}</div>
                    <div className="dashboard-mobile-metric__value">{metric.value}</div>
                    <div className="dashboard-mobile-metric__change">{metric.change}</div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-mobile-card dashboard-mobile-card--soft">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">Upcoming departures</div>
                  <div className="dashboard-mobile-card__subtle">Closest traveler movements</div>
                </div>
                <div className="dashboard-mobile-pill">{mobileUpcoming.length} trips</div>
              </div>

              <div className="dashboard-mobile-upcoming">
                {mobileUpcoming.length ? (
                  mobileUpcoming.map((booking) => (
                    <article key={booking.id} className="dashboard-mobile-upcoming__item">
                      <div className="dashboard-mobile-upcoming__avatar">
                        {booking.traveler.charAt(0)}
                      </div>
                      <div className="dashboard-mobile-upcoming__content">
                        <div className="dashboard-mobile-upcoming__topline">
                          <span className="dashboard-mobile-upcoming__name">{booking.traveler}</span>
                          <span className={`dashboard-mobile-status dashboard-mobile-status--${booking.status}`}>
                            {formatStatusLabel(booking.status)}
                          </span>
                        </div>
                        <div className="dashboard-mobile-upcoming__meta">
                          {booking.destination} • {formatMobileDate(booking.departureDate)}
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="dashboard-mobile-empty">No trips match that search yet.</div>
                )}
              </div>
            </section>

            <section className="dashboard-mobile-card">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">Booking flow</div>
                  <div className="dashboard-mobile-card__subtle">Live travel activity</div>
                </div>
                <div className="dashboard-mobile-pill">{filteredBookings.length} active</div>
              </div>

              <div className="dashboard-mobile-curve">
                <span className="dashboard-mobile-curve__line dashboard-mobile-curve__line--primary" />
                <span className="dashboard-mobile-curve__line dashboard-mobile-curve__line--secondary" />
                <span className="dashboard-mobile-curve__glow" />
              </div>

              <div className="dashboard-mobile-flow">
                {mobileFlow.map((booking) => (
                  <div key={booking.id} className="dashboard-mobile-flow__item">
                    <div className="dashboard-mobile-flow__traveler">
                      <div className="dashboard-mobile-flow__avatar">{booking.traveler.charAt(0)}</div>
                      <div>
                        <div className="dashboard-mobile-flow__title">{booking.traveler}</div>
                        <div className="dashboard-mobile-flow__meta">
                          {booking.destination} • {booking.agent}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-mobile-flow__aside">
                      <div className="dashboard-mobile-flow__value">{booking.amount}</div>
                      <div className={`dashboard-mobile-status dashboard-mobile-status--${booking.status}`}>
                        {formatStatusLabel(booking.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-mobile-totals">
                <div>
                  <div className="dashboard-mobile-totals__value">{confirmedCount}</div>
                  <div className="dashboard-mobile-totals__label">Confirmed</div>
                </div>
                <div>
                  <div className="dashboard-mobile-totals__value">{pendingCount}</div>
                  <div className="dashboard-mobile-totals__label">Pending</div>
                </div>
                <div>
                  <div className="dashboard-mobile-totals__value">{awaitingCount}</div>
                  <div className="dashboard-mobile-totals__label">Awaiting</div>
                </div>
              </div>
            </section>

            <section className="dashboard-mobile-card">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">Revenue pool</div>
                  <div className="dashboard-mobile-card__subtle">Today&apos;s quick summary</div>
                </div>
              </div>

              <div className="dashboard-mobile-pool">
                <div className="dashboard-mobile-pool__item">
                  <span className="dashboard-mobile-pool__dot dashboard-mobile-pool__dot--green" />
                  <div>
                    <div className="dashboard-mobile-pool__value">${totalRevenue.toLocaleString()}</div>
                    <div className="dashboard-mobile-pool__label">Visible revenue</div>
                  </div>
                </div>
                <div className="dashboard-mobile-pool__item">
                  <span className="dashboard-mobile-pool__dot dashboard-mobile-pool__dot--blue" />
                  <div>
                    <div className="dashboard-mobile-pool__value">{bookings.length}</div>
                    <div className="dashboard-mobile-pool__label">Tracked bookings</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-mobile-progress">
                <div className="dashboard-mobile-progress__header">
                  <span>Collection pace</span>
                  <span>78%</span>
                </div>
                <div className="dashboard-mobile-progress__bar">
                  <span className="dashboard-mobile-progress__fill" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="d-none d-md-block">
        <div className="page-header d-print-none dashboard-page-header">
          <div className="container-xl">
            <div className="row g-3 align-items-center">
              <div className="col">
                <div className="dashboard-heading">
                  <span className="dashboard-heading__eyebrow">Overview</span>
                  <h2 className="page-title">{copy.pageTitle}</h2>
                  <p className="text-secondary mb-0">
                    {copy.pageSubtitle || "A quick snapshot of bookings, revenue, and trip activity."}
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-auto">
                <div className="dashboard-toolbar">
                  <Button fullWidthOnMobile>New booking</Button>
                  <Button variant="outline" fullWidthOnMobile>
                    Export summary
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            <section className="dashboard-section">
              <MetricsOverview metrics={metrics} />
            </section>

            <section className="dashboard-section">
              <Card
                title="Recent bookings"
                subtitle="Search and review the latest traveler activity across your team."
                className="dashboard-table-card border-0"
                bodyClassName="p-0"
                actions={
                  <div className="dashboard-search">
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                          <path d="M21 21l-6 -6" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search bookings"
                        aria-label="Search bookings"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                }
              >
                {isLoading ? (
                  <div className="p-4 text-center text-secondary">Loading dashboard data...</div>
                ) : (
                  <Table
                    columns={bookingColumns}
                    data={filteredBookings}
                    emptyTitle="No matching bookings"
                    emptyDescription="Try a different traveler, destination, or booking ID."
                  />
                )}
              </Card>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
