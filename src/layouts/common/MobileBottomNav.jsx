import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { selectMenu } from "../../features/menu/store/menuSlice";
import { getBottomNavItems, getSupportedRoute } from "../../features/menu/utils/menuHelpers";
import { MenuIcon } from "../../features/menu/utils/menuIcons";
import { APP_ROUTES } from "../../constants/routes";

function MoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
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
  );
}

export default function MobileBottomNav({ onOpenDrawer }) {
  const menu = useSelector(selectMenu);
  const location = useLocation();
  const bottomNavItems = getBottomNavItems(menu);

  if (!bottomNavItems.length && menu.status !== "loading") {
    return null;
  }

  const getItemLabel = (item, supportedRoute) => {
    if (supportedRoute === APP_ROUTES.packages) {
      return "Packages";
    }

    if (supportedRoute === APP_ROUTES.bookings) {
      return "Booking";
    }

    if (supportedRoute === APP_ROUTES.transactions) {
      return "Txn";
    }

    return item.title?.replace(" Management", "") ?? "";
  };

  const isItemActive = (supportedRoute) => {
    if (!supportedRoute) {
      return false;
    }

    if (supportedRoute === APP_ROUTES.dashboard) {
      return location.pathname === APP_ROUTES.dashboard || location.pathname === "/admin/dashboard";
    }

    return location.pathname === supportedRoute || location.pathname.startsWith(`${supportedRoute}/`);
  };

  const renderItem = (item, index, variant = "") => {
    if (!item) {
      return <span key={`placeholder-${index}`} className="mobile-bottom-nav__item is-placeholder" />;
    }

    const supportedRoute = getSupportedRoute(item.path);
    const itemClasses = [
      "mobile-bottom-nav__item",
      variant === "center" ? "mobile-bottom-nav__item--center" : "",
      isItemActive(supportedRoute) ? "is-active" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const label = supportedRoute ? getItemLabel(item, supportedRoute) : item.title;

    if (supportedRoute) {
      return (
        <Link key={item.id} to={supportedRoute} className={itemClasses} aria-label={label} title={label}>
          <span className="mobile-bottom-nav__icon">
            <MenuIcon name={item.icon} size={22} />
          </span>
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={itemClasses}
        aria-label={label}
        title={label}
        onClick={() => toast.info(`${item.title} page is not available yet.`)}
      >
        <span className="mobile-bottom-nav__icon">
          <MenuIcon name={item.icon} size={22} />
        </span>
      </button>
    );
  };

  const leftItems = [bottomNavItems[0], bottomNavItems[1]];
  const centerItem = bottomNavItems[2];
  const rightItems = [bottomNavItems[3]];

  return (
    <nav className="mobile-bottom-nav d-md-none" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav__shell">
        <div className="mobile-bottom-nav__row">
          {leftItems.map(renderItem)}

          {renderItem(centerItem, 2, "center")}

          {rightItems.map(renderItem)}

          <button
            type="button"
            className="mobile-bottom-nav__item mobile-bottom-nav__item--drawer"
            aria-label="More"
            title="More"
            onClick={onOpenDrawer}
          >
            <span className="mobile-bottom-nav__icon">
              <MoreIcon />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
