interface WelcomeCardProps {
  name?: string;
  title?: string;
}

const WelcomeCard = ({ name = 'Dr. Lhemmuel M. Fiesta', title = 'Clinic Physician' }: WelcomeCardProps) => {
  return (
    <div className="bg-gradient-to-br from-[#D2691E] to-[#B85A1A] rounded-xl p-4 sm:p-6 text-white shadow-professional-lg card-hover animate-fade-in-up animate-delay-100">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 animate-fade-in animate-delay-200">Welcome back!</h3>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <svg className="w-7 h-7 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base sm:text-lg md:text-xl font-bold truncate transition-all duration-300 hover:scale-105">{name}</h4>
            <p className="text-xs sm:text-sm opacity-90">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
