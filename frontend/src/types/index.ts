// Tipos do domínio — todos espelham EXATAMENTE o que o backend devolve (camelCase
// e enums em MAIÚSCULO, iguais aos enums do schema.prisma).

// ---------- Autenticação ----------

// Papéis do usuário — IGUAIS ao enum Role do backend.
export type Role = "USER" | "ADMIN";

// O que o backend retorna como "user" (NUNCA vem password).
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string; // GET /auth/me devolve; register/login não
};

// Resposta de POST /auth/register e POST /auth/login.
export type AuthResponse = {
  token: string;
  user: User;
};

// ---------- Animais ----------

// Enum AnimalStatus do backend.
export type AnimalStatus = "AVAILABLE" | "ADOPTED" | "IN_TREATMENT";

// Enum AnimalSize do backend (porte).
export type AnimalSize = "SMALL" | "MEDIUM" | "LARGE";

export type Animal = {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  size: AnimalSize;
  description?: string | null;
  imageUrl?: string | null;
  status: AnimalStatus;
  createdAt: string;
  updatedAt: string;
};

// ---------- Solicitações de adoção ----------

export type AdoptionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdoptionRequest = {
  id: string;
  status: AdoptionStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  animalId: string;
  // include do backend: listMine traz animal; listAll traz animal + user
  animal?: Animal;
  user?: { id: string; name: string; email: string };
};

// ---------- Registros de resgate ----------

export type RescueStatus = "OPEN" | "RESCUED" | "CANCELED";

export type RescueReport = {
  id: string;
  description: string;
  location: string;
  status: RescueStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  // listAll do backend traz o user
  user?: { id: string; name: string; email: string };
};
