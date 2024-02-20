import { router } from "./trpc";
import { notesRouter } from "./routes/notes";
import { inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  notes: notesRouter,
});

export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
