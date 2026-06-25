import { Router } from "express";
import { rescueController } from "../controllers/rescue.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/isAdmin";
import { validate } from "../middlewares/validate";

const router = Router();

// Usuario logado: cria registro e ve os proprios
router.post("/", authenticate, validate(["description", "location"]), rescueController.create);
router.get("/me", authenticate, rescueController.listMine);

// ADMIN: ve todos e altera o status
router.get("/", authenticate, authorize("ADMIN"), rescueController.listAll);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(["status"]),
  rescueController.updateStatus
);

export default router;
