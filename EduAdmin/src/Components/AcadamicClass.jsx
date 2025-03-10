import React from 'react';
import UseFetchClasses from '../../hooks/UseFetchClasses';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiCalendar, FiArrowRight } from 'react-icons/fi';

const DEPARTMENTS = [
  "Computer Science",
  "Electronics",
  "Civil",
  "Mechanical",
  "Electrical",
  "Aeronautical",
  "Production",
  "Chemical",
  "Motor Vehicles"
];

export default function AcademicClass() {
  const navigate = useNavigate();
  const { data, isLoading } = UseFetchClasses();

  const groupedData = useMemo(() => {
    const initialData = DEPARTMENTS.reduce((acc, dept) => {
      acc[dept] = Array.from({ length: 5 }, (_, i) => ({
        yearLevel: i + 1,
        semisters: [1, 2]
      }));
      return acc;
    }, {});

    if (!data?.data) return initialData;

    data.data.forEach(item => {
      const department = item.department || "Unknown Department";
      if (DEPARTMENTS.includes(department)) {
        const yearIndex = initialData[department].findIndex(
          y => y.yearLevel === item.yearLevel
        );
        if (yearIndex !== -1) {
          initialData[department][yearIndex] = {
            ...initialData[department][yearIndex],
            ...item
          };
        }
      }
    });

    return initialData;
  }, [data]);

  return (
    <div className='w-full h-[500px] overflow-hidden'>
      <div className="w-full h-full p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto">
        {DEPARTMENTS.map((department) => (
          <div key={department} className="mt-6 mb-8">
            <div className="flex items-center mb-4">
              <FiBook className="text-gray-900 mr-2 text-xl" />
              <h2 className="text-xl font-semibold text-gray-900">{department}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupedData[department]?.map((item, index) => (
              <div
              key={`${department}-${index}`}
              className="bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md p-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FiUsers className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-md font-semibold text-gray-900">
                      Year {item.yearLevel}
                    </h3>
                  </div>
            
                  {[1, 2].map((semester) => (
                    <div
                      key={semester}
                      className="flex items-center text-sm text-gray-600 ml-7 mb-1 cursor-pointer hover:text-blue-400 transition-colors"
                      onClick={() => navigate(`/Courseoffering/${department}/${item.yearLevel}/${semester}`)}
                    >
                      <FiCalendar className="mr-2 w-4 h-4" />
                      <span>Semester {semester}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}