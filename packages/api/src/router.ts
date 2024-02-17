import { router } from "./trpc";
import { notesRouter } from "./routes/notes";

export const appRouter = router({
  notes: notesRouter,
});
