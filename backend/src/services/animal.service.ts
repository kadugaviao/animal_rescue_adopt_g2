import { Prisma, AnimalStatus, AnimalSize } from "@prisma/client";
import prisma from "../lib/prisma";
import { AnimalFilters, CreateAnimalDTO, UpdateAnimalDTO } from "../models/animal.model";

// Valida o enum de status com mensagem clara, em vez de deixar o Prisma estourar.
const STATUS_VALIDOS: AnimalStatus[] = ["AVAILABLE", "ADOPTED", "IN_TREATMENT"];

function validarStatus(status?: AnimalStatus) {
  if (status !== undefined && !STATUS_VALIDOS.includes(status)) {
    throw new Error("Status invalido. Use AVAILABLE, ADOPTED ou IN_TREATMENT.");
  }
}

// Valida o enum de porte (tamanho do animal).
const PORTES_VALIDOS: AnimalSize[] = ["SMALL", "MEDIUM", "LARGE"];

function validarPorte(size?: AnimalSize) {
  if (size !== undefined && !PORTES_VALIDOS.includes(size)) {
    throw new Error("Porte invalido. Use SMALL, MEDIUM ou LARGE.");
  }
}

export const animalService = {
  // Lista publica com filtros opcionais por especie, porte e status.
  async list(filters: AnimalFilters) {
    const where: Prisma.AnimalWhereInput = {};

    if (filters.species) {
      where.species = { equals: filters.species, mode: "insensitive" };
    }
    if (filters.size) {
      where.size = filters.size as AnimalSize;
    }
    if (filters.status) {
      where.status = filters.status as AnimalStatus;
    }

    return prisma.animal.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  async getById(id: string) {
    return prisma.animal.findUnique({ where: { id } });
  },

  async create(data: CreateAnimalDTO) {
    validarStatus(data.status);
    validarPorte(data.size);
    return prisma.animal.create({ data });
  },

  async update(id: string, data: UpdateAnimalDTO) {
    validarStatus(data.status);
    validarPorte(data.size);
    // P2025 (nao encontrado) e tratado no errorMiddleware.
    return prisma.animal.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.animal.delete({ where: { id } });
  },
};
