import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiAlignLeft } from "react-icons/fi";

export default function CafeCataloge() {
  const navigate = useNavigate();
  return (
    <div className="w-[80%] bg-white flex flex-col px-[20px] py-[20px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FiAlignLeft size={30} className="text-[26px] font-bold text-black" />
          <p className="font-bold text-black mx-3">Dashboard</p>
        </div>
      </div>
      <div className="flex flex-row mt-[30px]">
        <Button
          sx={{
            marginInline: 3,
          }}
          className="w-[200px] h-[200px] mx-3  text-white"
          onClick={() => navigate("/cafe/addsubscription")}
          variant="contained"
          color="primary"
        >
          ADD SUBSCRIPTIONS
        </Button>
        <Button
          sx={{
            marginInline: 3,
          }}
          className="w-[200px] h-[200px]  mx-3"
          variant="contained"
          color="primary"
          onClick={() => navigate("/cafe/subscription")}
        >
          GET SUBSCRIPTION REPORT
        </Button>

        <Button
          sx={{
            marginInline: 3,
          }}
          variant="contained"
          color="primary"
          onClick={() => navigate("/cafe/gate")}
        >
          GET CAFE GATE REPORT
        </Button>
      </div>
    </div>
  );
}
