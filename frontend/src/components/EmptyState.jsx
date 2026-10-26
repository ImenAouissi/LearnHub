export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="card empty">
      {Icon && <Icon size={40} />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
