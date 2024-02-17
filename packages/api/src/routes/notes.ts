import { parse, string } from "valibot";
import { publicProcedure, router } from "../trpc";
import { NotesTable, selectNotesSchema } from "../db/schema";
import { eq } from "drizzle-orm";

export const notesRouter = router({
  note: publicProcedure
    .input((raw) => parse(string(), raw))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const note = await db
        .select()
        .from(NotesTable)
        .where(eq(NotesTable.id, input))
        .get();

      // TODO: should we throw if it doesn't exist?

      //   TODO: backlinks, rendering

      return note;
    }),
});
