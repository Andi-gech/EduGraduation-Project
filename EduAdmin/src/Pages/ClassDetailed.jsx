import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import { FiBell, FiTrash, FiUpload, FiFile } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useParams } from 'react-router-dom';

export default function ClassDetailed() {
  const { department, year, semester, courseid } = useParams();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [notificationContent, setNotificationContent] = useState("");

  // Fetch Resources
  const { data: resources, isLoading: resourcesLoading } = useQuery(
    ['resources', courseid, department, year, semester],
    async () => {
      const response = await Api.get(
        `/resource/${courseid}?department=${department}&year=${year}&semester=${semester}`
      );
      return response.data;
    }
  );

  // Resource Upload Mutation
  const uploadMutation = useMutation(
    (formData) => Api.post(`/resource/${courseid}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources', courseid, department, year, semester]);
        setSelectedFile(null);
      },
    }
  );

  // Notification Mutation
  const addNotificationMutation = useMutation(
    (newNotification) => Api.post("/Notification/class", {
      department,
      year,
      semester,
      newNotification
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        setNotificationContent("");
      },
    }
  );

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resource', selectedFile);
    formData.append('department', department);
    formData.append('year', year);
    formData.append('semester', semester);
    uploadMutation.mutate(formData);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    addNotificationMutation.mutate({
      notification: notificationContent
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
        <div className="flex items-center">
          <IoMdNotificationsOutline size={30} color="orange" />
          <h2 className="ml-4 text-2xl text-black font-bold">Class Management</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <form onSubmit={handleNotificationSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Notification Content
              </label>
              <textarea
                value={notificationContent}
                onChange={(e) => setNotificationContent(e.target.value)}
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-md text-white font-semibold ${
                addNotificationMutation.isLoading
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={addNotificationMutation.isLoading}
            >
              {addNotificationMutation.isLoading ? "Posting..." : "Post Notification"}
            </button>
          </form>
        </div>

        {/* Resource Management Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Course Resources</h2>
          
          {/* Upload Form */}
          <form onSubmit={handleFileSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resource
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  type="submit"
                  className={`ml-2 px-4 py-2 rounded-md text-white ${
                    uploadMutation.isLoading
                      ? "bg-gray-400"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={uploadMutation.isLoading}
                >
                  <FiUpload className="inline-block" />
                </button>
              </div>
            </div>
          </form>

          {/* Resource List */}
          <div>
            <h3 className="text-lg font-medium mb-3">Uploaded Resources</h3>
            {resourcesLoading ? (
              <IsLoading />
            ) : resources?.length > 0 ? (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FiFile className="text-gray-500 mr-2" />
                      <a
                        href={resource.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {resource.resource.split('/').pop()}
                      </a>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round(resource.size / 1024)} KB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No resources uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}