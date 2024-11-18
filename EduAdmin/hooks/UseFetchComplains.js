import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchComplains() {
  const Fetchqr = async () => {
    return await axios.get(`http://192.168.1.15:3000/complain/`);
  };

  return useQuery({
    queryKey: ["fechcomplain"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
