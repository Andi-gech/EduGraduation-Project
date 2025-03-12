import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import IsLoading from "../Components/IsLoading";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import UseFetchClasses from "../../hooks/UseFetchClasses";

export default function NotificationManagement() {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  
  const { data: classes, isLoading } = UseFetchClasses();
  const sendNotification = useMutation(
    (notificationData) => Api.post("/Notification/class", notificationData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        setNotificationContent("");
        setSelectedClass("");
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass || !notificationContent) return;
    
    const [department, year, semester] = selectedClass.split("-");
    sendNotification.mutate({
      department,
      year,
      semester,
      newNotification: {
        notification: notificationContent
      }
    });
  };

  if (isLoading) return <IsLoading />;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IoMdNotificationsOutline className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                Send important updates to specific classes
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Choose a class...</option>
                {classes.data?.map(cls => (
                  <option 
                    key={`${cls.department}-${cls.yearLevel}-${cls.semister}`}
                    value={`${cls.department}-${cls.yearLevel}-${cls.semister}`}
                  >
                    {cls.department} - Year {cls.yearLevel} - Semester {cls.semister}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Content
              </label>
              <textarea
                value={notificationContent}
                onChange={(e) => setNotificationContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Write your notification message here..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sendNotification.isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                sendNotification.isLoading 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {sendNotification.isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Notification"
              )}
            </button>

            {/* Status Messages */}
            {sendNotification.isError && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center text-red-600">
                <FiAlertCircle className="flex-shrink-0 mr-3" />
                <span>Error: {sendNotification.error.message}</span>
              </div>
            )}

            {sendNotification.isSuccess && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center text-green-600">
                <FiCheckCircle className="flex-shrink-0 mr-3" />
                <span>Notification sent successfully!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}