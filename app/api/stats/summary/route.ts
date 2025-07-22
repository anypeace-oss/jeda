import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { user } from "@/auth-schema";
import { startOfDay, subDays } from "date-fns";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user stats and user info in parallel
    const [latestStats, userData] = await Promise.all([
      db
        .select({
          focusTime: stats.focusTime,
          date: stats.date,
          updatedAt: stats.updatedAt,
        })
        .from(stats)
        .where(eq(stats.userId, session.user.id))
        .orderBy(desc(stats.updatedAt))
        .limit(1),

      db.query.user.findFirst({
        where: eq(user.id, session.user.id),
        columns: {
          name: true,
          image: true,
        },
      }),
    ]);

    // Get all stats for calculations
    const allStats = await db
      .select({
        focusTime: stats.focusTime,
        date: stats.date,
      })
      .from(stats)
      .where(eq(stats.userId, session.user.id));

    // Calculate total hours spent
    const totalSeconds = allStats.reduce(
      (acc, stat) => acc + stat.focusTime,
      0
    );
    const hoursSpent = Math.round((totalSeconds / 3600) * 10) / 10; // Round to 1 decimal

    // Calculate unique days and streak
    const dates = allStats.map((stat) => startOfDay(stat.date).toISOString());
    const uniqueDatesSet = new Set(dates);
    const uniqueDays = uniqueDatesSet.size;

    // Calculate current streak
    let currentStreak = 0;
    let today = startOfDay(new Date());
    while (uniqueDatesSet.has(today.toISOString())) {
      currentStreak++;
      today = subDays(today, 1);
    }

    return NextResponse.json({
      hoursSpent,
      daysAccessed: uniqueDays,
      currentStreak,
      lastActive: latestStats[0]?.updatedAt || new Date(),
      username: userData?.name || "Anonymous",
      avatarUrl: userData?.image,
    });
  } catch (error) {
    console.error("[SUMMARY_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
