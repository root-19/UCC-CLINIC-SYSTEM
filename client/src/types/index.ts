// Navigation types
export interface NavLink {
  label: string;
  path: string;
}

// Component prop types
export interface HeaderProps {
  logo?: string;
  navLinks?: NavLink[];
  onSearchClick?: () => void;
  onAboutUsClick?: () => void;
  onLoginClick?: () => void;
  onRequestFormClick?: () => void;
  onAnnouncementsClick?: () => void;
}

export interface HeroProps {
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

// Route types
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

