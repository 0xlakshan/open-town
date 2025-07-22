import { publicProcedure, router, t } from '../trpc';
import { user } from '../../../db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { id } from 'zod/locales';

export const userRouter = router({
  createUser: publicProcedure
    .input(z.object({
      userName: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      password: z.string(),
      language: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
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
        // trpc specific errors
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Failed to fetch user"
        })
      }
    }),
  listUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.select().from(user);
      return users;
    } catch (error) {
      // trpc specific errors
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Failed to fetch user"
      })
    }
  }),
  getUserById: publicProcedure
    .input(
      z.object({
        userName: z.string()
      }).partial()
    )
    .query(async ({ ctx, input }) => {
      try {
        if (!input.userName) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: "userName id required"
          })
        }
        const userById = await ctx.db.select().from(user).where(eq(user.userName, input.userName));
        return userById;
      } catch (error) {
        // trpc specific errors
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Failed to fetch user"
        })
      }
  }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userName: z.string().optional(),
        email: z.string().optional(),
        emailVerified: z.boolean().optional(),
        password: z.string().optional(),
        language: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      if (Object.keys(data).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No fields to update provided'
        })
      }

      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'id is required'
        })
      }

      try {
        const updatedUser = await ctx.db
          .update(user)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(user.id, id))
          .returning();

        if (updatedUser.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User with that ID was not found.',
          });
        }          

        return updatedUser;
      } catch (error) {
        // trpc specific errors
        if (error instanceof TRPCError) {
          throw error;
        }
        // other potential errors
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user.',
        });
      }
    })
});