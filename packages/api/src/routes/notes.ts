import { parse, string } from "valibot";
import { publicProcedure, router } from "../trpc";
import { BacklinksTable, NotesTable, selectNotesSchema } from "../db/schema";
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

        const backlinksPromise = db
          // .query.BacklinksTable.findMany({
          //     where: eq(BacklinksTable.target, note.id),
          // })
          .select({
            r2_key: NotesTable.r2_key,
            title: NotesTable.title,
            target_text: BacklinksTable.target_text,
            context: BacklinksTable.context,
            noteId: BacklinksTable.target,
          })
          .from(BacklinksTable)
          .where(eq(BacklinksTable.source, note.id))
          .innerJoin(NotesTable, eq(BacklinksTable.target, NotesTable.id));

        const outgoingLinksPromise = db
          .select({
            target: BacklinksTable.target,
            target_text: BacklinksTable.target_text,
            r2_key: NotesTable.r2_key,
          })
          .from(BacklinksTable)
          .innerJoin(NotesTable, eq(BacklinksTable.target, NotesTable.id))
          .where(eq(BacklinksTable.source, note.id));

        const [backlinks, outgoingLinks] = await Promise.all([
          backlinksPromise,
          outgoingLinksPromise,
        ]);

        console.log({ backlinks, outgoingLinks });

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
          backlinks,
          outgoingLinks,
        };
      } catch (e) {
        console.log("notes.note - error", e);
        throw e;
      }

      // TODO: should we throw if it doesn't exist?

      //   TODO: backlinks, rendering
    }),
});
