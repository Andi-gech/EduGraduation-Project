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
    _id: index,

    firstName: student.firstName,
    lastName: student.lastName,
    email: student.auth.email,
    Role: student.auth.Role,
    authid: student.auth._id,

    enrollmentDate: student.date,
    profilePic: student.profilePic, // Assuming profilePic field exists
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "Role", headerName: "Role", width: 150 },
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
          View
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
    // Implement the approval logic here
    console.log("Approved student:", selectedStudent);
    handleCloseModal();
  };

  return (
    <div className="w-[80%] relative bg-white flex flex-col mx-[10px] my-[15px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FaArrowCircleLeft
            size={30}
            onClick={() => navigate(-1)}
            className="text-[26px] font-bold text-black cursor-pointer"
          />
          <p className="font-bold text-black mx-3">STUDENT VERIFICATIONS</p>
        </div>
      </div>
      {isLoading && <IsLoading />}

      <div style={{ height: 700, width: "100%", marginTop: 20 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Modal for Viewing and Approving Student Verification */}
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
