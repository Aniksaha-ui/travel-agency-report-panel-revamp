import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../contexts/AuthContext";
import { APP_BRAND } from "../../constants/brand";
import { APP_ROUTES } from "../../constants/routes";
import { selectMenu } from "../../features/menu/store/menuSlice";
import {
  getSupportedRoute,
  hasChildren,
} from "../../features/menu/utils/menuHelpers";
import { MenuIcon } from "../../features/menu/utils/menuIcons";
import { classNames } from "../../utils/classNames";
import { formatBoardDate } from "../../utils/dateUtils";

export default function Header({ onOpenDrawer }) {
  const { auth, logout } = useAuthContext();
  const { mainMenuItems, bottomMenuItems, status } = useSelector(selectMenu);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState(null);
  const accountMenuRef = useRef(null);
  const desktopNavRef = useRef(null);
  const userInitial = auth.user?.name?.charAt(0)?.toUpperCase() ?? "A";
  const roleLabel = auth.user?.role ?? "Administrator";
  const accountSubtitle = auth.user?.email || roleLabel;
  const headerDate = formatBoardDate();

  useEffect(() => {
    if (!isAccountMenuOpen && !openDesktopMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }

      if (
        desktopNavRef.current &&
        !desktopNavRef.current.contains(event.target)
      ) {
        setOpenDesktopMenu(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
        setOpenDesktopMenu(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen, openDesktopMenu]);

  const closeAccountMenu = () => {
    setIsAccountMenuOpen(false);
  };

  const closeDesktopMenu = () => {
    setOpenDesktopMenu(null);
  };

  const handleLogout = () => {
    closeAccountMenu();
    logout();
  };

  const handleUnavailableMenu = (title) => {
    closeDesktopMenu();
    toast.info(`${title} page is not available yet.`);
  };

  const toggleDesktopMenu = (item, event) => {
    if (!desktopNavRef.current) {
      return;
    }

    if (openDesktopMenu?.id === item.id) {
      setOpenDesktopMenu(null);
      return;
    }

    const navRect = desktopNavRef.current.getBoundingClientRect();
    const triggerRect = event.currentTarget.getBoundingClientRect();
    const rootFontSize =
      parseFloat(window.getComputedStyle(document.documentElement).fontSize) ||
      16;
    const flyoutWidth = Math.min(
      rootFontSize * 44,
      window.innerWidth - rootFontSize * 2,
    );
    const triggerLeft = triggerRect.left - navRect.left;
    const maxLeft = Math.max(
      0,
      window.innerWidth - navRect.left - flyoutWidth - rootFontSize,
    );

    setOpenDesktopMenu({
      id: item.id,
      title: item.title,
      children: item.children ?? [],
      left: Math.min(Math.max(0, triggerLeft), maxLeft),
      top: triggerRect.bottom - navRect.top + 8,
    });
  };

  const renderDesktopDropdownItems = (items) =>
    items.map((item) => {
      const supportedRoute = getSupportedRoute(item.path);

      if (supportedRoute) {
        return (
          <NavLink
            key={`${item.id}-${supportedRoute}`}
            to={supportedRoute}
            className={({ isActive }) =>
              classNames(
                "app-header__desktop-dropdown-item",
                isActive && "active",
              )
            }
            onClick={closeDesktopMenu}
          >
            <span className="app-header__desktop-dropdown-icon">
              <MenuIcon name={item.icon} size={16} />
            </span>
            <span>{item.title}</span>
          </NavLink>
        );
      }

      return (
        <button
          key={item.id}
          type="button"
          className="app-header__desktop-dropdown-item"
          onClick={() => handleUnavailableMenu(item.title)}
        >
          <span className="app-header__desktop-dropdown-icon">
            <MenuIcon name={item.icon} size={16} />
          </span>
          <span>{item.title}</span>
        </button>
      );
    });

  const renderDesktopMenuItem = (item, rowVariant = "primary") => {
    const supportedRoute = getSupportedRoute(item.path);
    const itemHasChildren = hasChildren(item);
    const isOpen = openDesktopMenu?.id === item.id;

    if (itemHasChildren) {
      return (
        <div key={item.id} className="app-header__desktop-item-wrap">
          <button
            type="button"
            className={classNames(
              "app-header__desktop-item",
              rowVariant === "secondary" &&
                "app-header__desktop-item--secondary",
              isOpen && "is-open",
            )}
            onClick={(event) => toggleDesktopMenu(item, event)}
            aria-expanded={isOpen}
            aria-haspopup="menu"
          >
            <span className="app-header__desktop-item-icon">
              <MenuIcon name={item.icon} size={16} />
            </span>
            <span>{item.title}</span>
            <span className="app-header__desktop-item-caret" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </span>
          </button>
        </div>
      );
    }

    if (supportedRoute) {
      return (
        <NavLink
          key={`${item.id}-${supportedRoute}`}
          to={supportedRoute}
          end={supportedRoute === APP_ROUTES.dashboard}
          className={({ isActive }) =>
            classNames(
              "app-header__desktop-item",
              rowVariant === "secondary" &&
                "app-header__desktop-item--secondary",
              isActive && "active",
            )
          }
        >
          <span className="app-header__desktop-item-icon">
            <MenuIcon name={item.icon} size={16} />
          </span>
          <span>{item.title}</span>
        </NavLink>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={classNames(
          "app-header__desktop-item",
          rowVariant === "secondary" && "app-header__desktop-item--secondary",
        )}
        onClick={() => handleUnavailableMenu(item.title)}
      >
        <span className="app-header__desktop-item-icon">
          <MenuIcon name={item.icon} size={16} />
        </span>
        <span>{item.title}</span>
      </button>
    );
  };

  return (
    <header className="navbar navbar-expand-md d-print-none app-header">
      <div className="container-xl app-header__container">
        <div className="app-header__top-row">
          <div className="app-header__brand-group">
            <button
              type="button"
              className="btn btn-outline-secondary app-header__menu-trigger d-md-none"
              onClick={onOpenDrawer}
              aria-label="Open navigation menu"
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
              <Link
                to="/"
                className="text-decoration-none app-header__brand-link"
              >
                <img
                  src={APP_BRAND.logo}
                  width={110}
                  height={32}
                  alt={APP_BRAND.name}
                  className="navbar-brand-image"
                />
                <span className="d-md-none app-header__brand-copy">
                  <span className="app-header__brand-name">
                    {APP_BRAND.shortName}
                  </span>
                  <span className="app-header__brand-subtitle">
                    Travel control
                  </span>
                </span>
              </Link>
            </h1>
            <div className="d-none d-md-block">
              <div className="app-header__tagline">{APP_BRAND.tagline}</div>
            </div>
          </div>

          <div className="navbar-nav flex-row order-md-last app-header__actions">
            <div className="app-header__role-copy d-none d-md-flex">
              {roleLabel.toLowerCase()}
            </div>
            <div className="nav-item app-header__profile" ref={accountMenuRef}>
              <button
                type="button"
                className="app-header__account-button"
                onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <span className="avatar avatar-sm app-header__avatar">
                  {userInitial}
                </span>
                <span className="app-header__user-copy">
                  <span className="app-header__user-name">
                    {auth.user?.name ?? "Admin User"}
                  </span>
                  <span className="app-header__user-email">
                    {accountSubtitle}
                  </span>
                </span>
                <span className="app-header__account-caret" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6l6 -6" />
                  </svg>
                </span>
              </button>

              {isAccountMenuOpen ? (
                <div className="app-header__account-menu" role="menu">
                  <div className="app-header__account-card">
                    <span className="avatar avatar-sm app-header__avatar">
                      {userInitial}
                    </span>
                    <div>
                      <div className="app-header__account-name">
                        {auth.user?.name ?? "Admin User"}
                      </div>
                      <div className="app-header__account-email">
                        {auth.user?.email ?? ""}
                      </div>
                      <div className="app-header__account-role">
                        {roleLabel}
                      </div>
                    </div>
                  </div>

                  <div className="app-header__account-links">
                    <NavLink
                      to={APP_ROUTES.profile}
                      className="app-header__account-link"
                      onClick={closeAccountMenu}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to={APP_ROUTES.changePassword}
                      className="app-header__account-link"
                      onClick={closeAccountMenu}
                    >
                      Change password
                    </NavLink>
                    <NavLink
                      to={APP_ROUTES.dashboard}
                      end
                      className="app-header__account-link"
                      onClick={closeAccountMenu}
                    >
                      Dashboard
                    </NavLink>
                  </div>

                  <button
                    type="button"
                    className="app-header__account-logout"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <nav
          ref={desktopNavRef}
          className="app-header__desktop-nav d-none d-md-flex"
          aria-label="Primary navigation"
        >
          {status === "loading" ? (
            <div className="app-header__desktop-nav-state">Loading menu...</div>
          ) : (
            <>
              {mainMenuItems.length ? (
                <div className="app-header__desktop-nav-scroll">
                  <div className="app-header__desktop-nav-row">
                    {mainMenuItems.map((item) =>
                      renderDesktopMenuItem(item, "primary"),
                    )}
                  </div>
                </div>
              ) : null}

              {bottomMenuItems.length ? (
                <div className="app-header__desktop-nav-scroll">
                  <div className="app-header__desktop-nav-row app-header__desktop-nav-row--secondary">
                    {bottomMenuItems.map((item) =>
                      renderDesktopMenuItem(item, "secondary"),
                    )}
                  </div>
                </div>
              ) : null}

              {openDesktopMenu?.children?.length ? (
                <div
                  className="app-header__desktop-flyout"
                  role="menu"
                  aria-label={openDesktopMenu.title}
                  style={{
                    left: `${openDesktopMenu.left}px`,
                    top: `${openDesktopMenu.top}px`,
                  }}
                >
                  {renderDesktopDropdownItems(openDesktopMenu.children)}
                </div>
              ) : null}

              {!mainMenuItems.length && !bottomMenuItems.length ? (
                <div className="app-header__desktop-nav-state">
                  Menu items will appear here once available.
                </div>
              ) : null}
            </>
          )}
        </nav>

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
