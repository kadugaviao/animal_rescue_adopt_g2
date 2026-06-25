import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERRO]", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({ message: "Registro ja existe (campo unico duplicado)." });
      case "P2025": 
        return res.status(404).json({ message: "Registro nao encontrado." });
      case "P2003": 
        return res.status(404).json({ message: "Relacionamento invalido (registro referenciado nao existe)." });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ message: "Dados invalidos para a operacao." });
  }

  if (err instanceof Error && err.message) {
    // Erro de negocio pode definir um status proprio (ex.: 409 duplicado); senao 400.
    const status =
      typeof (err as { status?: number }).status === "number"
        ? (err as { status?: number }).status!
        : 400;
    return res.status(status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Erro interno do servidor." });
}
