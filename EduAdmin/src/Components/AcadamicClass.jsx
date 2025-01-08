import React from 'react'
import UseFetchClasses from '../../hooks/UseFetchClasses';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AcadamicClass() {
    const navigate = useNavigate();

  const { data, isLoading } = UseFetchClasses();
      const groupedData = useMemo(() => {
        if (!data?.data) return {};
    
        return data.data.reduce((acc, item) => {
          const department = item.department || "Unknown Department";
          if (!acc[department]) {
            acc[department] = [];
          }
          acc[department].push(item);
          return acc;
        }, {});
      }, [data]);
    
  return (
    <div className="w-full flex  h-[500px] overflow-x-hidden p-5 overflow-y-auto pt-[300px]  flex-col justify-center">
    {Object.keys(groupedData).map((department) => (
      <div key={department} className="mt-8">

        <h2 className="text-xl font-bold mb-4 text-gray-700">{department}</h2>

  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {groupedData[department].map((item) => (
            <div
              key={item.id}
              className=" bg-gradient-to-r from-orange-300 to-yellow-100 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-700">
                  {item.yearLevel === "Graduated"
                    ? "Graduated"
                    : `Year ${item.yearLevel}`}
                </h3>
                {item.semister && (
                  <p className="text-sm text-gray-600 mt-2">
                    Semester {item.semister}
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-4">
                {/* Navigate to Course Offering */}
                <button
                  className="bg-gradient-to-r from-white  text-black font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg"
                  onClick={() =>
                    navigate(
                      `/Courseoffering/${department}/${item.yearLevel}/${item.semister}`
                    )
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
    </div>
  )
}
