import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchChat(chatroom) {
  const FetchChat = async () => {
    return await api.get(`/chatroom/${chatroom}/recentChats`);
  };

  return useQuery({
    queryKey: ["Chat", chatroom],
    queryFn: FetchChat,
    enabled: !!chatroom,
    refetchOnWindowFocus: false,
  });
}
