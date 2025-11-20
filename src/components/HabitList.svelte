<script>
  import { createEventDispatcher } from 'svelte';

  export let habits = [];
  export let loading = false;

  const dispatch = createEventDispatcher();

  const markToday = (id) => dispatch('markToday', { id });
  const deactivate = (id) => dispatch('deactivate', { id });
  const viewProgress = (id) => dispatch('viewProgress', { id });
</script>

<section class="card list-card">
  <h2>Mis hábitos</h2>

  {#if loading}
    <p>Cargando hábitos...</p>
  {:else if !habits || habits.length === 0}
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
            <button class="secondary" on:click={() => viewProgress(habit.id)}>
              Ver progreso
            </button>
            <button class="danger" on:click={() => deactivate(habit.id)}>
              Desactivar
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
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

  .habit-actions {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  button {
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    border: none;
    background: #6366f1;
    color: white;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.85rem;
  }

  button:hover {
    background: #4f46e5;
  }

  button.secondary {
    background: #475569;
  }

  button.secondary:hover {
    background: #334155;
  }

  button.danger {
    background: #b91c1c;
  }

  button.danger:hover {
    background: #991b1b;
  }
</style>
