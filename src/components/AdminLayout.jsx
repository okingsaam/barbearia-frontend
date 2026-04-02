import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import crownIcon from "../assets/icon-crown.svg";
import Header from "./Header";
import { clearAuthToken } from "../services/authService";

const ADMIN_ITEMS = [
  { to: "/dashboard",    label: "Dashboard" },
  { to: "/clientes",     label: "Clientes" },
  { to: "/barbeiros",    label: "Barbeiros" },
  { to: "/servicos",     label: "Serviços" },
  { to: "/produtos",     label: "Produtos" },
  { to: "/agendamentos", label: "Agenda" },
  { to: "/vendas",       label: "Vendas" },
];

function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="koc-app-shell">
      <nav className="koc-navbar" aria-label="Admin navigation">
        <div className="koc-navbar-brand">
          <img src={crownIcon} alt="King of Cut" />
          <div>
            <p>King of Cut</p>
            <span>Painel Admin</span>
          </div>
        </div>

        <ul className="koc-navbar-links">
          {ADMIN_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "koc-nav-link koc-nav-link-active" : "koc-nav-link"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/" className="koc-book-link">
          ← Voltar
        </Link>

        <button onClick={handleLogout} className="koc-book-link koc-book-link-button">
          Sair
        </button>
      </nav>

      <main className="koc-main">
        <Header />
        <Outlet />
      </main>

      <footer className="koc-footer">
        <p>
          © {new Date().getFullYear()} King of Cut ·{" "}
          <span style={{ color: "var(--koc-gold)" }}>Painel Admin</span>
        </p>
      </footer>
    </div>
  );
}

export default AdminLayout;
