import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  Home,
  LocalCafe,
  Report,
  People,
  School,
  Group,
  Event,
  Notifications,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function SideHeader() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home /> },
    { name: "CafeController", path: "/cafe", icon: <LocalCafe /> },
    { name: "Complains", path: "/complain", icon: <Report /> },
    { name: "Students", path: "/student", icon: <People /> },
    { name: "Acadamics", path: "/Acadamics", icon: <School /> },
    { name: "SocialClubs", path: "/SocialClubs", icon: <Group /> },
    { name: "Event", path: "/Event", icon: <Event /> },
    { name: "Permission", path: "/Permission", icon: <People /> },
    { name: "Notification", path: "/Notification", icon: <Notifications /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 300,
        flexShrink: 0,
        height: "100vh", // Full screen height
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
          height: "100vh", // Full screen height
        },
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            backgroundColor: "#e0e0e0",
            marginBottom: "2px",
          }}
        />
        <Typography variant="h6" fontWeight="bold" color="textPrimary">
          User
        </Typography>
        <Typography variant="caption" color="purple">
          Admin
        </Typography>
      </div>
      <Divider />
      {/* Navigation Menu */}
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            component={Link}
            to={item.path}
            sx={{
              padding: "7px 24px",
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
