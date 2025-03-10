
import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchTeacher() {
  const Fetchqr = async () => {
    return await Api.get(`/user/get/teachers`);
  };

  return useQuery({
    queryKey: ["fechTeacher"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
