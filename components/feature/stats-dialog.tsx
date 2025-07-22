"use client";

import { useState } from "react";
import { BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";

const ITEMS_PER_PAGE = 25;

type UserStats = {
  id: string;
  username: string;
  avatarUrl: string | null;
  totalFocusTime: number;
  streak: number;
};

type ActivitySummary = {
  hoursSpent: number;
  daysAccessed: number;
  currentStreak: number;
  lastActive: string;
  username: string;
  avatarUrl: string | null;
};

type RankingsResponse = {
  users: UserStats[];
  total: number;
};

// API fetching functions with error handling
const fetchSummary = async (): Promise<ActivitySummary> => {
  const res = await fetch("/api/stats/summary", {
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch summary");
  }
  return res.json();
};

const fetchRankings = async (page: number): Promise<RankingsResponse> => {
  const res = await fetch(
    `/api/stats/rankings?page=${page}&limit=${ITEMS_PER_PAGE}`,
    {
      credentials: "include",
    }
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch rankings");
  }
  return res.json();
};

const StatsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 p-4 rounded-lg bg-background/5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-12" />
      </div>
      <div className="space-y-2 p-4 rounded-lg bg-background/5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-12" />
      </div>
      <div className="space-y-2 p-4 rounded-lg bg-background/5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  </div>
);

const RankingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 p-4 rounded-lg bg-background/5"
      >
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-grow space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);

export function StatsDialog() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = authClient.useSession();

  // Use React Query for data fetching with caching
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery<ActivitySummary>({
    queryKey: ["stats", "summary"],
    queryFn: fetchSummary,
    enabled: open && !!session?.user,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const {
    data: rankingsData,
    isLoading: rankingsLoading,
    error: rankingsError,
  } = useQuery<RankingsResponse>({
    queryKey: ["stats", "rankings", currentPage],
    queryFn: () => fetchRankings(currentPage),
    enabled: open && !!session?.user,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const totalPages = rankingsData
    ? Math.ceil(rankingsData.total / ITEMS_PER_PAGE)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <BarChart className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            Statistics
          </DialogTitle>
        </DialogHeader>

        {!session?.user ? (
          <div className="text-center py-8 text-muted-foreground">
            Please sign in to view your statistics
          </div>
        ) : (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Activity Summary</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              {summaryLoading ? (
                <StatsSkeleton />
              ) : summaryError ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load summary
                </div>
              ) : summary ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    {summary.avatarUrl ? (
                      <Image
                        src={summary.avatarUrl ?? ""}
                        alt={summary.username}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {summary.username?.[0]?.toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div>
                      <h3 className="font-medium">{summary.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last active{" "}
                        {formatDistanceToNow(new Date(summary.lastActive), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 rounded-lg bg-background/5">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Hours Focused
                      </h4>
                      <p className="text-2xl font-bold">
                        {summary.hoursSpent.toFixed(1)}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-background/5">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Days Accessed
                      </h4>
                      <p className="text-2xl font-bold">
                        {summary.daysAccessed}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-background/5">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Current Streak
                      </h4>
                      <p className="text-2xl font-bold">
                        {summary.currentStreak} days
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No stats available
                </div>
              )}
            </TabsContent>

            <TabsContent value="rankings" className="mt-4">
              {rankingsLoading ? (
                <RankingSkeleton />
              ) : rankingsError ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load rankings
                </div>
              ) : rankingsData?.users && rankingsData.users.length > 0 ? (
                <>
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-4">
                      {rankingsData.users.map((user, index) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-background/5"
                        >
                          <span className="w-6 text-center font-medium">
                            #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </span>

                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl ?? ""}
                              alt={user.username}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {user.username?.[0]?.toUpperCase() ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex-grow">
                            <h4 className="font-medium">{user.username}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(user.totalFocusTime)}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.streak} days
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              currentPage > 1 &&
                              handlePageChange(currentPage - 1)
                            }
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              onClick={() => handlePageChange(i + 1)}
                              isActive={currentPage === i + 1}
                              className="bg-white "
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              currentPage < totalPages &&
                              handlePageChange(currentPage + 1)
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No rankings available
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
