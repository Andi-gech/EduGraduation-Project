import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseFetchComplains from "../../hooks/UseFetchComplains";
import { FiAlignLeft, FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import { FaBars } from "react-icons/fa";

export default function Complain() {
  const { data, isLoading } = UseFetchComplains();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a complaint
  const deleteMutation = useMutation({
    mutationFn: (data) => {
      return axios.delete(`http://eduapi.senaycreatives.com/complain/${data.id}`, data);
    },
    onSuccess: () => {
      setSuccess("Complain deleted successfully");
      queryClient.invalidateQueries(["fechcomplain"]);
    },
    onError: (error) => {
      setError(error.response?.data || "An error occurred");
    },
  });

  // Mutation for updating the status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return axios.put(`http://eduapi.senaycreatives.com/complain/${id}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fechcomplain"]);
    },
    onError: (error) => {
      setError(error.message || "Failed to update status");
    },
  });

  const rows = data?.data?.map((item) => ({
    id: item._id,
    location: item.location,
    complain: item.complain,
    user: item.user?.firstName + " " + item.user?.lastName,
    paymentMethod: item.paymentMethod,
    type: item.type,
    status: item.status,
    AvailableDate: item.date,
  }));

  const columns = [
    { field: "complain", headerName: "Complain", width: 250 , renderCell:(params)=>(
      <div className="flex items-center w-[250px] text-wrap">
        <p className="text-black">{params.row.complain}</p>
      </div>
    )},

  
    { field: "user", headerName: "Complaint Name", width: 170 },
    { field: "type", headerName: "Type", width: 95 },
    {
      field: "AvailableDate",
      headerName: "Available Date",
      width: 200,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) =>
            updateStatusMutation.mutate({
              id: params.row.id,
              status: e.target.value,
            })
          }
          variant="outlined"
          size="small"
          sx={{
            backgroundColor:
              params.row.status === "pending"
                ? "yellow"
                : params.row.status === "completed"
                ? "green"
                : "red",
            color: params.row.status === "pending" ? "black" : "white",
            fontSize: 12,
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <Button
          onClick={() => deleteMutation.mutate({ id: params.row.id })}
          variant="contained"
          size="small"
          color="error"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen  bg-white w-full m-6 ">
   
<div className="flex justify-between items-center h-[70px] mb-5 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
              <div className="flex items-center">
                <FiAlignLeft size={30} color="orange" />
                
                <h2 className="ml-4 text-2xl text-black font-bold">{"Complains "}</h2>
              </div>
               
            
            
            </div>
    
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

   
      {(isLoading || updateStatusMutation.isLoading) && <IsLoading />}
      <div style={{ height: 530, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              color: "#333",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </div>
    </div>
  );
}
