"use client";
import { useTimerStore } from "@/lib/store/timer";
import React from "react";

/**
 * ProgressTimer - A slim, animated progress bar for Pomodoro sessions.
 * Reads timer state from useTimerStore.
 */
export function ProgressTimer() {
  const { mode, timeLeft, settings, isRunning } = useTimerStore();

  // Get total time for current mode
  const totalTime = React.useMemo(() => {
    if (mode === "pomodoro") return settings.pomodoroTime * 60;
    if (mode === "shortBreak") return settings.shortBreakTime * 60;
    if (mode === "longBreak") return settings.longBreakTime * 60;
    return 1;
  }, [mode, settings]);

  // Calculate progress (0 to 1)
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  return (
    <div
      aria-label="Pomodoro progress bar"
      className="w-full h-0.5 bg-foreground/10  overflow-hidden shadow-inner rounded-full"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full transition-all duration-300 ${
          isRunning ? "bg-foreground" : "bg-foreground/20"
        }`}
        style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
      />
    </div>
  );
}
