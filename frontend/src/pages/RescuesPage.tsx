import { useState, useEffect, useCallback, type SubmitEvent } from "react";
import api from "../api/axios";
import type { RescueReport } from "../types";
import { rescueStatusLabel, rescueStatusColor } from "../lib/status";

export function RescuesPage() {
  const [reports, setReports] = useState<RescueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Formulário de novo registro de resgate.
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");

  const loadReports = useCallback(async () => {
    try {
      // GET /rescue-reports/me -> só os registros do usuário logado.
      const { data } = await api.get<RescueReport[]>("/rescue-reports/me");
      setReports(data);
    } catch {
      setError("Erro ao carregar seus registros");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!description.trim() || !location.trim()) return;
    setSending(true);
    setFormError("");
    try {
      await api.post("/rescue-reports", { description, location });
      setDescription("");
      setLocation("");
      await loadReports(); // recarrega a lista com o novo registro
    } catch {
      setFormError("Não foi possível registrar o resgate.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="space-y-2">
        <span className="app-eyebrow">Resgates</span>
        <h1 className="app-title">Registrar resgate</h1>
        <p className="app-subtitle">
          Informe animais em situação de risco. O abrigo acompanha e atualiza o
          status de cada registro.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Formulário */}
        <section className="app-surface h-fit">
          <div className="app-panel-body space-y-4">
            <h2 className="text-lg font-semibold text-slate-950">
              Novo registro
            </h2>

            {formError && <div className="app-alert">{formError}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="app-label">Local</label>
                <input
                  type="text"
                  className="app-input"
                  placeholder="Ex.: Rua X, próximo ao mercado"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="app-label">Descrição</label>
                <textarea
                  className="app-textarea"
                  rows={4}
                  placeholder="Descreva o animal e a situação..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="app-button-primary w-full"
                disabled={sending}
              >
                {sending ? "Registrando..." : "Registrar resgate"}
              </button>
            </form>
          </div>
        </section>

        {/* Lista dos meus registros */}
        <section className="app-surface overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Meus registros
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Histórico dos resgates que você registrou.
            </p>
          </div>

          <div className="px-5 py-2 sm:px-6">
            {error && <div className="app-alert my-3">{error}</div>}

            {loading ? (
              <div className="py-4">
                <div className="app-empty">Carregando...</div>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-4">
                <div className="app-empty">Nenhum registro ainda.</div>
              </div>
            ) : (
              <ul className="app-list">
                {reports.map((report) => (
                  <li key={report.id} className="app-list-item">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-950">
                        {report.location}
                      </p>
                      <p className="text-sm leading-6 text-slate-500">
                        {report.description}
                      </p>
                    </div>
                    <span
                      className={`app-badge ${rescueStatusColor[report.status]}`}
                    >
                      {rescueStatusLabel[report.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
