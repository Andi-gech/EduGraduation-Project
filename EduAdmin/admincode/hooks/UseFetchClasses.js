import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchClasses() {
  const Fetchqr = async () => {
    return await Api.get(`/enrollment/GetAllClass`);
  };

  return useQuery({
    queryKey: ["fechclass"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
