import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchResource() {
  const Fetchresource = async () => {
    return await api.get(`/resource`);
  };

  return useQuery({
    queryKey: ["resource"],
    queryFn: Fetchresource,
    refetchOnWindowFocus: false,
  });
}
