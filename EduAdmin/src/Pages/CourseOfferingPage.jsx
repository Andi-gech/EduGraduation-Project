import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaPlus, FaEye } from "react-icons/fa";
import { FiAlignLeft } from "react-icons/fi";
import { useParams } from "react-router-dom";
import UseFetchCourseOffering from "../../hooks/UseFetchCourseOffering";
import CourseDetailPopup from "../Popups/CourseDetailPopup";
import AddCoursePopup from "../Popups/AddCoursePopup";

export default function CourseOfferingPage() {
  const { department, year, semester } = useParams();
  const { data, isLoading } = UseFetchCourseOffering(
    department,
    year,
    semester
  );

  const [addCourse, setAddCourse] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [course, setCourse] = useState(null);

  const calculateTotalCreditHours = (courses) =>
    courses?.reduce(
      (acc, course) => acc + (course?.course?.creaditHrs || 0),
      0
    );

  const rows = data?.data?.courses.map((course) => ({
    id: course?._id,
    courseCode: course?.course?.Coursecode,
    title: course?.course?.Coursename,
    instructor: course?.teacher
      ? `${course?.teacher?.firstName} ${course?.teacher?.lastName}`
      : "Not Assigned",
    creditHours: course?.course?.creaditHrs,
  }));

  const columns = [
    { field: "courseCode", headerName: "Course Code", width: 150 },
    { field: "title", headerName: "Course Title", width: 250 },
    { field: "instructor", headerName: "Instructor", width: 200 },
    { field: "creditHours", headerName: "Credit Hrs", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCourse({
              id: params.row.id,
              offeringid: data?.data?._id,
              courseCode: params.row?.courseCode,
              title: params.row?.title,
              instructor: params.row?.instructor,
              creditHours: params.row?.creditHours,
            });
            setViewDetail(true);
          }}
          startIcon={<FaEye />}
        >
          View
        </Button>
      ),
    },
  ];

  const handleClose = () => {
    setViewDetail(false);
    setCourse(null);
    setAddCourse(false);
  };

  return (
    <Box
      sx={{
        width: "80%",

        mx: "auto",

        p: 3,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item display="flex" alignItems="center">
          <FiAlignLeft size={30} style={{ marginRight: "10px" }} />
          <Typography variant="h5" fontWeight="bold">
            Year {year} {department} Course Offerings
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FaPlus />}
            onClick={() => setAddCourse(true)}
          >
            Add New Course
          </Button>
        </Grid>
      </Grid>

      {/* Semester & Credit Hours Info */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1" fontWeight="bold">
          Semester: {semester}
        </Typography>
        <Typography variant="body1" fontWeight="bold" color="error">
          Total Credit Hours: {calculateTotalCreditHours(data?.data?.courses)}{" "}
          {calculateTotalCreditHours(data?.data?.courses) > 18 &&
            "(Overloaded)"}
        </Typography>
      </Paper>

      {/* Loading Indicator */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      {/* Data Grid */}
      {!isLoading && (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
          />
        </Box>
      )}

      {/* Add Course Popup */}
      {addCourse && (
        <AddCoursePopup onClose={handleClose} offeringid={data?.data?._id} />
      )}

      {/* Course Detail Popup */}
      {viewDetail && (
        <CourseDetailPopup
          onClose={handleClose}
          id={course.id}
          course={course}
        />
      )}
    </Box>
  );
}
