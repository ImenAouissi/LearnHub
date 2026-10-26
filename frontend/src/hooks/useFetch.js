import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

// Charge une adresse de l'API et gère "chargement / erreur / données".
// Passer null comme adresse = ne rien charger.
export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: '' });

  const load = useCallback(() => {
    if (!path) {
      setState({ data: null, loading: false, error: '' });
      return Promise.resolve();
    }
    setState((s) => ({ ...s, loading: true, error: '' }));
    return api(path)
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((e) => setState({ data: null, loading: false, error: e.message }));
  }, [path]);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
