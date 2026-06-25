import app from "./app";
import { env } from "./config/env";

// Sobe o servidor HTTP. A montagem do app fica em app.ts.
app.listen(env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
});
