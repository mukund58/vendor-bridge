import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Panel Viewport */}
      <div className="main-viewport">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic Route Content */}
        <main className="content-container p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
