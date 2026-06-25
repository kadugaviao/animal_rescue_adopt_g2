import { useState, useEffect, useCallback, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Animal, AnimalStatus, AnimalSize } from "../types";
import { animalStatusLabel, animalStatusColor, animalSizeLabel } from "../lib/status";

export function AnimalsPage() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros controlados — viram querystring na chamada GET /animals.
  const [species, setSpecies] = useState("");
  const [size, setSize] = useState<"" | AnimalSize>("");
  const [status, setStatus] = useState<"" | AnimalStatus>("");

  // useCallback: a função só muda quando os filtros mudam; útil no useEffect.
  const loadAnimals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Só manda o parâmetro que foi preenchido (axios ignora undefined).
      const { data } = await api.get<Animal[]>("/animals", {
        params: {
          species: species || undefined,
          size: size || undefined,
          status: status || undefined,
        },
      });
      setAnimals(data);
    } catch {
      setError("Erro ao carregar os animais");
    } finally {
      setLoading(false);
    }
  }, [species, size, status]);

  // Carrega ao abrir a página (lista pública, sem login).
  useEffect(() => {
    loadAnimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilter(e: SubmitEvent) {
    e.preventDefault();
    loadAnimals();
  }

  function clearFilters() {
    setSpecies("");
    setSize("");
    setStatus("");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="app-page-header">
        <div>
          <span className="app-eyebrow">Adote um amigo</span>
          <h1 className="app-title">Animais para adoção</h1>
          <p className="app-subtitle">
            Conheça os animais disponíveis e use os filtros para encontrar o
            companheiro ideal.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">
            {animals.length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <section className="app-surface">
        <div className="app-panel-body">
          <form
            onSubmit={handleFilter}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
          >
            <div>
              <label className="app-label">Espécie</label>
              <input
                type="text"
                className="app-input"
                placeholder="Ex.: Cachorro, Gato"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              />
            </div>

            <div>
              <label className="app-label">Porte</label>
              <select
                className="app-select"
                value={size}
                onChange={(e) => setSize(e.target.value as "" | AnimalSize)}
              >
                <option value="">Todos</option>
                <option value="SMALL">Pequeno</option>
                <option value="MEDIUM">Médio</option>
                <option value="LARGE">Grande</option>
              </select>
            </div>

            <div>
              <label className="app-label">Situação</label>
              <select
                className="app-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as "" | AnimalStatus)}
              >
                <option value="">Todas</option>
                <option value="AVAILABLE">Disponível</option>
                <option value="ADOPTED">Adotado</option>
                <option value="IN_TREATMENT">Em tratamento</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="app-button-primary">
                Filtrar
              </button>
              <button
                type="button"
                className="app-button-secondary"
                onClick={clearFilters}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </section>

      {error && <div className="app-alert">{error}</div>}

      {loading ? (
        <div className="app-empty">Carregando animais...</div>
      ) : animals.length === 0 ? (
        <div className="app-empty">Nenhum animal encontrado.</div>
      ) : (
        <div className="app-card-grid">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="app-card cursor-pointer"
              onClick={() => navigate(`/animais/${animal.id}`)}
            >
              {animal.imageUrl ? (
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  className="app-card-image"
                />
              ) : (
                <div className="app-card-image flex items-center justify-center text-4xl">
                  🐾
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {animal.name}
                  </h2>
                  <span
                    className={`app-badge ${animalStatusColor[animal.status]}`}
                  >
                    {animalStatusLabel[animal.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {animal.species}
                  {animal.breed ? ` • ${animal.breed}` : ""}
                </p>
                <p className="text-sm text-slate-500">
                  Porte: <span className="font-medium text-slate-700">{animalSizeLabel[animal.size]}</span>
                </p>
                {animal.description && (
                  <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                    {animal.description}
                  </p>
                )}
                <Link
                  to={`/animais/${animal.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="app-button-primary mt-2 w-full"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
