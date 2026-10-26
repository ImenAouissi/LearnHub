import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseCard from '../components/CourseCard.jsx';
import CardGridSkeleton from '../components/CardGridSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';

// US07 - Catalogue de cours (accessible sans compte)
export default function Home() {
  const { user } = useAuth();
  const { data: courses, loading, error } = useFetch('/courses');
  const { data: categories } = useFetch('/courses/categories');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const shown = (courses || []).filter(
    (c) =>
      (!category || c.category === category) &&
      (c.title + c.description).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <h1>Apprenez à votre rythme, avec les meilleurs formateurs</h1>
        <p>Parcourez le catalogue, inscrivez-vous en un clic et suivez votre progression chapitre par chapitre.</p>
        <div className="search">
          <Search size={18} />
          <input className="input" placeholder="Rechercher un cours..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {!user && <Link to="/register" className="btn btn-secondary" style={{ marginTop: 16 }}>Créer un compte gratuit</Link>}
      </section>

      <div className="chips">
        <button className={`chip ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>Tous</button>
        {(categories || []).map((c) => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="section-head">
        <h2>Catalogue ({shown.length})</h2>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <CardGridSkeleton />}
      {!loading && !error && shown.length === 0 && (
        <EmptyState icon={SearchX} title="Aucun cours trouvé" text="Essayez un autre mot-clé ou une autre catégorie." />
      )}
      <div className="grid">
        {shown.map((c) => <CourseCard key={c._id} course={c} />)}
      </div>
    </>
  );
}
