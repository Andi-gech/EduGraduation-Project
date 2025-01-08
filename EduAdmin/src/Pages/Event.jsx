import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IsLoading from "../Components/IsLoading";

export default function Event() {
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    eventname: "",
    eventdescription: "",
    eventStartDate: "",
    eventEndDate: "",
  });

  // Feedback messages
  const [openSnackbar, setOpenSnackbar] = useState(null);

  // Fetch events
  const {
    data: events,
    isLoading,
    isError,
  } = useQuery(["events"], async () => {
    const response = await axios.get("http://eduapi.senaycreatives.com/events");
    return response.data;
  });

  // Mutation to add a new event
  const addMutation = useMutation(
    (newEvent) => axios.post("http://eduapi.senaycreatives.com/events", newEvent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events"]); // Refresh events after a successful post
        setOpenSnackbar({
          message: "Event added successfully!",
          severity: "success",
        });
      },
      onError: () => {
        setOpenSnackbar({ message: "Error adding event.", severity: "error" });
      },
    }
  );

  // Mutation to delete an event
  const deleteMutation = useMutation(
    (id) => axios.delete(`http://eduapi.senaycreatives.com/events/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["events"]); // Refresh events after a successful deletion
        setOpenSnackbar({
          message: "Event deleted successfully!",
          severity: "success",
        });
      },
      onError: () => {
        setOpenSnackbar({
          message: "Error deleting event.",
          severity: "error",
        });
      },
    }
  );

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
    setFormData({
      eventname: "",
      eventdescription: "",
      eventStartDate: "",
      eventEndDate: "",
    }); // Reset form fields
  };

  // Handle event deletion
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <IsLoading />;
  if (isError)
    return (
      <div className="text-red-500 text-center">Error fetching events</div>
    );

  return (
    <div className="p-4">
      <Typography variant="h4" align="center" gutterBottom>
        Events
      </Typography>

      <Grid container spacing={4}>
        {/* Events List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2, overflowY: "scroll", height: 450 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            {events?.map((event) => (
              <Card key={event._id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.StartDate} - {event.EndDate}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(event._id)}
                    sx={{ marginTop: 2 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Card>
        </Grid>

        {/* Event Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add New Event
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="eventname"
                label="Event Name"
                value={formData.eventname}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                name="eventdescription"
                label="Event Description"
                value={formData.eventdescription}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                name="eventStartDate"
                label="Start Date"
                type="date"
                value={formData.eventStartDate}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="eventEndDate"
                label="End Date"
                type="date"
                value={formData.eventEndDate}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={addMutation.isLoading}
              >
                {addMutation.isLoading ? "Adding..." : "Add Event"}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar !== null}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(null)}
        message={openSnackbar?.message}
        severity={openSnackbar?.severity}
      />
    </div>
  );
}
