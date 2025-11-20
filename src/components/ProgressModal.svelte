<script>
  import { createEventDispatcher } from 'svelte';

  export let habitName = 'Hábito';
  export let data = [];

  const dispatch = createEventDispatcher();

  const total = data.length;
  const completed = data.filter((d) => d.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const close = () => dispatch('close');
</script>

<div class="modal-bg">
  <div class="modal">
    <h2>Progreso de: {habitName}</h2>

    {#if total === 0}
      <p>No hay registros en los últimos 30 días.</p>
    {:else}
      <p>
        Has cumplido este hábito <strong>{completed}</strong> de
        <strong>{total}</strong> días ({percent}%).
      </p>

      <div class="progress-bar">
        <div class="fill" style={`width: ${percent}%;`}></div>
      </div>

      <small>Basado en los últimos {total} registros.</small>

      <hr />

      <ul class="checks">
        {#each data as check}
          <li>
            <span>{check.date}</span>
            <span class:done={check.completed}>
              {check.completed ? '✔ Cumplido' : '✖ No cumplido'}
            </span>
          </li>
        {/each}
      </ul>
    {/if}

    <button on:click={close}>Cerrar</button>
  </div>
</div>

<style>
  .modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }

  .modal {
    background: #1e293b;
    padding: 2rem;
    border-radius: 1rem;
    width: 380px;
    max-width: 90%;
    color: #e2e8f0;
    border: 1px solid #334155;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }

  .modal h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .progress-bar {
    width: 100%;
    height: 14px;
    border-radius: 999px;
    background: #020617;
    border: 1px solid #334155;
    overflow: hidden;
    margin: 0.5rem 0 0.25rem;
  }

  .progress-bar .fill {
    height: 100%;
    background: #4f46e5;
    transition: width 0.3s ease;
  }

  .checks {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
    max-height: 180px;
    overflow-y: auto;
    font-size: 0.9rem;
  }

  .checks li {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0;
  }

  .checks span.done {
    color: #4ade80;
  }

  button {
    margin-top: 1rem;
    padding: 0.6rem 1rem;
    border-radius: 999px;
    border: none;
    background: #6366f1;
    color: white;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.9rem;
  }

  button:hover {
    background: #4f46e5;
  }
</style>
