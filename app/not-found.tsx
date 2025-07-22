"use client";

import { useTimerBackground } from "@/lib/hooks/use-timer-background";
import Link from "next/link";

export default function NotFound() {
  const backgroundColor = useTimerBackground();

  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{ backgroundColor }}
    >
      <h1 className="text-4xl font-bold text-white">404 - Page Not Found</h1>
      <p className="text-lg text-white">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="text-white underline">
        Go back to home
      </Link>
    </div>
  );
}
