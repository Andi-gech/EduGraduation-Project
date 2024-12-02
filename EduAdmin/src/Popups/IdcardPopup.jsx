/* eslint-disable react/prop-types */
import { Button, TextField } from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseFetchEachIdCard from "../../hooks/UseFechEachIdCard";

export default function IdcardPopup({ onClose, id }) {
  const { data, refetch } = UseFetchEachIdCard(id);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    EnglishFirstName: "",
    AmharicFirstName: "",
    EnglishLastName: "",
    AmharicLastName: "",
    IDNumber: "",
    DateOfBirth: "",
    National: "",
    Gender: "",
    Qr: "",
    IdPhoto: null,
    DateOfIssue: "",
    DateOfExpiry: "",
    isCompleted: false,
  });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  useEffect(() => {
    if (data?.data) {
      setFormData({
        EnglishFirstName: data.data.EnglishFirstName,
        AmharicFirstName: data.data.AmharicFirstName,
        EnglishLastName: data.data.EnglishLastName,
        AmharicLastName: data.data.AmharicLastName,
        IDNumber: data.data.IDNumber,
        DateOfBirth: data.data.DateOfBirth
          ? new Date(data.data.DateOfBirth).toISOString().split("T")[0]
          : "",
        National: data.data.National,
        isCompleted: data.data.isComplete,
        Gender: data.data.Gender,
        Qr: data.data.Qr,
        IdPhoto: null,
        DateOfIssue: data.data.DateOfIssue
          ? new Date(data.data.DateOfIssue).toISOString().split("T")[0]
          : "",
        DateOfExpiry: data.data.DateOfExpiry
          ? new Date(data.data.DateOfExpiry).toISOString().split("T")[0]
          : "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const formDataToSend = new FormData();
      Object.keys(updatedData).forEach((key) => {
        formDataToSend.append(key, updatedData[key]);
      });
      return await axios.put(
        `http://eduapi.senaycreatives.com/user/update/Digitalid/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    mutationKey: ["updateIdCard"],
    onSuccess: () => {
      queryClient.invalidateQueries("fechinactiveuser");
      onClose();
    },
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        IdPhoto: files[0],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  const previewImage = formData.IdPhoto
    ? URL.createObjectURL(formData.IdPhoto)
    : data?.data?.Photo;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-opacity-90 bg-gray-200 z-50 flex items-center justify-center">
      <div className="w-[90%] max-w-[800px] h-[90%] p-6 rounded-lg shadow-lg bg-white overflow-y-auto border border-gray-300">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <p className="text-2xl font-semibold text-gray-800">
            Update Student ID Card
          </p>
          <AiFillCloseCircle
            onClick={onClose}
            className="text-[30px] text-red-600 cursor-pointer hover:scale-110 transition-transform"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            name="EnglishFirstName"
            label="First Name (English)"
            value={formData.EnglishFirstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            name="AmharicFirstName"
            label="First Name (Amharic)"
            value={formData.AmharicFirstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            name="EnglishLastName"
            label="Last Name (English)"
            value={formData.EnglishLastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            name="AmharicLastName"
            label="Last Name (Amharic)"
            value={formData.AmharicLastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            name="IDNumber"
            label="ID Number"
            value={formData.IDNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            type="date"
            name="DateOfBirth"
            label="Date of Birth"
            value={formData.DateOfBirth}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            name="National"
            label="Nationality"
            value={formData.National}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            name="Gender"
            label="Gender"
            value={formData.Gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          {previewImage && (
            <img
              src={
                previewImage
                  ? `http://eduapi.senaycreatives.com/${data?.data?.Photo}`
                  : previewImage
              }
              alt="Preview"
              className="w-[100px] h-[100px] mb-4 rounded-md border border-gray-300"
            />
          )}
          <input
            type="file"
            name="Photo"
            accept="image/*"
            onChange={handleChange}
            className="col-span-2 mb-4 border border-gray-300 rounded-md p-2"
          />
          <TextField
            type="date"
            name="DateOfIssue"
            label="Date of Issue"
            value={formData.DateOfIssue}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            type="date"
            name="DateOfExpiry"
            label="Date of Expiry"
            value={formData.DateOfExpiry}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-gray-500 mr-2">Is Completed</p>
            <input
              type="checkbox"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isCompleted: e.target.checked,
                }))
              }
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="contained"
            color="primary"
            className="w-[150px] h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-md mr-2 shadow-md"
            onClick={handleSubmit}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="w-[150px] h-[40px] bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
