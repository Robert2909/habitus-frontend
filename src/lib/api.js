// src/lib/api.js
const API_BASE = 'http://localhost:8080/api';

async function handleResponse(res, message) {
  if (!res.ok) {
    throw new Error(message || 'Error en la petición');
  }
  return res.json();
}

export async function getHabits() {
  const res = await fetch(`${API_BASE}/habits`);
  return handleResponse(res, 'Error al cargar hábitos');
}

export async function createHabitApi(form) {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
  return handleResponse(res, 'Error al crear hábito');
}

export async function markTodayApi(habitId) {
  const res = await fetch(
    `${API_BASE}/habits/${habitId}/checks/today?completed=true`,
    { method: 'POST' }
  );
  if (!res.ok) {
    throw new Error('Error al marcar cumplimiento');
  }
}

export async function deactivateHabitApi(habitId) {
  const res = await fetch(`${API_BASE}/habits/${habitId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Error al desactivar el hábito');
  }
}

export async function getHabitProgressApi(habitId) {
  const today = new Date();
  const to = today.toISOString().split('T')[0];

  const past = new Date(today);
  past.setDate(today.getDate() - 30);
  const from = past.toISOString().split('T')[0];

  const res = await fetch(
    `${API_BASE}/habits/${habitId}/checks?from=${from}&to=${to}`
  );
  return handleResponse(res, 'Error al cargar el progreso');
}
