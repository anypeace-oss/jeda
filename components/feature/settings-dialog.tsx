"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Dialog as ShadDialog,
  DialogContent as ShadDialogContent,
  DialogTitle as ShadDialogTitle,
} from "@/components/ui/dialog";

import { useTimerStore } from "@/lib/store/timer";
import { defaultSettings } from "@/lib/store/timer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "../ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const COLOR_OPTIONS = [
  { name: "Brick Red", value: "oklch(0.5425 0.1342 23.73)" },
  { name: "Deep Indigo", value: "oklch(0.3635 0.0554 277.8)" },
  { name: "Teal", value: "oklch(0.5406 0.067 196.69)" },
  { name: "Steel Blue", value: "oklch(0.4703 0.0888 247.87)" },
  { name: "Bronze", value: "oklch(0.6209 0.095 90.75)" },
  { name: "Royal Purple", value: "oklch(0.3961 0.1167 303.38)" },
  { name: "Muted Magenta", value: "oklch(0.5297 0.1356 343.24)" },
  { name: "Forest Green", value: "oklch(0.5275 0.0713 151.27)" },
  { name: "Slate Gray", value: "oklch(0.2953 0.0196 278.09)" },
  { name: "Black", value: "oklch(0.0000 0.0000 0.0000)" },
];

export type SettingsData = {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  volume: number;
  alarmSound: string;
  backsound: string;
  alarmRepeat: number;
};

export const DEFAULT_SETTINGS: SettingsData = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  pomodoroColor: "oklch(0.5425 0.1342 23.73)",
  shortBreakColor: "oklch(0.5406 0.067 196.69)",
  longBreakColor: "oklch(0.4703 0.0888 247.87)",
  volume: 1,
  alarmSound: "alarm-bell.mp3",
  backsound: "",
  alarmRepeat: 1,
};

const ALARM_OPTIONS = [
  { label: "Alarm Bell", value: "alarm-bell.mp3" },
  { label: "Alarm Digital", value: "alarm-digital.mp3" },
  { label: "Alarm Kitchen", value: "alarm-kitchen.mp3" },
];
const BACKSOUND_OPTIONS = [
  { label: "None", value: "" },
  { label: "Ticking Fast", value: "ticking-fast.mp3" },
  { label: "Ticking Slow", value: "ticking-slow.mp3" },
];

export function SettingsDialog() {
  const { settings: storedSettings, updateSettings } = useTimerStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SettingsData>(storedSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorPickerMode, setColorPickerMode] = useState<
    null | "pomodoro" | "shortBreak" | "longBreak"
  >(null);

  const { data: session } = authClient.useSession();

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ignore if any modifier key is pressed
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      if (e.key.toLowerCase() === "s" || e.key.toUpperCase() === "S") {
        if (open) {
          setOpen(false);
        } else {
          setOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [open, setOpen]);

  // Load settings when dialog opens
  useEffect(() => {
    if (open) {
      // Always use stored settings first for immediate display
      setForm(storedSettings);
    }
  }, [open, storedSettings]);

  // Validation helpers
  const clamp = (val: string | number) => {
    const n = Number(val);
    if (isNaN(n) || val === "") return "";
    if (n < 1) return 1;
    if (n > 999) return 999;
    return n;
  };

  const isValid = (val: string | number) => {
    const n = Number(val);
    return val !== "" && !isNaN(n) && n >= 1 && n <= 999;
  };

  // Handlers
  const handleTimeChange = (field: keyof SettingsData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value === "" ? "" : clamp(value) }));
    setIsDirty(true);
  };

  const handleTimeBlur = (field: keyof SettingsData) => {
    // Only validate number fields
    if (
      [
        "pomodoroTime",
        "shortBreakTime",
        "longBreakTime",
        "longBreakInterval",
        "alarmRepeat",
      ].includes(field)
    ) {
      setForm((prev) => ({
        ...prev,
        [field]: isValid(prev[field] as number | string) ? prev[field] : 1,
      }));
    }
  };

  const handleSwitchChange = (field: keyof SettingsData, value: boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const saveSettings = async (settingsToSave: SettingsData) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Update local state after successful save
      updateSettings(settingsToSave);
      // toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (open && !newOpen && isDirty) {
      // Close dialog first
      setOpen(newOpen);
      setIsDirty(false);

      // Prepare settings to save
      const settingsToSave = {
        pomodoroTime: Number(form.pomodoroTime),
        shortBreakTime: Number(form.shortBreakTime),
        longBreakTime: Number(form.longBreakTime),
        autoStartBreaks: form.autoStartBreaks,
        autoStartPomodoros: form.autoStartPomodoros,
        longBreakInterval: Number(form.longBreakInterval),
        pomodoroColor: form.pomodoroColor,
        shortBreakColor: form.shortBreakColor,
        longBreakColor: form.longBreakColor,
        volume: form.volume,
        alarmSound: form.alarmSound,
        backsound: form.backsound,
        alarmRepeat: Number(form.alarmRepeat),
      };

      // Update local store immediately
      updateSettings(settingsToSave);

      // For logged-in users, also save to API
      if (session?.user) {
        saveSettings(settingsToSave);
      }
    } else {
      setOpen(newOpen);
      if (!newOpen) {
        setIsDirty(false);
      }
    }
  };

  // Color picker helpers
  const openColorPicker = (mode: "pomodoro" | "shortBreak" | "longBreak") => {
    setColorPickerMode(mode);
    setIsColorPickerOpen(true);
  };

  const closeColorPicker = () => {
    setIsColorPickerOpen(false);
    setColorPickerMode(null);
  };

  const handleColorPick = (color: string) => {
    if (!colorPickerMode) return;

    const newSettings = { ...form };
    if (colorPickerMode === "pomodoro") newSettings.pomodoroColor = color;
    if (colorPickerMode === "shortBreak") newSettings.shortBreakColor = color;
    if (colorPickerMode === "longBreak") newSettings.longBreakColor = color;

    setForm(newSettings);
    setIsDirty(true);
    closeColorPicker();
  };

  // Reset all fields
  const handleReset = () => {
    setForm(defaultSettings);
    setIsDirty(true);
  };

  // Sound preview handler
  const previewSound = useCallback(
    (type: "alarm" | "backsound", file: string) => {
      // Stop any existing preview
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.remove();
      }

      // Don't preview if "None" is selected
      if (!file) return;

      const audio = new Audio(`sounds/${type}/${file}`);
      audio.volume = form.volume ?? 1;
      setPreviewAudio(audio);
      audio.play().catch(() => {});
      setTimeout(() => {
        audio.pause();
        audio.remove();
        setPreviewAudio(null);
      }, 2000);
    },
    [previewAudio, form.volume]
  );

  // Volume change handler with preview
  const handleVolumeChange = (value: number) => {
    const newVolume = value / 100;
    setForm((prev) => ({ ...prev, volume: newVolume }));
    setIsDirty(true);

    // Play a short preview sound when adjusting volume
    if (!previewAudio) {
      const audio = new Audio("sounds/button-press.wav");
      audio.volume = newVolume;
      audio.play().catch(() => {});
      // Clean up the audio element after it finishes playing
      audio.onended = () => {
        audio.remove();
      };
    }
  };

  useEffect(() => {
    // Cleanup the preview audio on component unmount
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.remove();
      }
    };
  }, [previewAudio]);

  // Sound change handler
  const handleSoundChange = (
    field: "alarmSound" | "backsound",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    previewSound(field === "alarmSound" ? "alarm" : "backsound", value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings [s]</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[450px]">
          <div className="space-y-6">
            {/* Color Theme Section */}
            <div className="flex justify-between w-full space-y-4">
              <h3 className="text-base font-semibold">Color Themes</h3>
              <div className="flex gap-4">
                <button
                  className="w-8 h-8 rounded-md border border-background/30 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  style={{ backgroundColor: form.pomodoroColor }}
                  onClick={() => openColorPicker("pomodoro")}
                  title="Pomodoro Color"
                />
                <button
                  className="w-8 h-8 rounded-md border border-background/30 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  style={{ backgroundColor: form.shortBreakColor }}
                  onClick={() => openColorPicker("shortBreak")}
                  title="Short Break Color"
                />
                <button
                  className="w-8 h-8 rounded-md border border-background/30 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  style={{ backgroundColor: form.longBreakColor }}
                  onClick={() => openColorPicker("longBreak")}
                  title="Long Break Color"
                />
              </div>
            </div>

            {/* Timer Settings Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Timer</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="pomodoro" className="text-sm">
                    Pomodoro
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pomodoro"
                      type="number"
                      min={1}
                      max={999}
                      value={form.pomodoroTime}
                      onChange={(e) =>
                        handleTimeChange("pomodoroTime", e.target.value)
                      }
                      onBlur={() => handleTimeBlur("pomodoroTime")}
                      className="w-25 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortBreak" className="text-sm">
                    Short Break
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="shortBreak"
                      type="number"
                      min={1}
                      max={999}
                      value={form.shortBreakTime}
                      onChange={(e) =>
                        handleTimeChange("shortBreakTime", e.target.value)
                      }
                      onBlur={() => handleTimeBlur("shortBreakTime")}
                      className="w-25 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longBreak" className="text-sm">
                    Long Break
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="longBreak"
                      type="number"
                      min={1}
                      max={999}
                      value={form.longBreakTime}
                      onChange={(e) =>
                        handleTimeChange("longBreakTime", e.target.value)
                      }
                      onBlur={() => handleTimeBlur("longBreakTime")}
                      className="w-25 bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Auto Start Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoStartBreaks" className="text-sm">
                    Auto Start Breaks
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically start break timers
                  </p>
                </div>
                <Switch
                  id="autoStartBreaks"
                  checked={form.autoStartBreaks}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("autoStartBreaks", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoStartPomodoros" className="text-sm">
                    Auto Start Pomodoros
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically start pomodoro timers
                  </p>
                </div>
                <Switch
                  id="autoStartPomodoros"
                  checked={form.autoStartPomodoros}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("autoStartPomodoros", checked)
                  }
                />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <Label htmlFor="longBreakInterval" className="text-sm">
                Long Break Interval (Pomodoros)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="longBreakInterval"
                  type="number"
                  min={1}
                  max={999}
                  value={form.longBreakInterval}
                  onChange={(e) =>
                    handleTimeChange("longBreakInterval", e.target.value)
                  }
                  onBlur={() => handleTimeBlur("longBreakInterval")}
                  className="w-20 bg-background/50"
                />
              </div>
            </div>

            {/* Sound Settings Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Sound</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="volume" className="text-sm mb-2 block">
                    Volume
                  </Label>
                  <div className="flex items-center gap-4 w-full justify-center">
                    <Slider
                      id="volume"
                      min={0}
                      max={100}
                      step={1}
                      value={[Math.round((form.volume ?? 1) * 100)]}
                      onValueChange={([v]) => handleVolumeChange(v)}
                      className="w-full"
                    />
                    <span className="text-sm w-8 text-right">
                      {Math.round((form.volume ?? 1) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alarmSound" className="text-sm mb-2 block">
                      Alarm Sound
                    </Label>
                    <select
                      id="alarmSound"
                      className="w-full rounded border bg-background/50 p-2 text-sm"
                      value={form.alarmSound}
                      onChange={(e) =>
                        handleSoundChange("alarmSound", e.target.value)
                      }
                    >
                      {ALARM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="alarmRepeat" className="text-sm mb-2 block">
                      Alarm Repeat
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="alarmRepeat"
                        type="number"
                        min={1}
                        max={10}
                        value={form.alarmRepeat}
                        onChange={(e) =>
                          handleTimeChange("alarmRepeat", e.target.value)
                        }
                        onBlur={() => handleTimeBlur("alarmRepeat")}
                        className="w-20 bg-background/50"
                      />
                      <span className="text-sm">times</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="backsound" className="text-sm mb-2 block">
                    Backsound
                  </Label>
                  <select
                    id="backsound"
                    className="w-full rounded border bg-background/50 p-2 text-sm"
                    value={form.backsound}
                    onChange={(e) =>
                      handleSoundChange("backsound", e.target.value)
                    }
                  >
                    {BACKSOUND_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full">
              <Button
                size="sm"
                variant="default"
                onClick={handleReset}
                className="bg-red-500"
              >
                Reset All
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
      {/* Nested Color Picker Dialog */}
      <ShadDialog open={isColorPickerOpen} onOpenChange={closeColorPicker}>
        <ShadDialogContent className="max-w-xs flex flex-col items-center">
          <ShadDialogTitle className="text-base font-semibold mb-4 text-center w-full">
            {colorPickerMode === "pomodoro" && "Pick a color for Pomodoro"}
            {colorPickerMode === "shortBreak" && "Pick a color for Short Break"}
            {colorPickerMode === "longBreak" && "Pick a color for Long Break"}
          </ShadDialogTitle>
          <div className="grid grid-cols-5 gap-2 w-full">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                className={`relative w-10 h-10 md:w-15 md:h-15 rounded-lg border border-background/30 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all duration-150 hover:scale-110 ${
                  (colorPickerMode === "pomodoro" &&
                    form.pomodoroColor === color.value) ||
                  (colorPickerMode === "shortBreak" &&
                    form.shortBreakColor === color.value) ||
                  (colorPickerMode === "longBreak" &&
                    form.longBreakColor === color.value)
                    ? "ring-2 ring-primary scale-110"
                    : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorPick(color.value)}
                title={color.name}
                aria-label={color.name}
              >
                {((colorPickerMode === "pomodoro" &&
                  form.pomodoroColor === color.value) ||
                  (colorPickerMode === "shortBreak" &&
                    form.shortBreakColor === color.value) ||
                  (colorPickerMode === "longBreak" &&
                    form.longBreakColor === color.value)) && (
                  <svg
                    className="absolute left-1 top-1 w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </ShadDialogContent>
      </ShadDialog>
    </Dialog>
  );
}
