import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchIdCardRequests() {
  const Fetchqr = async () => {
    return await axios.get(
      `http://eduapi.senaycreatives.com/user/getAll/Digitalid`
    );
  };

  return useQuery({
    queryKey: ["fechIdCardRequests"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
