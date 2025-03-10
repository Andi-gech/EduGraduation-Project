import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFechEnrollTransaction() {
  const FetchTransaction = async () => {
    return await Api.get(`/enrollment/getEnrollmentTransaction`);
  };

  return useQuery({
    queryKey: ["fechEnrollmenttransaction"],
    queryFn: FetchTransaction,
    refetchOnWindowFocus: false,
  });
}
