import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchcheckdinner() {
  const Fetchqr = async () => {
    return await axios.get(
      `https://eduapi.senaycreatives.com/cafe/check/breakfast/66f2e6fd05d3db70941ef1d2`
    );
  };

  return useQuery({
    queryKey: ["fechqr"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
