import { AnimalStatus, AnimalSize } from "@prisma/client";

// Filtros aceitos em GET /animals (?species=&size=&status=)
export interface AnimalFilters {
  species?: string;
  size?: string;
  status?: string;
}

export interface CreateAnimalDTO {
  name: string;
  species: string;
  size: AnimalSize;
  status?: AnimalStatus;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
}

// Update: tudo opcional — o admin manda so o que quer mudar.
export type UpdateAnimalDTO = Partial<CreateAnimalDTO>;
