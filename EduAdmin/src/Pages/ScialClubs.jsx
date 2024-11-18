import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseFetchclub from "../../hooks/UseFechClubs";

export default function ScialClubs() {
  const { data } = UseFetchclub();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    clubname: "",
    clubdescription: "",
  });

  const mutation = useMutation({
    mutationFn: async (newSocial) => {
      return await axios.post("http://192.168.1.15:3000/Social", newSocial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("fechinactiveuser");
      setFormData({ clubname: "", clubdescription: "" });
    },
    onError: (error) => {
      console.error("Error creating social club:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex flex-col h-scree w-full">
      <Typography variant="h4" className="mb-4 text-center text-gray-800">
        Create a New Social Club
      </Typography>
      <Card className="mb-6 bg-white shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              name="clubname"
              label="Club Name"
              value={formData.clubname}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              name="clubdescription"
              label="Club Description"
              value={formData.clubdescription}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Creating..." : "Create Club"}
            </Button>
          </form>

          {mutation.isError && (
            <p className="text-red-500 mt-4">
              Error creating club: {mutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex-grow overflow-y-auto">
        <Typography variant="h6" className="mb-2 text-gray-800">
          Existing Clubs
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((club) => (
            <Card
              key={club._id}
              className="border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <CardContent>
                <Typography variant="subtitle1" className="font-bold">
                  {club.clubname}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {club.clubdescription}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
