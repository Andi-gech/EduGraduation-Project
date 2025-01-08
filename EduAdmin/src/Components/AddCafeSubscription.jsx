import {
  Button,

  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UseFetchUser from "../../hooks/UseFetchUser";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "./IsLoading";

export default function AddCafeSubscription() {
  const [selectedStudents, setSelectedStudent] = useState([]);
  const [location, setLocation] = useState("Select Location");
  const [sucess, setsucess] = useState(null);
  const [error, seterror] = useState(null);
  const { data, isLoading } = UseFetchUser();

  const columns = [
    { field: "no", headerName: "No", width: 50 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "isMilitary", headerName: "Status", width: 120 ,
      renderCell:(params)=>(
        <div className="flex items-center">
          {params.row.isMilitary ? (
          <p className="text-black">Military</p>
          ) : (
          <p className="text-black">Civilian</p>
          )}
        </div>
      )
    },
    {
      field: "selected",
      headerName: "Select",
      width: 150,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedStudents.includes(params.row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudent((prev) => [...prev, params.row.id]);
            } else {
              setSelectedStudent((prev) =>
                prev.filter((id) => id !== params.row.id)
              );
            }
          }}
        />
      ),
    },
  ];

  const rows = data?.data?.map((item) => ({
    id: item._id,
    no: data?.data?.indexOf(item) + 1,
    firstName: item.firstName,
    lastName: item.lastName,
    isMilitary: item.isMilitary,
  }));

  const mutation = useMutation({
    mutationFn: (data) =>
      axios.post("http://eduapi.senaycreatives.com/cafe/subscribe/manual", data),
    onSuccess: () => {
      setsucess("Subscription Added Successfully");
      setTimeout(() => setsucess(null), 3000);
    },
    onError: (error) => {
      seterror(error.response?.data || "An error occurred");
      setTimeout(() => seterror(null), 3000);
    },
  });

  return (
    <div className="w-full  flex flex-col px-[20px] ">
      
      <div className="flex items-center mb-5 ">
        <div className="flex flex-col">
         
          {selectedStudents.length > 0 && (
           <div className="flex items-center">
         
            <h2 className="ml-4 text-sm py-3 text-orange-400 font-bold">
              {selectedStudents.length} Students Selected
            </h2>
          </div>
          )}

          <div style={{ height: 370, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              
            />
          </div>

          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={location}
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
            >
              <MenuItem value="Select Location">Select Location</MenuItem>
              <MenuItem value="JIJIGA">JIJIGA</MenuItem>
              <MenuItem value="ASMERA">ASMERA</MenuItem>
              <MenuItem value="OTHER">OTHER</MenuItem>
            </Select>
          </FormControl>

          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                mutation.mutate({
                  users: selectedStudents,
                  location,
                });
              }}
              disabled={
                selectedStudents.length === 0 || location === "Select Location"
              }
            >
              Add Subscription
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={sucess !== null}
        autoHideDuration={3000}
        onClose={() => setsucess(null)}
        message={sucess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ width: "100%" }}
      />

      <Snackbar
        open={error !== null}
        autoHideDuration={3000}
        onClose={() => seterror(null)}
        message={error}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ width: "100%" }}
      />
    </div>
  );
}
