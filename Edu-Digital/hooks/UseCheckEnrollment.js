import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseCheckEnrollment() {
  const FetchEnrollStatus = async () => {
    return await api.get(`/enrollment/checkEnrollment`);
  };

  return useQuery({
    queryKey: ["EnrollStatus"],
    queryFn: FetchEnrollStatus,
    refetchOnWindowFocus: false,
  });
}
