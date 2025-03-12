import { useQuery } from "@tanstack/react-query";
import useApi from "../src/utils/UseApi";


export default function UseFetchMyClass() {
    const Api = useApi();
  const Fetchuser = async () => {
    return await Api.get(`/enrollment/getmyassigned`);
  };

  return useQuery({
    queryKey: ["fechMyClass"],
    queryFn: Fetchuser,
    refetchOnWindowFocus: false,
  });
}
