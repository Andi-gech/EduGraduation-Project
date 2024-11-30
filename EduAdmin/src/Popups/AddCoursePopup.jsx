/* eslint-disable react/prop-types */
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import UseFetchUser from "../../hooks/UseFetchUser";
import UseFetchCourses from "../../hooks/UseFechCourses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import IsLoading from "../Components/IsLoading";

const AddCoursePopup = ({ onClose, offeringid }) => {
  const [newCourse, setNewCourse] = useState({
    courseId: "",
    teacherId: "",
    Schedule: [],
  });
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const { data: teachersData, isLoading: isLoadingTeachers } = UseFetchUser();
  const { data: coursesData, isLoading: isLoadingCourses } = UseFetchCourses();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) =>
      axios.put(
        `http://192.168.1.15:3000/enrollment/add/course/${offeringid}`,
        data
      ),
    mutationKey: "addCourse",
    onSuccess: (data) => {
      console.log("Course added successfully!", data);
      queryClient.invalidateQueries("addCourse");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to add course", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSchedule = () => {
    if (selectedDay && selectedStartTime && selectedEndTime) {
      setNewCourse((prev) => ({
        ...prev,
        Schedule: [
          ...prev.Schedule,
          { day: selectedDay, Start: selectedStartTime, End: selectedEndTime },
        ],
      }));
      // Clear selections after adding
      setSelectedDay("");
      setSelectedStartTime("");
      setSelectedEndTime("");
    }
  };

  const handleSave = () => {
    console.log("New Course Details:", newCourse);
    mutation.mutate(newCourse); // Send the new course data
  };

  return (
    <div className="absolute z-20 top-0 flex h-full w-full backdrop-blur-sm items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 md:w-96 transition-transform transform duration-300 overflow-scroll">
        <h2 className="text-xl font-bold mb-4 text-center">
          ADD Course Details
        </h2>
        {(isLoadingTeachers || isLoadingCourses || mutation.isLoading) && (
          <IsLoading />
        )}

        <p className="text-sm text-gray-500">Course</p>
        <Select
          name="courseId"
          value={newCourse.courseId || ""}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="" disabled>
            Select a Course
          </MenuItem>
          {coursesData?.data?.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.Coursename} ({course.Coursecode})
            </MenuItem>
          ))}
        </Select>

        <p className="text-sm text-gray-500">Instructor</p>
        <Select
          name="teacherId"
          value={newCourse.teacherId || "Not Assigned"}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Not Assigned" disabled>
            Not Assigned
          </MenuItem>
          {teachersData?.data?.map((teacher) => (
            <MenuItem key={teacher._id} value={teacher._id}>
              {teacher.firstName} {teacher.lastName}
            </MenuItem>
          ))}
        </Select>

        <p className="text-sm text-gray-500">Schedule</p>
        <div className="flex flex-col">
          <Select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="" disabled>
              Select Day
            </MenuItem>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
          <TextField
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
            label="Start Time"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            value={selectedEndTime}
            onChange={(e) => setSelectedEndTime(e.target.value)}
            label="End Time"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleAddSchedule}
            variant="contained"
            color="primary"
            className="mt-2"
          >
            Add Schedule
          </Button>
        </div>

        {/* Display Schedule Items */}
        {newCourse.Schedule.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Added Schedule:</h3>
            <ul className="list-disc pl-5">
              {newCourse.Schedule.map((scheduleItem, index) => (
                <li key={index}>
                  {scheduleItem.day} from {scheduleItem.Start} to{" "}
                  {scheduleItem.End}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Add Course
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

export default AddCoursePopup;
