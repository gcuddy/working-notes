import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "./router";
import { createContext } from "./context";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/trpc/*", async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log("APP_URL is not defined. CORS errors may occur.");
  }

  return await cors({
    origin: (origin) =>
      origin.endsWith(new URL(c.env.APP_URL).host) ? origin : c.env.APP_URL,
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  })(c, next);
});

app.use("/trpc/*", async (c, next) => {
  console.log("HELLO????");
  return await trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(c.env.DB, c.env.BUCKET, opts);
    },
  })(c, next);
});

export default app;
