import { useState } from "react";
import {
  
  Button,
 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaPlus,FaEye} from "react-icons/fa";
import { FiAlignLeft } from "react-icons/fi";


import { useParams } from "react-router-dom";

import { useMutation,useQueryClient } from "@tanstack/react-query";
import UseFetchCourseOffering from "../../hooks/UseFetchCourseOffering";
import CourseDetailPopup from "../Popups/CourseDetailPopup";
import AddCoursePopup from "../Popups/AddCoursePopup";
import Api from "../utils/Api";


export default function CourseOfferingPage() {
  const { department, year, semester } = useParams();
  const [sucess, setsucess] = useState(null);
  const [error, seterror] = useState(null);
  const queryClient = useQueryClient();

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

  const rows = data?.data?.courses.map((course,index) => ({
    id: course?._id,
    no: index + 1,
    courseCode: course?.course?.Coursecode,
    title: course?.course?.Coursename,
    instructor: course?.teacher
      ? `${course?.teacher?.firstName} ${course?.teacher?.lastName}`
      : "Not Assigned",
    creditHours: course?.course?.creaditHrs,
  }));

  const columns = [
    { field: "no", headerName: "Number", width: 50 },
    { field: "courseCode", headerName: "Course Code", width: 150 },
    { field: "title", headerName: "Course Title", width: 230 },
    { field: "instructor", headerName: "Instructor", width: 200 },
    { field: "creditHours", headerName: "Credit Hrs", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
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
    {
      field: "action",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => {mutation.mutate({
            courseId: params.row.id,
          })
        console.log(params.row.id)}}
        >
          Delete
        </Button>
      ),
    }
  ];

  const handleClose = () => {
    setViewDetail(false);
    setCourse(null);
    setAddCourse(false);
  };
  const getsuffixtext = (semester) => {
   switch (semester) {
      case "1":
        return "st";
      case "2":
        return "nd";
      case "3":
        return "rd";
      default:
        return "th";
    }
  };
  const mutation = useMutation({
    mutationFn: (datas) =>
      Api.put(
        `/enrollment/remove/course/${data?.data?._id}`,
        datas
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
  
  return (
    <div className="w-full  flex flex-col px-[20px] ">
     
      <div className="flex justify-between items-center h-[70px] mb-5 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
              <div className="flex items-center">
                <FiAlignLeft size={30} color="orange" />
                
                <h2 className="ml-4 text-2xl text-black font-bold">{data?.data?.yearLevel + getsuffixtext(data?.data?.yearLevel) + " Year " + data?.data?.semister + getsuffixtext(data?.data?.semister)+" Semister Course Curriculum " }</h2>
              </div>
               
            
            
            </div>

     
      <div className="p-4 bg-white rounded shadow flex flex-row mb-4">
       <p
          className={`font-semibold ${
            calculateTotalCreditHours(data?.data?.courses) > 18
              ? "text-red-600"
              : ""
          }`}
        >
          Total Credit Hours: {calculateTotalCreditHours(data?.data?.courses)}{" "}
          {calculateTotalCreditHours(data?.data?.courses) > 18 &&
            "(Overloaded)"}
        </p>
        <Button onClick={() => setAddCourse(true)} startIcon={<FaPlus />}/>
      </div>

    
      
    
        <div style={{ height: 440,width:"100%" }} className="   bg-white rounded shadow">
        <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
      

    
      {addCourse && (
        <AddCoursePopup onClose={handleClose} offeringid={data?.data?._id} />
      )}

     
      {viewDetail && (
        <CourseDetailPopup
          onClose={handleClose}
          id={course.id}
          course={course}
        />
      )}
    </div>
  );
}
