import {
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiCoffee, FiFileText, FiLock } from "react-icons/fi";

export default function CafeCataloge() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "80%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        padding: 3,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <FiCoffee size={30} style={{ color: "black" }} />
        <Typography
          variant="h5"
          sx={{ marginLeft: 2, fontWeight: "bold", color: "primary.main" }}
        >
          Cafe Dashboard
        </Typography>
      </Box>

      {/* Button Grid Section */}
      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        {/* Add Subscription Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FiLock size={40} color="black" />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Add Subscription
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/cafe/addsubscription")}
              >
                Go
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Get Subscription Report Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FiFileText size={40} color="black" />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Subscription Report
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/cafe/subscription")}
              >
                View Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Get Cafe Gate Report Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FiCoffee size={40} color="black" />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Cafe Gate Report
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/cafe/gate")}
              >
                View Gate Report
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
