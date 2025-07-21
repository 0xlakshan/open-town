import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: integer("id").primaryKey(),
    userName: text("user_name").notNull(),
    email: text("email").notNull().unique()
});