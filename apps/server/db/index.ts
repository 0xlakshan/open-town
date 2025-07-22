import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import * as schema from './schema';

const createDrizzle = (connection: Sql) => drizzle(connection, { schema });

let db: ReturnType<typeof createDrizzle>;
let connection: Sql;

export const createConnection = async (url: string) => {
    try {
        connection = postgres(url, { max: 10 });
        db = createDrizzle(connection);
        const result = await db.execute('SELECT 1');
        console.log('DB Connected Successfully', result);
    } catch (error) {
        console.log('DB Connection Failed', error);
        process.exit(1);
    }
}

export const getDB = () => db;
export const getConnection = () => connection;

export type DB = ReturnType<typeof createDrizzle>;