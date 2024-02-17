import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "./router";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
