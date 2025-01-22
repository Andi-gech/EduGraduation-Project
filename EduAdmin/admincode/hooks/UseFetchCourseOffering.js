import { useQuery } from "@tanstack/react-query";
import Api from "../src/utils/Api";

export default function UseFetchCourseOffering(department, year, semister) {
  const FetchOfferings = async () => {
    // Fetch the user by their specific ID
    const response = await Api.get(
      `/enrollment/Getoffering?department=${department}&yearLevel=${year}&semister=${semister}`
    );
    return response;
  };

  return useQuery({
    queryKey: ["fetchcourseOffering", department, year, semister], // Use the user ID as part of the query key to cache the result
    queryFn: FetchOfferings,
    enabled: !!(department && year && semister), // Prevent query from running if id is falsy (e.g., undefined or null)
    refetchOnWindowFocus: false, // Disable refetching when window regains focus
  });
}
