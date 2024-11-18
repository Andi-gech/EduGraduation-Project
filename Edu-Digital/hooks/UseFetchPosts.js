import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchPosts() {
  const Fetchqr = async () => {
    return await api.get(`/post`);
  };

  return useQuery({
    queryKey: ["fechpost"],
    queryFn: Fetchqr,
  });
}
