import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MonthlyReportCardProps {
  onClick?: () => void;
}

const MonthlyReportCard = ({ onClick }: MonthlyReportCardProps) => {
  const [outerRadius, setOuterRadius] = useState(60);
  const [chartHeight, setChartHeight] = useState(250);

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 640;
      setOuterRadius(isMobile ? 60 : 80);
      setChartHeight(isMobile ? 250 : 300);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  // Sample data based on the image
  const data = [
    { name: 'Big three diseases', value: 86, color: '#3B82F6' },
    { name: 'NTDs', value: 81, color: '#EF4444' },
    { name: 'Infectious diseases', value: 58, color: '#10B981' },
    { name: 'Others', value: 31, color: '#8B5CF6' },
  ];

  const COLORS = data.map(item => item.color);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm text-gray-600">Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-[#D2691E] to-[#B85A1A] rounded-xl p-4 sm:p-6 text-white shadow-professional-lg card-hover animate-fade-in-up animate-delay-300">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 animate-fade-in animate-delay-400">Monthly Report for Reported Illness</h3>
      
      <div className="bg-white rounded-xl p-2 sm:p-4 mb-3 sm:mb-4 overflow-x-auto shadow-inner transition-all duration-300 hover:shadow-lg">
        <div className="w-full" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ value }) => `${value}`}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
              >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="square"
              formatter={(value: string) => value}
              wrapperStyle={{ color: '#000', fontSize: '12px' }}
              className="text-xs sm:text-sm"
            />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={onClick}
        className="w-full bg-white text-[#D2691E] py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        View Monthly Report for Reported Illness
      </button>
    </div>
  );
};

export default MonthlyReportCard;
