import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import IsLoading from "../Components/IsLoading";
import { IoMdNotificationsOutline } from "react-icons/io";
import UseFetchClasses from "../../hooks/UseFetchClasses";


export default function NotificationManagement() {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  
  // Fetch classes with custom hook
  const { data: classes, isLoading, isError } = UseFetchClasses();

  // Notification mutation
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
       <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
               <div className="flex items-center">
                 <IoMdNotificationsOutline size={30} color="orange" />
                 <h2 className="ml-4 text-2xl text-black font-bold">Notification Management</h2>
               </div>
             </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Choose a class</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Content
            </label>
            <textarea
              value={notificationContent}
              onChange={(e) => setNotificationContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white ${
              sendNotification.isLoading 
                ? "bg-gray-400" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={sendNotification.isLoading}
          >
            {sendNotification.isLoading ? "Sending..." : "Send Notification"}
          </button>
        </form>

        {sendNotification.isError && (
          <div className="mt-4 text-red-500">
            Error: {sendNotification.error.message}
          </div>
        )}

        {sendNotification.isSuccess && (
          <div className="mt-4 text-green-500">
            Notification sent successfully!
          </div>
        )}
      </div>
    </div>
  );
}