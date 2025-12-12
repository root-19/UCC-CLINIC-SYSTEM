import { useState, useEffect } from 'react';
import Modal from './Modal';
import bgClinic from '../assets/images/bg-clinic.png';
import { env } from '../config/env';

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestFormModal = ({ isOpen, onClose }: RequestFormModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    yearSection: '',
    schoolIdNumber: '',
    department: '',
    assessment: '',
    email: '',
    requestDate: '',
    requestTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Department list
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Set default date and time to current date/time
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().slice(0, 5); // HH:MM
      
      setFormData(prev => ({
        ...prev,
        requestDate: prev.requestDate || dateStr,
        requestTime: prev.requestTime || timeStr,
      }));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate Student ID Number format
    const studentIdPattern = /^[0-9]{8}-[A-Z]$/;
    if (!studentIdPattern.test(formData.schoolIdNumber)) {
      setError('Student ID Number must be in format: 8 digits, dash, 1 letter (e.g., 12345678-A)');
      setLoading(false);
      return;
    }

    try {
      // Combine name fields into fullname for backend
      const fullname = [formData.firstName, formData.middleName, formData.lastName]
        .filter(name => name.trim() !== '')
        .join(' ');

      const requestBody = {
        fullname,
        yearSection: formData.yearSection,
        schoolIdNumber: formData.schoolIdNumber,
        department: formData.department,
        assessment: formData.assessment,
        email: formData.email,
        requestDate: formData.requestDate,
        requestTime: formData.requestTime,
      };

      const response = await fetch(`${env.API_URL}/api/requests`, {
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
          firstName: '',
          middleName: '',
          lastName: '',
          yearSection: '',
          schoolIdNumber: '',
          department: '',
          assessment: '',
          email: '',
          requestDate: dateStr,
          requestTime: timeStr,
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit request form');
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
        <div className="relative bg-white/95 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-professional-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-clinic-green mb-2 text-center animate-fade-in-up animate-delay-100">
            Request Form
          </h2>
          
          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base animate-fade-in-up animate-delay-200">
            Submit your request forms conveniently. Kindly fill out all the necessary information.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Request form submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="flex flex-col gap-4">
              {/* First Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="firstName" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Middle Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="middleName" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                  Middle Name:
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                  placeholder="Enter your middle name (optional)"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="lastName" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Course/Year & Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="yearSection" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Course/Year & Section:
              </label>
              <input
                type="text"
                id="yearSection"
                name="yearSection"
                value={formData.yearSection}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                placeholder="e.g., BSIT - 3rd Year - Section A"
              />
            </div>

            {/* Student ID Number */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="schoolIdNumber" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Student ID Number:
              </label>
              <input
                type="text"
                id="schoolIdNumber"
                name="schoolIdNumber"
                value={formData.schoolIdNumber}
                onChange={(e) => {
                  // Format: 8 digits, dash, 1 letter
                  let value = e.target.value.toUpperCase();
                  // Remove any non-alphanumeric except dash
                  value = value.replace(/[^0-9A-Z-]/g, '');
                  // Limit to 10 characters (8 digits + dash + 1 letter)
                  if (value.length <= 10) {
                    setFormData({
                      ...formData,
                      schoolIdNumber: value,
                    });
                  }
                }}
                required
                pattern="[0-9]{8}-[A-Z]"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                placeholder="12345678-A"
                title="Format: 8 digits, dash, and 1 letter (e.g., 12345678-A)"
              />
              {formData.schoolIdNumber && !/^[0-9]{8}-[A-Z]$/.test(formData.schoolIdNumber) && (
                <p className="text-red-600 text-xs mt-1 sm:mt-0 sm:ml-2">
                  Format: 8 digits, dash, 1 letter (e.g., 12345678-A)
                </p>
              )}
            </div>

            {/* Department */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="department" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Department:
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Assessment */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="assessment" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Form Request:
              </label>
              <input
                type="text"
                id="assessment"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                placeholder="Enter the form you are requesting"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="email" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Request Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="requestDate" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Request Date:
              </label>
              <input
                type="date"
                id="requestDate"
                name="requestDate"
                value={formData.requestDate}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
              />
            </div>

            {/* Request Time */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="requestTime" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Request Time:
              </label>
              <input
                type="time"
                id="requestTime"
                name="requestTime"
                value={formData.requestTime}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green transition-all duration-200 hover:border-clinic-green/50 input-focus"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
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
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default RequestFormModal;

