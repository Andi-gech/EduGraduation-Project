import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import UseFetchUser from '../../hooks/UseFetchUser';
import { Button, Typography } from '@mui/material';
import StudentDetailPopup from '../Popups/StudentDetailPopup';

export default function StudentList() {
    const { data, isLoading } = UseFetchUser();
    const [addStudent, setAddStudent] = useState(false);
    const [viewDetail, setViewDetail] = useState(false);
    const [Selected, setSelected] = useState("Dashboard");
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(null);
    

  
    const rows = data?.data?.map((student, index) => ({
      id: student._id, // This 'id' field is mandatory for DataGrid
      _id: index,
      fullName: student.firstName + " " + student.lastName,
      email: student?.auth?.email,
      department: student?.Class?.department,
      semester: student?.Class?.semister||"N/A",
      yearLevel: student?.Class?.yearLevel,
      enrollmentDate: student.date,
      profilePic: student.profilePic,
    }));
  
    const columns = [
      { field: "_id", headerName: "ID", width: 50 },
      {
        field: "profilePic",
        headerName: "Pic",
        width: 60,
        renderCell: (params) => {
          return (
            <img
            src={`https://eduapi.senaycreatives.com/`+ params.value}
            
           
            className='w-[40px] h-[40px] rounded-full bg-zinc-100'
        
          />
          );
        },
      },
      { field: "fullName", headerName: "Full Name", width: 200 },
      { field: "email", headerName: "Email", width: 190 },
      { field: "department", headerName: "Department", width: 150 },
      { field: "semester", headerName: "Semester", width: 100 },
      { field: "yearLevel", headerName: "Year Level", width: 100 },
      {
        field: "actions",
        headerName: "View",
        width: 80,
        renderCell: (params) => (
          <Button
            onClick={() => {
              setId(params.row.id);
              setViewDetail(true);
            }} // Navigate to student details page
            variant="contained"
            color="primary"
          >
            View
          </Button>
        ),
      }
      
    ];
  
    const onClose = () => {
      setViewDetail(false);
      setId(null);
      setAddStudent(false);
    };
 
  return (
      <div className="w-full  flex flex-col  ">
        {viewDetail && <StudentDetailPopup onclose={onClose} id={id} />}
     
         
    <div className="w-full h-[520px]">
    <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <div className="w-full h-full flex flex-col"
              >
                <Typography>No students found.</Typography>
              </div >
            ),
          }}
        />
         </div>
       
       </div>
  )
}
