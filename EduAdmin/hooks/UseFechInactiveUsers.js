import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchInactiveUser() {
  const Fetchuser = async () => {
    return await axios.get(`https://eduapi.senaycreatives.com/auth/inactive`);
  };

  return useQuery({
    queryKey: ["fechinactiveuser"],
    queryFn: Fetchuser,
    refetchOnWindowFocus: false,
  });
}
