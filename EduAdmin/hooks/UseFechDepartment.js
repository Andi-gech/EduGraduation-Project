import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchDepartment() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:3000/report/department`);
  };

  return useQuery({
    queryKey: ["fechReport"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
