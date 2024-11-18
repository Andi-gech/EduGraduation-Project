import { useMemo } from "react";
import { Button } from "@mui/material";
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
    <div className="w-[80%] bg-white flex flex-col px-[20px] py-[20px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FiAlignLeft size={30} className="text-[26px] font-bold text-black" />
          <p className="font-bold text-black mx-3">Current ACTIVE ACADAMICS</p>
        </div>
      </div>

      {/* Show loading spinner if data is loading */}
      {isLoading && <IsLoading />}

      {/* Render each department section */}
      {Object.keys(groupedData).map((department) => (
        <div key={department} className="mt-6">
          {/* Department Header */}
          <h2 className="text-[18px] font-semibold text-black mb-4">
            {department}
          </h2>

          {/* Render class cards for the department */}
          <div className="flex flex-row flex-wrap">
            {groupedData[department].map((item) => (
              <Button
                key={item.id}
                sx={{
                  marginInline: 3,
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                className="w-[200px] h-[200px] mx-3 rounded-md"
                variant="contained"
                onClick={() =>
                  navigate(
                    `/Courseoffering/${department}/${item.yearLevel}/${item.semister}`
                  )
                }
              >
                {item.yearLevel === "Graduated"
                  ? "Graduated"
                  : ` year ${item.yearLevel}`}

                {item.semister && `  semister ${item.semister}`}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
