import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material"; // Only using MUI for Button
import { FaArrowCircleLeft } from "react-icons/fa";

import IsLoading from "../Components/IsLoading";

import { useNavigate } from "react-router-dom";
import ApprovalPopup from "../Popups/ApprovalPopup";
import UseFetchInactiveUser from "../../hooks/UseFechInactiveUsers";

export default function Verification() {
  const { data, isLoading } = UseFetchInactiveUser();
  const navigate = useNavigate();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const rows = data?.data?.map((student, index) => ({
    id: student._id,
    _id: index+1,

    firstName: student.firstName,
    lastName: student.lastName,
    email: student.auth.email,
    Role: student.auth.Role,
    authid: student.auth._id,

    enrollmentDate: student.date,
    profilePic: student.profilePic, 
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "Role", headerName: "Role", width: 150 },
    { field: "enrollmentDate", headerName: "Registation Date", width: 150,renderCell: (params) => {
      return new Date(params.value).toLocaleDateString();
    }
    },
    {
      field: "actions",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => handleOpenModal(params.row)}
          variant="contained"
          color="primary"
        >
        Update
        </Button>
      ),
    },
  ];

  const handleOpenModal = (student) => {
    console.log("Selected student:", student);
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handleApprove = () => {
    
    console.log("Approved student:", selectedStudent);
    handleCloseModal();
  };

  return (
    <div className="w-full  flex flex-col  ">
      
      {isLoading && <IsLoading />}

      <div style={{ height: 500, width: "100%", marginTop: 20 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {openModal && (
        <ApprovalPopup
          id={selectedStudent.id}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          authid={selectedStudent.authid}
        />
      )}
    </div>
  );
}
