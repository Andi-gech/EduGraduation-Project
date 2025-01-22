import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchInactiveUser() {
  const Fetchuser = async () => {
    return await Api.get(`/auth/inactive`);
  };

  return useQuery({
    queryKey: ["fechinactiveuser"],
    queryFn: Fetchuser,
    refetchOnWindowFocus: false,
  });
}
