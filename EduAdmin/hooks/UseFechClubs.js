import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchclub() {
  const Fetchqr = async () => {
    return await axios.get(`http://eduapi.senaycreatives.com/Social`);
  };

  return useQuery({
    queryKey: ["fechclubs"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
