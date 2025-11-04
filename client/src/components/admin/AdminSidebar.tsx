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
    { label: 'Notification', path: '/admin/notification' },
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
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">UCC Clinic Admin</h2>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-4">
          {navItems.map((item, index) => (
            <div key={item.path}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 sm:px-6 py-3 text-sm sm:text-base transition-colors ${
                  activeItem === item.path
                    ? 'bg-clinic-green text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
              {index < navItems.length - 1 && (
                <div className="border-b border-gray-200" />
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
