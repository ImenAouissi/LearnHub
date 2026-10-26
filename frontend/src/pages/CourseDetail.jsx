import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layers, Lock, Pencil, UserRound } from 'lucide-react';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { gradientFor } from '../utils/format.js';
import ProgressBar from '../components/ProgressBar.jsx';

// US07 - Détail d'un cours, US08 - Inscription
export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: course, loading, error } = useFetch(`/courses/${id}`);
  // Seul un étudiant a des inscriptions : on ne charge la liste que pour lui
  const { data: mine, reload } = useFetch(user?.role === 'etudiant' ? '/enrollments/mine' : null);
  const enrollment = (mine || []).find((e) => e.courseId === id);

  async function enroll() {
    try {
      await api('/enrollments', { method: 'POST', body: { courseId: id } });
      toast.success('Inscription réussie ! Une confirmation vous est envoyée.');
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <div className="skeleton" />;
  if (error) return <div className="alert">{error}</div>;

  const isOwner = user?.role === 'formateur' && user.id === course.ownerId;

  return (
    <div className="detail">
      <div>
        <div className="detail-banner" style={{ background: gradientFor(course.category) }}>
          <span className="badge">{course.category}</span>
          <h1 style={{ marginTop: 12 }}>{course.title}</h1>
          <div className="row" style={{ opacity: 0.9 }}>
            <UserRound size={16} /> {course.ownerName || 'Formateur'}
          </div>
        </div>

        <div className="card stack">
          <div>
            <h3>À propos de ce cours</h3>
            <p className="muted" style={{ marginBottom: 0 }}>{course.description}</p>
          </div>
        </div>

        <h3 style={{ margin: '24px 0 12px' }}>Programme ({course.chapters.length} chapitre{course.chapters.length > 1 ? 's' : ''})</h3>
        <div className="stack" style={{ gap: 10 }}>
          {course.chapters.length === 0 && <p className="muted">Le formateur n'a pas encore ajouté de chapitre.</p>}
          {course.chapters.map((ch, i) => (
            <div className="lesson-row" key={ch._id}>
              <span className="lesson-num">{i + 1}</span>
              <span style={{ flex: 1 }}>{ch.title}</span>
              {!enrollment && <Lock size={16} className="muted" />}
            </div>
          ))}
        </div>
      </div>

      <aside className="card side-card stack">
        {enrollment ? (
          <>
            <ProgressBar value={enrollment.progress} label="Votre progression" />
            <Link to={`/learn/${id}`} className="btn btn-block">Continuer le cours</Link>
          </>
        ) : user?.role === 'etudiant' ? (
          <button className="btn btn-block" onClick={enroll}>S'inscrire à ce cours</button>
        ) : !user ? (
          <button className="btn btn-block" onClick={() => navigate('/login')}>Connectez-vous pour vous inscrire</button>
        ) : null}

        {isOwner && (
          <Link to={`/teacher/courses/${id}`} className="btn btn-secondary btn-block"><Pencil size={16} /> Modifier ce cours</Link>
        )}
        <div className="row muted"><Layers size={16} /> {course.chapters.length} chapitres</div>
      </aside>
    </div>
  );
}
