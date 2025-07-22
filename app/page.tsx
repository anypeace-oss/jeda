"use client";
import { PomodoroTimer } from "@/components/feature/pomodoro-timer";

import Header from "@/components/layout/header";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Home() {
  const { isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div
        className="flex flex-col justify-center items-center h-screen"
        style={{
          backgroundColor: "oklch(0.5425 0.1342 23.73)",
        }}
      >
        <Image
          src="/icon.svg"
          alt="Jeda"
          width={100}
          height={100}
          className="animate-spin mb-4"
        />
        <h1 className="text-2xl font-medium  text-white">Jeda...</h1>
      </div>
    );
  }

  return (
    <div className="dark">
      <Header />
      <PomodoroTimer />
    </div>
  );
}
