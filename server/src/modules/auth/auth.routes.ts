import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getMe, syncUser } from "./auth.controller";

const router = Router();

router.get("/me", protect, getMe);
router.post("/sync", protect, syncUser);

export default router;
