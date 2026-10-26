import { Link } from 'react-router-dom';
import { BookOpen, Layers, UserRound } from 'lucide-react';
import { gradientFor } from '../utils/format.js';
import ProgressBar from './ProgressBar.jsx';

// Carte d'un cours. Si "progress" est donné, on affiche la barre de progression.
export default function CourseCard({ course, to, progress }) {
  return (
    <Link to={to || `/courses/${course._id}`} className="course-card">
      <div className="course-cover" style={{ background: gradientFor(course.category) }}>
        <span className="badge">{course.category}</span>
        <BookOpen size={44} />
      </div>
      <div className="course-body">
        <h3>{course.title}</h3>
        {course.description && <p>{course.description}</p>}
        {progress !== undefined && <ProgressBar value={progress} />}
        <div className="course-meta">
          <span><UserRound size={15} /> {course.ownerName || 'Formateur'}</span>
          {course.chaptersCount !== undefined && (
            <span><Layers size={15} /> {course.chaptersCount} chapitre{course.chaptersCount > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
