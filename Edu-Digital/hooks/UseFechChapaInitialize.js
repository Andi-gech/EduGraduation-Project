import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export default function UseFetchChapaInitialize(redirecturl) {
  const FetchChapaInitialize = async () => {
    // Pass redirecturl as a query parameter
    return await api.get(`/cafe/initiateChapa`, {
      params: { redirecturl }, // Add query parameters here
    });
  };

  return useQuery({
    queryKey: ["ChapaInitialize", redirecturl],
    queryFn: FetchChapaInitialize,
    enabled: !!redirecturl, // Only fetch if redirecturl is defined
    refetchOnWindowFocus: false,
  });
}
