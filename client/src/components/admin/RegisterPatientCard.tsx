interface RegisterPatientCardProps {
  onClick?: () => void;
}

const RegisterPatientCard = ({ onClick }: RegisterPatientCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-[#D2691E] to-[#B85A1A] rounded-xl p-4 sm:p-6 text-white shadow-professional-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100 w-full text-left animate-fade-in-up animate-delay-200"
    >
      <div className="flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px]">
        <div className="mb-3 sm:mb-4 relative group">
          {/* Person with plus icon */}
          <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* Person icon */}
            <circle cx="12" cy="8" r="4" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            {/* Plus sign on person */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v8m4-4H8" />
          </svg>
          {/* Document with checkmark */}
          <svg className="w-10 h-10 sm:w-12 sm:h-12 absolute -bottom-2 -right-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16l2 2 4-4" />
          </svg>
        </div>
        <p className="text-base sm:text-lg font-semibold text-center transition-all duration-300 group-hover:scale-105">Register New Patient</p>
      </div>
    </button>
  );
};

export default RegisterPatientCard;
