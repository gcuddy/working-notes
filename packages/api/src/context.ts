import { DrizzleD1Database } from "drizzle-orm/d1";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { createDb } from "./db/client";

interface ApiContextProps {
  db: DrizzleD1Database;
}

export const createContext = async (
  d1: D1Database,
  opts: FetchCreateContextFnOptions
): Promise<ApiContextProps> => {
  const db = createDb(d1);

  return {
    db,
  };
};

export type Context = ApiContextProps;
