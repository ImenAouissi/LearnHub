import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

// US09 - Suivre un cours chapitre par chapitre
export default function Learn() {
  const { courseId } = useParams();
  const toast = useToast();
  const { data: course, loading, error } = useFetch(`/courses/${courseId}`);
  const { data: mine, reload } = useFetch('/enrollments/mine');
  const [current, setCurrent] = useState(0);

  const enrollment = (mine || []).find((e) => e.courseId === courseId);

  // À l'ouverture, on se place sur le premier chapitre non terminé
  useEffect(() => {
    if (enrollment) {
      const firstTodo = enrollment.chapters.findIndex((c) => !c.done);
      setCurrent(firstTodo === -1 ? 0 : firstTodo);
    }
  }, [enrollment?.enrollmentId]);

  async function complete(chapterId) {
    try {
      const { progress } = await api(`/enrollments/${courseId}/chapters/${chapterId}/complete`, { method: 'POST' });
      toast.success(progress === 100 ? 'Bravo, cours terminé ! 🎉' : 'Chapitre terminé');
      await reload();
      if (current < course.chapters.length - 1) setCurrent(current + 1);
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading || !mine) return <div className="skeleton" />;
  if (error) return <div className="alert">{error}</div>;
  if (!enrollment) {
    return (
      <div className="card auth stack">
        <h3>Vous n'êtes pas inscrit à ce cours</h3>
        <Link to={`/courses/${courseId}`} className="btn">Voir le cours</Link>
      </div>
    );
  }

  const chapter = course.chapters[current];
  const done = enrollment.chapters[current]?.done;

  return (
    <>
      <Link to="/my-courses" className="row muted" style={{ marginBottom: 12 }}><ArrowLeft size={16} /> Mes cours</Link>
      <h1>{course.title}</h1>
      <div style={{ maxWidth: 420, marginBottom: 20 }}><ProgressBar value={enrollment.progress} label="Progression" /></div>

      {course.chapters.length === 0 ? (
        <p className="muted">Le formateur n'a pas encore ajouté de chapitre.</p>
      ) : (
        <div className="learn">
          <aside className="card">
            <h3>Chapitres</h3>
            <div className="lesson-list">
              {course.chapters.map((ch, i) => (
                <button key={ch._id} className={`lesson-btn ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)}>
                  {enrollment.chapters[i]?.done ? <CheckCircle2 size={18} className="done" /> : <Circle size={18} className="muted" />}
                  <span>{i + 1}. {ch.title}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="card stack">
            <h2>{chapter.title}</h2>
            <div className="lesson-content">{chapter.content}</div>
            <div className="row">
              {done ? (
                <span className="badge badge-success"><CheckCircle2 size={14} /> Chapitre terminé</span>
              ) : (
                <button className="btn" onClick={() => complete(chapter._id)}>Marquer comme terminé</button>
              )}
              <span className="spacer" />
              <button className="btn btn-secondary btn-sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Précédent</button>
              <button className="btn btn-secondary btn-sm" disabled={current === course.chapters.length - 1} onClick={() => setCurrent(current + 1)}>Suivant</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
