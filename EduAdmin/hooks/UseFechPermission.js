import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchpermissions() {
  const Fetchqr = async () => {
    return await axios.get(`http://eduapi.senaycreatives.com/permissions/new`);
  };

  return useQuery({
    queryKey: ["fechpermission"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
