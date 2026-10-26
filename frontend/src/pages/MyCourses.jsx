import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import CourseCard from '../components/CourseCard.jsx';
import CardGridSkeleton from '../components/CardGridSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';

// US09 - Mes cours et ma progression
export default function MyCourses() {
  const { data, loading, error } = useFetch('/enrollments/mine');

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Mes cours</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <CardGridSkeleton count={3} />}
      {data && data.length === 0 && (
        <EmptyState icon={GraduationCap} title="Vous n'êtes inscrit à aucun cours" text="Parcourez le catalogue pour commencer.">
          <Link to="/" className="btn">Voir le catalogue</Link>
        </EmptyState>
      )}
      <div className="grid">
        {(data || []).map((e) => (
          <CourseCard
            key={e.enrollmentId}
            to={`/learn/${e.courseId}`}
            progress={e.progress}
            course={{ title: e.title, category: e.category, ownerName: e.ownerName, chaptersCount: e.chapters.length }}
          />
        ))}
      </div>
    </>
  );
}
