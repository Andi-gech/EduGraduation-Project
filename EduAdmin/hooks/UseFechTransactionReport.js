import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchTransactionReport() {
  const Fetchtransaction = async () => {
    return await Api.get(`/transaction/report`);
  };

  return useQuery({
    queryKey: ["TranasactionReport"],
    queryFn: Fetchtransaction,
    refetchOnWindowFocus: false,
  });
}
