import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchGateReport() {
  const Fetchqr = async () => {
    return await Api.get(`/gate/Report`);
  };

  return useQuery({
    queryKey: ["fechGateReport"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
