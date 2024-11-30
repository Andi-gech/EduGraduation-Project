import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchComplains() {
  const Fetchqr = async () => {
    return await axios.get(`https://eduapi.senaycreatives.com/complain/`);
  };

  return useQuery({
    queryKey: ["fechcomplain"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
