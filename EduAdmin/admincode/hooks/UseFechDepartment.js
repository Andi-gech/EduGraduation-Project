import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchDepartment() {


  const Fetchqr = async () => {
    return await Api.get(`/report/department`);
  };

  return useQuery({
    queryKey: ["fechReport"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
