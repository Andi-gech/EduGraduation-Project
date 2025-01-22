import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchIdCardRequests() {
  const Fetchqr = async () => {
    return await Api.get(`/user/getAll/Digitalid`);
  };

  return useQuery({
    queryKey: ["fechIdCardRequests"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
