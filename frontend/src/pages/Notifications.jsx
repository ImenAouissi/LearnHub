import { Bell, BookCheck, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { formatDate } from '../utils/format.js';
import EmptyState from '../components/EmptyState.jsx';

// US11 - Voir ses notifications
export default function Notifications() {
  const { data, loading, error } = useFetch('/notifications/mine');

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Notifications</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 90 }} />}
      {data && data.length === 0 && <EmptyState icon={Bell} title="Aucune notification" text="Vos confirmations d'inscription apparaîtront ici." />}
      <div className="stack" style={{ gap: 10 }}>
        {(data || []).map((n) => (
          <div className="card row" key={n._id} style={{ padding: 16 }}>
            <div className="stat-icon">{n.type === 'inscription' ? <BookCheck size={20} /> : <Trash2 size={20} />}</div>
            <div style={{ flex: 1 }}>
              <div>{n.message}</div>
              <small className="muted">{formatDate(n.createdAt)}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
