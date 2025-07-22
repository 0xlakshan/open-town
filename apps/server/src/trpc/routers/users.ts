import { publicProcedure, router, t } from '../trpc';
import { user } from '../../../db/schema';
import { z } from 'zod';

export const userRouter = router({
  createUser: t.procedure
    .input(z.object({
      userName: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      password: z.string(),
      language: z.string(),
     }))
    .mutation(async ({ctx, input}) => {
      try {
        const newUser = await ctx.db
          .insert(user)
          .values({
            id: crypto.randomUUID(),
            userName: input.userName,
            email: input.email,
            emailVerified: input.emailVerified,
            password: input.password,
            language: input.language,
            createdAt: new Date(),
            updatedAt: new Date()
          }).returning();

          return newUser;
      } catch (error) {
        console.log(error);
      }
    }),
  listUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.select().from(user);
      return users;
    } catch (error) {
      console.log(error);
    }
  }),
});