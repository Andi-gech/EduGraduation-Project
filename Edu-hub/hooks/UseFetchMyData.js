import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchMyData() {
  const Fetchqr = async () => {
    return await api.get(`/user/me`);
  };

  return useQuery({
    queryKey: ["Me"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
