import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseFetchclub from "../../hooks/UseFechClubs";

export default function SocialClubs() {
  const { data: clubsData, isLoading: clubsLoading } = UseFetchclub();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    clubname: "",
    clubdescription: "",
  });

  const mutation = useMutation({
    mutationFn: async (newSocial) => {
      return await axios.post("http://eduapi.senaycreatives.com/Social", newSocial);
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
    <Box sx={{ backgroundColor: "#f4f6f9", padding: 4, minHeight: "100vh" }}>
      {/* Page Header */}
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
          marginBottom: 4,
        }}
      >
        Social Clubs Management
      </Typography>

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxHeight: "70vh",
              overflowY: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bbb",
                borderRadius: "6px",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 3 }}
            >
              Create a New Club
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="clubname"
                label="Club Name"
                value={formData.clubname}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={{ marginBottom: 3 }}
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
                sx={{ marginBottom: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Club"
                )}
              </Button>
            </form>
            {mutation.isError && (
              <Typography
                variant="body2"
                sx={{
                  color: "error.main",
                  marginTop: 2,
                  textAlign: "center",
                }}
              >
                Error: {mutation.error.message}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Clubs List Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              maxHeight: "70vh",
              overflowY: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bbb",
                borderRadius: "6px",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginBottom: 3,
                textAlign: "center",
              }}
            >
              Existing Clubs
            </Typography>
            {clubsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {clubsData?.data.map((club) => (
                  <Grid item xs={12} key={club._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", marginBottom: 1 }}
                        >
                          {club.clubname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {club.clubdescription}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between" }}>
                        <Button size="small" color="primary">
                          View Details
                        </Button>
                        <Button size="small" color="secondary">
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
