"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect } from "react";

const SHORTCUTS = [
  { key: "Space", action: "Start/Pause timer" },
  { key: "1", action: "Switch to Pomodoro" },
  { key: "2", action: "Switch to Short Break" },
  { key: "3", action: "Switch to Long Break" },
  { key: "R", action: "Open/Close Stats" },
  { key: "S", action: "Open/Close Settings" },
  { key: "K", action: "Open/Close  Keyboard Shortcuts" },
  { key: "A", action: "Open/Close  Ambient Sounds" },
];

type KeyboardShortcutsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KeyboardShortcuts({
  open,
  onOpenChange,
}: KeyboardShortcutsProps) {
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

      if (e.key.toLowerCase() === "k" || e.key.toUpperCase() === "K") {
        e.preventDefault();

        if (!open) {
          onOpenChange(true);
        } else {
          onOpenChange(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [open, onOpenChange]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {SHORTCUTS.map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-semibold">
                {action}
              </span>
              <kbd className="pointer-events-none inline-flex h-8 select-none items-center gap-1 rounded border bg-background/50 px-3 font-mono text-sm font-medium">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
