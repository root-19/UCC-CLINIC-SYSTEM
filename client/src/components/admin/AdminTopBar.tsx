import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import logoClinic from '../../assets/images/logo-clinic.png';
import { env } from '../../config/env';

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

interface RequestForm {
  id: string;
  fullname: string;
  yearSection: string;
  schoolIdNumber: string;
  departmentCourse: string;
  assessment: string;
  referredTo: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

const AdminTopBar = ({ onMenuClick }: AdminTopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<RequestForm[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/requests`);
      const data = await response.json();

      if (data.success) {
        // Filter pending requests
        const pending = data.data.filter((req: RequestForm) => req.status === 'pending');
        setPendingRequests(pending);
        setPendingCount(pending.length);
      }
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  useEffect(() => {
    if (user) {
      // Fetch pending requests on mount
      fetchPendingRequests();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingRequests, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchPendingRequests(); // Refresh when opening
    }
  };

  const handleViewAllRequests = () => {
    setShowNotifications(false);
    navigate('/admin/requested-form');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-professional border-b border-gray-200 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-clinic-green hover:bg-gray-100 rounded-lg transition-all duration-300 hover:rotate-90"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/admin/home" className="flex items-center gap-2 sm:gap-3 group transition-transform duration-300 hover:scale-105">
          <img src={logoClinic} alt="UCC CLINIC Logo" className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:rotate-3" />
          <span className="text-base sm:text-xl font-bold text-clinic-green hidden xs:inline transition-colors duration-300 group-hover:text-clinic-green-hover">UCC CLINIC</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell with Pending Count */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="p-2 text-gray-600 hover:text-clinic-green hover:bg-gray-100 rounded-full transition-all duration-300 relative hover:scale-110 hover:rotate-12"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs text-gray-600 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {pendingCount} pending
                </span>
              </div>
              
              <div className="overflow-y-auto max-h-80">
                {pendingRequests.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-gray-500 text-sm">No pending requests</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {pendingRequests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={handleViewAllRequests}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {request.fullname}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {request.assessment}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {pendingRequests.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleViewAllRequests}
                    className="w-full text-center text-sm text-clinic-green hover:text-clinic-green-hover font-medium py-2"
                  >
                    View All Requests ({pendingCount})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="User Profile"
            onClick={handleLogout}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
