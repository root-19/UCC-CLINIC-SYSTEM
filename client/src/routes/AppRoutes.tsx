import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';
import AdminHome from '../pages/admin/Home';
import RequestedForms from '../pages/admin/RequestedForms';
import Inventory from '../pages/admin/Inventory';
import RegistrationStudent from '../pages/admin/RegistrationStudent';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/requested-form" element={<RequestedForms />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/registration" element={<RegistrationStudent />} />
          {/* Add more routes here as needed */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;

