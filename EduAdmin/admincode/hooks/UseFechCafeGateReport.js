import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchCafeGateReport() {
  const Fetchqr = async () => {
    return await Api.get(`/cafe/report`);
  };

  return useQuery({
    queryKey: ["fechdata"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
