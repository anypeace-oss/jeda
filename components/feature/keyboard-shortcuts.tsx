"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "Space", action: "Start/Pause timer" },
  { key: "1", action: "Switch to Pomodoro" },
  { key: "2", action: "Switch to Short Break" },
  { key: "3", action: "Switch to Long Break" },
];

export function KeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
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
