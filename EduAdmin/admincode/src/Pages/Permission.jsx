import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiAlignLeft, FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import UseFetchpermissions from "../../hooks/UseFechPermission";
import Api from "../utils/Api";

export default function Permission() {
  const { data, isLoading } = UseFetchpermissions(); // Hook to fetch complaints or permissions data
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // New state for filter
  const [filterDate, setFilterDate] = useState(null); // New state for filter by date
  const queryClient = useQueryClient();

  // Mutation for deleting a permission
  const deleteMutation = useMutation({
    mutationFn: (data) => {
      return Api.delete(`/permissions/${data.id}`, data);
    },
    onSuccess: () => {
      setSuccess("Permission deleted successfully");
      queryClient.invalidateQueries(["fetchPermissions"]);
    },
    onError: (error) => {
      setError(error.response?.data || "An error occurred");
    },
  });

  // Mutation for updating the permission status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return Api.put(`/permissions/update/${id}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchPermissions"]);
    },
    onError: (error) => {
      setError(error.message || "Failed to update status");
    },
  });

  // Mapping the data to rows for the DataGrid
  const rows = data?.data
    ?.filter((item) => {
      if (filterStatus === "all") return true;
      return item.status === filterStatus;
    })
    ?.filter((item) => {
      if (!filterDate) return true;
      const permissionDate = new Date(item.permissionDate).toLocaleDateString();
      return permissionDate === new Date(filterDate).toLocaleDateString();
    })
    .map((item) => ({
      id: item._id,
      reason: item.Reason,
      user: item.user, // Assuming user is an ID or can be resolved later
      permissionDate: new Date(item.permissionDate).toLocaleDateString(),
      status: item.status,
    }));

  // Defining columns for the DataGrid
  const columns = [
    { field: "reason", headerName: "Reason", width: 280 },
    { field: "user", headerName: "User", width: 150 },
    {
      field: "permissionDate",
      headerName: "Permission Date",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
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
                : params.row.status === "approved"
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
          <MenuItem value="pending">pending</MenuItem>
          <MenuItem value="approved">approved</MenuItem>
          <MenuItem value="denied">denied</MenuItem>
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
    <div style={{ padding: 20 }}>
      
       <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
                <div className="flex items-center">
                  <FiAlignLeft size={30} color="orange" />
                  <h2 className="ml-4 text-2xl text-black font-bold">Permissions </h2>
                </div>
              
            

     
        <div style={{ display: "flex", gap: "10px" }}>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="denied">Denied</MenuItem>
          </Select>

          <TextField
            label="Filter by Date"
            type="date"
            variant="outlined"
            size="small"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 200 }}
          />
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
      <div style={{ height: 500, width: "100%" }}>
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
