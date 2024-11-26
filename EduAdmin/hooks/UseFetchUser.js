import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchUser() {
  const Fetchqr = async () => {
    return await axios.get(`https://eduapi.senaycreatives.com/user`);
  };

  return useQuery({
    queryKey: ["fechuser"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
