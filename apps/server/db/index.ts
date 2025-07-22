import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema';

const createDrizzle = (connection: Sql) => drizzle(connection, { schema });

let db: ReturnType<typeof createDrizzle>;
let connection: Sql;

export const createConnection = (url: string) => {
    connection = postgres(url, { max: 10 });
    db = createDrizzle(connection);
    return {
        db,
        connection
    }
}

export const getDB = () => {
    if (!db) throw new Error("Connection Error");
    return db;
};

export const getConnection = () => {
    if (!connection) throw new Error('Connection Error');
    return connection;
};

export type DB = ReturnType<typeof createDrizzle>;