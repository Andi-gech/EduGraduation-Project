import { DataGrid } from "@mui/x-data-grid";
import { FaCheck, FaTimes } from "react-icons/fa";
import UseFechCafeGateReport from "../../hooks/UseFechCafeGateReport";
import { FiArrowLeftCircle } from "react-icons/fi";
import IsLoading from "../Components/IsLoading";
import { useState, useMemo } from "react";
import UseFetchTransaction from "../../hooks/UseFetchTransaction";

export default function Transactions() {
  const { data, isLoading } = UseFetchTransaction();


  const [filterDate, setFilterDate] = useState({
    type: "today", 
    startDate: null,
    endDate: null,
  });


  const filterRows = (rows) => {
    if (!rows) return [];

    if (filterDate.type === "today") {
      const today = new Date().setHours(0, 0, 0, 0);
      return rows.filter(
        (row) => new Date(row.Date).setHours(0, 0, 0, 0) === today
      );
    }
    if (filterDate.type === "range") {
      const { startDate, endDate } = filterDate;
      return rows.filter((row) => {
        const rowDate = new Date(row.Date).getTime();
        return (
          rowDate >= new Date(startDate).getTime() &&
          rowDate <= new Date(endDate).getTime()
        );
      });
    }
    if (filterDate.type === "month") {
      const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const monthEnd = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );
      return rows.filter((row) => {
        const rowDate = new Date(row.Date).getTime();
        return rowDate >= monthStart.getTime() && rowDate <= monthEnd.getTime();
      });
    }
    if (filterDate.type === "year") {
      const yearStart = new Date(new Date().getFullYear(), 0, 1);
      const yearEnd = new Date(new Date().getFullYear(), 12, 31);
      return rows.filter((row) => {
        const rowDate = new Date(row.Date).getTime();
        return rowDate >= yearStart.getTime() && rowDate <= yearEnd.getTime();
      });
    }
    return rows;
  };

  const rows = useMemo(() => {
    const mappedRows = data?.data?.map((item, index) => ({
      id: item._id || index + 1, // Use item._id if available, otherwise fallback to index + 1
      _id: item.transactionId,
      amount: item.amount + " Birr",
      Date: item.transactionDate,
      mode: item.paymentMethod ==="test"? "Chapa":"manual",
      no: index + 1,
      profilepic: item.user?.profilePic,
     
      fullname: `${item.user?.firstName} ${item.user?.lastName}`,
      Status: item.status,
    }));
    return filterRows(mappedRows);
  }, [data, filterDate]);


  const columns = [
    { field: "no", headerName: "No", width: 50 },
    {field:"profilepic", headerName:"Photo", width: 60,renderCell: (params) => {
      return (
        <img
        src={`https://eduapi.senaycreatives.com/`+ params.value}
        
       
        className='w-[40px] h-[40px] rounded-full bg-zinc-100'
    
      />
      );
    },},
    { field: "fullname", headerName: "Full Name", width: 160 },
   
    { field: "_id", headerName: "Txn id", width: 260 },
   { field: "mode", headerName: "Mode", width: 70 },
    { field: "amount", headerName: "amount", width: 100 },
    
    
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return params.value ? (
<div className="flex h-[60px] items-center justify-center">
          <div className=" bg-green-600  px-3 rounded-full h-[24px] flex items-center justify-center">
            <p className="text-white font-bold">Approved</p>
          </div>
          </div>
        ) : (
          <div className="h-[60px] flex items-center justify-center">
            <FaTimes style={{ color: "red" }} />
            <p>Rejected</p>
          </div>
        );
      },
    },
  
    {
      field: "Date",
      headerName: "Date",
      width: 100,
      valueFormatter: (params) => new Date(params).toLocaleDateString(),
    },
  ];

  return (
    <div className="w-full  flex flex-col px-[20px] ">
      
      {isLoading && <IsLoading />}

    
      <div className="flex items-center mb-5  h-[40px] ">
        <select
          value={filterDate.type}
        
          
          onChange={(e) => setFilterDate({ ...filterDate, type: e.target.value })}
          className="border px-5 py-3 bg-white rounded-md shadow-sm shadow-zinc-100 "
        >
           <option  value="today" style={{ backgroundColor: 'lightblue', color: 'black' }}>
 <button className="bg-r"> <FiArrowLeftCircle size={20} /> Today </button> 
  </option>
  <option value="range" style={{ fontWeight: 'bold', color: 'green' }}>
    Date Range
  </option>
  <option value="month" style={{ fontStyle: 'italic', color: 'purple' }}>
    This Month
  </option>
  <option value="year" style={{ textDecoration: 'underline', color: 'red' }}>
    This Year
  </option>
        </select>

        {filterDate.type === "range" && (
          <div className="">
            <input
              type="date"
              value={filterDate.startDate || ""}
              
              onChange={(e) =>
                setFilterDate({ ...filterDate, startDate: e.target.value })
              }
              className="mr-2 p-2  font-normal"
            />
            <input
              type="date"
              value={filterDate.endDate || ""}
              onChange={(e) =>
                setFilterDate({ ...filterDate, endDate: e.target.value })
              }
              className="p-2"
            />
          </div>
        )}
        
      </div>

    
     

      <div className="w-full h-[450px]">
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
