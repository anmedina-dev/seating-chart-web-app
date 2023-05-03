import { UserButton, useUser } from "@clerk/nextjs";
import styles from "../styles/Classroom.module.css";
import useSWR from "swr";
import { useRouter } from "next/router";
import axios from "axios";
import fetcher from "@/lib/fetch";
import { useEffect } from "react";
import Board from "@/components/Board";

export default function Classroom() {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user ? user.id : "";
  const { data, error, isLoading } = useSWR(`/api/clerk?id=` + userId, fetcher);
  const router = useRouter();

  data;

  if (!isLoaded || !user || isLoading) return <div>...Loading</div>;
  if (error) router.push("/CreateTeacher");
  if (isLoaded && !isSignedIn) router.push("/");
  return (
    <main className="flex min-h-screen flex-col items-center mb-10 p-24 className={styles.clasroomSection}">
      <header className={styles.header}>
        <h1>Seating Chart Web App</h1>

        <UserButton showName={true} afterSignOutUrl="/" />
      </header>
      <Board />
    </main>
  );
}
