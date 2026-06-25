import { useState, type SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    // Validação simples no cliente: confirmação de senha (o backend não checa isso).
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }
    try {
      await register(name, email, password);
      navigate("/");
    } catch {
      // Backend devolve erro quando o email já existe.
      setError("Erro ao cadastrar (o email já pode estar em uso)");
    }
  }

  return (
    <div className="app-auth-shell">
      <div className="app-auth-grid">
        <aside className="app-auth-panel">
          <div className="app-auth-content">
            <div className="space-y-6">
              <span className="app-eyebrow text-emerald-300">Bem-vindo</span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white xl:text-5xl">
                  Crie sua conta e ajude a dar um novo lar a quem precisa.
                </h1>
                <p className="max-w-md text-sm leading-7 text-slate-300">
                  Com uma conta você pode solicitar adoções e registrar animais
                  que precisam de resgate.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Cadastro rápido
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Poucos campos e você já começa a usar a plataforma.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Solicite adoções
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Envie uma mensagem e acompanhe a resposta do abrigo.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Registre resgates
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Informe local e descrição de animais em risco.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur">
            <p className="text-sm leading-7 text-slate-300">
              Sua participação faz a diferença na vida de muitos animais.
            </p>
          </div>
        </aside>

        <section className="app-auth-card">
          <div className="app-auth-form">
            <div className="space-y-3">
              <span className="app-eyebrow">Resgate &amp; Adoção</span>
              <div>
                <h2 className="app-title">Cadastrar</h2>
                <p className="app-subtitle">
                  Crie seu acesso para participar das adoções e resgates.
                </p>
              </div>
            </div>

            {error && <div className="app-alert">{error}</div>}

            <form className="app-form-grid" onSubmit={handleSubmit}>
              <div>
                <label className="app-label">Nome</label>
                <input
                  type="text"
                  className="app-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="grid gap-5 sm:grid-cols-2">
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

                <div>
                  <label className="app-label">Confirmar senha</label>
                  <input
                    type="password"
                    className="app-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="app-button-primary w-full">
                Cadastrar
              </button>
            </form>

            <p className="text-sm text-slate-600">
              Já tem conta?{" "}
              <Link className="app-link" to="/login">
                Entrar
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
