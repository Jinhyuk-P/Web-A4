const form = document.querySelector("#user-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const message = document.querySelector("#form-message");
const usersList = document.querySelector("#users-list");
const submitButton = document.querySelector("#submit-button");

const API_URL = "http://localhost:3000";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  if (!value) return "Fecha no disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return date.toLocaleString("es-MX");
}

function showMessage(text, tone = "neutral") {
  message.textContent = text;
  message.dataset.tone = tone;
}

function renderUsers(users) {
  if (!users.length) {
    usersList.innerHTML = `
      <article class="empty-state">
        <p class="empty-title">Todavia no hay usuarios.</p>
        <p>Agrega el primero con el formulario.</p>
      </article>
    `;
    return;
  }
  usersList.innerHTML = users.map((user) => `
    <article class="user-card">
      <p class="user-name">${escapeHtml(user.name || "Sin nombre")}</p>
      <p class="user-email">${escapeHtml(user.email || "Sin email")}</p>
      <p class="user-date">${escapeHtml(formatDate(user.created_at))}</p>
      <button onclick="deleteUser('${user.id}')">Eliminar</button>
    </article>
  `).join("");
}

async function loadUsers() {
  usersList.innerHTML = '<p class="loading">Cargando usuarios...</p>';
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudieron cargar los usuarios.");
    renderUsers(data.users || []);
  } catch (error) {
    usersList.innerHTML = `
      <article class="empty-state">
        <p class="empty-title">No fue posible conectar con la API.</p>
        <p>${escapeHtml(error.message)}</p>
      </article>
    `;
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("No se pudo eliminar el usuario.");
    showMessage("Usuario eliminado correctamente.", "success");
    await loadUsers();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  showMessage("Guardando usuario...", "neutral");

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
  };

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo guardar el usuario.");
    form.reset();
    showMessage(`Usuario ${data.name} guardado correctamente.`, "success");
    await loadUsers();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

loadUsers();