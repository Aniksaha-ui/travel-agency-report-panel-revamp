import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { classNames } from "../../utils/classNames";
import { selectMenu } from "../../features/menu/store/menuSlice";
import { hasChildren, getSupportedRoute } from "../../features/menu/utils/menuHelpers";
import { MenuIcon } from "../../features/menu/utils/menuIcons";

function NavItem({ item, location }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supportedRoute = getSupportedRoute(item.path);
  const active = supportedRoute ? location.pathname === supportedRoute : false;
  const isDropdown = hasChildren(item);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuAction = (e) => {
    if (isDropdown) {
      e.preventDefault();
      setIsOpen(!isOpen);
      return;
    }

    if (!supportedRoute) {
      e.preventDefault();
      toast.info(`${item.title} page is not available yet.`);
    }
  };

  if (isDropdown) {
    const childChunks = [];
    if (item.children.length > 10) {
      const chunkSize = Math.ceil(item.children.length / 2);
      for (let i = 0; i < item.children.length; i += chunkSize) {
        childChunks.push(item.children.slice(i, i + chunkSize));
      }
    } else {
      childChunks.push(item.children);
    }

    const renderChild = (child) => {
      const childSupportedRoute = getSupportedRoute(child.path);
      const childActive = childSupportedRoute ? location.pathname === childSupportedRoute : false;
      const childContent = (
        <span className="d-flex align-items-center w-100">
          <span className="dropdown-item-icon d-flex align-items-center justify-content-center me-2 text-muted">
            <MenuIcon name={child.icon} size={18} />
          </span>
          <span className="text-truncate">{child.title}</span>
        </span>
      );

      return childSupportedRoute ? (
        <Link
          key={child.id}
          to={childSupportedRoute}
          className={classNames("dropdown-item", childActive && "active")}
          onClick={() => setIsOpen(false)}
        >
          {childContent}
        </Link>
      ) : (
        <button
          key={child.id}
          className="dropdown-item"
          onClick={() => {
            toast.info(`${child.title} page is not available yet.`);
            setIsOpen(false);
          }}
        >
          {childContent}
        </button>
      );
    };

    return (
      <li 
        ref={dropdownRef}
        className={classNames("nav-item dropdown", active && "active", isOpen && "show")}
      >
        <a
          className="nav-link dropdown-toggle"
          href="#navbar-base"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          role="button"
          aria-expanded={isOpen}
          onClick={handleMenuAction}
        >
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <MenuIcon name={item.icon} size={18} />
          </span>
          <span className="nav-link-title">{item.title}</span>
        </a>
        <div 
          className={classNames("dropdown-menu", isOpen && "show")}
          style={{ 
            maxHeight: 'calc(100vh - 12rem)', 
            overflowY: 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '100%',
            marginTop: '0.25rem'
          }}
        >
          <div className="dropdown-menu-columns">
            {childChunks.map((chunk, index) => (
              <div key={index} className="dropdown-menu-column">
                {chunk.map(renderChild)}
              </div>
            ))}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={classNames("nav-item", active && "active")}>
      {supportedRoute ? (
        <Link className="nav-link" to={supportedRoute}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <MenuIcon name={item.icon} size={18} />
          </span>
          <span className="nav-link-title">{item.title}</span>
        </Link>
      ) : (
        <button className="nav-link bg-transparent border-0 text-start w-100" onClick={handleMenuAction}>
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            <MenuIcon name={item.icon} size={18} />
          </span>
          <span className="nav-link-title">{item.title}</span>
        </button>
      )}
    </li>
  );
}

export default function DesktopNav() {
  const { mainMenuItems, bottomMenuItems, status } = useSelector(selectMenu);
  const location = useLocation();

  if (status !== "succeeded") {
    return null;
  }

  const allItems = [...mainMenuItems, ...bottomMenuItems];

  return (
    <header className="navbar-expand-md d-none d-md-block bg-white border-bottom">
      <div className="collapse navbar-collapse" id="navbar-menu">
        <div className="navbar navbar-light">
          <div className="container-xl">
            <ul className="navbar-nav flex-wrap" style={{ gap: '0.15rem' }}>
              {allItems.map((item) => (
                <NavItem key={item.id} item={item} location={location} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
