import { session, user, account, verification } from "@/auth-schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);

export const schema = {
  user: user,
  account: account,
  session: session,
  verification: verification,
};
