import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchEachUser(id) {
  const FetchUserById = async () => {
    // Fetch the user by their specific ID
    const response = await axios.get(
      `http://eduapi.senaycreatives.com/user/${id}`
    );
    return response;
  };

  return useQuery({
    queryKey: ["fetchUserById", id], // Use the user ID as part of the query key to cache the result
    queryFn: FetchUserById,
    enabled: !!id, // Prevent query from running if id is falsy (e.g., undefined or null)
    refetchOnWindowFocus: false, // Disable refetching when window regains focus
  });
}
