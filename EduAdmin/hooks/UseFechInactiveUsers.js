import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchInactiveUser() {
  const Fetchuser = async () => {
    return await axios.get(`http://localhost:3000/auth/inactive`);
  };

  return useQuery({
    queryKey: ["fechinactiveuser"],
    queryFn: Fetchuser,
    refetchOnWindowFocus: false,
  });
}
