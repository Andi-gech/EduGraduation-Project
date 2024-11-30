import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchcheckdinner() {
  const Fetchqr = async () => {
    return await axios.get(
      `http://192.168.1.15:3000/cafe/check/breakfast/66f2e6fd05d3db70941ef1d2`
    );
  };

  return useQuery({
    queryKey: ["fechqr"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
