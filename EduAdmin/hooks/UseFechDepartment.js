import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchDepartment() {
  const Fetchqr = async () => {
    return await axios.get(
      `https://eduapi.senaycreatives.com/report/department`
    );
  };

  return useQuery({
    queryKey: ["fechReport"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
