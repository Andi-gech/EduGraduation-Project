import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchEvent() {
  const FetchEvent = async () => {
    return await api.get(`/Events`);
  };

  return useQuery({
    queryKey: ["Eventz"],
    queryFn: FetchEvent,
    refetchOnWindowFocus: false,
  });
}
