import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchClubs() {
  const Fetchresource = async () => {
    return await api.get(`/Social`);
  };

  return useQuery({
    queryKey: ["clubs"],
    queryFn: Fetchresource,
    refetchOnWindowFocus: false,
  });
}
