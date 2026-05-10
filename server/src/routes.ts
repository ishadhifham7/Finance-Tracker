import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);

export default router;
