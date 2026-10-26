import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

// Les liens du menu changent selon le rôle de l'utilisateur
function linksFor(user) {
  const links = [{ to: '/', label: 'Catalogue', icon: BookOpen, end: true }];
  if (!user) return links;
  links.push({ to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard });
  if (user.role === 'etudiant') {
    links.push({ to: '/my-courses', label: 'Mes cours', icon: GraduationCap });
    links.push({ to: '/notifications', label: 'Notifications', icon: Bell });
  }
  if (user.role === 'formateur') links.push({ to: '/teacher', label: 'Gérer mes cours', icon: GraduationCap });
  if (user.role === 'admin') links.push({ to: '/admin/users', label: 'Utilisateurs', icon: Users });
  return links;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-logo"><GraduationCap size={20} /></span> LearnHub
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {linksFor(user).map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/profile" className="row" style={{ gap: 8, color: 'inherit' }}>
                <Avatar name={user.name} />
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="btn btn-ghost" title="Déconnexion" onClick={() => { logout(); navigate('/'); }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Connexion</Link>
              <Link to="/register" className="btn btn-sm">Créer un compte</Link>
            </>
          )}
          <button className="btn btn-ghost menu-toggle" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
