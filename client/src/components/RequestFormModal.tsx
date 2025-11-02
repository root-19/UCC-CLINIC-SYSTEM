import { useState } from 'react';
import Modal from './Modal';
import bgClinic from '../assets/images/bg-clinic.png';
import { env } from '../config/env';

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestFormModal = ({ isOpen, onClose }: RequestFormModalProps) => {
  const [formData, setFormData] = useState({
    fullname: '',
    yearSection: '',
    schoolIdNumber: '',
    departmentCourse: '',
    assessment: '',
    referredTo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${env.API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          fullname: '',
          yearSection: '',
          schoolIdNumber: '',
          departmentCourse: '',
          assessment: '',
          referredTo: '',
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
        <div className="relative bg-white/90 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Request Form
          </h2>
          
          <p className="text-gray-700 text-center mb-6 text-sm sm:text-base">
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
            {/* Fullname */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="fullname" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Fullname:
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                placeholder="Enter your full name"
              />
            </div>

            {/* Year & Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="yearSection" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Year & Section:
              </label>
              <input
                type="text"
                id="yearSection"
                name="yearSection"
                value={formData.yearSection}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                placeholder="e.g., 3rd Year - Section A"
              />
            </div>

            {/* School ID Number */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="schoolIdNumber" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                School ID Number:
              </label>
              <input
                type="text"
                id="schoolIdNumber"
                name="schoolIdNumber"
                value={formData.schoolIdNumber}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                placeholder="Enter your school ID number"
              />
            </div>

            {/* Department/Course */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="departmentCourse" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Department/Course:
              </label>
              <input
                type="text"
                id="departmentCourse"
                name="departmentCourse"
                value={formData.departmentCourse}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                placeholder="Enter your department or course"
              />
            </div>

            {/* Assessment */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="assessment" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Assessment:
              </label>
              <input
                type="text"
                id="assessment"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                placeholder="Enter assessment type"
              />
            </div>

            {/* Referred to */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="referredTo" className="text-gray-700 font-medium sm:w-40 flex-shrink-0">
                Referred to:
              </label>
              <input
                type="text"
                id="referredTo"
                name="referredTo"
                value={formData.referredTo}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green"
                placeholder="Enter referral information"
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
                className="px-6 py-2 bg-clinic-green text-white rounded-lg font-medium hover:bg-clinic-green-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

