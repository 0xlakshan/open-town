-- =================================================================
--  Postgres SQL Supported Schema
-- =================================================================
-- This script corrects the provided SQL for PostgreSQL compatibility
-- and incorporates best practices.
--
-- SQL migration changes:
-- 1. `user` table renamed to `users` to avoid reserved keyword conflicts.
-- 2. `ON UPDATE CURRENT_TIMESTAMP` is replaced with a trigger-based
--    function (`update_updated_at_column`) for automatic timestamp updates.
-- 3. `INT PRIMARY KEY` is changed to `BIGSERIAL PRIMARY KEY` for auto-incrementing IDs.
-- 4. `ENUM` types are created explicitly with `CREATE TYPE`.
-- 5. Foreign key constraints are written in correct PostgreSQL syntax.
-- 6. `JSON` type is changed to `JSONB` for better performance and indexing capabilities.
-- 7. `TIMESTAMP` is changed to `TIMESTAMPTZ` (timestamp with time zone) for robustness.
-- 8. Added indexes on foreign keys and frequently queried columns for performance.
-- =================================================================

-- -----------------------------------------------------------------
--  Trigger Function for `updated_at`
-- -----------------------------------------------------------------
-- PostgreSQL requires a trigger to automatically update the `updated_at` column on row changes.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';


-- -----------------------------------------------------------------
--  Custom Types
-- -----------------------------------------------------------------
-- ENUM types must be declared separately before use in a table.
CREATE TYPE user_status AS ENUM ('idle', 'offline', 'online');


-- -----------------------------------------------------------------
--  Table: users
-- -----------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Apply the trigger to the `users` table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------
--  Table: virtual_rooms
-- -----------------------------------------------------------------
CREATE TABLE virtual_rooms (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    active_user_count INT DEFAULT 0,
    room_hash VARCHAR(255) UNIQUE NOT NULL, -- room_hash should be unique
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Apply the trigger to the `virtual_rooms` table
CREATE TRIGGER update_virtual_rooms_updated_at
BEFORE UPDATE ON virtual_rooms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------
--  Table: user_virtual_room_sessions
-- -----------------------------------------------------------------
CREATE TABLE user_virtual_room_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id BIGINT NOT NULL REFERENCES virtual_rooms(id) ON DELETE CASCADE,
    position JSONB,
    status user_status DEFAULT 'offline',
    mic_enabled BOOLEAN DEFAULT false,
    video_enabled BOOLEAN DEFAULT false,
    screen_sharing BOOLEAN DEFAULT false,
    joined_at TIMESTAMPTZ,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- A user can only have one session per room
    UNIQUE(user_id, room_id)
);

-- Apply the trigger to the `user_virtual_room_sessions` table
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON user_virtual_room_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------
--  Table: chats
-- -----------------------------------------------------------------
CREATE TABLE chats (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES virtual_rooms(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Apply the trigger to the `chats` table
CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------
--  Table: video_calls
-- -----------------------------------------------------------------
CREATE TABLE video_calls (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES virtual_rooms(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Apply the trigger to the `video_calls` table
CREATE TRIGGER update_video_calls_updated_at
BEFORE UPDATE ON video_calls
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------
--  Indexes for Performance
-- -----------------------------------------------------------------
-- It's good practice to add indexes to foreign key columns and other
-- columns that will be frequently used in WHERE clauses.

-- Indexes for `users` table
CREATE INDEX idx_users_email ON users(email);

-- Indexes for `virtual_rooms` table
CREATE INDEX idx_virtual_rooms_user_id ON virtual_rooms(user_id);
CREATE INDEX idx_virtual_rooms_room_hash ON virtual_rooms(room_hash);

-- Indexes for `user_virtual_room_sessions` table
CREATE INDEX idx_sessions_user_id ON user_virtual_room_sessions(user_id);
CREATE INDEX idx_sessions_room_id ON user_virtual_room_sessions(room_id);

-- Indexes for `chats` table
CREATE INDEX idx_chats_room_id ON chats(room_id);
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC); -- For fetching recent messages

-- Indexes for `video_calls` table
CREATE INDEX idx_video_calls_room_id ON video_calls(room_id);

