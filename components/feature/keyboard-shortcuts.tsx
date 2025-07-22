"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SHORTCUTS = [
  { key: "Space", action: "Start/Pause timer" },
  { key: "1", action: "Switch to Pomodoro" },
  { key: "2", action: "Switch to Short Break" },
  { key: "3", action: "Switch to Long Break" },
];

type KeyboardShortcutsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KeyboardShortcuts({
  open,
  onOpenChange,
}: KeyboardShortcutsProps) {
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
