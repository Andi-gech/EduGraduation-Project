import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchCafeSubscription() {
  const Fetchqr = async () => {
    return await axios.get(
      `https://eduapi.senaycreatives.com/cafe/subscriptions/report`
    );
  };

  return useQuery({
    queryKey: ["fechsub"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
