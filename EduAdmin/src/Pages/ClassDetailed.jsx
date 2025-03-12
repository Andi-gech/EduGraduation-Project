import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../utils/Api";
import { FiBell, FiTrash, FiUpload, FiFile, FiX } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useParams } from 'react-router-dom';

export default function ClassDetailed() {
  const { department, year, semester, courseid } = useParams();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
 
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

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resource', selectedFile);
    formData.append('department', department);
    formData.append('year', year);
    formData.append('semester', semester);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <IoMdNotificationsOutline className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resources Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {department} - Year {year}, Semester {semester}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Resource Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload New Resource</h2>
            <form onSubmit={handleFileSubmit}>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      {selectedFile ? (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 truncate">
                            {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="inline-block text-gray-400 mb-1" />
                          <p className="text-sm text-gray-500 mt-1">
                            Choose file or drag and drop
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={!selectedFile || uploadMutation.isLoading}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    uploadMutation.isLoading || !selectedFile
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  }`}
                >
                  {uploadMutation.isLoading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Resources</h3>
            {resourcesLoading ? (
              <div className="text-center py-8">
                <IsLoading />
              </div>
            ) : resources?.length > 0 ? (
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource._id}
                    className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FiFile className="text-blue-600" />
                      </div>
                      <a
                        href={resource.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 truncate"
                      >
                        {resource.resource.split('/').pop()}
                      </a>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {(resource.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <FiFile className="inline-block" size={32} />
                </div>
                <p className="text-gray-500">No resources uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}