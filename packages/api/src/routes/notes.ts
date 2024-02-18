import { parse, string } from "valibot";
import { publicProcedure, router } from "../trpc";
import { NotesTable, selectNotesSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { useProcessor } from "../utils/markdown";

export const notesRouter = router({
  note: publicProcedure
    .input((raw) => parse(string(), raw))
    .query(async ({ ctx, input }) => {
      console.log("notes.note - input", input, { ctx });
      const t0 = Date.now();
      const { db, bucket } = ctx;

      try {
        const note = await db
          .select()
          .from(NotesTable)
          .where(eq(NotesTable.id, input))
          .get();

        if (!note) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        const obj = await bucket.get(note.r2_key as string);
        const noteText = await obj?.text();

        const processor = useProcessor([]);

        const html = processor.processSync(noteText).toString();

        console.log("notes.note - time", Date.now() - t0);
        // const note = "HELO";
        return {
          ...note,
          note: noteText,
          html,
        };
      } catch (e) {
        console.log("notes.note - error", e);
        throw e;
      }

      // TODO: should we throw if it doesn't exist?

      //   TODO: backlinks, rendering
    }),
});
