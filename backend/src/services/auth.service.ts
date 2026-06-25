import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { env } from "../config/env";
import { LoginDTO, RegisterDTO, AuthResponse, TokenPayload } from "../models/auth.model";

function gerarToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Checa e-mail duplicado com mensagem clara, sem depender so do @unique.
    const existente = await prisma.user.findUnique({ where: { email: data.email } });
    if (existente) {
      throw new Error("E-mail ja cadastrado.");
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
        role: "USER",
      },
    });

    const token = gerarToken({ id: user.id, email: user.email, role: user.role });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async login(data: LoginDTO): Promise<AuthResponse | null> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return null;

    const senhaOk = await bcrypt.compare(data.password, user.password);
    if (!senhaOk) return null;

    const token = gerarToken({ id: user.id, email: user.email, role: user.role });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return user;
  },
};
