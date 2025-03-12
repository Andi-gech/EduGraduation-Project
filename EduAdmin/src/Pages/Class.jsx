import React from 'react'
import UseFetchClasses from '../../hooks/UseFetchClasses'
import { FiUsers, FiCalendar, FiBook, FiAlertTriangle, FiFolderPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function Class() {
    const { data, isLoading, isError } = UseFetchClasses()
    const navigate = useNavigate()

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    )

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text 2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                        My Assigned Classes
                    </h1>
                    {!isLoading && !isError && (
                        <span className="text-sm text-gray-500">
                            Showing {data?.data?.length || 0} classes
                        </span>
                    )}
                </div>

                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center text-red-600">
                            <FiAlertTriangle className="w-6 h-6 mr-2" />
                            <h3 className="text-lg font-medium">
                                Failed to load classes. Please try again later.
                            </h3>
                        </div>
                    </div>
                )}

                {!isLoading && !isError && data?.data?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <FiFolderPlus className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg mb-2">
                            No classes assigned yet
                        </p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Browse available courses →
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        data?.data?.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/CourseOffering/${item.department}/${item.yearLevel}/${item.semister}/${item.courseid}`)}
                                className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-blue-200 hover:shadow-lg transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                        Year {item.yearLevel}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Semester {item.semister}
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {item.course}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 font-mono">
                                    {item.coursecode}
                                </p>

                                <div className="flex flex-col space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FiUsers className="w-4 h-4 mr-2 text-blue-500" />
                                        <span>Department: {item.department}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiBook className="w-4 h-4 mr-2 text-blue-500" />
                                        <span>Course Code: {item.coursecode}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-blue-600 font-medium">
                                        View Details
                                    </span>
                                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}