import { useTimerStore } from "@/lib/store/timer";

export function useBackground() {
  const { mode, settings } = useTimerStore();

  const getBackground = () => {
    // If image background is enabled and we have an image, return the image
    if (settings.backgroundType === "image" && settings.backgroundImage) {
      return {
        type: "image" as const,
        value: settings.backgroundImage
      };
    }
    
    // Otherwise, return color based on mode
    let color = settings.pomodoroColor;
    switch (mode) {
      case "pomodoro":
        color = settings.pomodoroColor;
        break;
      case "shortBreak":
        color = settings.shortBreakColor;
        break;
      case "longBreak":
        color = settings.longBreakColor;
        break;
    }
    
    return {
      type: "color" as const,
      value: color
    };
  };

  return getBackground();
}