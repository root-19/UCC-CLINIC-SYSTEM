import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import bgClinic from '../../assets/images/bg-clinic.png';
import { env } from '../../config/env';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MonthlyData {
  month: string;
  requests: number;
  registrations: number;
  total: number;
}

interface MedicationData {
  medication: string;
  requests: number;
}

interface AssessmentData {
  assessment: string;
  count: number;
}

interface DepartmentData {
  department: string;
  count: number;
}

interface ReportData {
  monthlyData: MonthlyData[];
  medicationData: MedicationData[];
  assessmentData: AssessmentData[];
  departmentData: DepartmentData[];
  totalRequests: number;
  totalRegistrations: number;
  totalStudents: number;
  requestStudents: number;
  registrationStudents: number;
}

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchReports();
  }, [selectedYear, selectedMonth]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.append('year', selectedYear.toString());
      if (selectedMonth) {
        params.append('month', selectedMonth);
      }

      const response = await fetch(`${env.API_URL}/api/reports/medication?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        setError(data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!user) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

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
                <h1 className="text-2xl sm:text-3xl font-bold text-clinic-green animate-fade-in-up animate-delay-100">Monthly Reports</h1>
                <div className="flex gap-2 flex-wrap animate-fade-in-up animate-delay-200">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent text-sm transition-all duration-200 hover:border-clinic-green/50 input-focus shadow-sm"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clinic-green focus:border-transparent text-sm transition-all duration-200 hover:border-clinic-green/50 input-focus shadow-sm"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
                  <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {!loading && !error && reportData && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">Total Request Forms</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.totalRequests}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-medium">Total Student Records</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.totalRegistrations}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium">Total Unique Students</p>
                      <p className="text-2xl font-bold text-purple-900">{reportData.totalStudents}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-sm text-orange-600 font-medium">Medication Types</p>
                      <p className="text-2xl font-bold text-orange-900">{reportData.medicationData.length}</p>
                    </div>
                  </div>

                  {/* Monthly Request Forms and Student Records Chart */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Monthly Request Forms & Student Records
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={reportData.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month" 
                            tickFormatter={formatMonthLabel}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number | undefined, name: string) => {
                              const numValue = value ?? 0;
                              if (name === 'requests') return [`${numValue} requests`, 'Request Forms'];
                              if (name === 'registrations') return [`${numValue} records`, 'Student Records'];
                              return [`${numValue} total`, 'Total'];
                            }}
                            labelFormatter={(label) => `Month: ${formatMonthLabel(label)}`}
                          />
                          <Legend />
                          <Bar dataKey="requests" fill="#3B82F6" name="Request Forms" />
                          <Bar dataKey="registrations" fill="#10B981" name="Student Records" />
                          <Bar dataKey="total" fill="#8B5CF6" name="Total" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Medications Chart */}
                  {reportData.medicationData.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Most Requested Medications
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={reportData.medicationData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="medication" type="category" width={120} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="requests" fill="#10B981" name="Number of Requests" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                              <Pie
                                data={reportData.medicationData as unknown as Array<Record<string, unknown>>}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: unknown) => {
                                  const data = props as MedicationData;
                                  return `${data.medication}: ${data.requests}`;
                                }}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="requests"
                              >
                                {reportData.medicationData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assessment Types Chart */}
                  {reportData.assessmentData && reportData.assessmentData.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Assessment Types from Request Forms
                      </h2>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={reportData.assessmentData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="assessment" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#F59E0B" name="Number of Requests" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Department Chart */}
                  {reportData.departmentData && reportData.departmentData.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Requests & Records by Department
                      </h2>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={reportData.departmentData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="department" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#EC4899" name="Total Count" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {reportData.monthlyData.length === 0 && reportData.totalRequests === 0 && reportData.totalRegistrations === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No data available for the selected period.</p>
                      <p className="text-gray-500 text-sm mt-2">Please select a different year or month, or add request forms and student records.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;

