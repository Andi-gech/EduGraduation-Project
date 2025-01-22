import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import { FiBell, FiTrash } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function Notifications() {
  const queryClient = useQueryClient();

  const [notificationContent, setNotificationContent] = useState("");
  const [notificationType, setNotificationType] = useState("normal");
  const [notificationTypeOption, setNotificationTypeOption] =
    useState("general");

  // Fetch Notifications
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(["notifications"], async () => {
    const response = await Api.get("/Notification/all");
    return response.data;
  });

  // Mutation to add a new notification
  const addMutation = useMutation(
    (newNotification) => Api.post("/Notification/all", newNotification),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        setNotificationContent("");
      },
    }
  );

  // Mutation to delete a notification
  const deleteMutation = useMutation(
    (id) => Api.delete(`/Notification/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );

  // Handle input change
  const handleChange = (e) => setNotificationContent(e.target.value);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({
      notification: notificationContent
    });
  };

  // Handle notification deletion
  const handleDelete = (id) => deleteMutation.mutate(id);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">
          Error fetching notifications
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
       <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
                     <div className="flex items-center">
                       <IoMdNotificationsOutline size={30} color="orange" />
                       
                       <h2 className="ml-4 text-2xl text-black font-bold">Notification</h2>
                     </div>
                     </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div className="bg-white relative overflow-y-auto h-[500px] w-[500px] rounded-lg shadow-lg px-6">
          <h2 className="text-xl bg-white sticky top-0 left-0 w-full h-[40px] font-semibold mb-4">Existing Notifications</h2>
          {isLoading && <IsLoading />}
          <ul className="space-y-4">
            {notifications?.length === 0 && (
              <p className="text-gray-500">No notifications available</p> )}
            {notifications?.map((notification) => (
              <li
                key={notification._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <span>{notification.notification}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(notification._id)}
                  disabled={deleteMutation.isLoading}
                >
                  <FiTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>

      
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add a New Notification</h2>
          <form onSubmit={handleSubmit}>
          

            {notificationType === "normal" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Notification Type Option
                </label>
                <select
                  value={notificationTypeOption}
                  onChange={(e) => setNotificationTypeOption(e.target.value)}
                  className="w-full mt-2 p-2 border bg-white border-gray-300 rounded-md"
                >
                  <option value="general">General</option>
                  <option value="notice">Notice</option>
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Notification Content
              </label>
              <textarea
                value={notificationContent}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-md text-white font-semibold ${
                addMutation.isLoading
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={addMutation.isLoading}
            >
              {addMutation.isLoading ? "Adding..." : "Add Notification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
