import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { APP_ROUTES } from "./constants/routes";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoginPage from "./features/auth/pages/LoginPage";
import CustomerValuePage from "./features/customerValue/pages/CustomerValuePage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import GuideEfficiencyPage from "./features/guideEfficiency/pages/GuideEfficiencyPage";
import MonthRunningBalancePage from "./features/monthRunningBalance/pages/MonthRunningBalancePage";
import TripPerformancePage from "./features/tripPerformance/pages/TripPerformancePage";
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
          path={APP_ROUTES.tripPerformance}
          element={
            <ProtectedRoute>
              <TripPerformancePage />
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
          path={APP_ROUTES.monthRunningBalance}
          element={
            <ProtectedRoute>
              <MonthRunningBalancePage />
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
