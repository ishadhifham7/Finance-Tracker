import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  createBudget,
  deleteBudget,
  getBudget,
  listBudgets,
  updateBudget,
} from "./budget.controller";

const router = Router();

router.use(protect);

router.route("/").get(listBudgets).post(createBudget);

router.route("/:id").get(getBudget).patch(updateBudget).delete(deleteBudget);

export default router;
