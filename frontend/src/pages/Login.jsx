import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// US02 - Connexion
export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/users/login', { method: 'POST', body: form });
      login(data.token, data.user);
      toast.success(`Bienvenue ${data.user.name} !`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth">
      <h2>Content de vous revoir</h2>
      <p className="sub">Connectez-vous pour accéder à votre espace</p>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" className="input" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <div className="alert">{error}</div>}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Connexion...' : 'Se connecter'}</button>
      </form>
      <p className="auth-foot">Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
}
