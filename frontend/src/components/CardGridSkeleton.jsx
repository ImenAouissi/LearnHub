// Des blocs gris animés pendant le chargement, pour éviter une page vide
export default function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => <div className="skeleton" key={i} />)}
    </div>
  );
}
