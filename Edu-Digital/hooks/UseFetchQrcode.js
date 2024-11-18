import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchQrCode() {
  const Fetchqr = async () => {
    return await api.get(`/user/get/Digitalid`);
  };

  return useQuery({
    queryKey: ["fechqr"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
