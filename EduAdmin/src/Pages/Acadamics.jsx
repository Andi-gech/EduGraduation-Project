import { useMemo } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiAlignLeft } from "react-icons/fi";

import UseFetchClasses from "../../hooks/UseFetchClasses";
import IsLoading from "../Components/IsLoading";

export default function Acadamics() {
  const navigate = useNavigate();
  const { data, isLoading } = UseFetchClasses();

  // Group classes by department
  const groupedData = useMemo(() => {
    if (!data?.data) return {};

    return data.data.reduce((acc, item) => {
      const department = item.department || "Unknown Department";
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(item);
      return acc;
    }, {});
  }, [data]);

  return (
    <div
      style={{
        width: "80%",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        height: "100vh", // Set a fixed height
        overflowY: "auto", // Enable vertical scrolling
        borderRadius: "10px", // Add rounded corners for better UI
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <FiAlignLeft
          size={30}
          style={{ color: "black", marginRight: "10px" }}
        />
        <Typography variant="h4" fontWeight="bold">
          Current Active Academics
        </Typography>
      </div>

      {/* Show loading spinner if data is loading */}
      {isLoading && <IsLoading />}

      {/* Render each department section */}
      {Object.keys(groupedData).map((department) => (
        <div key={department} style={{ marginTop: "30px" }}>
          {/* Department Header */}
          <Typography
            variant="h5"
            style={{
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
            }}
          >
            {department}
          </Typography>

          {/* Render class cards for the department */}
          <Grid container spacing={3}>
            {groupedData[department].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  style={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: "bold", color: "#000" }}
                    >
                      {item.yearLevel === "Graduated"
                        ? "Graduated"
                        : `Year ${item.yearLevel}`}
                    </Typography>
                    {item.semister && (
                      <Typography
                        variant="body2"
                        style={{ marginTop: "5px", color: "#555" }}
                      >
                        Semester {item.semister}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions style={{ justifyContent: "center" }}>
                    {/* Navigate to Course Offering */}
                    <Tooltip title="View detailed course information">
                      <Button
                        variant="contained"
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#1a73e8",
                          color: "#fff",
                        }}
                        onClick={() =>
                          navigate(
                            `/Courseoffering/${department}/${item.yearLevel}/${item.semister}`
                          )
                        }
                      >
                        View Details
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}
