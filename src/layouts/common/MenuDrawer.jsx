import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../contexts/AuthContext";
import { classNames } from "../../utils/classNames";
import { selectMenu } from "../../features/menu/store/menuSlice";
import { hasChildren, getSupportedRoute } from "../../features/menu/utils/menuHelpers";
import { MenuIcon } from "../../features/menu/utils/menuIcons";

function ChevronIcon({ expanded }) {
  return (
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
      className={classNames("app-drawer__chevron", expanded && "is-expanded")}
      aria-hidden="true"
    >
      <path d="M9 6l6 6l-6 6" />
    </svg>
  );
}

function DrawerSection({ items, location, onClose }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (itemId) => {
    setExpandedItems((currentItems) => ({
      ...currentItems,
      [itemId]: !currentItems[itemId],
    }));
  };

  const handleMenuAction = (item) => {
    if (hasChildren(item)) {
      toggleExpanded(item.id);
      return;
    }

    toast.info(`${item.title} page is not available yet.`);
    onClose();
  };

  const renderItems = (menuItems, level = 0) =>
    menuItems.map((item) => {
      const supportedRoute = getSupportedRoute(item.path);
      const expanded = Boolean(expandedItems[item.id]);
      const active = supportedRoute ? location.pathname === supportedRoute : false;

      return (
        <div key={item.id} className="app-drawer__item-wrap">
          {supportedRoute ? (
            <Link
              to={supportedRoute}
              onClick={onClose}
              className={classNames("app-drawer__item", active && "is-active")}
              style={{ "--drawer-level": level }}
            >
              <span className="app-drawer__item-icon">
                <MenuIcon name={item.icon} size={18} />
              </span>
              <span className="app-drawer__item-label">{item.title}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleMenuAction(item)}
              className={classNames("app-drawer__item", expanded && "is-expanded")}
              style={{ "--drawer-level": level }}
            >
              <span className="app-drawer__item-icon">
                <MenuIcon name={item.icon} size={18} />
              </span>
              <span className="app-drawer__item-label">{item.title}</span>
              {hasChildren(item) ? <ChevronIcon expanded={expanded} /> : null}
            </button>
          )}

          {hasChildren(item) && expanded ? (
            <div className="app-drawer__children">{renderItems(item.children, level + 1)}</div>
          ) : null}
        </div>
      );
    });

  return <div className="app-drawer__list">{renderItems(items)}</div>;
}

export default function MenuDrawer({ open, onClose }) {
  const { auth, logout } = useAuthContext();
  const { mainMenuItems, bottomMenuItems, status, error } = useSelector(selectMenu);
  const location = useLocation();
  const userInitial = auth.user?.name?.charAt(0)?.toUpperCase() ?? "A";

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className={classNames("app-drawer", open && "is-open")}>
      <button
        type="button"
        className="app-drawer__backdrop"
        aria-label="Close menu drawer"
        onClick={onClose}
      />
      <aside className="app-drawer__panel" aria-hidden={!open}>
        <div className="app-drawer__header">
          <div>
            <div className="app-drawer__eyebrow">Mobile Navigation</div>
            <h3 className="app-drawer__title">Menu</h3>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm app-drawer__close"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="app-drawer__body">
          <section className="app-drawer__account">
            <div className="app-drawer__account-avatar">{userInitial}</div>
            <div className="app-drawer__account-copy">
              <div className="app-drawer__account-name">{auth.user?.name ?? "Admin User"}</div>
              <div className="app-drawer__account-email">{auth.user?.email ?? ""}</div>
              <div className="app-drawer__account-role">{auth.user?.role ?? "Administrator"}</div>
            </div>
            <button type="button" className="btn btn-primary btn-sm app-drawer__logout" onClick={handleLogout}>
              Log out
            </button>
          </section>

          {status === "loading" ? (
            <div className="app-drawer__state">Loading menu items...</div>
          ) : status === "failed" ? (
            <div className="app-drawer__state">{error || "Unable to load menu items."}</div>
          ) : (
            <>
              <section className="app-drawer__section">
                <div className="app-drawer__section-title">Main menu</div>
                <DrawerSection items={mainMenuItems} location={location} onClose={onClose} />
              </section>

              <section className="app-drawer__section">
                <div className="app-drawer__section-title">More tools</div>
                <DrawerSection items={bottomMenuItems} location={location} onClose={onClose} />
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
