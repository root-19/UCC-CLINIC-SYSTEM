import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import bgClinic from '../../assets/images/bg-clinic.png';
import { env } from '../../config/env';

interface RequestForm {
  id: string;
  fullname: string;
  yearSection: string;
  schoolIdNumber: string;
  department: string;
  assessment: string;
  email: string;
  requestDate?: any;
  status: string;
  createdAt: any;
  updatedAt: any;
}

const RequestedForms = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<RequestForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${env.API_URL}/api/requests`);
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      } else {
        setError(data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
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
      hour12: true,
    });
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      setUpdatingId(requestId);
      const response = await fetch(`${env.API_URL}/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the request in the local state
        setRequests(requests.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus, updatedAt: new Date() }
            : req
        ));
        alert(`Status updated to ${newStatus}. Email notification sent to student.`);
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

  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(requestId);
      const response = await fetch(`${env.API_URL}/api/requests/${requestId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove the request from the local state
        setRequests(requests.filter(req => req.id !== requestId));
        alert('Request deleted successfully.');
      } else {
        alert(data.message || 'Failed to delete request');
      }
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-clinic-green animate-fade-in-up animate-delay-100">Requested Forms</h1>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
                  <p className="mt-4 text-gray-600">Loading requests...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {!loading && !error && requests.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No request forms found.</p>
                </div>
              )}

              {!loading && !error && requests.length > 0 && (
                <div className="overflow-x-auto">
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 shadow-professional card-hover animate-fade-in-up"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{request.fullname}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Year & Section:</span> {request.yearSection}
                          </p>
                          <p>
                            <span className="font-medium">School ID:</span> {request.schoolIdNumber}
                          </p>
                          <p>
                            <span className="font-medium">Department:</span> {request.department}
                          </p>
                          <p>
                            <span className="font-medium">Assessment:</span> {request.assessment}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {request.email}
                          </p>
                          {request.requestDate && (
                            <p>
                              <span className="font-medium">Request Date & Time:</span> {formatDate(request.requestDate)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-3">
                            Submitted: {formatDate(request.createdAt)}
                          </p>
                        </div>
                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(request.id, 'approved')}
                                disabled={updatingId === request.id}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                {updatingId === request.id ? 'Updating...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                disabled={updatingId === request.id}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                {updatingId === request.id ? 'Updating...' : 'Reject'}
                              </button>
                            </>
                          )}
                          {(request.status === 'approved' || request.status === 'rejected') && (
                            <button
                              onClick={() => handleUpdateStatus(request.id, 'pending')}
                              disabled={updatingId === request.id}
                                className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {updatingId === request.id ? 'Updating...' : 'Reset to Pending'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(request.id)}
                            disabled={deletingId === request.id}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {deletingId === request.id ? 'Deleting...' : 'Delete'}
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
                          Department
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                         Form Request
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Request Date & Time
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
                      {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-all duration-200 animate-fade-in">
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                            {request.fullname}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {request.yearSection}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {request.schoolIdNumber}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {request.department}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {request.assessment}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {request.email}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                            {request.requestDate ? formatDate(request.requestDate) : 'N/A'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {getStatusBadge(request.status)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="flex gap-2">
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(request.id, 'approved')}
                                    disabled={updatingId === request.id}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    title="Approve"
                                  >
                                    {updatingId === request.id ? '...' : 'Approve'}
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                    disabled={updatingId === request.id}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    title="Reject"
                                  >
                                    {updatingId === request.id ? '...' : 'Reject'}
                                  </button>
                                </>
                              )}
                              {(request.status === 'approved' || request.status === 'rejected') && (
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'pending')}
                                  disabled={updatingId === request.id}
                                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  title="Reset to Pending"
                                >
                                  {updatingId === request.id ? '...' : 'Reset'}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(request.id)}
                                disabled={deletingId === request.id}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                title="Delete Request"
                              >
                                {deletingId === request.id ? '...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && requests.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Total Requests: <span className="font-semibold">{requests.length}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestedForms;

