import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as authSchema from "../auth-schema";
import { drizzle as drizzleWs } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// For normal queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// For prepared statements and better type inference
const queryClient = postgres(process.env.DATABASE_URL!);

export const db = drizzle(pool, {
  schema: { ...schema, ...authSchema },
});

// Create a separate instance for prepared statements
export const dbPrepared = drizzleWs(queryClient, {
  schema: { ...schema, ...authSchema },
});

// Export types
export type DbClient = typeof db;
export type Stats = typeof schema.stats.$inferSelect;
export type NewStats = typeof schema.stats.$inferInsert;
export type Settings = typeof schema.settings.$inferSelect;
export type NewSettings = typeof schema.settings.$inferInsert;

// Export schemas
export const insertStatsSchema = createInsertSchema(schema.stats);
export const selectStatsSchema = createSelectSchema(schema.stats);
export const insertSettingsSchema = createInsertSchema(schema.settings);
export const selectSettingsSchema = createSelectSchema(schema.settings);

export * from "./schema";
