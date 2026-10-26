import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Bouton clair / sombre. Le choix est gardé dans le navigateur.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button className="btn btn-ghost" title="Changer de thème" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
