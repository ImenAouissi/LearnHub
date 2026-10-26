import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

// Petits messages qui apparaissent en bas de l'écran puis disparaissent
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, type, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  const toast = {
    success: (message) => show('success', message),
    error: (message) => show('error', message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
