import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchInactiveUser() {
  const Fetchuser = async () => {
    return await axios.get(`http://192.168.1.15:3000/auth/inactive`);
  };

  return useQuery({
    queryKey: ["fechinactiveuser"],
    queryFn: Fetchuser,
    refetchOnWindowFocus: false,
  });
}
