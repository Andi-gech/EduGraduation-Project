import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchCourses() {
  const Fetchqr = async () => {
    return await axios.get(
      `https://eduapi.senaycreatives.com/enrollment/GetAllCourses`
    );
  };

  return useQuery({
    queryKey: ["fechCourses"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
