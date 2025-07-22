import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { user } from "@/auth-schema";
import { startOfDay, subDays } from "date-fns";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get page from query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(user);

    // Get paginated users with their stats
    const [usersData, allStats] = await Promise.all([
      db
        .select({
          userId: user.id,
          name: user.name,
          image: user.image,
        })
        .from(user)
        .limit(limit)
        .offset(offset),

      db
        .select({
          userId: stats.userId,
          focusTime: stats.focusTime,
          date: stats.date,
        })
        .from(stats),
    ]);

    // Group stats by user for efficient processing
    const userStatsMap = allStats.reduce(
      (
        acc: Record<string, { totalFocusTime: number; dates: Set<string> }>,
        stat
      ) => {
        if (!acc[stat.userId]) {
          acc[stat.userId] = {
            totalFocusTime: 0,
            dates: new Set<string>(),
          };
        }
        acc[stat.userId].totalFocusTime += stat.focusTime;
        acc[stat.userId].dates.add(startOfDay(stat.date).toISOString());
        return acc;
      },
      {}
    );

    // Calculate rankings with streaks
    const rankings = usersData
      .map((user) => {
        const stats = userStatsMap[user.userId] || {
          totalFocusTime: 0,
          dates: new Set<string>(),
        };

        // Calculate streak
        let streak = 0;
        let today = startOfDay(new Date());
        while (stats.dates.has(today.toISOString())) {
          streak++;
          today = subDays(today, 1);
        }

        return {
          id: user.userId,
          username: user.name || "Anonymous",
          avatarUrl: user.image,
          totalFocusTime: stats.totalFocusTime,
          streak,
        };
      })
      .sort((a, b) => b.totalFocusTime - a.totalFocusTime);

    return NextResponse.json({
      users: rankings,
      total: Number(count),
    });
  } catch (error) {
    console.error("[RANKINGS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}
