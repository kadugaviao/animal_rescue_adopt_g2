import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

// Casca das telas internas: Navbar no topo + conteúdo da rota no <Outlet />.
// Login e Cadastro não usam este layout.
export function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-page">
        <div className="app-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
