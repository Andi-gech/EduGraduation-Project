/* eslint-disable react/prop-types */
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import UseFetchUser from "../../hooks/UseFetchUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import IsLoading from "../Components/IsLoading";

const CourseDetailPopup = ({ onClose, course }) => {
  const [editedCourse, setEditedCourse] = useState({
    id: "",
    offeringid: "",
    courseCode: "",
    title: "",
    instructor: "",
    creditHours: "",
  });
  const { data, isLoading } = UseFetchUser();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) =>
      axios.put(
        `http://192.168.1.15:3000/enrollment/update/teacher/${editedCourse.offeringid}`,
        data
      ),
    mutationKey: "addTeacher",
    onSuccess: (data) => {
      console.log("Student data submitted successfully!");
      console.log("Course Details:", data);
      queryClient.invalidateQueries("addTeacher");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to submit student data", error);
    },
  });

  // Update the local state when course prop changes
  useEffect(() => {
    setEditedCourse(course);
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved Course Details:", {
      id: editedCourse.id,
      instructor: editedCourse.instructor,
    });
    mutation.mutate({
      courseId: editedCourse.id,
      teacherId: editedCourse.instructor,
    });
  };

  return (
    <div className="absolute z-20 top-0 flex h-full w-full backdrop-blur-sm  items-center justify-center">
      <div className="bg-white   rounded-lg shadow-lg p-6 w-80 md:w-96 transition-transform transform duration-300">
        <h2 className="text-xl font-bold mb-4 text-center">
          Edit Course Details
        </h2>
        {(isLoading || mutation?.isLoading) && <IsLoading />}

        <TextField
          label="Course Code"
          variant="outlined"
          name="courseCode"
          value={editedCourse?.courseCode}
          onChange={handleInputChange}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course Title"
          variant="outlined"
          name="title"
          value={editedCourse?.title}
          disabled
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <p className="text-sm text-gray-500">Instructor</p>
        <Select
          name="instructor"
          value={editedCourse?.instructor || "Not Assigned"}
          defaultValue={"Not Assigned"}
          onChange={handleInputChange}
        >
          <MenuItem value="Not Assigned" disabled>
            Not Assigned
          </MenuItem>
          {data?.data?.map((teacher) => (
            <MenuItem key={teacher._id} value={teacher._id}>
              {teacher.firstName} {teacher.lastName}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Credit Hours"
          variant="outlined"
          disabled
          name="creditHours"
          value={editedCourse?.creditHours}
          onChange={handleInputChange}
          type="number"
          fullWidth
          margin="normal"
        />

        <div className="flex justify-end mt-4">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Edit Teacher
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            className="ml-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPopup;
