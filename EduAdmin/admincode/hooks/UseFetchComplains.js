import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";


export default function UseFetchComplains() {
  const Fetchqr = async () => {
    return await Api.get(`/complain`);
  };

  return useQuery({
    queryKey: ["fechcomplain"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
