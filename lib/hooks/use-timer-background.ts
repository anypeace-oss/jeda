import { useTimerStore } from "@/lib/store/timer";

export function useTimerBackground() {
  const { mode, settings } = useTimerStore();

  const getBackgroundColor = () => {
    switch (mode) {
      case "pomodoro":
        return settings.pomodoroColor;
      case "shortBreak":
        return settings.shortBreakColor;
      case "longBreak":
        return settings.longBreakColor;
      default:
        return settings.pomodoroColor;
    }
  };

  return getBackgroundColor();
}
