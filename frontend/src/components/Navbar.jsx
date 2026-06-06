import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const userName = user ? user.name : 'Sarah Jenkins';
  const userRole = user ? user.role : 'Procurement Admin';

  return (
    <header className="navbar-header glass border-bottom border-light d-flex align-items-center justify-content-between px-4">
      {/* Left section: Toggle Menu & Search */}
      <div className="d-flex align-items-center gap-3 flex-grow-1">
        <button
          type="button"
          className="btn-toggle-sidebar d-lg-none btn border-0 p-0 text-white"
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <FiMenu size={24} />
        </button>

        {/* Search Bar */}
        <div className="search-bar-wrapper d-none d-md-flex align-items-center px-3 py-1.5 rounded-3 border border-light">
          <FiSearch className="text-muted me-2" size={16} />
          <input
            type="text"
            className="search-input bg-transparent border-0 text-white fs-7"
            placeholder="Search transactions, vendors, files..."
            aria-label="Search"
          />
          <kbd className="search-kbd d-none d-lg-inline-block ms-2 text-muted bg-dark border-0 px-1.5 py-0.5 rounded small">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right section: Notifications & Profile */}
      <div className="d-flex align-items-center gap-4">
        {/* Search trigger on mobile */}
        <button
          type="button"
          className="btn d-md-none border-0 p-0 text-white text-muted-hover"
          aria-label="Search"
        >
          <FiSearch size={20} />
        </button>

        {/* Notifications Icon with Badge */}
        <div className="dropdown">
          <button
            type="button"
            className="btn-notification btn border-0 p-0 position-relative text-white"
            id="notificationsDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FiBell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-dark rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
          <ul 
            className="dropdown-menu dropdown-menu-end dropdown-dark border border-light p-2 mt-2" 
            aria-labelledby="notificationsDropdown"
            style={{ width: '280px', backgroundColor: 'var(--bg-card)', zIndex: 1050 }}
          >
            <li className="px-3 py-2 border-bottom border-light">
              <h6 className="m-0 text-white font-semibold">Notifications</h6>
            </li>
            <li>
              <a className="dropdown-item rounded py-2 d-flex flex-column gap-1 text-wrap mt-1" href="#notification-rfq">
                <span className="text-white small fw-medium">New RFQ submitted by Vendor</span>
                <span className="text-muted extra-small">2 minutes ago</span>
              </a>
            </li>
            <li>
              <a className="dropdown-item rounded py-2 d-flex flex-column gap-1 text-wrap" href="#notification-approve">
                <span className="text-white small fw-medium">Quotation pending approvals</span>
                <span className="text-muted extra-small">1 hour ago</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider border-light" />
            </li>
            <li className="text-center py-1">
              <a href="#notifications" className="text-primary small text-decoration-none fw-medium">View all notifications</a>
            </li>
          </ul>
        </div>

        {/* Profile Avatar & User Role info */}
        <div className="dropdown">
          <div
            className="user-profile-wrapper d-flex align-items-center gap-2.5 cursor-pointer"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            role="button"
          >
            <div className="avatar-wrapper rounded-circle border border-2 border-primary overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
                alt="User Avatar"
                className="img-fluid"
                width={36}
                height={36}
              />
            </div>
            <div className="user-details-wrapper d-none d-lg-flex flex-column text-start">
              <span className="user-name text-white fs-7 fw-semibold lh-1">{userName}</span>
              <span className="user-role text-muted fs-8 mt-1">{userRole}</span>
            </div>
            <FiChevronDown className="text-muted d-none d-lg-inline-block" size={14} />
          </div>
          <ul 
            className="dropdown-menu dropdown-menu-end dropdown-dark border border-light p-2 mt-2" 
            aria-labelledby="profileDropdown"
            style={{ backgroundColor: 'var(--bg-card)', zIndex: 1050 }}
          >
            <li>
              <a className="dropdown-item rounded py-2 text-white" href="#profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
                Profile Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item rounded py-2 text-white" href="#company" onClick={(e) => { e.preventDefault(); navigate('/vendor-settings'); }}>
                Company Details
              </a>
            </li>
            <li>
              <hr className="dropdown-divider border-light" />
            </li>
            <li>
              <a className="dropdown-item rounded py-2 text-danger" href="#logout" onClick={handleLogout}>
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
