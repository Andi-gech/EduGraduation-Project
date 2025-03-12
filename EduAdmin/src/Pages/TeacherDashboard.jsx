import React, { useState } from 'react';
import { FiClock, FiX } from 'react-icons/fi';
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import UseFetchClasses from '../../hooks/UseFetchClasses';

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};

export default function TeacherDashboard() {
  const { data: classes, isLoading } = UseFetchClasses();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [selectedClass, setSelectedClass] = useState(null);

  if (isLoading) return <div>Loading classes...</div>;

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Dashboard Header */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <FaChalkboardTeacher className="text-blue-600 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
          </div>
          <button
            onClick={() => {
              signOut();
              navigate('/login');
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* Statistics Column */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold p-6 border-b text-gray-800">Class Overview</h2>
          <div className="space-y-4 p-6 overflow-y-auto">
            <StatCard 
              title="Total Classes" 
              value={classes?.data?.length || 0}
              icon={<FaChalkboardTeacher className="text-white text-xl" />}
              color="bg-blue-500"
            />
            <StatCard 
              title="Departments" 
              value={new Set(classes?.data?.map(c => c.department))?.size || 0}
              icon={<FaChalkboardTeacher className="text-white text-xl" />}
              color="bg-green-500"
            />
          </div>
        </div>

        {/* Schedule Column */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold p-6 border-b text-gray-800">Class Schedule</h2>
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {classes?.data?.map(cls => (
              <div 
                key={cls._id} 
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => setSelectedClass(cls)}
              >
                <div className="mb-2">
                  <h3 className="font-medium text-gray-800">{cls.course}</h3>
                  <p className="text-sm text-gray-500">{cls.coursecode}</p>
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <FiClock className="mr-2" />
                  <span>Click to view schedule</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {selectedClass.course} ({selectedClass.coursecode})
              </h3>
              <button 
                onClick={() => setSelectedClass(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {selectedClass.department} • Year {selectedClass.yearLevel} • Semester {selectedClass.semister}
                </p>
              </div>
              
              {selectedClass.schedule?.length > 0 ? (
                <div className="space-y-3">
                  {selectedClass.schedule.map(session => (
                    <div key={session._id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FiClock className="mr-2" />
                        <span className="font-medium">{session.day}</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {formatTime(session.Start)} - {formatTime(session.End)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No schedule available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-4 rounded-lg text-white flex items-center justify-between`}>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{title}</p>
    </div>
    <div className="p-3 bg-white bg-opacity-20 rounded-full">
      {icon}
    </div>
  </div>
);