// Rótulos (PT-BR) e cores de cada status, centralizados pra não repetir nas telas.
import type { AnimalStatus, AnimalSize, AdoptionStatus, RescueStatus } from "../types";

export const animalStatusLabel: Record<AnimalStatus, string> = {
  AVAILABLE: "Disponível",
  ADOPTED: "Adotado",
  IN_TREATMENT: "Em tratamento",
};

// Rótulos do porte (enum AnimalSize do backend).
export const animalSizeLabel: Record<AnimalSize, string> = {
  SMALL: "Pequeno",
  MEDIUM: "Médio",
  LARGE: "Grande",
};

export const animalStatusColor: Record<AnimalStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  ADOPTED: "bg-slate-200 text-slate-700 ring-slate-300",
  IN_TREATMENT: "bg-amber-100 text-amber-800 ring-amber-200",
};

export const adoptionStatusLabel: Record<AdoptionStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

export const adoptionStatusColor: Record<AdoptionStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-100 text-rose-700 ring-rose-200",
};

export const rescueStatusLabel: Record<RescueStatus, string> = {
  OPEN: "Aberto",
  RESCUED: "Resgatado",
  CANCELED: "Cancelado",
};

export const rescueStatusColor: Record<RescueStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800 ring-amber-200",
  RESCUED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  CANCELED: "bg-slate-200 text-slate-700 ring-slate-300",
};
