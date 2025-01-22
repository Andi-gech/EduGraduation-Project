import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchTransaction() {
  const FetchTransaction = async () => {
    return await Api.get(`/transaction`);
  };

  return useQuery({
    queryKey: ["fechtransaction"],
    queryFn: FetchTransaction,
    refetchOnWindowFocus: false,
  });
}
