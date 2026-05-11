import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { APP_ROUTES } from "./constants/routes";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ChangePasswordPage from "./features/account/pages/ChangePasswordPage";
import AccountBalancePage from "./features/accountBalance/pages/AccountBalancePage";
import AccountHistoryPage from "./features/accountHistory/pages/AccountHistoryPage";
import ProfilePage from "./features/account/pages/ProfilePage";
import AverageBookingValueReportPage from "./features/averageBookingValueReport/pages/AverageBookingValueReportPage";
import LoginPage from "./features/auth/pages/LoginPage";
import BlogEditorPage from "./features/blogs/pages/BlogEditorPage";
import BlogsPage from "./features/blogs/pages/BlogsPage";
import BookingSummaryPage from "./features/bookingSummary/pages/BookingSummaryPage";
import BookingInvoicePage from "./features/bookings/pages/BookingInvoicePage";
import BookingsPage from "./features/bookings/pages/BookingsPage";
import CustomerValuePage from "./features/customerValue/pages/CustomerValuePage";
import DailyBalancePage from "./features/dailyBalance/pages/DailyBalancePage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import FinancialReportPage from "./features/financialReport/pages/FinancialReportPage";
import GuideEfficiencyPage from "./features/guideEfficiency/pages/GuideEfficiencyPage";
import GuideFormPage from "./features/guides/pages/GuideFormPage";
import GuidesPage from "./features/guides/pages/GuidesPage";
import HighCancellationPackagesPage from "./features/highCancellationPackages/pages/HighCancellationPackagesPage";
import HotelFormPage from "./features/hotels/pages/HotelFormPage";
import HotelsPage from "./features/hotels/pages/HotelsPage";
import LowOccupancyReportPage from "./features/lowOccupancyReport/pages/LowOccupancyReportPage";
import LowPerformingPackagesPage from "./features/lowPerformingPackages/pages/LowPerformingPackagesPage";
import MonitoringPage from "./features/monitoring/pages/MonitoringPage";
import MonthRunningBalancePage from "./features/monthRunningBalance/pages/MonthRunningBalancePage";
import OverallSalesPage from "./features/overallSales/pages/OverallSalesPage";
import PackageCreatePage from "./features/packages/pages/PackageCreatePage";
import PackagesPage from "./features/packages/pages/PackagesPage";
import RefundStatusReportPage from "./features/refundStatusReport/pages/RefundStatusReportPage";
import RefundsPage from "./features/refunds/pages/RefundsPage";
import RoutesPage from "./features/routes/pages/RoutesPage";
import TransactionsPage from "./features/transactions/pages/TransactionsPage";
import TicketsPage from "./features/tickets/pages/TicketsPage";
import TripEditPage from "./features/trips/pages/TripEditPage";
import TripsPage from "./features/trips/pages/TripsPage";
import TripPerformancePage from "./features/tripPerformance/pages/TripPerformancePage";
import UserGrowthReportPage from "./features/userGrowthReport/pages/UserGrowthReportPage";
import VisaApplicationDetailsPage from "./features/visaApplications/pages/VisaApplicationDetailsPage";
import VisaApplicationsPage from "./features/visaApplications/pages/VisaApplicationsPage";
import VisaCountryFormPage from "./features/visaCountries/pages/VisaCountryFormPage";
import VisaCountriesPage from "./features/visaCountries/pages/VisaCountriesPage";
import VisaRequirementFormPage from "./features/visaRequirements/pages/VisaRequirementFormPage";
import VisaRequirementsPage from "./features/visaRequirements/pages/VisaRequirementsPage";
import VisaTypeFormPage from "./features/visaTypes/pages/VisaTypeFormPage";
import VisaTypesPage from "./features/visaTypes/pages/VisaTypesPage";
import VehiclesPage from "./features/vehicles/pages/VehiclesPage";
import VehicleWiseSeatReportPage from "./features/vehicleWiseSeatReport/pages/VehicleWiseSeatReportPage";
import VehicleTrackingReportPage from "./features/vehicleTrackingReport/pages/VehicleTrackingReportPage";
import { store } from "./store/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function ProtectedRoute({ children }) {
  const {
    auth: { isAuthenticated },
  } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const {
    auth: { isAuthenticated },
  } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.dashboard} replace />;
  }

  return children;
}

function AppRoutes() {
  const {
    auth: { isAuthenticated },
  } = useAuthContext();

  return (
    <>
      <Routes>
        <Route
          path={APP_ROUTES.accountBalance}
          element={
            <ProtectedRoute>
              <AccountBalancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.accountHistory}
          element={
            <ProtectedRoute>
              <AccountHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.averageBookingValueReport}
          element={
            <ProtectedRoute>
              <AverageBookingValueReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.blogList}
          element={
            <ProtectedRoute>
              <BlogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.blogCreate}
          element={
            <ProtectedRoute>
              <BlogEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.blogEdit}
          element={
            <ProtectedRoute>
              <BlogEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookings}
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookingInvoice}
          element={
            <ProtectedRoute>
              <BookingInvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.dashboard}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.changePassword}
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.tripPerformance}
          element={
            <ProtectedRoute>
              <TripPerformancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.transactions}
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.tickets}
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.guide}
          element={
            <ProtectedRoute>
              <GuidesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.guideCreate}
          element={
            <ProtectedRoute>
              <GuideFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.guideEdit}
          element={
            <ProtectedRoute>
              <GuideFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.vehicles}
          element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.trips}
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.tripCreate}
          element={
            <ProtectedRoute>
              <TripEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.tripEdit}
          element={
            <ProtectedRoute>
              <TripEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.bookingSummary}
          element={
            <ProtectedRoute>
              <BookingSummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.vehicleTrackingReport}
          element={
            <ProtectedRoute>
              <VehicleTrackingReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.customerValue}
          element={
            <ProtectedRoute>
              <CustomerValuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.dailyBalance}
          element={
            <ProtectedRoute>
              <DailyBalancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.overallSales}
          element={
            <ProtectedRoute>
              <OverallSalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.monitoring}
          element={
            <ProtectedRoute>
              <MonitoringPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.monthRunningBalance}
          element={
            <ProtectedRoute>
              <MonthRunningBalancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.packages}
          element={
            <ProtectedRoute>
              <PackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.packageCreate}
          element={
            <ProtectedRoute>
              <PackageCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.financialReport}
          element={
            <ProtectedRoute>
              <FinancialReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.guideEfficiency}
          element={
            <ProtectedRoute>
              <GuideEfficiencyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.hotel}
          element={
            <ProtectedRoute>
              <HotelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.hotelCreate}
          element={
            <ProtectedRoute>
              <HotelFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.hotelEdit}
          element={
            <ProtectedRoute>
              <HotelFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.highCancellationPackages}
          element={
            <ProtectedRoute>
              <HighCancellationPackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.lowOccupancyReport}
          element={
            <ProtectedRoute>
              <LowOccupancyReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.lowPerformingPackages}
          element={
            <ProtectedRoute>
              <LowPerformingPackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.refund}
          element={
            <ProtectedRoute>
              <RefundsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.refundStatusReport}
          element={
            <ProtectedRoute>
              <RefundStatusReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.routes}
          element={
            <ProtectedRoute>
              <RoutesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.userGrowthReport}
          element={
            <ProtectedRoute>
              <UserGrowthReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaApplications}
          element={
            <ProtectedRoute>
              <VisaApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaApplicationDetails}
          element={
            <ProtectedRoute>
              <VisaApplicationDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaCountries}
          element={
            <ProtectedRoute>
              <VisaCountriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaCountryCreate}
          element={
            <ProtectedRoute>
              <VisaCountryFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaCountryEdit}
          element={
            <ProtectedRoute>
              <VisaCountryFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaRequirements}
          element={
            <ProtectedRoute>
              <VisaRequirementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaRequirementCreate}
          element={
            <ProtectedRoute>
              <VisaRequirementFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaRequirementEdit}
          element={
            <ProtectedRoute>
              <VisaRequirementFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaTypes}
          element={
            <ProtectedRoute>
              <VisaTypesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaTypeCreate}
          element={
            <ProtectedRoute>
              <VisaTypeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.visaTypeEdit}
          element={
            <ProtectedRoute>
              <VisaTypeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.vehicleWiseSeatReport}
          element={
            <ProtectedRoute>
              <VehicleWiseSeatReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={APP_ROUTES.login}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? APP_ROUTES.dashboard : APP_ROUTES.login}
              replace
            />
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
