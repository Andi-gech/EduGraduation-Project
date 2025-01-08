import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Notifications() {
  const queryClient = useQueryClient();

  const [notificationContent, setNotificationContent] = useState("");
  const [notificationType, setNotificationType] = useState("normal"); // Default to normal
  const [notificationTypeOption, setNotificationTypeOption] =
    useState("general"); // Default to General

  // Fetch Notifications
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery(["notifications"], async () => {
    const response = await axios.get("http://eduapi.senaycreatives.com/Notification/all");
    return response.data;
  });

  // Mutation to add a new notification
  const addMutation = useMutation(
    (newNotification) =>
      axios.post("http://eduapi.senaycreatives.com/Notification/all", newNotification),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        setNotificationContent("");
      },
    }
  );

  // Mutation to add a push notification
  const addPushNotificationMutation = useMutation(
    (newPushNotification) =>
      axios.post(
        "http://192.168.1.15:3000/Notification/all",
        newPushNotification
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        setNotificationContent("");
      },
    }
  );

  // Mutation to delete a notification
  const deleteMutation = useMutation(
    (id) => axios.delete(`http://192.168.1.15:3000/Notification/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    }
  );

  // Handle input change
  const handleChange = (e) => {
    setNotificationContent(e.target.value);
  };

  // Handle notification type change
  const handleTypeChange = (e) => {
    setNotificationType(e.target.value);
  };

  // Handle notification type option change (General / Notice)
  const handleNotificationTypeOptionChange = (e) => {
    setNotificationTypeOption(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (notificationType === "normal") {
      addMutation.mutate({
        notification: notificationContent,
        type: notificationTypeOption, // Add type to the notification payload
      });
    } else {
      addPushNotificationMutation.mutate({ notification: notificationContent });
    }
  };

  // Handle notification deletion
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" align="center" mt={4}>
        Error fetching notifications
      </Typography>
    );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Notifications Management
      </Typography>

      <Grid container spacing={4}>
        {/* Notifications List */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 400, overflowY: "scroll" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Existing Notifications
            </Typography>
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  divider
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemText primary={notification.notification} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDelete(notification._id)}
                      disabled={deleteMutation.isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Notification Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Add a New Notification
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* Notification Type Selector */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  value={notificationType}
                  onChange={handleTypeChange}
                  label="Notification Type"
                >
                  <MenuItem value="normal">Normal Notification</MenuItem>
                  <MenuItem value="push">Push Notification</MenuItem>
                </Select>
              </FormControl>

              {/* If Normal Notification is selected, show Notification Type option (General or Notice) */}
              {notificationType === "normal" && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Notification Type Option</InputLabel>
                  <Select
                    value={notificationTypeOption}
                    onChange={handleNotificationTypeOptionChange}
                    label="Notification Type Option"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="notice">Notice</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Notification Content Input */}
              <TextField
                name="notification"
                label="Notification Content"
                value={notificationContent}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  addMutation.isLoading || addPushNotificationMutation.isLoading
                }
              >
                {addMutation.isLoading ||
                addPushNotificationMutation.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : notificationType === "normal" ? (
                  "Add Normal Notification"
                ) : (
                  "Add Push Notification"
                )}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
