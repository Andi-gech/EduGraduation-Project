import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchNotification() {
  const Fetchqr = async () => {
    return await api.get(`/notification/`);
  };

  return useQuery({
    queryKey: ["fechnotification"],
    queryFn: Fetchqr,
  });
}
