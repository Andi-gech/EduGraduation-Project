import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchCourses() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:3000/enrollment/GetAllCourses`);
  };

  return useQuery({
    queryKey: ["fechCourses"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
