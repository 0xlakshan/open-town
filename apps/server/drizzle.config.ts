import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './db/schema.ts',
    out: './db/migrations',
    dbCredentials: {
        url: 'postgresql://temp_dev_user:625625@localhost:5432/postgres'
    }
});