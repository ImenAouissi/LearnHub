import { Link } from 'react-router-dom';
import { Bell, BookOpen, CheckCircle2, GraduationCap, Layers, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { ROLE_LABELS } from '../utils/format.js';

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="card stat">
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// Tableau de bord : des chiffres et des raccourcis adaptés au rôle
export default function Dashboard() {
  const { user } = useAuth();
  const { data: s, loading, error } = useFetch('/stats/me');

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <h1>Bonjour {user.name} 👋</h1>
          <p className="muted" style={{ margin: 0 }}>Votre espace {ROLE_LABELS[user.role].toLowerCase()}</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 90 }} />}

      {s?.role === 'etudiant' && (
        <>
          <div className="stats">
            <Stat icon={BookOpen} value={s.enrolled} label="Cours suivis" />
            <Stat icon={CheckCircle2} value={s.completed} label="Cours terminés" />
            <Stat icon={TrendingUp} value={`${s.average} %`} label="Progression moyenne" />
            <Stat icon={Bell} value={s.notifications} label="Notifications" />
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/my-courses" className="btn">Continuer mes cours</Link>
            <Link to="/" className="btn btn-secondary">Explorer le catalogue</Link>
          </div>
        </>
      )}

      {s?.role === 'formateur' && (
        <>
          <div className="stats">
            <Stat icon={BookOpen} value={s.courses} label="Cours publiés" />
            <Stat icon={Layers} value={s.chapters} label="Chapitres écrits" />
            <Stat icon={UserCheck} value={s.students} label="Étudiants inscrits" />
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/teacher/new" className="btn">Créer un nouveau cours</Link>
            <Link to="/teacher" className="btn btn-secondary">Gérer mes cours</Link>
          </div>
        </>
      )}

      {s?.role === 'admin' && (
        <>
          <div className="stats">
            <Stat icon={Users} value={s.users} label="Utilisateurs" />
            <Stat icon={GraduationCap} value={s.students} label="Étudiants" />
            <Stat icon={UserCheck} value={s.teachers} label="Formateurs" />
            <Stat icon={BookOpen} value={s.courses} label="Cours" />
            <Stat icon={CheckCircle2} value={s.enrollments} label="Inscriptions" />
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/admin/users" className="btn">Voir les utilisateurs</Link>
          </div>
        </>
      )}
    </>
  );
}
