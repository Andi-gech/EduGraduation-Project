import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Api from "../utils/Api";
import { Snackbar, Alert } from "@mui/material";

const departments = [
  "Computer Science",
  "Electronics",
  "Civil",
  "Mechanical",
  "Electrical",
  "Aeronautical",
  "Production",
  "Chemical",
  "Motor Vehicles",
];

export default function CreateCourseForm() {
  const [courseData, setCourseData] = useState({
    Coursename: '',
    Coursecode: '',
    creaditHrs: '',
    department: departments[0]
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const mutation = useMutation((newCourse) => 
    Api.post('/enrollment/CreateCourse', newCourse)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(courseData, {
      onSuccess: () => {
        setSuccess("Course created successfully");
        setTimeout(() => setSuccess(null), 3000);
        setCourseData({
          Coursename: '',
          Coursecode: '',
          creaditHrs: '',
          department: departments[0]
        });
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || "Failed to create course";
        setError(errorMessage);
        console.error("Failed to create course", error);
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields remain the same */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
          <input
            type="text"
            name="Coursename"
            value={courseData.Coursename}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Code
          </label>
          <input
            type="text"
            name="Coursecode"
            value={courseData.Coursecode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credit Hours
          </label>
          <input
            type="number"
            name="creaditHrs"
            value={courseData.creaditHrs}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            name="department"
            value={courseData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}