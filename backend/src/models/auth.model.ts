// DTOs e tipos da autenticacao.

export interface LoginDTO {
  email: string;
  password: string;
}

// Sem "role" de proposito: o usuario nao escolhe o proprio papel.
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

// Conteudo que vai dentro do JWT (volta em req.user apos o authenticate).
export interface TokenPayload {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

// Resposta de login/register. Nunca inclui a senha.
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}
