import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchclub() {
  const Fetchqr = async () => {
    return await Api.get(`/Social`);
  };

  return useQuery({
    queryKey: ["fechclubs"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
