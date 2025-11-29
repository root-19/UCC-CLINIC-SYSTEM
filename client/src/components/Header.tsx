import { Link } from 'react-router-dom';
import type { HeaderProps } from '../types';
import logoClinic from '../assets/images/logo-clinic.png';

const Header = ({ 
  logo = logoClinic, 
  navLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Announcement', path: '/announcement' },
    { label: 'Request Form', path: '/request-form' },
    { label: 'login', path: '/login' }

  ],
  onSearchClick,
  onAboutUsClick,
  onLoginClick,
  onRequestFormClick,
  onBlogClick,
  onAnnouncementsClick
}: HeaderProps) => {
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
        <Link to="/" className="flex items-center gap-3 no-underline text-inherit group transition-transform duration-300 hover:scale-105">
          <img src={logo} alt="UCC CLINIC Logo" className="h-10 md:h-[40px] w-auto object-contain transition-transform duration-300 group-hover:rotate-3" />
          <span className="text-xl md:text-[1.25rem] font-bold text-clinic-green transition-colors duration-300 group-hover:text-clinic-green-hover">UCC CLINIC</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link, index) => (
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
          
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center gap-2 px-5 py-2.5 bg-search-green text-white border-none rounded-lg cursor-pointer text-sm font-semibold shadow-md transition-all duration-300 hover:bg-search-green-hover hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              onClick={onSearchClick}
              aria-label="Search"
            >
              <svg 
                className="w-[18px] h-[18px] stroke-current transition-transform duration-300 group-hover:rotate-90" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search</span>
            </button>
            {/* <button 
              className="bg-transparent border-none cursor-pointer p-2 flex items-center justify-center text-gray-800 transition-colors duration-200 hover:text-search-green"
              aria-label="Voice search"
            >
              <svg 
                className="w-6 h-6 fill-current" 
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

