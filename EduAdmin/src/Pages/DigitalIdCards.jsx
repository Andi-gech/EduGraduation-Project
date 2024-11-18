import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material"; // Only using MUI for Button
import { FaArrowCircleLeft } from "react-icons/fa";
import UseFetchIdCardRequests from "../../hooks/UseFechIdCardRequests";

import IdcardPopup from "../Popups/IdcardPopup";

function DigitalIdCards() {
  const { data, isLoading } = UseFetchIdCardRequests();
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const rows = data?.data?.map((student, index) => ({
    id: student._id,
    _id: index + 1, // For display
    firstName: student.EnglishFirstName,
    lastName: student.EnglishLastName,
    idNumber: student.IDNumber,
    national: student.National,
    gender: student.Gender,
    profilePic: student.Qr,
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "idNumber", headerName: "ID Number", width: 100 },
    { field: "national", headerName: "Nationality", width: 150 },
    { field: "gender", headerName: "Gender", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
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
    setSelectedStudent(student.id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="w-[80%] relative bg-white flex flex-col mx-[10px] my-[15px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FaArrowCircleLeft
            size={30}
            onClick={() => handleCloseModal()}
            className="text-[26px] font-bold text-black cursor-pointer"
          />
          <p className="font-bold text-black mx-3">DIGITAL ID VERIFICATIONS</p>
        </div>
      </div>

      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Uncomment if you want to implement a modal for viewing details */}
      {openModal && (
        <IdcardPopup id={selectedStudent} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default DigitalIdCards;
