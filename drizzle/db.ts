import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env-local" });

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Add this line for debugging


const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);