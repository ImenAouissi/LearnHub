const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Une seule fonction pour parler au backend : ajoute le token et renvoie du JSON.
export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Token expiré : on prévient l'application pour qu'elle déconnecte l'utilisateur
    if (res.status === 401 && token) window.dispatchEvent(new Event('auth:expired'));
    throw new Error(data.error || 'Erreur serveur');
  }
  return data;
}
