import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import AdminHome from '../pages/admin/home';
import RequestedForms from '../pages/admin/RequestedForms';
import Inventory from '../pages/admin/Inventory';
import RegistrationStudent from '../pages/admin/RegistrationStudent';
import Announcement from '../pages/admin/Announcement';
import Reports from '../pages/admin/Reports';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/requested-form" element={<RequestedForms />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/registration" element={<RegistrationStudent />} />
          <Route path="/admin/announcement" element={<Announcement />} />
          <Route path="/admin/monthly-report" element={<Reports />} />
          {/* Add more routes here as needed */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;

