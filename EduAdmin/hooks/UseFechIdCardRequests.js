import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchIdCardRequests() {
  const Fetchqr = async () => {
    return await axios.get(`http://192.168.1.15:3000/user/getAll/Digitalid`);
  };

  return useQuery({
    queryKey: ["fechIdCardRequests"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
