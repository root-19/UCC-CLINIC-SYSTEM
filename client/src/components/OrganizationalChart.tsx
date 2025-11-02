interface Person {
  name: string;
  title: string;
}

interface OrgChartProps {
  className?: string;
}

const OrganizationalChart = ({ className = '' }: OrgChartProps) => {
  const OfficerInCharge: Person = {
    name: 'Atty. Jessamine Jared S. Nas',
    title: 'Officer in Charge',
  };

  const Director: Person = {
    name: 'Dr. Evelyn Ong Cueva',
    title: 'OIC of UCC College of Health and Science and Director of UCC Health Clinic',
  };

  const Physician: Person = {
    name: 'Dr. Lhemmuel M. Fiesta',
    title: 'Physician',
  };

  const Dentist: Person = {
    name: 'Dr. Carol May G. Yañez',
    title: 'Dentist',
  };

  const Nurses: Person[] = [
    { name: 'Rose N. Rafael, RN', title: 'Nurse' },
    { name: 'Vanessa M. Castillo, RN', title: 'Nurse' },
    { name: 'Paula Michelle S. Diaz, RN', title: 'Nurse' },
    { name: 'Dhona B. Calugay, RN', title: 'Nurse' },
  ];

  return (
    <div className={`organizational-chart ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-clinic-green mb-2">
          School Clinic Organizational Chart
        </h3>
      </div>

      {/* Top Level - Officer in Charge */}
      <div className="flex flex-col items-center mb-8">
        <OrgBox person={OfficerInCharge} level={1} />
      </div>

      {/* Connector Line */}
      <div className="flex justify-center mb-8">
        <div className="w-0.5 h-8 bg-gray-400"></div>
      </div>

      {/* Second Level - Director */}
      <div className="flex flex-col items-center mb-8">
        <OrgBox person={Director} level={2} />
      </div>

      {/* Connector Lines */}
      <div className="flex justify-center mb-8">
        <div className="w-0.5 h-8 bg-gray-400"></div>
      </div>

      {/* Third Level - Physician and Dentist */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <OrgBox person={Physician} level={3} />
          {/* Connector Line */}
          <div className="w-0.5 h-8 bg-gray-400 my-4"></div>
          {/* Fourth Level - Nurses under Physician */}
          <div className="flex flex-col gap-4">
            <OrgBox person={Nurses[0]} level={4} />
            <OrgBox person={Nurses[1]} level={4} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <OrgBox person={Dentist} level={3} />
          {/* Connector Line */}
          <div className="w-0.5 h-8 bg-gray-400 my-4"></div>
          {/* Fourth Level - Nurses under Dentist */}
          <div className="flex flex-col gap-4">
            <OrgBox person={Nurses[2]} level={4} />
            <OrgBox person={Nurses[3]} level={4} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrgBoxProps {
  person: Person;
  level: number;
}

const OrgBox = ({ person, level }: OrgBoxProps) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md p-4 min-w-[250px] max-w-[300px] flex items-center gap-3 hover:shadow-lg transition-shadow">
      {/* Person Icon */}
      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Name and Title */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm mb-1">
          {person.name}
        </div>
        <div className="text-xs text-gray-600">{person.title}</div>
      </div>
    </div>
  );
};

export default OrganizationalChart;

