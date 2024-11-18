import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchclub() {
  const Fetchqr = async () => {
    return await axios.get(`http://192.168.1.15:3000/Social`);
  };

  return useQuery({
    queryKey: ["fechclubs"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
