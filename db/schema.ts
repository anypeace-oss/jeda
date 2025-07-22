import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  real,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { user } from "../auth-schema";

export const stats = pgTable(
  "stats",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    focusTime: integer("focus_time").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdDateIdx: uniqueIndex("user_id_date_idx").on(table.userId, table.date),
  })
);

export const settings = pgTable("settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  pomodoroTime: integer("pomodoro_time").notNull().default(25),
  shortBreakTime: integer("short_break_time").notNull().default(5),
  longBreakTime: integer("long_break_time").notNull().default(15),
  autoStartBreaks: boolean("auto_start_breaks").notNull().default(false),
  autoStartPomodoros: boolean("auto_start_pomodoros").notNull().default(false),
  longBreakInterval: integer("long_break_interval").notNull().default(4),
  pomodoroColor: text("pomodoro_color")
    .notNull()
    .default("oklch(0.3635 0.0554 277.8)"),
  shortBreakColor: text("short_break_color")
    .notNull()
    .default("oklch(0.5406 0.067 196.69)"),
  longBreakColor: text("long_break_color")
    .notNull()
    .default("oklch(0.4703 0.0888 247.87)"),
  alarmRepeat: integer("alarm_repeat").notNull().default(1),
  volume: real("volume").notNull().default(1),
  alarmSound: text("alarm_sound").notNull().default("alarm-bell.mp3"),
  backsound: text("backsound").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
