import {
  Box,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  Grid,
  Tooltip,
} from "@mui/material";
import { FiAlignLeft } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
} from "recharts";
import { PieChart } from "@mui/x-charts/PieChart";
import UseFetchDepartment from "../../hooks/UseFechDepartment";
import UseFetchCafeSubscription from "../../hooks/UseFetchCafeSubscription";
import UseFetchUser from "../../hooks/UseFetchUser";

export default function Dashboard() {
  const { data: subs } = UseFetchCafeSubscription();
  const { data: users } = UseFetchUser();
  const { data } = UseFetchDepartment();

  const pieChartData =
    data?.data?.map((item) => ({
      name: item?.department,
      value: item?.count || 0,
    })) || [];

  return (
    <Box sx={{ padding: "16px", width: "100%", backgroundColor: "#fff" }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <FiAlignLeft size={30} />
          <Typography variant="h6" fontWeight="bold" ml={2}>
            Dashboard
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "25px",
              "& .MuiOutlinedInput-root": { pl: 2 },
            }}
          />
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 2 }}>
              <FaBell size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Section */}
      <Typography variant="subtitle1" mb={1}>
        Number Statistics
      </Typography>
      <Grid container spacing={2} mb={3}>
        <StatCard title="Total Students" count={users?.data?.length} />
        <StatCard title="Total Subscriptions" count={subs?.data?.length} />
        <StatCard title="Total Departments" count={data?.data?.length} />
        <StatCard
          title="Total In Compound Students"
          count={users?.data?.filter((user) => user?.incomponund)?.length}
        />
      </Grid>

      {/* Graphs Section */}
      <Typography variant="subtitle1" mb={1}>
        Graph Representation
      </Typography>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box sx={{ flexGrow: 1, marginRight: 2, maxWidth: "750px" }}>
          <AreaChart
            width={750}
            height={200}
            data={data?.data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="department" />
            <YAxis />
            <RechartTooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 200,
            height: 200,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <PieChart
            series={[
              {
                data: pieChartData,
                innerRadius: 30,
                outerRadius: 70,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 90,
                cy: 90,
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}

const StatCard = ({ title, count }) => {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {count || 0}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
