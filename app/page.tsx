"use client";
import { PomodoroTimer } from "@/components/feature/pomodoro-timer";
import { useBackground } from "@/lib/hooks/use-background";
import React, { useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Header from "@/components/layout/header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

export default function Home() {
  const handle = useFullScreenHandle();
  const background = useBackground();

  const toggleFullScreen = () => {
    if (handle.active) {
      handle.exit();
    } else {
      handle.enter();
    }
  };

  // Shortcut keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ignore if any modifier key is pressed
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Tekan "F" untuk toggle fullscreen
      if (e.key.toLowerCase() === "f") {
        toggleFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handle]); // handle sebagai dependency karena dipakai di toggleFullScreen

  return (
    <div>
      <FullScreen handle={handle}>
        <div className="dark relative min-h-screen overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out`}
            style={{
              backgroundColor: background.type === "color" ? background.value : "transparent",
            }}
          />

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

          {background.type === "image" &&
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 ease-in-out"></div>
          }

          <Header />
          <PomodoroTimer />

          <Button
            onClick={toggleFullScreen}
            size={"icon"}
            variant="outline"
            className="absolute bottom-4 right-4"
          >
            {handle.active ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </FullScreen>
    </div>
  );
}
