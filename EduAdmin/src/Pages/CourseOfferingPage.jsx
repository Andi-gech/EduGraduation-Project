import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material"; // Hook to fetch course data
import { FaPlus, FaEye } from "react-icons/fa";

import IsLoading from "../Components/IsLoading";
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
  const calculateTotalCreditHours = (courses) => {
    return courses?.reduce(
      (acc, course) => acc + (course?.course?.creaditHrs || 0),
      0
    );
  };

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
          variant="contained"
          color="primary"
        >
          <FaEye className="mr-1" />
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
    <div className="w-[80%] overflow-hidden relative mx-auto my-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <FiAlignLeft size={30} className="text-black" />
          <h1 className="text-2xl font-bold ml-3">
            Year {year} {department} Course Offerings
          </h1>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setAddCourse(true)}
            className="flex items-center px-4 py-2 bg-zinc-900 hover:bg-zinc-600 text-white rounded-full"
          >
            <FaPlus size={20} className="mr-2" />
            Add New Course
          </button>
        </div>
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <p className="font-bold">Semester: {semester}</p>
        <p className="font-bold text-red-500">
          Total Credit Hours: {calculateTotalCreditHours(data?.data?.courses)}
          {calculateTotalCreditHours(data?.data?.courses) > 18
            ? " (Overloaded)"
            : ""}
        </p>
      </div>
      {isLoading && <IsLoading />}
      {addCourse && (
        <AddCoursePopup onClose={handleClose} offeringid={data?.data._id} />
      )}

      {viewDetail && (
        <CourseDetailPopup
          onClose={handleClose}
          id={course.id}
          course={course}
        />
      )}
      <div style={{ height: 380, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
