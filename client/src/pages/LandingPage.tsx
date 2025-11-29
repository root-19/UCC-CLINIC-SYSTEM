import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import LoginModal from '../components/LoginModal';
import RequestFormModal from '../components/RequestFormModal';
import BlogModal from '../components/BlogModal';
import AnnouncementsModal from '../components/AnnouncementsModal';
import OrganizationalChart from '../components/OrganizationalChart';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRequestFormModalOpen, setIsRequestFormModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSearchClick = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  const handleCtaClick = () => {
    navigate('/announcements');
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

  const handleAnnouncementsClick = () => {
    setIsAnnouncementsModalOpen(true);
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

  const handleCloseBlogModal = () => {
    setIsBlogModalOpen(false);
  };

  const handleCloseAnnouncementsModal = () => {
    setIsAnnouncementsModalOpen(false);
  };

  const handleLoginSuccess = (userData: any) => {
    login(userData);
    navigate('/admin/home');
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header 
        onSearchClick={handleSearchClick}
        onAboutUsClick={handleAboutUsClick}
        onLoginClick={handleLoginClick}
        onRequestFormClick={handleRequestFormClick}
        onAnnouncementsClick={handleAnnouncementsClick}
      />
      <Hero 
        title="Clinic Access and Record Enhancements System"
        onCtaClick={handleCtaClick}
      />
      
      <Footer />
      
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

      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={handleCloseBlogModal}
      />

      <AnnouncementsModal
        isOpen={isAnnouncementsModalOpen}
        onClose={handleCloseAnnouncementsModal}
      />
    </div>
  );
};

export default LandingPage;

