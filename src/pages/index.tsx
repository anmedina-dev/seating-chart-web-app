import { Inter } from "next/font/google";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import styles from "../styles/Home.module.css";
import Classroom from "../components/Classroom";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className={styles.header}>
        <h1>Seating Chart Web App</h1>

        <SignedIn>
          {/* Mount the UserButton component */}

          <UserButton showName={true} />
        </SignedIn>

        <SignedOut>
          {/* Signed out users get sign in button */}

          <SignInButton />
        </SignedOut>
      </header>

      <SignedIn>
        <Classroom />
      </SignedIn>
      <SignedOut>Please Sign In</SignedOut>
    </main>
  );
}
