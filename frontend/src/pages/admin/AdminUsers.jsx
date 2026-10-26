import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { ROLE_LABELS } from '../../utils/format.js';
import Avatar from '../../components/Avatar.jsx';

const ROLES = [['', 'Tous'], ['etudiant', 'Étudiants'], ['formateur', 'Formateurs'], ['admin', 'Admins']];

// US10 - Liste des utilisateurs (admin), filtrable par rôle
export default function AdminUsers() {
  const [role, setRole] = useState('');
  const [query, setQuery] = useState('');
  const { data, loading, error } = useFetch('/users' + (role ? `?role=${role}` : ''));

  const shown = (data || []).filter((u) => (u.name + u.email).toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Utilisateurs ({shown.length})</h1>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="chips">
          {ROLES.map(([value, label]) => (
            <button key={value} className={`chip ${role === value ? 'active' : ''}`} onClick={() => setRole(value)}>{label}</button>
          ))}
        </div>
        <span className="spacer" />
        <div className="search" style={{ minWidth: 240 }}>
          <Search size={16} />
          <input className="input" placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 160 }} />}
      {data && (
        <div className="card table-wrap" style={{ padding: 0 }}>
          <table className="table">
            <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id}>
                  <td><div className="user-cell"><Avatar name={u.name} /> {u.name}</div></td>
                  <td className="muted">{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-warning' : ''}`}>{ROLE_LABELS[u.role]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
