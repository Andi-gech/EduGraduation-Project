import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchGateReport() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:3000/gate/Report`);
  };

  return useQuery({
    queryKey: ["fechGateReport"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
