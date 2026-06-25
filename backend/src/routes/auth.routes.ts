import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Publicas. No cadastro nao validamos "role": o usuario nao escolhe papel.
router.post("/register", validate(["name", "email", "password"]), authController.register);
router.post("/login", validate(["email", "password"]), authController.login);

// Protegida: precisa de token valido.
router.get("/me", authenticate, authController.me);

export default router;
