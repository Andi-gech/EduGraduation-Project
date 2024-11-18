import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import api from "../utils/api";
import { SET_USER_PROFILE_LIST } from "../Redux/actions";

export default function UseFetchProfilepic(id) {
  const dispatch = useDispatch();
  const profileList = useSelector((state) => state.profileList.profileList);
  const profileExists = profileList.some((profile) => profile.id === id);

  const fetchProfilePic = async () => {
    const response = await api.get(`/user/getprofilepic/${id}`);
    return response.data; // Adjust according to your API response structure
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["profilePic", id],
    queryFn: fetchProfilePic,
    enabled: !!id && !profileExists, // Only run if the id exists and the profile is not already in profileList
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Set data to stale after 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep cached data for 10 minutes
  });
  if (isSuccess) {
    console.log(data);
    if (!profileExists) {
      // If the profile wasn't already in the list, add it
      dispatch({
        type: "SET_USER_PROFILE_LIST",
        payload: [
          {
            id: id,
            image: data,
          },
        ],
      });
      console.log("profie dispached");
    }
  }

  // Return either the existing profile from profileList or fetched data
  const profile = useMemo(
    () =>
      profileExists ? profileList.find((profile) => profile.id === id) : data,
    [profileList, profileExists, id, data]
  );
  console.log(profileList);
  return { profile, isLoading, isError };
}
