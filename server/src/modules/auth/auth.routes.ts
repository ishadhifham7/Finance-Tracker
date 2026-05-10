import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { AuthRequest } from "./auth.types";

const router = Router();

// Endpoint to check auth status and return user profile
router.get("/me", protect, (req: AuthRequest, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

export default router;
