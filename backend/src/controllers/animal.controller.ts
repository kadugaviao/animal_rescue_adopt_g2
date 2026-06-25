import { Request, Response, NextFunction } from "express";
import { animalService } from "../services/animal.service";

export const animalController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const animais = await animalService.list({
        species: req.query.species as string | undefined,
        size: req.query.size as string | undefined,
        status: req.query.status as string | undefined,
      });
      return res.status(200).json(animais);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const animal = await animalService.getById(String(req.params.id));
      if (!animal) return res.status(404).json({ message: "Animal nao encontrado." });
      return res.status(200).json(animal);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const animal = await animalService.create(req.body);
      return res.status(201).json(animal);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const animal = await animalService.update(String(req.params.id), req.body);
      return res.status(200).json(animal);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await animalService.remove(String(req.params.id));
      return res.status(204).send(); // 204 = sucesso sem corpo
    } catch (err) {
      next(err);
    }
  },
};
