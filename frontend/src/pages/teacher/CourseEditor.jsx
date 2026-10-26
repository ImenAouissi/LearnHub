import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

// US04, US05, US06 - Créer ou modifier un cours, et gérer ses chapitres
export default function CourseEditor() {
  const { id } = useParams(); // absent = création d'un nouveau cours
  const navigate = useNavigate();
  const toast = useToast();
  const { data: course, error, reload } = useFetch(id ? `/courses/${id}` : null);
  const { data: categories } = useFetch('/courses/categories');
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [chapter, setChapter] = useState({ title: '', content: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (course) setForm({ title: course.title, description: course.description, category: course.category });
  }, [course]);

  async function saveCourse(e) {
    e.preventDefault();
    try {
      if (id) {
        await api(`/courses/${id}`, { method: 'PUT', body: form });
        toast.success('Cours enregistré');
        reload();
      } else {
        const created = await api('/courses', { method: 'POST', body: form });
        toast.success('Cours créé. Ajoutez maintenant des chapitres.');
        navigate(`/teacher/courses/${created._id}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function addChapter(e) {
    e.preventDefault();
    try {
      await api(`/courses/${id}/chapters`, { method: 'POST', body: chapter });
      setChapter({ title: '', content: '' });
      toast.success('Chapitre ajouté');
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeChapter(chapterId) {
    try {
      await api(`/courses/${id}/chapters/${chapterId}`, { method: 'DELETE' });
      toast.success('Chapitre supprimé');
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeCourse() {
    try {
      await api(`/courses/${id}`, { method: 'DELETE' });
      toast.success('Cours supprimé');
      navigate('/teacher');
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (error) return <div className="alert">{error}</div>;

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>{id ? 'Modifier le cours' : 'Nouveau cours'}</h1>
        {id && <button className="btn btn-secondary" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Supprimer le cours</button>}
      </div>

      <div className="stack">
        <form className="card form" onSubmit={saveCourse}>
          <h3>Informations générales</h3>
          <div className="field">
            <label htmlFor="title">Titre</label>
            <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="category">Catégorie</label>
            <input id="category" className="input" list="categories" placeholder="Ex : DevOps, Web, Sécurité" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <datalist id="categories">{(categories || []).map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div><button className="btn">{id ? 'Enregistrer' : 'Créer le cours'}</button></div>
        </form>

        {id && course && (
          <div className="card stack">
            <h3>Chapitres ({course.chapters.length})</h3>
            {course.chapters.map((ch, i) => (
              <div className="lesson-row" key={ch._id}>
                <span className="lesson-num">{i + 1}</span>
                <span style={{ flex: 1 }}>{ch.title}</span>
                <button className="btn btn-ghost btn-sm" title="Supprimer" onClick={() => removeChapter(ch._id)}><Trash2 size={16} /></button>
              </div>
            ))}
            <form className="form" onSubmit={addChapter} style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div className="field">
                <label htmlFor="ch-title">Nouveau chapitre</label>
                <input id="ch-title" className="input" placeholder="Titre du chapitre" value={chapter.title} onChange={(e) => setChapter({ ...chapter, title: e.target.value })} required />
              </div>
              <textarea className="textarea" placeholder="Contenu du chapitre" value={chapter.content} onChange={(e) => setChapter({ ...chapter, content: e.target.value })} required />
              <div><button className="btn"><Plus size={16} /> Ajouter le chapitre</button></div>
            </form>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer ce cours ?"
          text="Cette action est définitive. Les étudiants inscrits seront informés."
          confirmLabel="Supprimer"
          onConfirm={removeCourse}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
