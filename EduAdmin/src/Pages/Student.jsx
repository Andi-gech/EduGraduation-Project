import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import UseFetchUser from "../../hooks/UseFetchUser"; // Assuming you have a hook to fetch student data
import { FaQrcode, FaUserCheck, FaUserPlus } from "react-icons/fa";
import { FiAlignLeft } from "react-icons/fi";
import StudentDetailPopup from "../Popups/StudentDetailPopup";
import AddStudentPopup from "../Popups/AddStudentPopup";
import { useState } from "react";
import IsLoading from "../Components/IsLoading";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const { data, isLoading } = UseFetchUser();
  const [addStudent, setAddStudent] = useState(false);

  const [viewdetail, setviewdetail] = useState(false);
  const [id, setid] = useState(null);
  const navigate = useNavigate();

  const rows = data?.data?.map((student, index) => ({
    id: student._id, // This 'id' field is mandatory for DataGrid
    _id: index,
    fullName: student.firstName + " " + student.lastName,
    lastName: student.lastName,
    email: student.auth.email,
    department: student.Class.department,
    semister: student.Class.semister,
    yearLevel: student.Class.yearLevel,

    enrollmentDate: student.date,
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "fullName", headerName: "Full Name", width: 200 },

    { field: "email", headerName: "Email", width: 250 },
    { field: "department", headerName: "Department", width: 200 },
    { field: "semister", headerName: "Semester", width: 100 },
    { field: "yearLevel", headerName: "Year Level", width: 100 },
    {
      field: "actions",
      headerName: "View",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              console.log(params.row.id, "idddddddds");
              setid(params.row.id);
              setviewdetail(true);
            }} // Navigate to student details page
            variant="contained"
            color="primary"
          >
            View
          </Button>
        );
      },
    },
  ];
  const onclose = () => {
    setviewdetail(false);
    setid(null);
    setAddStudent(false);
  };

  return (
    <div className="w-[80%] relative bg-white flex flex-col mx-[10px] my-[15px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FiAlignLeft size={30} className="text-[26px] font-bold text-black" />
          <p className="font-bold text-black mx-3">STUDENT</p>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div
            onClick={() => {
              navigate("/student/verifications");
            }}
            className=" w-[200px] mx-2 py-2 bg-zinc-100 hover:bg-zinc-100 cursor-pointer rounded-full flex flex-row items-center justify-center"
          >
            <p className="text-sm text-black mx-2"> Verfication Request </p>
            <FaUserCheck
              size={20}
              className="text-[20px] font-bold text-black"
            />
          </div>
          <div
            onClick={() => {
              setAddStudent(true);
            }}
            className=" w-[200px] mx-2 py-2 bg-zinc-900 hover:bg-zinc-600 cursor-pointer rounded-full flex flex-row items-center justify-center"
          >
            <p className="text-sm text-white mx-2">ADD NEW STUDENT </p>
            <FaUserPlus
              size={20}
              className="text-[20px] font-bold text-white"
            />
          </div>
          <div
            onClick={() => {
              navigate("/student/IdentityCard");
            }}
            className=" w-[140px] py-2 bg-zinc-900 hover:bg-zinc-600 cursor-pointer rounded-full flex flex-row items-center justify-center"
          >
            <p className="text-sm text-white mx-2">DIGITAL ID</p>
            <FaQrcode size={20} className="text-[20px] font-bold text-white" />
          </div>
        </div>
      </div>
      {isLoading && <IsLoading />}
      <AddStudentPopup open={addStudent} onClose={onclose} />
      {viewdetail && <StudentDetailPopup onclose={onclose} id={id} />}

      <div style={{ height: 700, width: "100%", marginTop: 20 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
