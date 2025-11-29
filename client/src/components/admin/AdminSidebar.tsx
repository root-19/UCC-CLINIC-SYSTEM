import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isOpen = true, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin/home' },
    { label: 'Clinic Inventory', path: '/admin/inventory' },
    { label: 'Student Record', path: '/admin/registration' },
    { label: 'Announcements', path: '/admin/announcement' },
    // { label: 'Notification', path: '/admin/notification' },
    { label: 'Requested Form', path: '/admin/requested-form' },
    // { label: 'Staff Schedule', path: '/admin/staff-schedule' },
    { label: 'Monthly Report', path: '/admin/monthly-report' },
  ];

  const handleNavClick = (path: string) => {
    setActiveItem(path);
    navigate(path);
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          w-64 h-full
          bg-white
          border-r border-gray-200
          z-50
          transform transition-transform duration-300 ease-in-out
          shadow-professional
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-clinic-green to-clinic-green-hover">
          <h2 className="text-base sm:text-lg font-bold text-white">UCC Clinic Admin</h2>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 hover:rotate-90"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-4">
          {navItems.map((item, index) => (
            <div key={item.path} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 sm:px-6 py-3.5 text-sm sm:text-base font-medium transition-all duration-300 relative group ${
                  activeItem === item.path
                    ? 'bg-clinic-green text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-clinic-green'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {activeItem === item.path && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white shadow-sm"></span>
                )}
                {!activeItem.includes(item.path) && (
                  <span className="absolute left-0 top-0 h-full w-0 bg-clinic-green transition-all duration-300 group-hover:w-1"></span>
                )}
              </button>
              {index < navItems.length - 1 && (
                <div className="border-b border-gray-100" />
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
