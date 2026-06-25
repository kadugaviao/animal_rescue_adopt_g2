import { Router } from "express";
import { animalController } from "../controllers/animal.controller";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/isAdmin";
import { validate } from "../middlewares/validate";

const router = Router();

// Publicas: qualquer um ve a lista e os detalhes (aceita ?species=&size=&status=)
router.get("/", animalController.list);
router.get("/:id", animalController.getById);

// Apenas ADMIN cadastra, edita e remove animais.
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(["name", "species", "size"]),
  animalController.create
);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(["name", "species", "size"]),
  animalController.update
);
router.delete("/:id", authenticate, authorize("ADMIN"), animalController.remove);

export default router;
