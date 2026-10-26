import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ROLE_LABELS } from '../utils/format.js';
import Avatar from '../components/Avatar.jsx';

// US03 - Consulter et modifier son profil
export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    api('/users/me').then((u) => setForm({ name: u.name, email: u.email })).catch((e) => toast.error(e.message));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const u = await api('/users/me', { method: 'PUT', body: form });
      updateUser({ ...user, name: u.name, email: u.email });
      toast.success('Profil mis à jour');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="card auth">
      <div className="stack" style={{ justifyItems: 'center', marginBottom: 20 }}>
        <Avatar name={form.name || user.name} large />
        <span className="badge">{ROLE_LABELS[user.role]}</span>
      </div>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="name">Nom</label>
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <button className="btn btn-block">Enregistrer les modifications</button>
      </form>
    </div>
  );
}
