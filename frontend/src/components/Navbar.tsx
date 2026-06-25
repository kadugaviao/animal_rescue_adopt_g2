import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // NavLink dá o estado isActive: destaca o link da rota atual.
  function navLinkClass({ isActive }: { isActive: boolean }) {
    return [
      "rounded-full px-3 py-2 text-sm font-semibold transition duration-150",
      isActive
        ? "bg-emerald-100 text-emerald-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");
  }

  return (
    <header className="app-topbar">
      <div className="app-container">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link className="flex items-center gap-3" to="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-extrabold text-white">
                🐾
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Resgate &amp; Adoção
                </p>
                <p className="text-sm text-slate-500">Um lar para cada animal</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap items-center gap-2">
              <NavLink className={navLinkClass} to="/" end>
                Animais
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink className={navLinkClass} to="/minhas-adocoes">
                    Minhas adoções
                  </NavLink>
                  <NavLink className={navLinkClass} to="/resgates">
                    Resgates
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <>
                  <NavLink className={navLinkClass} to="/admin/animais">
                    Gerir animais
                  </NavLink>
                  <NavLink className={navLinkClass} to="/admin/adocoes">
                    Adoções
                  </NavLink>
                  <NavLink className={navLinkClass} to="/admin/resgates">
                    Resgates (admin)
                  </NavLink>
                </>
              )}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              {isAuthenticated ? (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Conectado
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {user?.name}
                      </span>
                      {isAdmin && (
                        <span className="app-badge bg-emerald-100 text-emerald-700 ring-emerald-200">
                          admin
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="app-button-secondary px-4 py-3"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link className="app-button-secondary" to="/login">
                    Entrar
                  </Link>
                  <Link className="app-button-primary" to="/register">
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
