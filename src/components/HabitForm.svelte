<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let name = '';
  let description = '';
  let category = '';
  let priority = 2;
  let localError = '';

  function submitForm() {
    localError = '';

    if (!name.trim()) {
      localError = 'El nombre del hábito es obligatorio.';
      return;
    }

    dispatch('create', {
      name,
      description,
      category,
      priority: Number(priority)
    });

    // limpiar
    name = '';
    description = '';
    category = '';
    priority = 2;
  }
</script>

<section class="card form-card">
  <h2>Nuevo hábito</h2>

  {#if localError}
    <div class="alert error">{localError}</div>
  {/if}

  <form on:submit|preventDefault={submitForm}>
    <label>
      Nombre *
      <input
        type="text"
        bind:value={name}
        placeholder="Ej. Estudiar Desarrollo Web"
        required
      />
    </label>

    <label>
      Descripción
      <textarea
        rows="3"
        bind:value={description}
        placeholder="Describe brevemente el hábito"
      ></textarea>
    </label>

    <label>
      Categoría
      <input
        type="text"
        bind:value={category}
        placeholder="Ej. Estudio, Salud, Personal"
      />
    </label>

    <label>
      Prioridad
      <select bind:value={priority}>
        <option value="1">Baja</option>
        <option value="2">Media</option>
        <option value="3">Alta</option>
      </select>
    </label>

    <button type="submit">Agregar hábito</button>
  </form>
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

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
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

  .alert.error {
    background: #7f1d1d;
    color: #fecaca;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
</style>
