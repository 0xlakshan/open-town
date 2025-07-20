import { z } from 'zod';
import { db } from '../../../db/db';
import { publicProcedure, router, t } from '../trpc';

let id = 0;

export const userRouter = router({
  createUser: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const post = {
        id: ++id,
        ...input,
      };
      db.posts.push(post);
      return post;
    }),
  listUsers: publicProcedure.query(() => db.posts),
});