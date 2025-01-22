import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchCafeSubscription() {
  const Fetchqr = async () => {
    return await Api.get(`/cafe/subscriptions/report`);
  };

  return useQuery({
    queryKey: ["fechsub"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
