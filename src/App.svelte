<script>
  import { onMount } from 'svelte';

  const API_BASE = 'http://localhost:8080/api';

  let habits = [];
  let loading = true;
  let error = '';

  // Formulario para crear hábito
  let form = {
    name: '',
    description: '',
    category: '',
    priority: 2
  };

  async function loadHabits() {
    loading = true;
    error = '';

    try {
      const res = await fetch(`${API_BASE}/habits`);
      if (!res.ok) {
        throw new Error('Error al cargar hábitos');
      }
      habits = await res.json();
    } catch (e) {
      console.error(e);
      error = 'No se pudieron cargar los hábitos.';
    } finally {
      loading = false;
    }
  }

  async function createHabit(event) {
    event.preventDefault(); // para que no recargue la página
    error = '';

    if (!form.name.trim()) {
      error = 'El nombre del hábito es obligatorio.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error('Error al crear hábito');
      }

      const newHabit = await res.json();
      habits = [...habits, newHabit];

      form = {
        name: '',
        description: '',
        category: '',
        priority: 2
      };
    } catch (e) {
      console.error(e);
      error = 'No se pudo crear el hábito.';
    }
  }

  async function markToday(habitId) {
    error = '';

    try {
      const res = await fetch(
        `${API_BASE}/habits/${habitId}/checks/today?completed=true`,
        {
          method: 'POST'
        }
      );

      if (!res.ok) {
        throw new Error('Error al marcar cumplimiento');
      }

      await loadHabits();
    } catch (e) {
      console.error(e);
      error = 'No se pudo marcar el hábito como cumplido hoy.';
    }
  }

  onMount(() => {
    loadHabits();
  });
</script>

<main>
  <header>
    <h1>Habitus</h1>
    <p>Sistema de seguimiento de hábitos personales</p>
  </header>

  {#if error}
    <div class="alert error">{error}</div>
  {/if}

  <section class="layout">
    <section class="card form-card">
      <h2>Nuevo hábito</h2>
      <form on:submit|preventDefault={createHabit}>
        <label>
          Nombre *
          <input
            type="text"
            bind:value={form.name}
            placeholder="Ej. Estudiar Desarrollo Web"
            required
          />
        </label>

        <label>
          Descripción
          <textarea
            rows="3"
            bind:value={form.description}
            placeholder="Describe brevemente el hábito"
          ></textarea>
        </label>

        <label>
          Categoría
          <input
            type="text"
            bind:value={form.category}
            placeholder="Ej. Estudio, Salud, Personal"
          />
        </label>

        <label>
          Prioridad
          <select bind:value={form.priority}>
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </select>
        </label>

        <button type="submit">Agregar hábito</button>
      </form>
    </section>

    <section class="card list-card">
      <h2>Mis hábitos</h2>

      {#if loading}
        <p>Cargando hábitos...</p>
      {:else if habits.length === 0}
        <p>No hay hábitos registrados todavía.</p>
      {:else}
        <ul class="habit-list">
          {#each habits as habit}
            <li class="habit-item">
              <div class="habit-main">
                <h3>{habit.name}</h3>

                {#if habit.description}
                  <p class="description">{habit.description}</p>
                {/if}

                <div class="meta">
                  {#if habit.category}
                    <span class="tag">{habit.category}</span>
                  {/if}

                  <span class="tag priority">Prioridad: {habit.priority}</span>
                </div>
              </div>

              <div class="habit-actions">
                <button on:click={() => markToday(habit.id)}>
                  Marcar cumplido hoy
                </button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  </section>
</main>

<style>
  main {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
    margin: 0;
    padding: 2rem;
    background: #0f172a;
    color: #e5e7eb;
  }

  header {
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 2.2rem;
  }

  header p {
    margin: 0.25rem 0 0;
    color: #9ca3af;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: 1.5rem;
  }

  .card {
    background: #020617;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    border: 1px solid #1f2933;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  input,
  textarea,
  select {
    background: #020617;
    border-radius: 0.5rem;
    border: 1px solid #374151;
    padding: 0.5rem 0.75rem;
    color: #e5e7eb;
    font-size: 0.95rem;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 999px;
    border: none;
    background: #6366f1;
    color: white;
    font-weight: 500;
    cursor: pointer;
  }

  button:hover {
    background: #4f46e5;
  }

  .habit-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .habit-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.9rem 1rem;
    background: #020617;
    border-radius: 0.75rem;
    border: 1px solid #1f2937;
  }

  .habit-main h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }

  .description {
    margin: 0 0 0.4rem;
    color: #9ca3af;
    font-size: 0.9rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    background: #111827;
    border-radius: 999px;
    padding: 0.15rem 0.6rem;
    font-size: 0.75rem;
    color: #9ca3af;
    border: 1px solid #1f2937;
  }

  .tag.priority {
    border-color: #6366f1;
  }
</style>
