import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useEffect } from "react";
import api from "../utils/api";

export default function UseFetchProfilepic(id) {
  const dispatch = useDispatch();
  const profileList = useSelector((state) => state.profileList.profileList);

  // Check if the profile already exists in the Redux state
  const existingProfile = profileList.find((profile) => profile.id === id);

  const fetchProfilePic = async () => {
    const response = await api.get(`/user/getprofilepic/${id}`);
    return response.data; // Adjust according to your API response structure
  };

  // Fetch profile picture if not already in Redux
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profilePic", id],
    queryFn: fetchProfilePic,
    enabled: !!id && !existingProfile, // Only fetch if id exists and profile is not in Redux
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Set data to stale after 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep cached data for 10 minutes
  });

  // Add profile to Redux state when data is successfully fetched
  useEffect(() => {
    if (data && !existingProfile) {
      dispatch({
        type: "SET_USER_PROFILE_LIST",
        payload: [
          {
            id: id,
            image: data,
          },
        ],
      });
    }
  }, [data, dispatch, id, existingProfile]);

  // Memoize the profile to return
  const profile = useMemo(() => {
    return existingProfile || (data ? { id, image: data } : null);
  }, [existingProfile, data, id]);

  return { profile, isLoading, isError };
}
