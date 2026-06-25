import { useState, useEffect, useCallback, type SubmitEvent } from "react";
import api from "../../api/axios";
import type { Animal, AnimalStatus } from "../../types";
import { animalStatusLabel, animalStatusColor } from "../../lib/status";

// Estado inicial "vazio" do formulário. Reusado para criar e para cancelar edição.
const emptyForm = {
  name: "",
  species: "",
  breed: "",
  age: "",
  size: "",
  description: "",
  imageUrl: "",
  status: "AVAILABLE" as AnimalStatus,
};

export function AnimalsAdminPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // editingId nulo = modo criação; preenchido = modo edição (PUT).
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadAnimals = useCallback(async () => {
    try {
      const { data } = await api.get<Animal[]>("/animals");
      setAnimals(data);
    } catch {
      setError("Erro ao carregar os animais");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  // Atualiza um campo qualquer do form mantendo o resto.
  function setField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function startEdit(animal: Animal) {
    setEditingId(animal.id);
    setForm({
      name: animal.name,
      species: animal.species,
      breed: animal.breed ?? "",
      age: animal.age != null ? String(animal.age) : "",
      size: animal.size,
      description: animal.description ?? "",
      imageUrl: animal.imageUrl ?? "",
      status: animal.status,
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setFormError("");

    // Monta o payload convertendo os campos numéricos e omitindo os vazios.
    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed || undefined,
      age: form.age ? Number(form.age) : undefined,
      size: form.size,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
      status: form.status,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/animals/${editingId}`, payload);
      } else {
        await api.post("/animals", payload);
      }
      resetForm();
      await loadAnimals();
    } catch {
      setFormError("Não foi possível salvar. Confira os campos obrigatórios.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este animal?")) return;
    try {
      await api.delete(`/animals/${id}`);
      await loadAnimals();
    } catch {
      setError("Não foi possível excluir o animal.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <span className="app-eyebrow">Administração</span>
        <h1 className="app-title">Gerir animais</h1>
        <p className="app-subtitle">
          Cadastre, edite e remova os animais disponíveis para adoção.
        </p>
      </div>

      {error && <div className="app-alert">{error}</div>}

      {/* Formulário criar/editar */}
      <section className="app-surface">
        <div className="app-panel-body space-y-5">
          <h2 className="text-lg font-semibold text-slate-950">
            {editingId ? "Editar animal" : "Novo animal"}
          </h2>

          {formError && <div className="app-alert">{formError}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="app-label">Nome *</label>
                <input
                  type="text"
                  className="app-input"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="app-label">Espécie *</label>
                <input
                  type="text"
                  className="app-input"
                  value={form.species}
                  onChange={(e) => setField("species", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="app-label">Raça</label>
                <input
                  type="text"
                  className="app-input"
                  value={form.breed}
                  onChange={(e) => setField("breed", e.target.value)}
                />
              </div>
              <div>
                <label className="app-label">Idade</label>
                <input
                  type="number"
                  className="app-input"
                  value={form.age}
                  onChange={(e) => setField("age", e.target.value)}
                />
              </div>
              <div>
                <label className="app-label">Porte *</label>
                <select
                  className="app-select"
                  value={form.size}
                  onChange={(e) => setField("size", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="SMALL">Pequeno</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="LARGE">Grande</option>
                </select>
              </div>
              <div>
                <label className="app-label">Situação</label>
                <select
                  className="app-select"
                  value={form.status}
                  onChange={(e) =>
                    setField("status", e.target.value as AnimalStatus)
                  }
                >
                  <option value="AVAILABLE">Disponível</option>
                  <option value="ADOPTED">Adotado</option>
                  <option value="IN_TREATMENT">Em tratamento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="app-label">URL da imagem</label>
              <input
                type="text"
                className="app-input"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
              />
            </div>

            <div>
              <label className="app-label">Descrição</label>
              <textarea
                className="app-textarea"
                rows={3}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  className="app-button-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="app-button-primary"
                disabled={saving}
              >
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Salvar alterações"
                    : "Cadastrar animal"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Lista */}
      <section className="app-surface overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Animais cadastrados
          </h2>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="app-empty">Carregando...</div>
          </div>
        ) : animals.length === 0 ? (
          <div className="p-6">
            <div className="app-empty">Nenhum animal cadastrado.</div>
          </div>
        ) : (
          <div className="app-table-scroll">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Espécie</th>
                  <th>Situação</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal.id}>
                    <td className="font-semibold text-slate-950">
                      {animal.name}
                    </td>
                    <td>
                      {animal.species}
                      {animal.breed ? ` • ${animal.breed}` : ""}
                    </td>
                    <td>
                      <span
                        className={`app-badge ${animalStatusColor[animal.status]}`}
                      >
                        {animalStatusLabel[animal.status]}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          className="app-button-secondary"
                          onClick={() => startEdit(animal)}
                        >
                          Editar
                        </button>
                        <button
                          className="app-button-danger"
                          onClick={() => handleDelete(animal.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
