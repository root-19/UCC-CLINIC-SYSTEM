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
    <div className={`organizational-chart ${className} animate-fade-in`}>
      {/* Mission Section */}
      <div className="mb-8 animate-fade-in-up animate-delay-100">
        <h3 className="text-2xl font-bold text-clinic-green mb-3">MISSION</h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          To render medical services to all stakeholders and provide a safe and healthy drug-free and smoke free environment through health education.
        </p>
      </div>

      {/* Vision Section */}
      <div className="mb-8 animate-fade-in-up animate-delay-200">
        <h3 className="text-2xl font-bold text-clinic-green mb-3">VISION</h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          A University Medical Clinic dedicated to providing quality and efficient medical services for the welfare of students, faculty and staff.
        </p>
      </div>

      {/* Goals Section */}
      <div className="mb-8 animate-fade-in-up animate-delay-300">
        <h3 className="text-2xl font-bold text-clinic-green mb-4">GOALS</h3>
        <ol className="space-y-3 text-gray-700 text-base leading-relaxed list-decimal list-inside">
          <li>To maintain the health and well-being of all students and school personnel by providing access to primary, preventive health care service in a school setting.</li>
          <li>To organize and manage the school clinic according to Department of Health standard and evidence-based practice guidelines.</li>
          <li>To run the clinic as a first aid center for accidents and injuries that occur in school.</li>
          <li>To report more serious/major incidents involving students to the parents, directly by telephone, as soon as possible or as per the school protocol.</li>
          <li>To provide a temporary resting place for ill or sick students or staff.</li>
          <li>To arrange immediate transfer to hospital for any student or member of staff who requires emergency medical attention.</li>
          <li>To clearly label and store student's individual medication, in an appropriate and safe manner.</li>
          <li>To administer medications as prescribed by the school doctor or by written instruction from the parent.</li>
          <li>To maintain and encourage good practices in hygiene and hand washing throughout the school, by education and example.</li>
          <li>To follow any health advice given by the Department of Health public health for infectious diseases/epidemics that might affect the students and staff of the school.</li>
          <li>To follow all Department of Health requirements for student medical exams and record keeping.</li>
          <li>To help and advise students and staff regarding current health issues as the need arises.</li>
          <li>To impart knowledge and information on health matters to students through health education/awareness programs and teachings.</li>
        </ol>
      </div>

      {/* Organizational Chart Section */}
      <div className="text-center mb-8 animate-fade-in-up animate-delay-400">
        <h3 className="text-3xl font-bold text-clinic-green mb-2">
          School Clinic Organizational Chart
        </h3>
      </div>

      {/* Top Level - Officer in Charge */}
      <div className="flex flex-col items-center mb-8">
        <OrgBox person={OfficerInCharge} />
      </div>

      {/* Connector Line */}
      <div className="flex justify-center mb-8">
        <div className="w-0.5 h-8 bg-gray-400"></div>
      </div>

      {/* Second Level - Director */}
      <div className="flex flex-col items-center mb-8">
        <OrgBox person={Director} />
      </div>

      {/* Connector Lines */}
      <div className="flex justify-center mb-8">
        <div className="w-0.5 h-8 bg-gray-400"></div>
      </div>

      {/* Third Level - Physician and Dentist */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <OrgBox person={Physician} />
          {/* Connector Line */}
          <div className="w-0.5 h-8 bg-gray-400 my-4"></div>
          {/* Fourth Level - Nurses under Physician */}
          <div className="flex flex-col gap-4">
            <OrgBox person={Nurses[0]} />
            <OrgBox person={Nurses[1]} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <OrgBox person={Dentist} />
          {/* Connector Line */}
          <div className="w-0.5 h-8 bg-gray-400 my-4"></div>
          {/* Fourth Level - Nurses under Dentist */}
          <div className="flex flex-col gap-4">
            <OrgBox person={Nurses[2]} />
            <OrgBox person={Nurses[3]} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrgBoxProps {
  person: Person;
}

const OrgBox = ({ person }: OrgBoxProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-xl shadow-professional p-4 min-w-[250px] max-w-[300px] flex items-center gap-3 hover:shadow-professional-lg hover:-translate-y-1 transition-all duration-300 card-hover animate-fade-in-up">
      {/* Person Icon */}
      <div className="w-12 h-12 bg-gradient-to-br from-clinic-green to-clinic-green-hover rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 hover:scale-110">
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

