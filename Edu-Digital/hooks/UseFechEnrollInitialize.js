import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export default function UseFetchEnrollInitialize(redirecturl) {
  const FetchEnrollInitialize = async () => {
    // Pass redirecturl as a query parameter
    return await api.get(`/enrollment/initiateChapa`, {
      params: { redirecturl }, // Add query parameters here
    });
  };

  return useQuery({
    queryKey: ["EnrollInitialize", redirecturl],
    queryFn: FetchEnrollInitialize,
    enabled: !!redirecturl, // Only fetch if redirecturl is defined
    refetchOnWindowFocus: false,
  });
}
