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
};

const defaultSettings: Settings = {
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
  backsound: "ticking-fast.mp3",
  alarmRepeat: 1,
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
          const updatedSettings = { ...state.settings, ...newSettings };

          // Only update timeLeft if timer duration settings changed AND timer is not running
          if (!state.isRunning) {
            const timeSettingsChanged =
              ("pomodoroTime" in newSettings && state.mode === "pomodoro") ||
              ("shortBreakTime" in newSettings &&
                state.mode === "shortBreak") ||
              ("longBreakTime" in newSettings && state.mode === "longBreak");

            if (timeSettingsChanged) {
              const newTimeLeft =
                state.mode === "pomodoro"
                  ? updatedSettings.pomodoroTime * 60
                  : state.mode === "shortBreak"
                  ? updatedSettings.shortBreakTime * 60
                  : updatedSettings.longBreakTime * 60;

              return {
                settings: updatedSettings,
                timeLeft: newTimeLeft,
              };
            }
          }

          // If timer is running or no time settings changed, just update settings
          return { settings: updatedSettings };
        });
      },
      incrementCompletedPomodoros: () => {
        set((state) => ({ completedPomodoros: state.completedPomodoros + 1 }));
      },
    }),
    {
      name: "timer-storage",
    }
  )
);

export const getBackgroundColor = () => {
  const { settings } = useTimerStore.getState();
  return settings.pomodoroColor;
};
