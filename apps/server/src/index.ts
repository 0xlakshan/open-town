import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { createContext } from './trpc/trpc';
import { appRouter } from './trpc';
import { createConnection } from '../db/index';


async function main() {
  
  // DB Connection
  await createConnection('postgresql://temp_dev_user:625625@localhost:5432/postgres');

  // express implementation
  const app = express();

  app.use((req, _res, next) => {
    // logger
    console.log('🌵', req.method, req.path, req.body ?? req.query);
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


  const PORT = 2021;
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

void main();