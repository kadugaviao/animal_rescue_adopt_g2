import { useState, type SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Formulário controlado: cada input reflete o estado e o atualiza no onChange.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/"); // sucesso -> vai pra lista de animais
    } catch {
      setError("Email ou senha inválidos");
    }
  }

  return (
    <div className="app-auth-shell">
      <div className="app-auth-grid">
        <aside className="app-auth-panel">
          <div className="app-auth-content">
            <div className="space-y-6">
              <span className="app-eyebrow text-emerald-300">
                Resgate &amp; Adoção
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white xl:text-5xl">
                  Cada login aproxima um animal de um novo lar.
                </h1>
                <p className="max-w-md text-sm leading-7 text-slate-300">
                  Acompanhe os animais disponíveis, registre resgates e
                  acompanhe suas solicitações de adoção em um só lugar.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Animais para adoção
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Lista clara com filtros por espécie, porte e situação.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Resgates registrados
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Comunique animais em situação de risco rapidamente.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Adoções acompanhadas
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Veja o andamento de cada solicitação que você enviou.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
            <p className="text-sm leading-7 text-slate-300">
              Plataforma feita para conectar pessoas e animais — simples, direta
              e focada no que importa.
            </p>
          </div>
        </aside>

        <section className="app-auth-card">
          <div className="app-auth-form">
            <div className="space-y-3">
              <span className="app-eyebrow">Resgate &amp; Adoção</span>
              <div>
                <h2 className="app-title">Entrar</h2>
                <p className="app-subtitle">
                  Acesse para solicitar adoções e registrar resgates.
                </p>
              </div>
            </div>

            {error && <div className="app-alert">{error}</div>}

            <form className="app-form-grid" onSubmit={handleSubmit}>
              <div>
                <label className="app-label">Email</label>
                <input
                  type="email"
                  className="app-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="app-label">Senha</label>
                <input
                  type="password"
                  className="app-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="app-button-primary w-full">
                Entrar
              </button>
            </form>

            <p className="text-sm text-slate-600">
              Não tem conta?{" "}
              <Link className="app-link" to="/register">
                Cadastre-se
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
