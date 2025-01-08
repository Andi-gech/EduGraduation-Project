import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material"; // Only using MUI for Button
import { FaArrowCircleLeft, FaCircle, FaCircleNotch, FaEye } from "react-icons/fa";
import UseFetchIdCardRequests from "../../hooks/UseFechIdCardRequests";

import IdcardPopup from "../Popups/IdcardPopup";

function DigitalIdCards() {
  const { data, isLoading } = UseFetchIdCardRequests();
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const rows = data?.data?.map((student, index) => ({
    id: student._id,
    _id: index + 1, 
    firstName: student.EnglishFirstName,
    lastName: student.EnglishLastName,
    idNumber: student.IDNumber,
    national: student.National,
    gender: student.Gender,
    Status: student.isComplete,

    profilePic: student.Photo,
    
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "firstName", headerName: "First Name", width: 120 },
    { field: "lastName", headerName: "Last Name", width: 120 },
    { field: "idNumber", headerName: "ID Number", width: 100 },
    { field: "national", headerName: "Nationality", width: 100 },
    { field: "gender", headerName: "Gender", width: 100 },
    {field: "profilePic", headerName: "Profile Picture", width: 80, renderCell: (params) => {
        return (
          <img
            src={`https:eduapi.senaycreatives.com/`+params.value}
            
            alt="Pp"
            
            className="w-[50px] h-[50px] text-zinc-300 rounded-full bg-zinc-100"
       
          />
        );
      }
    },
    {
      field: "Status",
      headerName: "Status",
      width: 95,
      renderCell: (params) => {
        return params.value ? (
          <div className="h-[60px] flex flex-row items-center justify-center">
            <FaCircle  className="text-green-300" size={10} />
            <p className="text-sm text-zinc-600 font-bold mx-[1px]">active</p>
          </div>
        ) : (
          <div className="h-[60px] flex items-center justify-center">
        <FaCircle  className="text-red-700" size={10} />
        <p className="text-sm text-zinc-600 font-bold mx-[1px]">In-active</p>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Button
          onClick={() => handleOpenModal(params.row)}
          variant="contained"
          color="primary"
        >
          Edit
        </Button>
      ),
    },
    {
      field:"View",
      headerName:"View",
      width:50,
      renderCell:(params)=>(
        <div className="w-full h-full  cursor-pointer justify-center flex items-center">
        <div className="flex flex-row    w-[40px] h-[40px] items-center justify-center">
          <p className="flex  w-[20px]"></p><FaEye color="orange" size={20}/>

          </div>
          </div>
      )
    }
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
    <div className="w-full  flex flex-col  ">
      
    <div className="w-full h-[500px]">
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
