import { DataGrid } from "@mui/x-data-grid";
import { Button, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseFetchComplains from "../../hooks/UseFetchComplains";
import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";

export default function Complain() {
  const { data, isLoading } = UseFetchComplains();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a complaint
  const deleteMutation = useMutation({
    mutationFn: (data) => {
      return axios.delete(
        `http://eduapi.senaycreatives.com/complain/${data.id}`,
        data
      );
    },
    onSuccess: () => {
      setSuccess("complain deleted successfully");
      queryClient.invalidateQueries(["fechcomplain"]);

      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(error.response?.data || "An error occurred");
      setTimeout(() => setError(null), 3000);
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
      queryClient.invalidateQueries(["fechcomplain"]); // Refresh data after successful status change
    },
    onError: (error) => {
      setError(error.message || "Failed to update status");
      setTimeout(() => setError(null), 3000);
    },
  });

  const rows = data?.data?.map((item) => ({
    id: item._id,
    _id: item._id,
    location: item.location,
    complain: item.complain,
    user: item.user?.firstName,
    paymentMethod: item.paymentMethod,
    type: item.type,
    status: item.status,
    AvailableDate: item.date,
  }));

  const columns = [
    { field: "complain", headerName: "Complain", width: 280 },
    { field: "user", headerName: "Complaint Name", width: 150 },
    { field: "type", headerName: "Type", width: 100 },
    {
      field: "AvailableDate",
      headerName: "Available Date",
      width: 200,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => {
            const newStatus = e.target.value;
            updateStatusMutation.mutate({
              id: params.row.id,
              status: newStatus,
            });
          }}
          variant="outlined"
          sx={{
            height: 30,
            borderRadius: "9999px",
            fontSize: 14,
            backgroundColor:
              params.row.status === "pending"
                ? "yellow"
                : params.row.status === "completed"
                ? "green"
                : params.row.status === "rejected"
                ? "red"
                : "white",
            color: params.row.status === "pending" ? "black" : "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
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
      field: "selected",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => deleteMutation.mutate({ id: params.row.id })}
          variant="contained"
          color="warning"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="w-[80%] bg-white flex flex-col px-[20px] py-[20px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FiArrowLeftCircle
            size={30}
            className="text-[26px] font-bold text-black"
          />
          <p className="font-bold text-black mx-3">COMPLAINS</p>
        </div>
      </div>

      {success && (
        <div className="rounded-md bg-green-400 absolute right-[100px] top-[30px] flex items-center justify-center px-[20px] h-[50px]">
          <p className="text-white">{success}</p>
        </div>
      )}
      {(isLoading || updateStatusMutation.isLoading) && <IsLoading />}
      {error && (
        <div className="rounded-md bg-red-600 absolute right-[100px] top-[30px] flex items-center justify-center min-w-[200px] px-[10px] h-[50px]">
          <p className="text-white">{error}</p>
        </div>
      )}

      <div style={{ height: 700, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
