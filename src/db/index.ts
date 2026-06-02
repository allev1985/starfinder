import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "@/config";
import * as schema from "./schema";

declare global {
  var _pgClient: ReturnType<typeof postgres> | undefined;
}

const client = globalThis._pgClient ?? postgres(config.databaseUrl, { max: 1 });
if (process.env.NODE_ENV !== "production") globalThis._pgClient = client;

export const db = drizzle(client, { schema });
