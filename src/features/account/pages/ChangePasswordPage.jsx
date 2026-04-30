import AdminLayout from "../../../layouts/AdminLayout";
import Card from "../../../components/ui/Card";

export default function ChangePasswordPage() {
  return (
    <AdminLayout>
      <div className="page-header d-print-none dashboard-page-header">
        <div className="container-xl">
          <div className="dashboard-desktop-hero">
            <div>
              <span className="dashboard-mobile-card__eyebrow">Security</span>
              <h2 className="page-title mb-2">Change password</h2>
              <p className="text-secondary mb-0">
                Password update UI is ready for the account security endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <Card
                title="Update password"
                subtitle="Connect the password API endpoint here when it is available."
                className="border-0"
              >
                <form className="account-form">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="current-password">
                      Current password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="new-password">
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      disabled
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="confirm-password">
                      Confirm password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      disabled
                    />
                  </div>
                  <button type="button" className="btn btn-primary" disabled>
                    Save password
                  </button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
