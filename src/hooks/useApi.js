import { useQuery } from "@tanstack/react-query";

export default function useApi(options) {
  return useQuery({
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
}
