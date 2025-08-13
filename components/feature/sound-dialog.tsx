"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AudioLines, Pause, Play, RefreshCw } from "lucide-react";

import { Slider } from "../ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Sound data with name, icon, and source path
const AMBIENT_SOUNDS = [
  {
    id: "rain",
    name: "Rain",
    icon: "🌧️",
    src: "/sounds/ambient/rain.mp3",
  },
  {
    id: "ocean",
    name: "Ocean",
    icon: "🌊",
    src: "/sounds/ambient/ocean.mp3",
  },
  // Duplicates for demo
  {
    id: "rain-2",
    name: "Light Rain",
    icon: "☔",
    src: "/sounds/ambient/rain.mp3",
  },
  {
    id: "ocean-2",
    name: "Ocean Waves",
    icon: "🌊",
    src: "/sounds/ambient/ocean.mp3",
  },
  {
    id: "rain-3",
    name: "Rain Storm",
    icon: "⛈️",
    src: "/sounds/ambient/rain.mp3",
  },
  {
    id: "ocean-3",
    name: "Deep Ocean",
    icon: "🌊",
    src: "/sounds/ambient/ocean.mp3",
  },
  {
    id: "rain-4",
    name: "Gentle Rain",
    icon: "💧",
    src: "/sounds/ambient/rain.mp3",
  },
  {
    id: "ocean-4",
    name: "Calm Ocean",
    icon: "🌊",
    src: "/sounds/ambient/ocean.mp3",
  },
  {
    id: "rain-5",
    name: "Rain Forest",
    icon: "🌴",
    src: "/sounds/ambient/rain.mp3",
  },
  {
    id: "ocean-5",
    name: "Beach Waves",
    icon: "🏖️",
    src: "/sounds/ambient/ocean.mp3",
  },
];

type SoundState = {
  isPlaying: boolean;
  volume: number;
  audio?: HTMLAudioElement;
};

export default function SoundDialog() {
  const [soundStates, setSoundStates] = useState<Record<string, SoundState>>(
    {}
  );
  const [pausedSounds, setPausedSounds] = useState<string[]>([]); // Track paused sounds
  const [dialogOpen, setDialogOpen] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Initialize sound states
  useEffect(() => {
    const initialStates: Record<string, SoundState> = {};
    AMBIENT_SOUNDS.forEach((sound) => {
      initialStates[sound.id] = {
        isPlaying: false,
        volume: 50,
      };
    });
    setSoundStates(initialStates);
  }, []);

  // Cleanup audio on unmount only
  useEffect(() => {
    // Store ref to current audio elements when effect runs
    const currentAudioRefs = audioRefs.current;

    return () => {
      // Use stored ref in cleanup
      Object.values(currentAudioRefs).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []); // Empty deps array since we only want this on mount/unmount

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

      if (e.key.toLowerCase() === "a" || e.key.toUpperCase() === "A") {
        if (dialogOpen) {
          setDialogOpen(false);
        } else {
          setDialogOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [dialogOpen, setDialogOpen]);

  const toggleSound = (soundId: string) => {
    const sound = AMBIENT_SOUNDS.find((s) => s.id === soundId);
    if (!sound) return;

    setSoundStates((prev) => {
      const newState = { ...prev };
      const currentState = newState[soundId];

      // Create or get audio element
      if (!audioRefs.current[soundId]) {
        const audio = new Audio(sound.src);
        audio.loop = true;
        audioRefs.current[soundId] = audio;
      }

      const audio = audioRefs.current[soundId];
      const isPaused = pausedSounds.includes(soundId);

      if (currentState.isPlaying || isPaused) {
        // If sound is playing or paused, set it to inactive
        audio.pause();
        setPausedSounds((prev) => prev.filter((id) => id !== soundId));
        newState[soundId] = {
          ...currentState,
          isPlaying: false,
        };
      } else {
        // Sound is inactive, check global pause state
        const allSoundsArePaused =
          playingCount === 0 && pausedSounds.length > 0;

        if (allSoundsArePaused) {
          // If all sounds are paused, add this to paused too
          setPausedSounds((prev) => [...prev, soundId]);
          newState[soundId] = {
            ...currentState,
            isPlaying: false,
          };
        } else {
          // Normal play behavior
          audio.volume = currentState.volume / 100;
          audio.play().catch(() => {
            console.log(
              "Playback failed, probably due to autoplay restrictions"
            );
          });

          newState[soundId] = {
            ...currentState,
            isPlaying: true,
          };
        }
      }

      return newState;
    });
  };

  const handleVolumeChange = (soundId: string, value: number[]) => {
    const volume = value[0];
    const audio = audioRefs.current[soundId];
    if (audio) {
      audio.volume = volume / 100;
    }

    setSoundStates((prev) => ({
      ...prev,
      [soundId]: {
        ...prev[soundId],
        volume,
      },
    }));
  };

  // Get count of currently playing sounds
  const playingCount = Object.values(soundStates).filter(
    (state) => state.isPlaying
  ).length;

  // Modified toggle all sounds to only affect active sounds
  const toggleAllSounds = () => {
    const hasPlayingSounds = playingCount > 0;

    if (hasPlayingSounds) {
      // Pause all playing sounds and remember them
      const newPausedSounds: string[] = [];

      Object.keys(soundStates).forEach((soundId) => {
        const state = soundStates[soundId];
        const audio = audioRefs.current[soundId];

        if (state.isPlaying && audio) {
          audio.pause();
          newPausedSounds.push(soundId);
        }
      });

      setPausedSounds(newPausedSounds);

      setSoundStates((prev) => {
        const newState = { ...prev };
        newPausedSounds.forEach((id) => {
          newState[id] = { ...newState[id], isPlaying: false };
        });
        return newState;
      });
    } else {
      // Resume only previously paused sounds
      pausedSounds.forEach((soundId) => {
        const audio = audioRefs.current[soundId];
        const state = soundStates[soundId];

        if (audio && state.volume > 0) {
          audio.volume = state.volume / 100;
          audio.play().catch(() => { });
        }
      });

      setSoundStates((prev) => {
        const newState = { ...prev };
        pausedSounds.forEach((id) => {
          newState[id] = { ...newState[id], isPlaying: true };
        });
        return newState;
      });

      // Clear paused sounds list
      setPausedSounds([]);
    }
  };

  // Reset function now also clears paused sounds
  const resetAllSounds = () => {
    // Tambahkan konfirmasi alert
    const confirmReset = window.confirm(
      "Apakah Anda yakin ingin mereset semua suara?"
    );

    if (confirmReset) {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
      });

      setSoundStates((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((id) => {
          newState[id] = { isPlaying: false, volume: 50 };
        });
        return newState;
      });

      setPausedSounds([]); // Clear paused sounds on reset
    }
  };
  // Helper function to check if a sound is paused
  const isSoundPaused = (soundId: string) => {
    return pausedSounds.includes(soundId);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <AudioLines className="h-5 w-5" />
              {playingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                  {playingCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ambient [A]</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center ">
          <DialogTitle className="text-xl font-medium">Sounds</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAllSounds}
              className="h-8 w-8"
            >
              {playingCount > 0 ? (
                <Pause className="h-4 w-4" />
              ) : pausedSounds.length > 0 ? (
                <Play className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetAllSounds}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 max-h-[500px] overflow-y-auto">
          {AMBIENT_SOUNDS.map((sound) => {
            const state = soundStates[sound.id];
            if (!state) return null;

            const isPaused = isSoundPaused(sound.id);

            return (
              <div
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`
                  relative group cursor-pointer rounded-lg p-4 
                  transition-all duration-200 border
                  ${state.isPlaying
                    ? "bg-primary/5 "
                    : isPaused
                      ? "bg-muted/50  hover:bg-muted"
                      : "bg-card hover:bg-accent border-muted"
                  }
                  ${state.isPlaying
                    ? "opacity-100"
                    : isPaused
                      ? "opacity-90"
                      : "opacity-70 hover:opacity-90"
                  }
                `}
              >
                <div className="text-center mb-3">
                  <span
                    className={`text-2xl select-none
                    ${state.isPlaying
                        ? "opacity-100"
                        : isPaused
                          ? "opacity-90"
                          : "opacity-60 hover:opacity-90"
                      }
                    `}
                  >
                    {sound.icon}
                  </span>
                  <p
                    className={`text-sm font-medium mt-1
                    ${state.isPlaying
                        ? "opacity-100"
                        : isPaused
                          ? "opacity-90"
                          : "opacity-60 hover:opacity-90"
                      }
                    `}
                  >
                    {sound.name}
                  </p>
                </div>

                <div
                  className={`
                    transition-all duration-200
                    ${state.isPlaying || isPaused
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                    }
                  `}
                  onClick={(e) => e.stopPropagation()} // Prevent card click when clicking slider container
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Slider
                      value={[state.volume]}
                      max={100}
                      step={1}
                      className={`w-full ${isPaused ? "opacity-75" : ""}`}
                      onValueChange={(value) =>
                        handleVolumeChange(sound.id, value)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
