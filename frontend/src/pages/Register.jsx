import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

// US01 - Création de compte
export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'etudiant' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/users/register', { method: 'POST', body: form });
      toast.success('Compte créé ! Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth">
      <h2>Créer un compte</h2>
      <p className="sub">Rejoignez LearnHub en quelques secondes</p>
      <form className="form" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={form.role === 'etudiant' ? 'active' : ''} onClick={() => setForm({ ...form, role: 'etudiant' })}>Je suis étudiant</button>
          <button type="button" className={form.role === 'formateur' ? 'active' : ''} onClick={() => setForm({ ...form, role: 'formateur' })}>Je suis formateur</button>
        </div>
        <div className="field">
          <label htmlFor="name">Nom complet</label>
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" className="input" type="password" autoComplete="new-password" minLength={6} placeholder="6 caractères minimum" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <div className="alert">{error}</div>}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Création...' : 'Créer mon compte'}</button>
      </form>
      <p className="auth-foot">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </div>
  );
}
