import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/db/schema.ts"],
  driver: "d1",
  dbCredentials: {
    dbName: "notes",
    wranglerConfigPath: "wrangler.toml",
  },
  out: "./migrations",
  strict: true,
  verbose: false,
});
