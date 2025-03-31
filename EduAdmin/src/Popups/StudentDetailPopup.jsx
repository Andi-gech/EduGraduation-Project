/* eslint-disable react/prop-types */
import { Input, Button } from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";
import UseFetchEachUser from "../../hooks/UseFetchEachUser";
import { useEffect } from "react";

export default function StudentDetailPopup({ onclose, id }) {
  const { data, refetch } = UseFetchEachUser(id);

  // Ensure refetch is called when id changes
  useEffect(() => {
    if (id) {
      refetch(); // Refetch student data when id changes
    }
  }, [id, refetch]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-opacity-80 bg-zinc-100 z-50 flex items-center justify-center">
      <div className="w-[900px] h-auto p-6 rounded-lg shadow-lg bg-white">
        <div className="flex items-center justify-between border-b pb-4">
          <p className="text-2xl font-semibold text-gray-800">
            Student Details
          </p>
          <AiFillCloseCircle
            onClick={onclose}
            className="text-[30px] text-red-600 cursor-pointer"
          />
        </div>

        <div className="w-full flex mt-4 px-[20px] flex-row">
          <img
            src={`https://eduapi.senaycreatives.com/${data?.data?.profilePic}`}
            alt="Avatar"
            className="w-[250px] h-[250px] rounded-md shadow-lg"
          />

          <div className="flex flex-col ml-10">
            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">First Name:</p>
              <Input
                value={data?.data?.firstName}
                sx={{
                  outline: "none",
                  border: "none",
                  boxShadow: "none",
                }}
                className="w-[250px] h-[40px] px-3  rounded-md"
              />
            </div>

            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">Last Name:</p>
              <Input
                value={data?.data?.lastName}
                sx={{
                  outline: "none",
                  border: "none",
                  boxShadow: "none",
                }}
                className="w-[250px] h-[40px] px-3  rounded-md"
              />
            </div>

            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">Gender:</p>
              <Input
                value={data?.data?.gender}
                sx={{
                  outline: "none",
                  border: "none",
                  boxShadow: "none",
                }}
                className="w-[250px] h-[40px] px-3  rounded-md"
              />
            </div>

            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">Email:</p>
              <Input
                value={data?.data?.email}
                sx={{
                  outline: "none",
                  border: "none",
                  boxShadow: "none",
                }}
                className="w-[250px] h-[40px] px-3  rounded-md"
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="contained"
                color="primary"
                className="w-[150px] h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
