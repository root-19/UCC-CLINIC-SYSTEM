interface WelcomeCardProps {
  name?: string;
  title?: string;
}

const WelcomeCard = ({ name = 'Dr. Lhemmuel M. Fiesta', title = 'Clinic Physician' }: WelcomeCardProps) => {
  return (
    <div className="bg-[#D2691E] rounded-lg p-4 sm:p-6 text-white">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Welcome back!</h3>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 sm:w-10 sm:h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base sm:text-lg md:text-xl font-bold truncate">{name}</h4>
            <p className="text-xs sm:text-sm opacity-90">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
