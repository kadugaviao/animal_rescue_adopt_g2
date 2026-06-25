import dotenv from "dotenv";

// Carrega o .env para process.env.
dotenv.config();

// Valida as variaveis criticas na subida: melhor nem subir do que quebrar na request.
const { DATABASE_URL, JWT_SECRET } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL nao definida. Configure o .env (string do Neon).");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET nao definida. Configure o .env com um segredo forte.");
}

// Objeto unico e tipado pro resto do app importar daqui.
export const env = {
  DATABASE_URL,
  JWT_SECRET,
  PORT: Number(process.env.PORT) || 3333,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
