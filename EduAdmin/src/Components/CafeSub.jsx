import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseFetchCafeSubscription from "../../hooks/UseFetchCafeSubscription";

export default function CafeSub() {
  const { data, isLoading } = UseFetchCafeSubscription();
  const [sucess, setsucess] = useState(null);
  const [error, seterror] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.delete(
        "http://eduapi.senaycreatives.com/cafe/unsubscribe/" + data.id,
        data
      );
    },
    onSuccess: () => {
      setsucess("Subscription deleted Successfully");
      queryClient.invalidateQueries(["fechsub"]);
      setTimeout(() => {
        setsucess(null);
      }, 3000);
    },
    onError: (error) => {
      console.log(error, "error Message");
      seterror(error.response.data || "error ocured");
      setTimeout(() => {
        seterror(null);
      }, 3000);
    },
  });

  const rows = data?.data?.map((item) => ({
    id: item._id, // This 'id' field is mandatory for DataGrid
    No: data?.data?.indexOf(item) + 1,
    location: item.location,
    user: item.user?.firstName,
    paymentMethod: item.paymentMethod,
    startdate: item.startdate,
    enddate: item.enddate,
  }));

  const columns = [
    { field: "No", headerName: "No", width: 50 },
    { field: "location", headerName: "Location", width: 100 },
    { field: "user", headerName: "first Name", width: 150 },
    { field: "paymentMethod", headerName: "Payment Method", width: 150 },
    {
      field: "startdate",
      headerName: "Start Date",
      width: 100,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
    {
      field: "enddate",
      headerName: "End Date",
      width: 100,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
    {
      field: "selected",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => mutation.mutate({ id: params.row.id })}
            variant="contained"
            color="warning"
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <div className="w-full  flex flex-col  ">
      
 <div className="w-full h-[450px]">
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    
    </div>
  );
}
