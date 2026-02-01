import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/forgot-password", userController.createRecoverToken);
router.post("/reset-password", userController.resetPassword);

router.get("/me", authMiddleware, userController.me);

export default router;
