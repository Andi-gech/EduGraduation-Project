import { Button } from "@mui/material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UseFetchUser from "../../hooks/UseFetchUser";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";

export default function AddCafeSubscription() {
  const [selectedStudents, setSelectedStudent] = useState([]);
  const [sucess, setsucess] = useState(null);
  const [error, seterror] = useState(null);
  const { data, isLoading } = UseFetchUser();
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "firstName", headerName: "firstName", width: 250 },
    { field: "lastName", headerName: "lastName", width: 150 },
    { field: "isMilitary", headerName: "isMilitary", width: 100 },
    {
      field: "selected",
      headerName: "Select",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedStudent([...selectedStudents, params.row.id]);
              } else {
                selectedStudents.splice(
                  selectedStudents.indexOf(params.row.id),
                  1
                );
                setSelectedStudent([...selectedStudents]);
              }
            }}
          />
        );
      },
    },
  ];
  const rows = data?.data?.map((item) => ({
    id: item._id, // This 'id' field is mandatory for DataGrid
    _id: item._id,
    firstName: item.firstName,
    lastName: item.lastName,
    isMilitary: item.isMilitary,
  }));
  console.log(selectedStudents);
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(
        "http://eduapi.senaycreatives.com/cafe/subscribe/manual",
        data
      );
    },
    onSuccess: () => {
      setsucess("Subscription Added Successfully");
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

  return (
    <div className="w-[80%] bg-white flex flex-col px-[20px] py-[20px]">
      {(isLoading || mutation.isLoading) && <IsLoading />}
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FiArrowLeftCircle
            size={30}
            className="text-[26px] font-bold text-black"
          />
          <p className="font-bold text-black mx-3">ADD SUBSCRIPTION </p>
        </div>
      </div>
      <div className="flex flex-col">
        {selectedStudents.length > 0 && (
          <div>
            Selected Students:{" "}
            {selectedStudents.map((item) => (
              <span key={item}>{item},</span>
            ))}
          </div>
        )}
        <div style={{ height: 300, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
        <div className="flex flex-row h-[50px] items-center ">
          <div>Location</div>
          <div className="h-[80%] mx-3 px-3  rounded-md mt-2 flex items-center justify-center">
            <select defaultValue="Select Location">
              <option value="Select Location">SELECT LOCATIONS</option>
              <option value="Location 1">JIJIGA</option>
              <option value="Location 2">ASMERA</option>
              <option value="Location 3">OTHER</option>
            </select>
          </div>
        </div>
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

      <div className="flex justify-end w-[190px]">
        <Button
          onClick={() => {
            console.log({
              users: selectedStudents,
              location: "JIJIGA",
            });
            mutation.mutate({
              users: selectedStudents,
              location: "JIJIGA",
            });
          }}
          disabled={selectedStudents?.length > 0 ? false : true}
          variant="contained"
          color="primary"
        >
          Add Subscription
        </Button>
      </div>
    </div>
  );
}
