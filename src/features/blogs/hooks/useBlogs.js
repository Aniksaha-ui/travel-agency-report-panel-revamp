import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogsService";

export default function useBlogs(page, search, refreshKey = 0) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      setIsFetching(true);
      setError(null);

      try {
        const response = await getBlogs({ page, search });

        if (isMounted) {
          setData(response);
        }
      } catch (nextError) {
        if (isMounted) {
          setError(nextError instanceof Error ? nextError : new Error("Unable to load blogs."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, [page, refreshKey, search]);

  return {
    data,
    error,
    isFetching,
    isLoading,
  };
}
