import { useState, useEffect, useCallback, type SubmitEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import type { Animal } from "../types";
import { animalStatusLabel, animalStatusColor, animalSizeLabel } from "../lib/status";

export function AnimalDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado do formulário de adoção.
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAnimal = useCallback(async () => {
    try {
      const { data } = await api.get<Animal>(`/animals/${id}`);
      setAnimal(data);
    } catch {
      setError("Erro ao carregar o animal");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAnimal();
  }, [loadAnimal]);

  async function handleAdopt(e: SubmitEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setFormError("");
    setSuccess("");
    try {
      await api.post("/adoptions", { animalId: id, message });
      setSuccess("Solicitação enviada! Acompanhe em 'Minhas adoções'.");
      setMessage("");
    } catch (err) {
      // 409 = você já tem um pedido para este animal.
      const status = (err as AxiosError).response?.status;
      if (status === 409) {
        setFormError("Você já enviou uma solicitação para este animal.");
      } else {
        setFormError("Não foi possível enviar a solicitação.");
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div className="app-empty">Carregando...</div>;
  }

  if (error || !animal) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="app-alert">{error || "Animal não encontrado."}</div>
        <Link to="/" className="app-link">
          &larr; Voltar para a lista
        </Link>
      </div>
    );
  }

  // Mesmo critério do backend: só aceita adoção quando o animal está AVAILABLE.
  const isAvailable = animal.status === "AVAILABLE";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        &larr; Voltar para a lista
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Coluna da imagem + dados */}
        <section className="app-surface overflow-hidden">
          {animal.imageUrl ? (
            <img
              src={animal.imageUrl}
              alt={animal.name}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-slate-100 text-6xl">
              🐾
            </div>
          )}

          <div className="app-panel-body space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h1 className="app-title">{animal.name}</h1>
              <span className={`app-badge ${animalStatusColor[animal.status]}`}>
                {animalStatusLabel[animal.status]}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Espécie" value={animal.species} />
              <Info label="Raça" value={animal.breed || "—"} />
              <Info
                label="Idade"
                value={animal.age != null ? `${animal.age}` : "—"}
              />
              <Info label="Porte" value={animalSizeLabel[animal.size]} />
            </div>

            {animal.description && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Sobre
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {animal.description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Coluna da adoção */}
        <aside className="app-surface h-fit">
          <div className="app-panel-body space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Quero adotar
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Envie uma mensagem ao abrigo contando por que você quer adotar.
              </p>
            </div>

            {!isAvailable ? (
              <div className="app-notice">
                {animal.status === "ADOPTED"
                  ? "Este animal já foi adotado. 🎉"
                  : animal.status === "IN_TREATMENT"
                    ? "Este animal está em tratamento e ainda não está disponível para adoção."
                    : "Indisponível para adoção."}
              </div>
            ) : !isAuthenticated ? (
              <div className="space-y-3">
                <div className="app-empty">
                  Você precisa estar logado para solicitar a adoção.
                </div>
                <button
                  className="app-button-primary w-full"
                  onClick={() => navigate("/login")}
                >
                  Entrar para adotar
                </button>
              </div>
            ) : (
              <>
                {success && <div className="app-notice">{success}</div>}
                {formError && <div className="app-alert">{formError}</div>}

                <form onSubmit={handleAdopt} className="space-y-4">
                  <div>
                    <label className="app-label">Mensagem</label>
                    <textarea
                      className="app-textarea"
                      rows={4}
                      placeholder="Conte um pouco sobre você e seu lar..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="app-button-primary w-full"
                    disabled={sending}
                  >
                    {sending ? "Enviando..." : "Enviar solicitação"}
                  </button>
                </form>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// Pequeno bloco rótulo + valor, reutilizado nos dados do animal.
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
