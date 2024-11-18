import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchSchedule() {
  const Fetchqr = async () => {
    return await api.get(`/enrollment/GetSchedule`);
  };

  return useQuery({
    queryKey: ["schedule"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
