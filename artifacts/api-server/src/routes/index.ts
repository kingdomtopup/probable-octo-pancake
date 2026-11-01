import { Router, type IRouter } from "express";
import healthRouter from "./health";
import topupRouter from "./topup";
import paymentRouter from "./payment";

const router: IRouter = Router();

router.use(healthRouter);
router.use(topupRouter);
router.use(paymentRouter);

export default router;
