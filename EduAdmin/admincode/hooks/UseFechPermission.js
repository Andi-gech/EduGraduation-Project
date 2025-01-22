import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchpermissions() {
  const Fetchqr = async () => {
    return await Api.get(`/permissions/new`);
  };

  return useQuery({
    queryKey: ["fechpermission"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
