import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { AdoptionRequest } from "../types";
import { adoptionStatusLabel, adoptionStatusColor } from "../lib/status";

export function MyAdoptionsPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // GET /adoptions/me -> só as solicitações do usuário logado (com animal).
        const { data } = await api.get<AdoptionRequest[]>("/adoptions/me");
        setRequests(data);
      } catch {
        setError("Erro ao carregar suas solicitações");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="space-y-2">
        <span className="app-eyebrow">Acompanhamento</span>
        <h1 className="app-title">Minhas adoções</h1>
        <p className="app-subtitle">
          Veja o andamento de cada solicitação de adoção que você enviou.
        </p>
      </div>

      {error && <div className="app-alert">{error}</div>}

      {loading ? (
        <div className="app-empty">Carregando...</div>
      ) : requests.length === 0 ? (
        <div className="app-empty">
          Você ainda não solicitou nenhuma adoção.{" "}
          <Link to="/" className="app-link">
            Ver animais
          </Link>
        </div>
      ) : (
        <section className="app-surface overflow-hidden">
          <div className="app-table-scroll">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Mensagem</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      {req.animal ? (
                        <Link
                          to={`/animais/${req.animal.id}`}
                          className="text-sm font-semibold text-slate-950 transition hover:text-emerald-700"
                        >
                          {req.animal.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className="block max-w-md text-sm text-slate-600">
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
                      <span className="text-sm text-slate-600">
                        {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                      </span>
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
