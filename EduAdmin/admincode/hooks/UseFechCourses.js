import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchCourses() {
  const Fetchqr = async () => {
    return await Api.get(`/enrollment/GetAllCourses`);
  };

  return useQuery({
    queryKey: ["fechCourses"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
