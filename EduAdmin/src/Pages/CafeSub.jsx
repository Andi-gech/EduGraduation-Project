import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseFetchCafeSubscription from "../../hooks/UseFetchCafeSubscription";
import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";

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
    _id: item._id,
    location: item.location,
    user: item.user?.firstName,
    paymentMethod: item.paymentMethod,
    startdate: item.startdate,
    enddate: item.enddate,
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "location", headerName: "Location", width: 100 },
    { field: "user", headerName: "first Name", width: 250 },
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
    <div className="w-[80%] bg-white flex flex-col px-[20px] py-[20px]">
      {isLoading && <IsLoading />}
      <div className="flex flex-row w-full items-center">
        <FiArrowLeftCircle
          size={30}
          onClick={() => window.history.back()}
          className="text-[26px] font-bold text-black"
        />
        <p className="font-bold text-black mx-3">SUBSCRIPTIONS</p>
      </div>

      {sucess && (
        <div className=" rounded-md bg-green-400 absolute right-[100px] top-[30px]   flex items-center justify-center  px-[20px] h-[50px]">
          <p className="text-white">{sucess || "sucess"}</p>
        </div>
      )}
      {error && (
        <div className=" rounded-md bg-red-600 absolute right-[100px] top-[30px]   flex items-center justify-center min-w-[200px] px-[10px] h-[50px]">
          <p className="text-white">{error || "error occured"}</p>
        </div>
      )}

      <div style={{ height: 900, width: "100%", marginTop: 20 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
