import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../constants/routes";
import { useAuthContext } from "../../../contexts/AuthContext";
import AdminLayout from "../../../layouts/AdminLayout";
import Card from "../../../components/ui/Card";

export default function ProfilePage() {
  const { auth } = useAuthContext();
  const user = auth.user ?? {};
  const userInitial = user.name?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <AdminLayout>
      <div className="page-header d-print-none dashboard-page-header">
        <div className="container-xl">
          <div className="dashboard-desktop-hero">
            <div>
              <span className="dashboard-mobile-card__eyebrow">Account</span>
              <h2 className="page-title mb-2">Profile</h2>
              <p className="text-secondary mb-0">
                Review the currently signed-in administrator account details.
              </p>
            </div>
            <Link to={APP_ROUTES.changePassword} className="btn btn-primary">
              Change password
            </Link>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <Card className="border-0 h-100">
                <div className="account-profile-card">
                  <div className="account-profile-card__avatar">{userInitial}</div>
                  <div>
                    <h3 className="account-profile-card__name">{user.name ?? "Admin User"}</h3>
                    <div className="text-secondary">{user.role ?? "Administrator"}</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 col-lg-8">
              <Card
                title="Account information"
                subtitle="These values come from the active authentication session."
                className="border-0 h-100"
              >
                <div className="account-detail-grid">
                  <div className="account-detail-grid__item">
                    <span>Name</span>
                    <strong>{user.name ?? "Admin User"}</strong>
                  </div>
                  <div className="account-detail-grid__item">
                    <span>Email</span>
                    <strong>{user.email || "Not available"}</strong>
                  </div>
                  <div className="account-detail-grid__item">
                    <span>Role</span>
                    <strong>{user.role ?? "Administrator"}</strong>
                  </div>
                  <div className="account-detail-grid__item">
                    <span>Status</span>
                    <strong>Active session</strong>
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
