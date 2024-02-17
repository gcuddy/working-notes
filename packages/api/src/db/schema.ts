import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-valibot";

export const NotesTable = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title"),
  r2_key: text("r2_key"),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),
});

export type Notes = InferSelectModel<typeof NotesTable>;
export type InsertNotes = InferInsertModel<typeof NotesTable>;
export const insertNotesSchema = createInsertSchema(NotesTable);
export const selectNotesSchema = createSelectSchema(NotesTable);

export const BacklinksTable = sqliteTable(
  "backlinks",
  {
    source: text("source"),
    target: text("target"),
    target_text: text("target_text"),
    context: text("context"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.source, table.target],
    }),
  })
);

export type Backlinks = InferSelectModel<typeof BacklinksTable>;
export type InsertBacklinks = InferInsertModel<typeof BacklinksTable>;
export const insertBacklinkSchema = createInsertSchema(BacklinksTable);
export const selectBacklinksSchema = createSelectSchema(BacklinksTable);
