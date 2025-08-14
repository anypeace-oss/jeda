// lib/store/timer.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  completedPomodoros: number;
  settings: Settings;
  setMode: (mode: TimerMode) => void;
  toggleTimer: () => void;
  updateSettings: (settings: Settings) => void;
  incrementCompletedPomodoros: () => void;
  loadUserSettings: () => Promise<void>;
  initializeTimeLeft: () => void;
  setTimeLeft: (time: number) => void;
}

export type Settings = {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  volume: number;
  alarmSound: string;
  backsound: string;
  alarmRepeat: number;
  backgroundType: "color" | "image";
  backgroundImage: string;
  enableNotifications: boolean;
};

export const defaultSettings: Settings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  pomodoroColor: "oklch(0.5425 0.1342 23.73)",
  shortBreakColor: "oklch(0.5406 0.067 196.69)",
  longBreakColor: "oklch(0.4703 0.0888 247.87)",
  volume: 1,
  alarmSound: "alarm-bell.mp3",
  backsound: "none",
  alarmRepeat: 1,
  backgroundType: "image",
  backgroundImage:
    "https://res.cloudinary.com/dxurnpbrc/image/upload/v1755188916/6_si5cfa.png",
  enableNotifications: true,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: "pomodoro",
      isRunning: false,
      timeLeft: defaultSettings.pomodoroTime * 60,
      completedPomodoros: 0,
      settings: defaultSettings,
      setMode: (mode) => {
        const settings = get().settings;
        const newTimeLeft =
          mode === "pomodoro"
            ? settings.pomodoroTime * 60
            : mode === "shortBreak"
            ? settings.shortBreakTime * 60
            : settings.longBreakTime * 60;

        set({ mode, timeLeft: newTimeLeft, isRunning: false });
      },
      toggleTimer: () => {
        set((state) => ({ isRunning: !state.isRunning }));
      },
      updateSettings: (newSettings) => {
        set((state) => {
          // Calculate new time left based on current mode and new settings
          const newTimeLeft =
            state.mode === "pomodoro"
              ? newSettings.pomodoroTime * 60
              : state.mode === "shortBreak"
              ? newSettings.shortBreakTime * 60
              : newSettings.longBreakTime * 60;

          // Always update settings and timeLeft unless timer is running
          if (!state.isRunning) {
            return {
              settings: newSettings,
              timeLeft: newTimeLeft,
            };
          }

          // If timer is running, only update settings
          return { settings: newSettings };
        });
      },
      incrementCompletedPomodoros: () => {
        set((state) => ({ completedPomodoros: state.completedPomodoros + 1 }));
      },
      loadUserSettings: async () => {
        // Only fetch if we're still using default settings
        const currentSettings = get().settings;
        const isUsingDefaults = Object.entries(currentSettings).every(
          ([key, value]) => defaultSettings[key as keyof Settings] === value
        );

        if (isUsingDefaults) {
          try {
            const response = await fetch("/api/settings", {
              credentials: "include",
            });
            if (!response.ok) {
              throw new Error("Failed to load settings");
            }
            const data = await response.json();
            // Merge with defaults to ensure all fields exist
            const mergedSettings = {
              ...defaultSettings,
              ...data,
            };
            // Update settings and recalculate timeLeft if needed
            get().updateSettings(mergedSettings);
          } catch (error) {
            console.error("Error loading user settings:", error);
          }
        }
      },
      initializeTimeLeft: () => {
        const state = get();
        // Only initialize if timeLeft is 0 or undefined
        if (!state.timeLeft) {
          const settings = state.settings;
          const newTimeLeft =
            state.mode === "pomodoro"
              ? settings.pomodoroTime * 60
              : state.mode === "shortBreak"
              ? settings.shortBreakTime * 60
              : settings.longBreakTime * 60;
          set({ timeLeft: newTimeLeft });
        }
      },
      setTimeLeft: (time: number) => {
        set({ timeLeft: time });
      },
    }),
    {
      name: "timer-storage",
      partialize: (state) => ({
        settings: state.settings,
        completedPomodoros: state.completedPomodoros,
        mode: state.mode,
        timeLeft: state.timeLeft,
        isRunning: state.isRunning, // Preserve the actual running state
      }),
      onRehydrateStorage: () => (state) => {
        // When state is rehydrated from storage, ensure timeLeft is valid
        if (state) {
          if (!state.timeLeft) {
            state.initializeTimeLeft();
          }
        }
      },
    }
  )
);

export const getBackgroundColor = () => {
  const { settings } = useTimerStore.getState();
  return settings.pomodoroColor;
};
