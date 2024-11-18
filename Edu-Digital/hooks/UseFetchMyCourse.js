import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchMyCourse() {
  const Fetchqr = async () => {
    return await api.get(`/enrollment/currentEnrollment`);
  };

  return useQuery({
    queryKey: ["enrollment"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
