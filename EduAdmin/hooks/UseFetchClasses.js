import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchClasses() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:3000/enrollment/GetAllClass`);
  };

  return useQuery({
    queryKey: ["fechclass"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
