import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchCafeGateReport() {
  const Fetchqr = async () => {
    return await axios.get(`http://192.168.1.15:3000/cafe/report`);
  };

  return useQuery({
    queryKey: ["fechdata"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
