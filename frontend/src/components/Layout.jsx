import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

// Le cadre commun à toutes les pages : menu en haut, contenu, pied de page
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">LearnHub — projet fil rouge, module Architecture logicielle et microservices</footer>
    </>
  );
}
