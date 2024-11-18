import { DataGrid } from "@mui/x-data-grid";
import { FaCheck, FaTimes } from "react-icons/fa";
import UseFechCafeGateReport from "../../hooks/UseFechCafeGateReport";
import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";

export default function Cafe() {
  const { data, isLoading } = UseFechCafeGateReport();

  const rows = data?.data?.map((item) => ({
    id: item._id, // This 'id' field is mandatory for DataGrid
    _id: item._id,
    BreakFast: item.BreakFast,
    Date: item.Date,
    Dinner: item.Dinner,
    Lunch: item.Lunch,
    FirstName: item.user?.firstName,
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    {
      field: "BreakFast",
      headerName: "BreakFast",
      width: 100,
      renderCell: (params) => {
        return params.value ? (
          <div className=" h-[60px]  flex items-center justify-center">
            <FaCheck style={{ color: "green" }} />
          </div>
        ) : (
          <div className=" h-[60px]  flex items-center justify-center">
            <FaTimes style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      field: "Dinner",
      headerName: "Dinner",
      width: 100,
      renderCell: (params) => {
        return params.value ? (
          <div className=" h-[60px]  flex items-center justify-center">
            <FaCheck style={{ color: "green" }} />
          </div>
        ) : (
          <div className=" h-[60px]  flex items-center justify-center">
            <FaTimes style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      field: "Lunch",
      headerName: "Lunch",
      width: 100,
      renderCell: (params) => {
        return params.value ? (
          <div className=" h-[60px]  flex items-center justify-center">
            <FaCheck style={{ color: "green" }} />
          </div>
        ) : (
          <div className=" h-[60px]  flex items-center justify-center">
            <FaTimes style={{ color: "red" }} />
          </div>
        );
      },
    },
    { field: "FirstName", headerName: "First Name", width: 150 },
    {
      field: "Date",
      headerName: "Date",
      width: 100,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
  ];

  return (
    <div className="w-[80%] bg-white flex flex-col px-[20px] py-[20px]">
      <div className="flex flex-row w-full items-center">
        <FiArrowLeftCircle
          size={30}
          className="text-[26px] font-bold text-black"
        />
        <p className="font-bold text-black mx-3">CAFE GATE</p>
      </div>
      {isLoading && <IsLoading />}

      <div style={{ height: 700, width: "100%", marginTop: 30 }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
