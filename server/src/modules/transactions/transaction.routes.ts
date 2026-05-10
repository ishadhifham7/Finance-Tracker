import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createTransaction,
  deleteTransaction,
  getFinancialSummary,
  getTransaction,
  listTransactions,
  updateTransaction,
} from "./transaction.controller";

const router = Router();

router.use(protect);

router.get("/summary", getFinancialSummary);

router
  .route("/")
  .get(listTransactions)
  .post(createTransaction);

router
  .route("/:id")
  .get(getTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
