<script>
  import { onMount } from 'svelte';
  import HabitForm from './components/HabitForm.svelte';
  import HabitList from './components/HabitList.svelte';
  import ProgressModal from './components/ProgressModal.svelte';

  import {
    getHabits,
    createHabitApi,
    markTodayApi,
    deactivateHabitApi,
    getHabitProgressApi
  } from './lib/api';

  let habits = [];
  let loading = true;
  let error = '';

  let progressModal = false;
  let progressData = [];
  let selectedHabitName = '';

  onMount(loadHabits);

  async function loadHabits() {
    loading = true;
    error = '';
    try {
      habits = await getHabits();
    } catch (e) {
      console.error(e);
      error = 'No se pudieron cargar los hábitos.';
    } finally {
      loading = false;
    }
  }

  async function handleCreateHabit(event) {
    const form = event.detail;
    error = '';
    try {
      const newHabit = await createHabitApi(form);
      habits = [...habits, newHabit];
    } catch (e) {
      console.error(e);
      error = 'No se pudo crear el hábito.';
    }
  }

  async function handleMarkToday(event) {
    const { id } = event.detail;
    error = '';
    try {
      await markTodayApi(id);
      await loadHabits();
    } catch (e) {
      console.error(e);
      error = 'No se pudo marcar el hábito como cumplido hoy.';
    }
  }

  async function handleDeactivate(event) {
    const { id } = event.detail;
    error = '';
    const confirmDelete = confirm('¿Deseas desactivar este hábito?');
    if (!confirmDelete) return;

    try {
      await deactivateHabitApi(id);
      habits = habits.filter((h) => h.id !== id);
    } catch (e) {
      console.error(e);
      error = 'No se pudo desactivar el hábito.';
    }
  }

  async function handleViewProgress(event) {
    const { id } = event.detail;
    error = '';
    try {
      const checks = await getHabitProgressApi(id);
      progressData = checks;

      const habit = habits.find((h) => h.id === id);
      selectedHabitName = habit?.name || 'Hábito';

      progressModal = true;
    } catch (e) {
      console.error(e);
      error = 'No se pudo cargar el progreso.';
    }
  }
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
    <HabitForm on:create={handleCreateHabit} />

    <HabitList
      {habits}
      {loading}
      on:markToday={handleMarkToday}
      on:deactivate={handleDeactivate}
      on:viewProgress={handleViewProgress}
    />
  </section>

  {#if progressModal}
    <ProgressModal
      habitName={selectedHabitName}
      data={progressData}
      on:close={() => (progressModal = false)}
    />
  {/if}
</main>

<style>
  main {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      sans-serif;
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

  .alert.error {
    background: #7f1d1d;
    color: #fecaca;
    padding: 0.6rem 0.9rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
