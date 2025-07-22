import { 
    pgTable, 
    text, 
    boolean,
    timestamp
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    userName: text("user_name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    password: text("password").notNull(),
    language: text("language").notNull().default("en"),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});