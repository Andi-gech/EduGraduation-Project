/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";
import UseFetchEachUser from "../../hooks/UseFetchEachUser";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function ApprovalPopup({ onClose, id, authid }) {
  const { data, refetch } = UseFetchEachUser(id);
  const queryclient = useQueryClient();

  // Ensure refetch is called when id changes
  useEffect(() => {
    if (id) {
      refetch(); // Refetch student data when id changes
    }
  }, [id, refetch]);
  const mutation = useMutation({
    mutationFn: async () => {
      return await axios.put(
        `https://eduapi.senaycreatives.com/auth/approve/${authid}`
      );
    },
    mutationKey: ["approve"],
    onSuccess: () => {
      queryclient.invalidateQueries("fechinactiveuser");
      onClose();
    },
  });

  const handleApprove = () => {
    // Implement the approval logic here
    mutation.mutate();
  };

  const handleReject = () => {
    // Implement the rejection logic here
    console.log("Rejected student:", data?.data);
    onClose(); // Close the popup after rejecting
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-opacity-80 bg-zinc-100 z-50 flex items-center justify-center">
      <div className="w-[900px] h-auto p-6 rounded-lg shadow-lg bg-white">
        <div className="flex items-center justify-between border-b pb-4">
          <p className="text-2xl font-semibold text-gray-800">
            Approve Student Verification
          </p>
          <AiFillCloseCircle
            onClick={onClose}
            className="text-[30px] text-red-600 cursor-pointer"
          />
        </div>

        <div className="w-full flex mt-4 px-[20px] flex-row">
          <img
            src={
              data?.data?.profilePic
                ? `https://eduapi.senaycreatives.com/${data?.data?.profilePic}`
                : "https://via.placeholder.com/250"
            }
            alt="Avatar"
            className="w-[250px] h-[250px] rounded-md shadow-lg"
          />

          <div className="flex flex-col ml-10">
            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">First Name:</p>
              <p className="w-[250px] h-[40px] px-3 rounded-md">
                {data?.data?.firstName}
              </p>
            </div>

            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">Last Name:</p>
              <p className="w-[250px] h-[40px] px-3 rounded-md">
                {data?.data?.lastName}
              </p>
            </div>

            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">Gender:</p>
              <p className="w-[250px] h-[40px] px-3 rounded-md">
                {data?.data?.gender}
              </p>
            </div>

            <div className="flex items-center mb-4">
              <p className="w-[120px] font-bold text-gray-600">Email:</p>
              <p className="w-[250px] h-[40px] px-3 rounded-md">
                {data?.data?.email}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="contained"
                color="primary"
                className="w-[150px] h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-md mr-2"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className="w-[150px] h-[40px] bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={handleReject}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
