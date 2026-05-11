import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import categoryRoutes from "./modules/categories/category.routes";
import budgetRoutes from "./modules/budgets/budget.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);
router.use("/budgets", budgetRoutes);

export default router;
