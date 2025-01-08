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

import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import UseFetchpermissions from "../../hooks/UseFechPermission";

export default function Permission() {
  const { data, isLoading } = UseFetchpermissions(); // Hook to fetch complaints or permissions data
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a permission
  const deleteMutation = useMutation({
    mutationFn: (data) => {
      return axios.delete(`http://eduapi.senaycreatives.com/permissions/${data.id}`, data);
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
      return axios.put(`http://eduapi.senaycreatives.com/permissions/update/${id}`, {
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
  const rows = data?.data?.map((item) => ({
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
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <FiArrowLeftCircle size={30} style={{ marginRight: 10 }} />
          <Typography variant="h6" fontWeight="bold">
            Permissions
          </Typography>
        </div>
      </div>

      {/* Success and Error Messages */}
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

      {/* DataGrid Section */}
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
