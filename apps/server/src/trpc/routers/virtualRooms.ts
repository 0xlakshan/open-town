import { publicProcedure, router, t } from "../trpc";
import { virtual_room } from "../../../db/schema";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const virtualRoomRouter = router({
  createVirtualRoom: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        isActive: z.boolean(),
        activeUserCount: z.number(),
        roomHash: z.string(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newVirtualRoom = await ctx.db
          .insert(virtual_room)
          .values({
            id: crypto.randomUUID(),
            userId: input.userId,
            title: input.title,
            isActive: input.isActive,
            activeUserCount: input.activeUserCount,
            roomHash: input.roomHash,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return newVirtualRoom;
      } catch (error) {
        // trpc specific errors
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),
});
