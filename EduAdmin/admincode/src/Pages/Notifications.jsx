import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import { FiAlignLeft } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";

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
    (newNotification) =>
      Api.post("/Notification/all", newNotification),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        setNotificationContent("");
      },
    }
  );

  // Mutation to add a push notification
  const addPushNotificationMutation = useMutation(
    (newPushNotification) =>
      Api.post(
        "/Notification/all",
        newPushNotification
      ),
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
  const handleChange = (e) => {
    setNotificationContent(e.target.value);
  };

  // Handle notification type change
  const handleTypeChange = (e) => {
    setNotificationType(e.target.value);
  };

  // Handle notification type option change (General / Notice)
  const handleNotificationTypeOptionChange = (e) => {
    setNotificationTypeOption(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (notificationType === "normal") {
      addMutation.mutate({
        notification: notificationContent,
        type: notificationTypeOption, // Add type to the notification payload
      });
    } else {
      addPushNotificationMutation.mutate({ notification: notificationContent });
    }
  };

  // Handle notification deletion
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  

  if (isError)
    return (
      <p className="text-red-500 text-center mt-4">
        Error fetching notifications
      </p>
    );

  return (
    <div className="p-4 bg-white min-h-screen">
    
      <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
                <div className="flex items-center">
                  <FiAlignLeft size={30} color="orange" />
                  <h2 className="ml-4 text-2xl text-black font-bold">Notifications </h2>
                </div>
              
            

     
       
     </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="col-span-1">
          <div className="bg-white relative p-6 rounded-lg shadow-lg h-96 w-[450px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Existing Notifications</h2>
           {
              isLoading && <IsLoading />
           }

            <ul>
              {notifications?.map((notification) => (
                <li
                  key={notification._id}
                  className="flex justify-between items-center border-b py-3"
                >
                  <span>{notification.notification}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(notification._id)}
                    disabled={deleteMutation.isLoading}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

     
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add a New Notification</h2>
            <form onSubmit={handleSubmit}>
            
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Notification Type</label>
                <select
                  value={notificationType}
                  onChange={handleTypeChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="normal">Normal Notification</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>

             {notificationType === "normal" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Notification Type Option</label>
                  <select
                    value={notificationTypeOption}
                    onChange={handleNotificationTypeOptionChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="general">General</option>
                    <option value="notice">Notice</option>
                  </select>
                </div>
              )}

            
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Notification Content</label>
                <textarea
                  name="notification"
                  value={notificationContent}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={addMutation.isLoading || addPushNotificationMutation.isLoading}
              >
                {addMutation.isLoading || addPushNotificationMutation.isLoading ? (
                  <div className="animate-spin border-t-4 border-white border-solid rounded-full h-6 w-6 mx-auto"></div>
                ) : notificationType === "normal" ? (
                  "Add Normal Notification"
                ) : (
                  "Add Push Notification"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
