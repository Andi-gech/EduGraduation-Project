import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchUser() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:3000/user`);
  };

  return useQuery({
    queryKey: ["fechuser"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
