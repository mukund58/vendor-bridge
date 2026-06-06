import { NavLink } from 'react-router-dom';
import { navigationItems } from '../data/navigation';
import { FiX, FiActivity } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop d-lg-none" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar glass border-end border-light ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-between p-4 border-bottom border-light">
          <div className="d-flex align-items-center gap-2">
            <div className="logo-icon-wrapper d-flex align-items-center justify-content-center">
              <FiActivity className="logo-icon fs-4 text-primary" />
            </div>
            <span className="logo-text fw-bold fs-5 tracking-wide">
              Vendor<span className="text-primary">Bridge</span>
            </span>
          </div>
          <button 
            type="button" 
            className="btn-close-sidebar d-lg-none btn border-0 p-0 text-white" 
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <div className="sidebar-menu flex-grow-1 p-3">
          <nav className="nav flex-column gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    // Close sidebar on mobile after clicking a link
                    if (window.innerWidth < 992) {
                      toggleSidebar();
                    }
                  }}
                  className={({ isActive }) =>
                    `sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${
                      isActive ? 'active' : ''
                    }`
                  }
                >
                  <Icon className="menu-icon" size={18} />
                  <span className="menu-label font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Branding */}
        <div className="sidebar-footer p-3 border-top border-light text-center">
          <span className="text-muted small">v1.0.0 &copy; 2026</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
