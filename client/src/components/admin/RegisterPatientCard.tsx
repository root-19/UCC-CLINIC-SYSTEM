interface RegisterPatientCardProps {
  onClick?: () => void;
}

const RegisterPatientCard = ({ onClick }: RegisterPatientCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#D2691E] rounded-lg p-4 sm:p-6 text-white hover:opacity-90 transition-opacity w-full text-left"
    >
      <div className="flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px]">
        <div className="mb-3 sm:mb-4 relative">
          {/* Person with plus icon */}
          <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* Person icon */}
            <circle cx="12" cy="8" r="4" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            {/* Plus sign on person */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v8m4-4H8" />
          </svg>
          {/* Document with checkmark */}
          <svg className="w-10 h-10 sm:w-12 sm:h-12 absolute -bottom-2 -right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16l2 2 4-4" />
          </svg>
        </div>
        <p className="text-base sm:text-lg font-semibold text-center">Register New Patient</p>
      </div>
    </button>
  );
};

export default RegisterPatientCard;
