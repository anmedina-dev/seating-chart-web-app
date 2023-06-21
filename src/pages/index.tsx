import { SignInButton, useUser } from "@clerk/nextjs";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  if (isLoaded && isSignedIn) router.push("/CreateTeacher");

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className={styles.header}>
        <h1>Seating Chart Web App</h1>
        {/* Signed out users get sign in button */}
        <SignInButton redirectUrl="/CreateTeacher" />
      </header>
      <p>Please Sign In</p>
    </main>
  );
}
