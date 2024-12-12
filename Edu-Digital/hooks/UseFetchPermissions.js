import { useQuery } from "@tanstack/react-query";

import api from "../utils/api";

export default function UseFetchPermissions() {
  const Fetchqr = async () => {
    return await api.get(`/permissions/History`);
  };

  return useQuery({
    queryKey: ["fechpermissions"],
    queryFn: Fetchqr,
  });
}
