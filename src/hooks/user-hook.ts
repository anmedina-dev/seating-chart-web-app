import fetcher from "@/lib/fetch";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";

const useUserHook = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user ? user.id : "";
  const { data, error, isLoading } = useSWR(`/api/clerk?id=` + userId, fetcher);

  return { isLoaded, isSignedIn, data, isLoading, error, user };
};

export default useUserHook;
