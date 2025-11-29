import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import WelcomeCard from '../../components/admin/WelcomeCard';
import RegisterPatientCard from '../../components/admin/RegisterPatientCard';
import MonthlyReportCard from '../../components/admin/MonthlyReportCard';
import bgClinic from '../../assets/images/bg-clinic.png';

const AdminHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRegisterPatient = () => {
    navigate('/admin/registration');
  };

  const handleViewReport = () => {
    navigate('/admin/monthly-report');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <AdminTopBar onMenuClick={toggleSidebar} />

        {/* Content with Background */}
        <main className="flex-1 relative overflow-auto">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${bgClinic})` }}
          />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 p-3 sm:p-4 md:p-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Welcome Card */}
              <WelcomeCard 
                name={user.username ? `Dr. ${user.username}` : 'Dr. Lhemmuel M. Fiesta'}
                title="Clinic Physician"
              />

              {/* Register New Patient Card */}
              <RegisterPatientCard onClick={handleRegisterPatient} />
            </div>

            {/* Monthly Report Card */}
            <div className="mb-4 sm:mb-6">
              <MonthlyReportCard onClick={handleViewReport} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
