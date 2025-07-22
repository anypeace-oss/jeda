import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stats } from "@/db/schema";
import { startOfDay } from "date-fns";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { headers } from "next/headers";

// Validation schema
const trackStatsSchema = z.object({
  focusTime: z.number().min(0),
});

// Type for PostgreSQL error
interface PostgresError extends Error {
  code: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const result = trackStatsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { focusTime } = result.data;

    // Get current date (UTC midnight)
    const today = startOfDay(new Date());

    try {
      // Try to find existing stats for today
      const existingStats = await db.query.stats.findFirst({
        where: and(eq(stats.userId, session.user.id), eq(stats.date, today)),
      });

      let updatedStats;
      if (existingStats) {
        // Update if exists
        updatedStats = await db
          .update(stats)
          .set({
            focusTime: existingStats.focusTime + focusTime,
            updatedAt: new Date(),
          })
          .where(and(eq(stats.userId, session.user.id), eq(stats.date, today)))
          .returning();
      } else {
        // Create if doesn't exist
        updatedStats = await db
          .insert(stats)
          .values({
            userId: session.user.id,
            date: today,
            focusTime,
          })
          .returning();
      }

      return NextResponse.json(updatedStats[0]);
    } catch (dbError) {
      // Handle potential race condition where another request created the record
      // between our check and insert
      const pgError = dbError as PostgresError;
      if (
        pgError.code === "23505" &&
        pgError.constraint === "user_id_date_idx"
      ) {
        // Retry the update
        const updatedStats = await db
          .update(stats)
          .set({
            focusTime: sql`focus_time + ${focusTime}`,
            updatedAt: new Date(),
          })
          .where(and(eq(stats.userId, session.user.id), eq(stats.date, today)))
          .returning();

        return NextResponse.json(updatedStats[0]);
      }

      throw dbError;
    }
  } catch (error) {
    console.error("[TRACK_STATS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to save stats" },
      { status: 500 }
    );
  }
}
