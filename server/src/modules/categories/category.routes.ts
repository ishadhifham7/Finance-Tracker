import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(listCategories)
  .post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
