import { useState, useEffect } from 'react';
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
} from 'recharts';

interface MonthlyReportCardProps {
  onClick?: () => void;
}

interface MonthlyData {
  month: string;
  requests: number;
  registrations: number;
  total: number;
}

interface ReportData {
  totalRequests: number;
  totalRegistrations: number;
  totalStudents: number;
  medicationData: Array<{ medication: string; requests: number }>;
  monthlyData: MonthlyData[];
}

const MonthlyReportCard = ({ onClick }: MonthlyReportCardProps) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const response = await fetch(`${env.API_URL}/api/reports/medication?year=${currentYear}`);
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-professional-lg card-hover animate-fade-in-up animate-delay-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 animate-fade-in animate-delay-400">
          Monthly Report Summary
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clinic-green"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total Request Forms</p>
              <p className="text-2xl font-bold text-blue-900">{reportData?.totalRequests || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600 font-medium">Total Student Records</p>
              <p className="text-2xl font-bold text-green-900">{reportData?.totalRegistrations || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-600 font-medium">Total Unique Students</p>
              <p className="text-2xl font-bold text-purple-900">{reportData?.totalStudents || 0}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-orange-600 font-medium">Medication Types</p>
              <p className="text-2xl font-bold text-orange-900">{reportData?.medicationData?.length || 0}</p>
            </div>
          </div>

          {/* Monthly Chart */}
          {reportData?.monthlyData && reportData.monthlyData.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Monthly Request Forms & Student Records
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ResponsiveContainer width="100%" height={300}>
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
          )}
        </>
      )}

      <button
        onClick={onClick}
        className="w-full bg-clinic-green text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md transition-all duration-300 hover:bg-clinic-green-hover hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        View Full Monthly Report
      </button>
    </div>
  );
};

export default MonthlyReportCard;
