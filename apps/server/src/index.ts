import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { createContext } from './trpc/trpc';
import { appRouter } from './trpc';

import { drizzle } from 'drizzle-orm/postgres-js';




async function main() {
  
  // DB Connection
  const db = drizzle("postgresql://temp_dev_user:625625@localhost:5432/postgres");
  try {
    const result = await db.execute('select 1');
    const table = await db.execute('select * from test_table');
    console.log(table);
    console.log('DB Connected Successfully', result);
  } catch (error) {
    console.log('DB Connection Failed', error);
    process.exit(0);
  }

  // express implementation
  const app = express();

  app.use((req, _res, next) => {
    // request logger
    console.log('⬅️ ', req.method, req.path, req.body ?? req.query);

    next();
  });

  app.use('/trpc',trpcExpress.createExpressMiddleware({
    router: appRouter,
      createContext,
    }),
  );
  
  app.get('/', (_req, res) => {
    res.send('hello');
  });

  app.listen(2021, () => {
    console.log('listening on port 2021');
  });
}

void main();