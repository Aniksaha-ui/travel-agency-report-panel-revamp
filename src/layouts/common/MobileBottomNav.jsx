import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { selectMenu } from "../../features/menu/store/menuSlice";
import { getBottomNavItems, getSupportedRoute } from "../../features/menu/utils/menuHelpers";
import { MenuIcon } from "../../features/menu/utils/menuIcons";

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

  const renderItem = (item, index) => {
    if (!item) {
      return <span key={`placeholder-${index}`} className="mobile-bottom-nav__item is-placeholder" />;
    }

    const supportedRoute = getSupportedRoute(item.path);
    const itemClasses = `mobile-bottom-nav__item${
      supportedRoute && location.pathname === supportedRoute ? " is-active" : ""
    }`;

    if (supportedRoute) {
      return (
        <Link key={item.id} to={supportedRoute} className={itemClasses}>
          <span className="mobile-bottom-nav__icon">
            <MenuIcon name={item.icon} size={22} />
          </span>
          <span className="mobile-bottom-nav__label">{item.title}</span>
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={itemClasses}
        onClick={() => toast.info(`${item.title} page is not available yet.`)}
      >
        <span className="mobile-bottom-nav__icon">
          <MenuIcon name={item.icon} size={22} />
        </span>
        <span className="mobile-bottom-nav__label">{item.title}</span>
      </button>
    );
  };

  const leftItems = [bottomNavItems[0], bottomNavItems[1]];
  const rightItems = [bottomNavItems[2]];

  return (
    <nav className="mobile-bottom-nav d-md-none" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav__shell">
        <div className="mobile-bottom-nav__row">
          {leftItems.map(renderItem)}

          <button
            type="button"
            className="mobile-bottom-nav__fab"
            aria-label="Open all menus"
            onClick={onOpenDrawer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
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
          </button>

          {rightItems.map(renderItem)}

          <button
            type="button"
            className="mobile-bottom-nav__item mobile-bottom-nav__item--drawer"
            onClick={onOpenDrawer}
          >
            <span className="mobile-bottom-nav__icon">
              <MoreIcon />
            </span>
            <span className="mobile-bottom-nav__label">More</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
