import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createTransaction,
  deleteTransaction,
  getExpenseDistribution,
  getFinancialSummary,
  getMonthlyTrends,
  getTransaction,
  listTransactions,
  updateTransaction,
} from "./transaction.controller";

const router = Router();

router.use(protect);

router.get("/expense-distribution", getExpenseDistribution);
router.get("/monthly-trends", getMonthlyTrends);
router.get("/summary", getFinancialSummary);

router.route("/").get(listTransactions).post(createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
