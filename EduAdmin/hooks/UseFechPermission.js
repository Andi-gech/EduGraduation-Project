import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchpermissions() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:3000/permissions/new`);
  };

  return useQuery({
    queryKey: ["fechpermission"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
