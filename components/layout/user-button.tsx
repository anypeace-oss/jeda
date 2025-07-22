"use client";
import { Button } from "@/components/ui/button";
import {
  Keyboard,
  LayoutDashboard,
  Loader,
  LogIn,
  LogOut,
  MoreVertical,
  Package,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { KeyboardShortcuts } from "../feature/keyboard-shortcuts";
import { useState } from "react";

export function UserButton() {
  const { data: session, isPending } = authClient.useSession();
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Show loading spinner while checking auth status
  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" disabled>
          <Loader className="h-5 w-5 animate-spin" />
        </Button>
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
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
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
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  }

  // Show user menu if authenticated
  return (
    <>
      <KeyboardShortcuts
        open={showKeyboardShortcuts}
        onOpenChange={setShowKeyboardShortcuts}
      />
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
              <span className="font-medium truncate">
                {session?.user?.name || "Loading..."}
              </span>
            </div>
            <span className="text-muted-foreground truncate pl-6">
              {session?.user?.email || "Loading..."}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowKeyboardShortcuts(true)}>
            <Keyboard className="w-4 h-4 mr-2" />
            Shortcuts
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => authClient.signOut()}
            className="text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
