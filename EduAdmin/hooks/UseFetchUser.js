import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchUser() {
  const Fetchqr = async () => {
    return await Api.get(`/user/get/teachers`);
  };

  return useQuery({
    queryKey: ["fechuser"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
