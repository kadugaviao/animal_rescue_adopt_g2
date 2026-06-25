import { Router } from "express";
import { adoptionController } from "../controllers/adoption.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/isAdmin";
import { validate } from "../middlewares/validate";

const router = Router();

// Usuario logado: cria solicitacao e ve as proprias
router.post("/", authenticate, validate(["animalId", "message"]), adoptionController.create);
router.get("/me", authenticate, adoptionController.listMine);

// ADMIN: ve todas e aprova/rejeita
router.get("/", authenticate, authorize("ADMIN"), adoptionController.listAll);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(["status"]),
  adoptionController.updateStatus
);

export default router;
