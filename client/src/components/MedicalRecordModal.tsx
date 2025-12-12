import { useState, useEffect } from 'react';
import Modal from './Modal';
import bgClinic from '../assets/images/bg-clinic.png';
import { env } from '../config/env';

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
  studentData?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    schoolIdNumber?: string;
    department?: string;
    yearSection?: string;
  };
}

const MedicalRecordModal = ({ isOpen, onClose, studentId, studentData }: MedicalRecordModalProps) => {
  const [formData, setFormData] = useState({
    // Student Information
    firstName: '',
    middleName: '',
    lastName: '',
    schoolIdNumber: '',
    department: '',
    yearSection: '',
    
    // Visit Details
    visitDate: '',
    visitTime: '',
    reasonForVisit: '',
    visitType: '',
    
    // Vital Signs
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    weight: '',
    height: '',
    
    // Medical Assessment
    initialAssessment: '',
    diagnosis: '',
    symptomsObserved: '',
    allergies: '',
    existingMedicalConditions: '',
    
    // Treatment / Action Taken
    medicationGiven: '',
    firstAidProvided: '',
    proceduresDone: '',
    adviceGiven: '',
    sentHome: '',
    parentNotified: '',
    
    // Referral Information
    referredTo: '',
    referralReason: '',
    referralTime: '',
    transportAssistance: '',
    
    // Attending Personnel
    attendingPersonnelName: '',
    attendingPersonnelId: '',
    additionalRemarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Department list - same as request form
  const departments = [
    'College of Business and Accountancy',
    'College of Education',
    'College of Criminology',
    'College of Law',
    'Department of Tourism and Hospitality Industry Management',
    'Computer Studies Department',
    'Psychology Department',
    'Political Science Department',
    'Graduate School',
    'Other',
  ];

  const visitTypes = ['Check-up', 'Emergency', 'Follow-up', 'Medication request'];

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().slice(0, 5);
      
      // Pre-fill student data if provided
      if (studentData) {
        setFormData(prev => ({
          ...prev,
          firstName: studentData.firstName || '',
          middleName: studentData.middleName || '',
          lastName: studentData.lastName || '',
          schoolIdNumber: studentData.schoolIdNumber || '',
          department: studentData.department || '',
          yearSection: studentData.yearSection || '',
          visitDate: dateStr,
          visitTime: timeStr,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          visitDate: prev.visitDate || dateStr,
          visitTime: prev.visitTime || timeStr,
        }));
      }
    }
  }, [isOpen, studentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine name fields into fullname for backend
      const fullname = [formData.firstName, formData.middleName, formData.lastName]
        .filter(name => name.trim() !== '')
        .join(' ');

      const requestBody = {
        ...formData,
        fullname,
        studentId: studentId || formData.schoolIdNumber,
      };

      const response = await fetch(`${env.API_URL}/api/medical-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        setFormData({
          firstName: studentData?.firstName || '',
          middleName: studentData?.middleName || '',
          lastName: studentData?.lastName || '',
          schoolIdNumber: studentData?.schoolIdNumber || '',
          department: studentData?.department || '',
          yearSection: studentData?.yearSection || '',
          visitDate: dateStr,
          visitTime: timeStr,
          reasonForVisit: '',
          visitType: '',
          temperature: '',
          bloodPressure: '',
          heartRate: '',
          respiratoryRate: '',
          weight: '',
          height: '',
          initialAssessment: '',
          diagnosis: '',
          symptomsObserved: '',
          allergies: '',
          existingMedicalConditions: '',
          medicationGiven: '',
          firstAidProvided: '',
          proceduresDone: '',
          adviceGiven: '',
          sentHome: '',
          parentNotified: '',
          referredTo: '',
          referralReason: '',
          referralTime: '',
          transportAssistance: '',
          attendingPersonnelName: '',
          attendingPersonnelId: '',
          additionalRemarks: '',
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit medical record');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Background with blur effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 rounded-lg -z-10"
          style={{ backgroundImage: `url(${bgClinic})` }}
        />
        
        {/* Form Container */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-professional-lg animate-fade-in max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-bold text-clinic-green mb-2 text-center animate-fade-in-up animate-delay-100">
            Medical Record / Visit Form
          </h2>
          
          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base animate-fade-in-up animate-delay-200">
            Complete medical visit record. Fill out all necessary information.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Medical record submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Student Information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">1. Student Information</h3>
              
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
                      First Name: *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="middleName" className="block text-gray-700 font-medium mb-1">
                      Middle Name:
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="Middle name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
                      Last Name: *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="schoolIdNumber" className="block text-gray-700 font-medium mb-1">
                      School ID Number: *
                    </label>
                    <input
                      type="text"
                      id="schoolIdNumber"
                      name="schoolIdNumber"
                      value={formData.schoolIdNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="12345678-A"
                    />
                  </div>
                  <div>
                    <label htmlFor="yearSection" className="block text-gray-700 font-medium mb-1">
                      Year & Section: *
                    </label>
                    <input
                      type="text"
                      id="yearSection"
                      name="yearSection"
                      value={formData.yearSection}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="e.g., 3rd Year - Section A"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-gray-700 font-medium mb-1">
                    Department: *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Visit / Check-Up Details */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">2. Visit / Check-Up Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="visitDate" className="block text-gray-700 font-medium mb-1">
                      Date of Visit: *
                    </label>
                    <input
                      type="date"
                      id="visitDate"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    />
                  </div>
                  <div>
                    <label htmlFor="visitTime" className="block text-gray-700 font-medium mb-1">
                      Time of Visit: *
                    </label>
                    <input
                      type="time"
                      id="visitTime"
                      name="visitTime"
                      value={formData.visitTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reasonForVisit" className="block text-gray-700 font-medium mb-1">
                    Reason for Visit: *
                  </label>
                  <input
                    type="text"
                    id="reasonForVisit"
                    name="reasonForVisit"
                    value={formData.reasonForVisit}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="e.g., headache, stomach ache, injury, follow-up"
                  />
                </div>

                <div>
                  <label htmlFor="visitType" className="block text-gray-700 font-medium mb-1">
                    Type of Visit: *
                  </label>
                  <select
                    id="visitType"
                    name="visitType"
                    value={formData.visitType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green bg-white"
                  >
                    <option value="">Select Visit Type</option>
                    {visitTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Vital Signs */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">3. Vital Signs (Optional)</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="temperature" className="block text-gray-700 font-medium mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="text"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label htmlFor="bloodPressure" className="block text-gray-700 font-medium mb-1">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    id="bloodPressure"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label htmlFor="heartRate" className="block text-gray-700 font-medium mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="text"
                    id="heartRate"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label htmlFor="respiratoryRate" className="block text-gray-700 font-medium mb-1">
                    Respiratory Rate
                  </label>
                  <input
                    type="text"
                    id="respiratoryRate"
                    name="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="16"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-gray-700 font-medium mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="65"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-gray-700 font-medium mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="170"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Medical Assessment */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">4. Medical Assessment</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="initialAssessment" className="block text-gray-700 font-medium mb-1">
                    Initial Assessment / Findings:
                  </label>
                  <textarea
                    id="initialAssessment"
                    name="initialAssessment"
                    value={formData.initialAssessment}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter initial assessment and findings"
                  />
                </div>
                <div>
                  <label htmlFor="diagnosis" className="block text-gray-700 font-medium mb-1">
                    Diagnosis (if any):
                  </label>
                  <input
                    type="text"
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter diagnosis"
                  />
                </div>
                <div>
                  <label htmlFor="symptomsObserved" className="block text-gray-700 font-medium mb-1">
                    Symptoms Observed:
                  </label>
                  <textarea
                    id="symptomsObserved"
                    name="symptomsObserved"
                    value={formData.symptomsObserved}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Describe symptoms observed"
                  />
                </div>
                <div>
                  <label htmlFor="allergies" className="block text-gray-700 font-medium mb-1">
                    Allergies (Food, medicine, environmental):
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="List any allergies"
                  />
                </div>
                <div>
                  <label htmlFor="existingMedicalConditions" className="block text-gray-700 font-medium mb-1">
                    Existing Medical Conditions (Asthma, diabetes, heart condition, etc.):
                  </label>
                  <input
                    type="text"
                    id="existingMedicalConditions"
                    name="existingMedicalConditions"
                    value={formData.existingMedicalConditions}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="List existing conditions"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Treatment / Action Taken */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">5. Treatment / Action Taken</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="medicationGiven" className="block text-gray-700 font-medium mb-1">
                    Medication Given (name, dosage, time):
                  </label>
                  <textarea
                    id="medicationGiven"
                    name="medicationGiven"
                    value={formData.medicationGiven}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter medication details"
                  />
                </div>
                <div>
                  <label htmlFor="firstAidProvided" className="block text-gray-700 font-medium mb-1">
                    First Aid Provided:
                  </label>
                  <textarea
                    id="firstAidProvided"
                    name="firstAidProvided"
                    value={formData.firstAidProvided}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Describe first aid provided"
                  />
                </div>
                <div>
                  <label htmlFor="proceduresDone" className="block text-gray-700 font-medium mb-1">
                    Procedures Done:
                  </label>
                  <textarea
                    id="proceduresDone"
                    name="proceduresDone"
                    value={formData.proceduresDone}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="List procedures performed"
                  />
                </div>
                <div>
                  <label htmlFor="adviceGiven" className="block text-gray-700 font-medium mb-1">
                    Advice Given:
                  </label>
                  <textarea
                    id="adviceGiven"
                    name="adviceGiven"
                    value={formData.adviceGiven}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter advice given to student"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sentHome" className="block text-gray-700 font-medium mb-1">
                      Was the student sent home? *
                    </label>
                    <select
                      id="sentHome"
                      name="sentHome"
                      value={formData.sentHome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="parentNotified" className="block text-gray-700 font-medium mb-1">
                      Was the parent notified? *
                    </label>
                    <select
                      id="parentNotified"
                      name="parentNotified"
                      value={formData.parentNotified}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Referral Information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">6. Referral Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="referredTo" className="block text-gray-700 font-medium mb-1">
                    Referred to (Clinic, ER, Specialist):
                  </label>
                  <input
                    type="text"
                    id="referredTo"
                    name="referredTo"
                    value={formData.referredTo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter referral destination"
                  />
                </div>
                <div>
                  <label htmlFor="referralReason" className="block text-gray-700 font-medium mb-1">
                    Reason for referral:
                  </label>
                  <textarea
                    id="referralReason"
                    name="referralReason"
                    value={formData.referralReason}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter reason for referral"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="referralTime" className="block text-gray-700 font-medium mb-1">
                      Time referred:
                    </label>
                    <input
                      type="time"
                      id="referralTime"
                      name="referralTime"
                      value={formData.referralTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    />
                  </div>
                  <div>
                    <label htmlFor="transportAssistance" className="block text-gray-700 font-medium mb-1">
                      Transport assistance given (if any):
                    </label>
                    <input
                      type="text"
                      id="transportAssistance"
                      name="transportAssistance"
                      value={formData.transportAssistance}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="Transport details"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Attending Personnel Information */}
            <div className="pb-4">
              <h3 className="text-xl font-semibold text-clinic-green mb-4">7. Attending Personnel Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="attendingPersonnelName" className="block text-gray-700 font-medium mb-1">
                      Name of Nurse/Doctor: *
                    </label>
                    <input
                      type="text"
                      id="attendingPersonnelName"
                      name="attendingPersonnelName"
                      value={formData.attendingPersonnelName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label htmlFor="attendingPersonnelId" className="block text-gray-700 font-medium mb-1">
                      Signature/ID: *
                    </label>
                    <input
                      type="text"
                      id="attendingPersonnelId"
                      name="attendingPersonnelId"
                      value={formData.attendingPersonnelId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                      placeholder="Enter ID or signature"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="additionalRemarks" className="block text-gray-700 font-medium mb-1">
                    Additional Remarks:
                  </label>
                  <textarea
                    id="additionalRemarks"
                    name="additionalRemarks"
                    value={formData.additionalRemarks}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                    placeholder="Enter any additional remarks"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-clinic-green text-white rounded-lg font-semibold shadow-md hover:bg-clinic-green-hover hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Submitting...' : 'Submit Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default MedicalRecordModal;

