import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

export default function UseFetchusers() {
  const Fetchcourse = () => {
    return axios.get(`https://jsonplaceholder.typicode.com/todos/1`);
  };

  return useQuery({
    queryKey: ["fechquiz"],
    queryFn: Fetchcourse,
    refetchOnWindowFocus: false,
  });
}
