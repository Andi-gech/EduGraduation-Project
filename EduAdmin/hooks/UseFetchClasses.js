import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchClasses() {
  const Fetchqr = async () => {
    return await axios.get(
      `https://eduapi.senaycreatives.com/enrollment/GetAllClass`
    );
  };

  return useQuery({
    queryKey: ["fechclass"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
