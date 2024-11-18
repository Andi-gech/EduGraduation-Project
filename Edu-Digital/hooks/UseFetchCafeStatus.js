import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchCafeStatus() {
  const FetchCafeStatus = async () => {
    return await api.get(`/cafe/subscription/status`);
  };

  return useQuery({
    queryKey: ["CafeStatus"],
    queryFn: FetchCafeStatus,
    refetchOnWindowFocus: false,
  });
}
