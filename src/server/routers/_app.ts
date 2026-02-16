import { router } from "../trpc";
import { companyInfoRouter } from "./companyInfo";
import { featureRouter } from "./feature";
import { fieldRouter } from "./field";
import { metricsRouter } from "./metrics";
import { paymentRouter } from "./payment";
import { rbacRouter } from "./rbac";
import { reservationRouter } from "./reservation";
import { sportCenterRouter } from "./sportCenter";
import { tenantRouter } from "./tenant";
import { translationRouter } from "./translation";
import { uploadRouter } from "./upload";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  companyInfo: companyInfoRouter,
  translation: translationRouter,
  field: fieldRouter,
  feature: featureRouter,
  reservation: reservationRouter,
  tenant: tenantRouter,
  sportCenter: sportCenterRouter,
  payment: paymentRouter,
  metrics: metricsRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
