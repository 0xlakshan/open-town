import { 
    pgTable, 
    text, 
    boolean,
    timestamp,
    integer
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

export const virtual_room = pgTable("virtual_room", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    title: text("title").notNull(),
    isActive: boolean("is_active").default(false),
    activeUserCount: integer("active_user_count").default(0),
    roomHash: text("room_hash").notNull(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});
