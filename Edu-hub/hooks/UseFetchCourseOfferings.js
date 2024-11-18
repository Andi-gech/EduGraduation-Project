import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchCourseOffering() {
  const Fetchqr = async () => {
    return await api.get(`/enrollment/GetMyoffering`);
  };

  return useQuery({
    queryKey: ["MyOffering"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
