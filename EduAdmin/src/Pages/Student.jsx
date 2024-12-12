import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, Stack, IconButton } from "@mui/material";
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
  const [viewDetail, setViewDetail] = useState(false);
  const [id, setId] = useState(null);
  const navigate = useNavigate();

  const rows = data?.data?.map((student, index) => ({
    id: student._id, // This 'id' field is mandatory for DataGrid
    _id: index,
    fullName: student.firstName + " " + student.lastName,
    email: student.auth.email,
    department: student.Class.department,
    semester: student.Class.semister,
    yearLevel: student.Class.yearLevel,
    enrollmentDate: student.date,
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 50 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "department", headerName: "Department", width: 200 },
    { field: "semester", headerName: "Semester", width: 100 },
    { field: "yearLevel", headerName: "Year Level", width: 100 },
    {
      field: "actions",
      headerName: "View",
      width: 100,
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
    },
  ];

  const onClose = () => {
    setViewDetail(false);
    setId(null);
    setAddStudent(false);
  };

  return (
    <Box
      sx={{
        width: "75%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 3,

          color: "black",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <FiAlignLeft size={30} />
          <Typography variant="h6">STUDENT</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={() => navigate("/student/verifications")}
            sx={{
              bgcolor: "secondary.light",
              color: "white",
              "&:hover": { bgcolor: "secondary.dark" },
            }}
          >
            <FaUserCheck size={20} />
          </IconButton>
          <IconButton
            onClick={() => setAddStudent(true)}
            sx={{
              bgcolor: "success.main",
              color: "white",
              "&:hover": { bgcolor: "success.dark" },
            }}
          >
            <FaUserPlus size={20} />
          </IconButton>
          <IconButton
            onClick={() => navigate("/student/IdentityCard")}
            sx={{
              bgcolor: "error.main",
              color: "white",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            <FaQrcode size={20} />
          </IconButton>
        </Stack>
      </Box>

      {isLoading && <IsLoading />}

      <AddStudentPopup open={addStudent} onClose={onClose} />
      {viewDetail && <StudentDetailPopup onclose={onClose} id={id} />}

      <Box sx={{ height: 430, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography>No students found.</Typography>
              </Box>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
