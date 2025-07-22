import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const DEFAULT_SETTINGS = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  pomodoroColor: "oklch(0.3635 0.0554 277.8)",
  shortBreakColor: "oklch(0.5406 0.067 196.69)",
  longBreakColor: "oklch(0.4703 0.0888 247.87)",
  volume: 1,
  alarmSound: "alarm-bell.mp3",
  backsound: "",
  alarmRepeat: 1,
} as const;

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSettings = await db.query.settings.findFirst({
      where: eq(settings.userId, session.user.id),
    });

    if (!userSettings) {
      // Return default settings if none exist
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    // Remove date fields from the response
    const { createdAt, updatedAt, ...settingsWithoutDates } = userSettings;
    return NextResponse.json(settingsWithoutDates);
  } catch (error) {
    console.error("[SETTINGS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Extract only the fields we want to save
    const {
      pomodoroTime,
      shortBreakTime,
      longBreakTime,
      autoStartBreaks,
      autoStartPomodoros,
      longBreakInterval,
      pomodoroColor,
      shortBreakColor,
      longBreakColor,
      volume,
      alarmSound,
      backsound,
      alarmRepeat,
    } = body;

    const settingsData = {
      userId: session.user.id,
      pomodoroTime,
      shortBreakTime,
      longBreakTime,
      autoStartBreaks,
      autoStartPomodoros,
      longBreakInterval,
      pomodoroColor,
      shortBreakColor,
      longBreakColor,
      volume,
      alarmSound,
      backsound,
      alarmRepeat,
      updatedAt: new Date(),
    };

    // First try to find existing settings
    const existingSettings = await db.query.settings.findFirst({
      where: eq(settings.userId, session.user.id),
    });

    let result;
    if (existingSettings) {
      // Update if exists
      result = await db
        .update(settings)
        .set(settingsData)
        .where(eq(settings.userId, session.user.id))
        .returning();
    } else {
      // Create if doesn't exist
      result = await db.insert(settings).values(settingsData).returning();
    }

    // Remove date fields from the response
    const { createdAt, updatedAt, ...settingsWithoutDates } = result[0];
    return NextResponse.json(settingsWithoutDates);
  } catch (error) {
    console.error("[SETTINGS_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
