import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { APP_ROUTES } from "./constants/routes";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ChangePasswordPage from "./features/account/pages/ChangePasswordPage";
import ProfilePage from "./features/account/pages/ProfilePage";
import LoginPage from "./features/auth/pages/LoginPage";
import BookingSummaryPage from "./features/bookingSummary/pages/BookingSummaryPage";
import CustomerValuePage from "./features/customerValue/pages/CustomerValuePage";
import DailyBalancePage from "./features/dailyBalance/pages/DailyBalancePage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import FinancialReportPage from "./features/financialReport/pages/FinancialReportPage";
import GuideEfficiencyPage from "./features/guideEfficiency/pages/GuideEfficiencyPage";
import MonthRunningBalancePage from "./features/monthRunningBalance/pages/MonthRunningBalancePage";
import TransactionsPage from "./features/transactions/pages/TransactionsPage";
import TripPerformancePage from "./features/tripPerformance/pages/TripPerformancePage";
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
          path={APP_ROUTES.monthRunningBalance}
          element={
            <ProtectedRoute>
              <MonthRunningBalancePage />
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
