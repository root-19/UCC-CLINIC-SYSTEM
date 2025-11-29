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
  const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationForm[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
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

  // Get unique departments
  const departments = Array.from(new Set(registrations.map(r => r.departmentCourse).filter(Boolean))).sort();

  // Filter registrations based on search, department, and status
  useEffect(() => {
    let filtered = [...registrations];

    // Filter by status tab
    if (activeTab === 'active') {
      filtered = filtered.filter(r => r.status === 'active');
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(r => r.status === 'inactive');
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(r => r.departmentCourse === selectedDepartment);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.fullname.toLowerCase().includes(query) ||
        r.schoolIdNumber.toLowerCase().includes(query) ||
        r.yearSection.toLowerCase().includes(query) ||
        r.departmentCourse.toLowerCase().includes(query) ||
        r.formToRequest.toLowerCase().includes(query) ||
        r.purpose.toLowerCase().includes(query)
      );
    }

    setFilteredRegistrations(filtered);
  }, [registrations, activeTab, selectedDepartment, searchQuery]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API_URL}/api/registrations`);
      const data = await response.json();

      if (data.success) {
        setRegistrations(data.data);
        setFilteredRegistrations(data.data);
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

  const handleUpdateStatus = async (registrationId: string, newStatus: 'active' | 'inactive') => {
    try {
      setUpdatingId(registrationId);
      const response = await fetch(`${env.API_URL}/api/registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the registration in the local state
        setRegistrations(registrations.map(reg =>
          reg.id === registrationId
            ? { ...reg, status: newStatus, updatedAt: new Date() }
            : reg
        ));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };


  const getStatusBadge = (status: string) => {
    const isActive = status === 'active';
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
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
            <div className="bg-white rounded-xl shadow-professional-lg p-4 sm:p-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-clinic-green animate-fade-in-up animate-delay-100">Student Records</h1>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-6 py-2.5 bg-clinic-green text-white rounded-lg hover:bg-clinic-green-hover hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm sm:text-base font-semibold shadow-md animate-scale-in animate-delay-200"
                >
                  {showAddForm ? 'Cancel' : 'Add Student'}
                </button>
              </div>

              {/* Status Tabs */}
              <div className="mb-6 border-b border-gray-200 animate-fade-in-up animate-delay-200">
                <nav className="flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`py-2.5 px-4 border-b-2 font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'all'
                        ? 'border-clinic-green text-clinic-green scale-105'
                        : 'border-transparent text-gray-500 hover:text-clinic-green hover:border-clinic-green/50'
                    }`}
                  >
                    All Students ({registrations.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-2.5 px-4 border-b-2 font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'active'
                        ? 'border-clinic-green text-clinic-green scale-105'
                        : 'border-transparent text-gray-500 hover:text-clinic-green hover:border-clinic-green/50'
                    }`}
                  >
                    Active ({registrations.filter(r => r.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('inactive')}
                    className={`py-2.5 px-4 border-b-2 font-semibold text-sm transition-all duration-300 ${
                      activeTab === 'inactive'
                        ? 'border-clinic-green text-clinic-green scale-105'
                        : 'border-transparent text-gray-500 hover:text-clinic-green hover:border-clinic-green/50'
                    }`}
                  >
                    Inactive ({registrations.filter(r => r.status === 'inactive').length})
                  </button>
                </nav>
              </div>

              {/* Search and Filter Bar */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, ID, department, form, or purpose..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green focus:border-transparent transition-all duration-200 hover:border-clinic-green/50 input-focus animate-fade-in-up animate-delay-300"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Department Filter */}
                <div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green focus:border-transparent bg-white transition-all duration-200 hover:border-clinic-green/50 input-focus animate-fade-in-up animate-delay-400"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {searchQuery || selectedDepartment ? (
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredRegistrations.length} of {registrations.length} student(s)
                </div>
              ) : null}

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

              {!loading && !error && filteredRegistrations.length === 0 && registrations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No student records found.</p>
                  <p className="text-gray-500 text-sm mt-2">Click "Add Student" to start adding students.</p>
                </div>
              )}

              {!loading && !error && filteredRegistrations.length === 0 && registrations.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No students found matching your filters.</p>
                </div>
              )}

              {!loading && !error && filteredRegistrations.length > 0 && (
                <div className="overflow-x-auto">
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-4">
                    {filteredRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-professional card-hover animate-fade-in-up"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{registration.fullname}</h3>
                          {getStatusBadge(registration.status || 'active')}
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
                        <div className="mt-4 flex gap-2">
                          {registration.status === 'active' ? (
                            <button
                              onClick={() => handleUpdateStatus(registration.id, 'inactive')}
                              disabled={updatingId === registration.id}
                              className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {updatingId === registration.id ? 'Updating...' : 'Set Inactive'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(registration.id, 'active')}
                              disabled={updatingId === registration.id}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {updatingId === registration.id ? 'Updating...' : 'Set Active'}
                            </button>
                          )}
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
                      {filteredRegistrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50 transition-all duration-200 animate-fade-in">
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
                            {getStatusBadge(registration.status || 'active')}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="flex gap-2">
                              {registration.status === 'active' ? (
                                <button
                                  onClick={() => handleUpdateStatus(registration.id, 'inactive')}
                                  disabled={updatingId === registration.id}
                                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  title="Set Inactive"
                                >
                                  {updatingId === registration.id ? '...' : 'Inactive'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(registration.id, 'active')}
                                  disabled={updatingId === registration.id}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  title="Set Active"
                                >
                                  {updatingId === registration.id ? '...' : 'Active'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && filteredRegistrations.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Showing {filteredRegistrations.length} of {registrations.length} student(s)
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
