/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import UseFetchUser from "../../hooks/UseFetchUser";
import UseFetchCourses from "../../hooks/UseFechCourses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import IsLoading from "../Components/IsLoading";
import Api from "../utils/Api";
import UseFetchTeacher from "../../hooks/UseFetchTeacher";

const AddCoursePopup = ({ onClose, offeringid }) => {
  const [newCourse, setNewCourse] = useState({
    courseId: "",
    teacherId: "",
    Schedule: [],
  });
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const { data: teachersData, isLoading: isLoadingTeachers } = UseFetchTeacher();
  const { data: coursesData, isLoading: isLoadingCourses } = UseFetchCourses();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) =>
     
      Api.put(
        `/enrollment/add/course/${offeringid}`,
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
      setSelectedDay("");
      setSelectedStartTime("");
      setSelectedEndTime("");
    }
  };

  const handleSave = () => {
    console.log("data", newCourse);
    mutation.mutate(newCourse);
  };

  const handleRemoveSchedule = (index) => {
    setNewCourse((prev) => ({
      ...prev,
      Schedule: prev.Schedule.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
          width: { xs: "90%", sm: "400px" },
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" textAlign="center" mb={2}>
          Add Course Details
        </Typography>
        {(isLoadingTeachers || isLoadingCourses || mutation.isLoading) && (
          <IsLoading />
        )}

        {/* Course Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="course-select-label">Course</InputLabel>
          <Select
            labelId="course-select-label"
            name="courseId"
            value={newCourse.courseId || ""}
            onChange={handleInputChange}
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
        </FormControl>

        {/* Instructor Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="teacher-select-label">Instructor</InputLabel>
          <Select
            labelId="teacher-select-label"
            name="teacherId"
            value={newCourse.teacherId || ""}
            onChange={handleInputChange}
          >
            <MenuItem value="" disabled>
              Select an Instructor
            </MenuItem>
            {teachersData?.data?.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.firstName} {teacher.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Schedule Section */}
        <Typography variant="subtitle1" mt={2}>
          Schedule
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="day-select-label">Day</InputLabel>
          <Select
            labelId="day-select-label"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
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
        </FormControl>
        <TextField
          label="Start Time"
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.target.value)}
          fullWidth
          margin="normal"
          type="time"
        />
        <TextField
          label="End Time"
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.target.value)}
          fullWidth
          margin="normal"
          type="time"
        />
        <Button
          onClick={handleAddSchedule}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          Add Schedule
        </Button>

        {/* Display Added Schedule */}
        {newCourse.Schedule.length > 0 && (
          <List>
            {newCourse.Schedule.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveSchedule(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${item.day} from ${item.Start} to ${item.End}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Action Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSave}>
            Add Course
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCoursePopup;
