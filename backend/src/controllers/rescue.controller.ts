import { Request, Response, NextFunction } from "express";
import { rescueService } from "../services/rescue.service";

export const rescueController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await rescueService.create(req.user!.id, req.body);
      return res.status(201).json(report);
    } catch (err) {
      next(err);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await rescueService.listMine(req.user!.id);
      return res.status(200).json(reports);
    } catch (err) {
      next(err);
    }
  },

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await rescueService.listAll();
      return res.status(200).json(reports);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await rescueService.updateStatus(String(req.params.id), req.body.status);
      return res.status(200).json(report);
    } catch (err) {
      next(err);
    }
  },
};
