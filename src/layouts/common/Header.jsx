import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { APP_BRAND } from "../../constants/brand";
import { selectMenu } from "../../features/menu/store/menuSlice";

export default function Header({ onOpenDrawer }) {
  const { auth, logout } = useAuthContext();
  const { status } = useSelector(selectMenu);
  const userInitial = auth.user?.name?.charAt(0)?.toUpperCase() ?? "A";
  const roleLabel = auth.user?.role ?? "Administrator";
  const headerDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="navbar navbar-expand-md d-print-none app-header">
      <div className="container-xl app-header__container">
        <div className="app-header__top-row">
          <div className="app-header__brand-group">
            <button
              type="button"
              className="btn btn-outline-secondary app-header__menu-trigger"
              onClick={onOpenDrawer}
            >
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
                aria-hidden="true"
              >
                <path d="M4 8l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 16l16 0" />
              </svg>
              <span className="d-none d-sm-inline ms-2">
                {status === "loading" ? "Loading..." : "More"}
              </span>
            </button>

            <h1 className="navbar-brand navbar-brand-autodark mb-0 app-header__brand">
              <Link to="/" className="text-decoration-none app-header__brand-link">
                <img
                  src={APP_BRAND.logo}
                  width={110}
                  height={32}
                  alt={APP_BRAND.name}
                  className="navbar-brand-image"
                />
                <span className="d-md-none app-header__brand-copy">
                  <span className="app-header__brand-name">{APP_BRAND.shortName}</span>
                  <span className="app-header__brand-subtitle">Travel control</span>
                </span>
              </Link>
            </h1>
            <div className="d-none d-md-block">
              <div className="app-header__tagline">{APP_BRAND.tagline}</div>
            </div>
          </div>

          <div className="navbar-nav flex-row order-md-last app-header__actions">
            <div className="nav-item d-none d-md-flex me-3">
              <div className="btn-list">
                <span className="btn btn-ghost-secondary disabled">{roleLabel}</span>
              </div>
            </div>

            <div className="nav-item app-header__profile">
              <div className="app-header__user">
                <span className="avatar avatar-sm app-header__avatar">{userInitial}</span>
                <div className="app-header__user-copy">
                  <div className="app-header__user-name">{auth.user?.name ?? "Admin User"}</div>
                  <div className="app-header__user-email">{auth.user?.email ?? ""}</div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary app-header__logout"
                onClick={logout}
              >
                <span className="d-none d-sm-inline">Log out</span>
                <span className="d-inline d-sm-none">Exit</span>
              </button>
            </div>
          </div>
        </div>

        <div className="app-header__mobile-banner d-md-none">
          <div>
            <div className="app-header__mobile-eyebrow">Travel pulse</div>
            <div className="app-header__mobile-title">{APP_BRAND.tagline}</div>
          </div>
          <div className="app-header__mobile-meta">
            <span>{roleLabel}</span>
            <span>{headerDate}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
