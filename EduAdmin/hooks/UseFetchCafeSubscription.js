import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchCafeSubscription() {
  const Fetchqr = async () => {
    return await axios.get(
      `http://192.168.1.15:3000/cafe/subscriptions/report`
    );
  };

  return useQuery({
    queryKey: ["fechsub"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}