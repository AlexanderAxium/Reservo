import { router } from "../trpc";
import { companyInfoRouter } from "./companyInfo";
import { featureRouter } from "./feature";
import { fieldRouter } from "./field";
import { rbacRouter } from "./rbac";
import { reservationRouter } from "./reservation";
import { translationRouter } from "./translation";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  companyInfo: companyInfoRouter,
  translation: translationRouter,
  field: fieldRouter,
  feature: featureRouter,
  reservation: reservationRouter,
});

export type AppRouter = typeof appRouter;
