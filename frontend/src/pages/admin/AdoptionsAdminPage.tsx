import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import type { AdoptionRequest, AdoptionStatus } from "../../types";
import { adoptionStatusLabel, adoptionStatusColor } from "../../lib/status";

export function AdoptionsAdminPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      // GET /adoptions (ADMIN) -> todas, com animal e user incluídos.
      const { data } = await api.get<AdoptionRequest[]>("/adoptions");
      setRequests(data);
    } catch {
      setError("Erro ao carregar as solicitações");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // PATCH /adoptions/:id/status. Ao APROVAR, o backend marca o animal como ADOPTED
  // (dentro de uma transação) — por isso recarregamos a lista depois.
  async function changeStatus(id: string, status: AdoptionStatus) {
    setUpdatingId(id);
    setError("");
    try {
      await api.patch(`/adoptions/${id}/status`, { status });
      await loadRequests();
    } catch {
      setError("Não foi possível atualizar a solicitação.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <span className="app-eyebrow">Administração</span>
        <h1 className="app-title">Solicitações de adoção</h1>
        <p className="app-subtitle">
          Aprove ou rejeite os pedidos. Aprovar marca o animal como adotado.
        </p>
      </div>

      {error && <div className="app-alert">{error}</div>}

      {loading ? (
        <div className="app-empty">Carregando...</div>
      ) : requests.length === 0 ? (
        <div className="app-empty">Nenhuma solicitação recebida.</div>
      ) : (
        <section className="app-surface overflow-hidden">
          <div className="app-table-scroll">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Solicitante</th>
                  <th>Mensagem</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="font-semibold text-slate-950">
                      {req.animal?.name ?? "—"}
                    </td>
                    <td>
                      <div className="min-w-[160px]">
                        <p className="text-sm font-medium text-slate-800">
                          {req.user?.name ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {req.user?.email}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="block max-w-xs text-sm text-slate-600">
                        {req.message}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`app-badge ${adoptionStatusColor[req.status]}`}
                      >
                        {adoptionStatusLabel[req.status]}
                      </span>
                    </td>
                    <td>
                      {req.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            className="app-button-primary px-3 py-2"
                            onClick={() => changeStatus(req.id, "APPROVED")}
                            disabled={updatingId === req.id}
                          >
                            Aprovar
                          </button>
                          <button
                            className="app-button-danger"
                            onClick={() => changeStatus(req.id, "REJECTED")}
                            disabled={updatingId === req.id}
                          >
                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <span className="block text-right text-xs text-slate-400">
                          Decidido
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
