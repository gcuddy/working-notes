import { text, integer, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

export const notes = sqliteTable('notes', {
	id: text('id').primaryKey(),
	title: text('title'),
	r2_key: text('r2_key'),
	created_at: integer('created_at', { mode: 'timestamp' }),
	updated_at: integer('updated_at', { mode: 'timestamp' })
});

export const backlinks = sqliteTable(
	'backlinks',
	{
		source: text('source'),
		target: text('target'),
		target_text: text('target_text'),
		context: text('context')
		// created_at: integer('created_at'),
		// updated_at: integer('updated_at')
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.source, table.target]
		})
	})
);

export const insertBacklinkSchema = createInsertSchema(backlinks);
