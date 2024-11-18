import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchChat() {
  const FetchChat = async () => {
    return await api.get(`/chatroom/ask`);
  };

  return useQuery({
    queryKey: ["Chat"],
    queryFn: FetchChat,
    refetchOnWindowFocus: false,
  });
}
