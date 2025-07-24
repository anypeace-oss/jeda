"use client";
import { Button } from "@/components/ui/button";
import {
  Keyboard,
  Loader,
  LogIn,
  LogOut,
  MoreVertical,
  Trash,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { KeyboardShortcuts } from "../feature/keyboard-shortcuts";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const DELETE_CONFIRMATION_TEXT = "DELETE";

export function UserButton() {
  const { data: session, isPending } = authClient.useSession();
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== DELETE_CONFIRMATION_TEXT) {
      toast.error("Please type the confirmation text exactly as shown");
      return;
    }

    try {
      setIsDeleting(true);
      await authClient.deleteUser();
      setShowDeleteDialog(false);
      toast.success("Your account has been deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation("");
    }
  };

  // Show loading spinner while checking auth status
  if (isPending) {
    return (
      <div className="flex items-center ">
        <Skeleton className="w-9 h-9 border-2 border-white/50 bg-foreground/10" />
      </div>
    );
  }

  // Show login/register buttons if not authenticated
  if (!session) {
    return (
      <>
        <KeyboardShortcuts
          open={showKeyboardShortcuts}
          onOpenChange={setShowKeyboardShortcuts}
        />
        <div className="flex items-center gap-2">
          <Button variant={"outline"} asChild>
            <Link href={"/login"}>Sign In</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={"outline"} size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-xs p-1">
              <DropdownMenuItem asChild>
                <Link href={"/login"}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowKeyboardShortcuts(true)}>
                <Keyboard className="w-4 h-4 mr-2" />
                Shortcuts
                <span className="text-[10px] border border-muted-foreground rounded-md py-1 px-2">
                  K
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  }

  return (
    <>
      <KeyboardShortcuts
        open={showKeyboardShortcuts}
        onOpenChange={setShowKeyboardShortcuts}
      />
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription className="pt-4">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type 'DELETE' to confirm"
              className="font-mono"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmation("");
              }}
              className="border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={
                deleteConfirmation !== DELETE_CONFIRMATION_TEXT || isDeleting
              }
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="cursor-pointer p-0 border-2 border-white/50 rounded-md"
        >
          {session?.user?.image ? (
            <Image
              src={session?.user?.image ?? ""}
              alt="User"
              width={36}
              height={36}
            />
          ) : (
            <User className="w-5 h-5 text-primary-foreground" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 text-xs p-1">
          <DropdownMenuLabel className="flex flex-col gap-1 py-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-semibold">
                {session?.user?.name || "Loading..."}
              </span>
            </div>
            <span className="text-foreground/80 pl-6 font-light">
              {session?.user?.email || "Loading..."}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowKeyboardShortcuts(true)}>
            <Keyboard className="w-4 h-4 mr-2" />
            Shortcuts{" "}
            <span className="text-[10px] border/80 border rounded-md py-1 px-2">
              K
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => authClient.signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
