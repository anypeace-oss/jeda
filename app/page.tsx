"use client";
import { PomodoroTimer } from "@/components/feature/pomodoro-timer";
import { useBackground } from "@/lib/hooks/use-background";

import Header from "@/components/layout/header";
// import Expalin from "@/components/layout/expalin";
// import Footer from "@/components/layout/footer";
import Image from "next/image";

export default function Home() {
  const background = useBackground();

  return (
    <div>
      <div className="dark relative min-h-screen overflow-hidden">
        {/* Wrapper untuk smooth transition */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out`}
          style={{
            backgroundColor: background.type === "color" ? background.value : "transparent",
          }}
        />

        {/* Background image */}
        {background.type === "image" && (
          <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
            <Image
              src={background.value}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Overlay hitam */}
        {background.type === "image" &&
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 ease-in-out"></div>
        }

        <Header />
        <PomodoroTimer />
      </div>
      {/* <Expalin /> */}
      {/* <Footer /> */}
    </div>
  );
}
