import { initTRPC } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getDB } from '../../db';

export async function createContext({req, res}: CreateExpressContextOptions) {
  return {
    req,
    res,
    db: getDB()
  }
}

type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;


// import { initTRPC } from '@trpc/server';
// import * as trpcExpress from '@trpc/server/adapters/express';

// export const createContext = ({req,res,}: trpcExpress.CreateExpressContextOptions) => {
//   const getUser = () => {
//     if (req.headers.authorization !== 'secret') {
//       return null;
//     }
//     return {
//       name: 'alex',
//     };
//   };

//   return {
//     req,
//     res,
//     user: getUser(),
//   };
// };

// type Context = Awaited<ReturnType<typeof createContext>>;

// export const t = initTRPC.context<Context>().create();

// export const router = t.router;
// export const publicProcedure = t.procedure;