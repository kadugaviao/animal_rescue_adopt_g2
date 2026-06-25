import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/logger";
import { errorMiddleware } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import animalRoutes from "./routes/animal.routes";
import adoptionRoutes from "./routes/adoption.routes";
import rescueRoutes from "./routes/rescue.routes";

// Monta o app Express. A ordem dos middlewares importa.
const app = express();

// CORS libera o frontend a chamar a API.
app.use(cors());

// Parser de JSON antes das rotas, senao req.body fica undefined.
app.use(express.json());

app.use(loggerMiddleware);

// Rotas do dominio.
app.use("/auth", authRoutes);
app.use("/animals", animalRoutes);
app.use("/adoptions", adoptionRoutes);
app.use("/rescue-reports", rescueRoutes);

// Error middleware sempre por ultimo (so roda em next(err) ou throw).
app.use(errorMiddleware);

export default app;
