"use client";
import { PomodoroTimer } from "@/components/feature/pomodoro-timer";

import Header from "@/components/layout/header";
export default function Home() {
  return (
    <div className="dark">
      <Header />
      <PomodoroTimer />
    </div>
  );
}
