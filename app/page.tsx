"use client";
import { PomodoroTimer } from "@/components/feature/pomodoro-timer";

import Header from "@/components/layout/header";
import Expalin from "@/components/layout/expalin";
import Footer from "@/components/layout/footer";
// import SupportUs from "@/components/layout/support-us";
export default function Home() {
  return (
    <div>
      <div className="dark">
        <Header />
        <PomodoroTimer />
      </div>
      <Expalin />
      {/* <SupportUs /> */}
      <Footer />
    </div>
  );
}
