import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookPlus, Layers, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import EmptyState from '../../components/EmptyState.jsx';

// US04, US05 - Liste de mes cours (formateur)
export default function TeacherCourses() {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/courses');
  const [toDelete, setToDelete] = useState(null);

  const mine = (data || []).filter((c) => c.ownerId === user.id);

  async function remove() {
    try {
      await api(`/courses/${toDelete._id}`, { method: 'DELETE' });
      toast.success('Cours supprimé. Les étudiants inscrits sont prévenus.');
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Mes cours ({mine.length})</h1>
        <Link to="/teacher/new" className="btn"><PlusCircle size={18} /> Nouveau cours</Link>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 160 }} />}
      {data && mine.length === 0 && (
        <EmptyState icon={BookPlus} title="Vous n'avez pas encore de cours" text="Créez votre premier cours et ajoutez des chapitres.">
          <Link to="/teacher/new" className="btn">Créer un cours</Link>
        </EmptyState>
      )}

      {mine.length > 0 && (
        <div className="card table-wrap" style={{ padding: 0 }}>
          <table className="table">
            <thead><tr><th>Cours</th><th>Catégorie</th><th>Chapitres</th><th /></tr></thead>
            <tbody>
              {mine.map((c) => (
                <tr key={c._id}>
                  <td><Link to={`/courses/${c._id}`}><strong>{c.title}</strong></Link></td>
                  <td><span className="badge">{c.category}</span></td>
                  <td><span className="row muted" style={{ gap: 6 }}><Layers size={15} /> {c.chaptersCount}</span></td>
                  <td>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>
                      <Link to={`/teacher/courses/${c._id}`} className="btn btn-secondary btn-sm"><Pencil size={14} /> Modifier</Link>
                      <button className="btn btn-ghost btn-sm" title="Supprimer" onClick={() => setToDelete(c)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Supprimer ce cours ?"
          text={`« ${toDelete.title} » sera supprimé définitivement. Les étudiants inscrits seront informés.`}
          confirmLabel="Supprimer"
          onConfirm={remove}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
