import { useAuth, useSession } from "@clerk/nextjs";
import styles from "../styles/Classroom.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetch";

export default function Classroom() {
  const { push } = useRouter();
  const { userId } = useAuth();
  const { data } = useSWR(`/api/clerk?id=` + userId, fetcher);

  if (!data) {
    push("/CreateTeacher");
  }

  //if (isLoading) return <div>loading...</div>;

  return <div className={styles.clasroomSection}>classroom</div>;
}
