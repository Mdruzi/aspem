/* ============================================================
   ASPEM — auth.js  |  Autenticação e sessão
   ============================================================ */

const SESSION_KEY = 'aspem_session';

function login(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

function loginByUsername(username) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return null;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}
