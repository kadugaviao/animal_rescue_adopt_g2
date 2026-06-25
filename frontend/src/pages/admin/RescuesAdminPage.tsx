import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import type { RescueReport, RescueStatus } from "../../types";
import { rescueStatusLabel, rescueStatusColor } from "../../lib/status";

export function RescuesAdminPage() {
  const [reports, setReports] = useState<RescueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      // GET /rescue-reports (ADMIN) -> todos, com o usuário que registrou.
      const { data } = await api.get<RescueReport[]>("/rescue-reports");
      setReports(data);
    } catch {
      setError("Erro ao carregar os registros");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // PATCH /rescue-reports/:id/status — muda entre OPEN, RESCUED e CANCELED.
  async function changeStatus(id: string, status: RescueStatus) {
    setUpdatingId(id);
    setError("");
    try {
      await api.patch(`/rescue-reports/${id}/status`, { status });
      await loadReports();
    } catch {
      setError("Não foi possível atualizar o registro.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <span className="app-eyebrow">Administração</span>
        <h1 className="app-title">Registros de resgate</h1>
        <p className="app-subtitle">
          Acompanhe os resgates informados e atualize a situação de cada um.
        </p>
      </div>

      {error && <div className="app-alert">{error}</div>}

      {loading ? (
        <div className="app-empty">Carregando...</div>
      ) : reports.length === 0 ? (
        <div className="app-empty">Nenhum registro recebido.</div>
      ) : (
        <section className="app-surface overflow-hidden">
          <div className="app-table-scroll">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Local</th>
                  <th>Descrição</th>
                  <th>Registrado por</th>
                  <th>Status</th>
                  <th className="text-right">Alterar para</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="font-semibold text-slate-950">
                      {report.location}
                    </td>
                    <td>
                      <span className="block max-w-xs text-sm text-slate-600">
                        {report.description}
                      </span>
                    </td>
                    <td>
                      <div className="min-w-[160px]">
                        <p className="text-sm font-medium text-slate-800">
                          {report.user?.name ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {report.user?.email}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`app-badge ${rescueStatusColor[report.status]}`}
                      >
                        {rescueStatusLabel[report.status]}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <select
                          className="app-select max-w-[180px]"
                          value={report.status}
                          disabled={updatingId === report.id}
                          onChange={(e) =>
                            changeStatus(
                              report.id,
                              e.target.value as RescueStatus,
                            )
                          }
                        >
                          <option value="OPEN">Aberto</option>
                          <option value="RESCUED">Resgatado</option>
                          <option value="CANCELED">Cancelado</option>
                        </select>
                      </div>
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
