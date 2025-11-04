import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import bgClinic from '../../assets/images/bg-clinic.png';
import { env } from '../../config/env';

interface RegistrationForm {
  id: string;
  fullname: string;
  yearSection: string;
  schoolIdNumber: string;
  departmentCourse: string;
  formToRequest: string;
  purpose: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

const RegistrationStudent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    yearSection: '',
    schoolIdNumber: '',
    departmentCourse: '',
    formToRequest: '',
    purpose: '',
  });

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API_URL}/api/registrations`);
      const data = await response.json();

      if (data.success) {
        setRegistrations(data.data);
      } else {
        setError(data.message || 'Failed to fetch registrations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${env.API_URL}/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowAddForm(false);
        setFormData({
          fullname: '',
          yearSection: '',
          schoolIdNumber: '',
          departmentCourse: '',
          formToRequest: '',
          purpose: '',
        });
        fetchRegistrations();
      } else {
        alert(data.message || 'Failed to add registration');
      }
    } catch (err) {
      console.error('Error adding registration:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleDelete = async (registrationId: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      const response = await fetch(`${env.API_URL}/api/registrations/${registrationId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchRegistrations();
      } else {
        alert(data.message || 'Failed to delete registration');
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
      alert('Network error. Please try again.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <AdminTopBar onMenuClick={toggleSidebar} />

        {/* Content with Background */}
        <main className="flex-1 relative overflow-auto">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url(${bgClinic})` }}
          />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Registration</h1>
                <div className="flex gap-2">
                  <button
                    onClick={fetchRegistrations}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover transition-colors text-sm sm:text-base"
                  >
                    {showAddForm ? 'Cancel' : 'Add Registration'}
                  </button>
                </div>
              </div>

              {/* Add Registration Form */}
              {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Student Registration</h2>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fullname *
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year & Section *
                      </label>
                      <input
                        type="text"
                        name="yearSection"
                        value={formData.yearSection}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="e.g., 3rd Year - Section A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School ID Number *
                      </label>
                      <input
                        type="text"
                        name="schoolIdNumber"
                        value={formData.schoolIdNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="Enter school ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department/Course *
                      </label>
                      <input
                        type="text"
                        name="departmentCourse"
                        value={formData.departmentCourse}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="Enter department/course"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Form to Request *
                      </label>
                      <input
                        type="text"
                        name="formToRequest"
                        value={formData.formToRequest}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="e.g., Medical Certificate"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose *
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent"
                        placeholder="Enter purpose"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover transition-colors font-medium"
                      >
                        Add Registration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
                  <p className="mt-4 text-gray-600">Loading registrations...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {!loading && !error && registrations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No student registrations found.</p>
                  <p className="text-gray-500 text-sm mt-2">Click "Add Registration" to start adding students.</p>
                </div>
              )}

              {!loading && !error && registrations.length > 0 && (
                <div className="overflow-x-auto">
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-4">
                    {registrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{registration.fullname}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {registration.status || 'Active'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Year & Section:</span> {registration.yearSection}
                          </p>
                          <p>
                            <span className="font-medium">School ID:</span> {registration.schoolIdNumber}
                          </p>
                          <p>
                            <span className="font-medium">Department/Course:</span> {registration.departmentCourse}
                          </p>
                          <p>
                            <span className="font-medium">Form to Request:</span> {registration.formToRequest}
                          </p>
                          <p>
                            <span className="font-medium">Purpose:</span> {registration.purpose}
                          </p>
                          <p className="text-xs text-gray-500 mt-3">
                            Registered: {formatDate(registration.createdAt)}
                          </p>
                        </div>
                        {/* Action Buttons */}
                        <div className="mt-4">
                          <button
                            onClick={() => handleDelete(registration.id)}
                            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <table className="hidden sm:table w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Fullname
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Year & Section
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          School ID
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Department/Course
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Form to Request
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Purpose
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium">
                            {registration.fullname}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {registration.yearSection}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {registration.schoolIdNumber}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {registration.departmentCourse}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {registration.formToRequest}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {registration.purpose}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              {registration.status || 'Active'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <button
                              onClick={() => handleDelete(registration.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium"
                              title="Delete Registration"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && registrations.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Total Registrations: <span className="font-semibold">{registrations.length}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrationStudent;
