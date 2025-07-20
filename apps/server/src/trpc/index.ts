import { userRouter } from "./routers/users";
import { router } from "./trpc";

// --------- create procedures etc
// const messageRouter = router({
//   addMessage: publicProcedure.input(z.string()).mutation(({ input }) => {
//     const msg = createMessage(input);
//     db.messages.push(msg);

//     return msg;
//   }),
//   listMessages: publicProcedure.query(() => db.messages),
// });

// root router to call
export const appRouter = router({
  // merge predefined routers
  user: userRouter
  // message: messageRouter,
  // // or individual procedures
  // hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
  //   return `hello ${input ?? ctx.user?.name ?? 'world'}`;
  // }),
  // // or inline a router
  // admin: router({
  //   secret: publicProcedure.query(({ ctx }) => {
  //     if (!ctx.user) {
  //       throw new TRPCError({ code: 'UNAUTHORIZED' });
  //     }
  //     if (ctx.user?.name !== 'alex') {
  //       throw new TRPCError({ code: 'FORBIDDEN' });
  //     }
  //     return {
  //       secret: 'sauce',
  //     };
  //   }),
  // }),
});

export type AppRouter = typeof appRouter;