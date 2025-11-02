import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Modal from '../components/Modal';
import LoginModal from '../components/LoginModal';
import RequestFormModal from '../components/RequestFormModal';
import OrganizationalChart from '../components/OrganizationalChart';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRequestFormModalOpen, setIsRequestFormModalOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  const handleCtaClick = () => {
    // TODO: Implement navigation to next section or page
    console.log('View More clicked');
  };

  const handleAboutUsClick = () => {
    setIsAboutUsModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRequestFormClick = () => {
    setIsRequestFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAboutUsModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRequestFormModal = () => {
    setIsRequestFormModalOpen(false);
  };

  const handleLoginSuccess = (userData: any) => {
    login(userData);
    navigate('/admin/home');
  };

  return (
    <div className="w-full min-h-screen">
      <Header 
        onSearchClick={handleSearchClick}
        onAboutUsClick={handleAboutUsClick}
        onLoginClick={handleLoginClick}
        onRequestFormClick={handleRequestFormClick}
      />
      <Hero 
        title="Clinic Access and Record Enhancements System"
        onCtaClick={handleCtaClick}
      />
      
      <Modal
        isOpen={isAboutUsModalOpen}
        onClose={handleCloseModal}
        title="About Us"
      >
        <OrganizationalChart />
      </Modal>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />

      <RequestFormModal
        isOpen={isRequestFormModalOpen}
        onClose={handleCloseRequestFormModal}
      />
    </div>
  );
};

export default LandingPage;

