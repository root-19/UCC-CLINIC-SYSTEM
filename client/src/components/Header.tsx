import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { HeaderProps } from '../types';
import logoClinic from '../assets/images/logo-clinic.png';

const Header = ({ 
  logo = logoClinic, 
  // Removed the login nav link; clicking the logo will now trigger login if `onLoginClick` is provided
  navLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Announcement', path: '/announcement' },
    { label: 'Request Form', path: '/request-form' }
  ],
  onAboutUsClick,
  onLoginClick,
  onRequestFormClick,
  onAnnouncementsClick
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If a login handler is provided, open the login modal when logo is clicked
    if (onLoginClick) {
      onLoginClick();
      return;
    }

    if (location.pathname === '/') {
      // If already on home page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home page
      navigate('/');
    }
  };

  const handleLinkClick = (label: string, e: React.MouseEvent) => {
    if (label === 'About Us' && onAboutUsClick) {
      e.preventDefault();
      onAboutUsClick();
    }
    if (label === 'Announcement' && onAnnouncementsClick) {
      e.preventDefault();
      onAnnouncementsClick();
    }
    if (label.toLowerCase() === 'login' && onLoginClick) {
      e.preventDefault();
      onLoginClick();
    }
    if (label === 'Request Form' && onRequestFormClick) {
      e.preventDefault();
      onRequestFormClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-professional z-50 animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 no-underline text-inherit group transition-transform duration-300 hover:scale-105"
        >
          <img src={logo} alt="UCC CLINIC Logo" className="h-10 md:h-[40px] w-auto object-contain transition-transform duration-300 group-hover:rotate-3" />
          <span className="text-xl md:text-[1.25rem] font-bold text-clinic-green transition-colors duration-300 group-hover:text-clinic-green-hover">UCC CLINIC</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={(e) => handleLinkClick(link.label, e)}
                className="text-gray-700 no-underline text-[0.95rem] font-medium transition-all duration-300 hover:text-clinic-green hover:scale-105 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-clinic-green transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

