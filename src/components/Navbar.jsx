import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/clientes", label: "Clientes" },
  { to: "/barbeiros", label: "Barbeiros" },
  { to: "/servicos", label: "Servicos" },
  { to: "/produtos", label: "Produtos" },
  { to: "/agendamentos", label: "Agendamentos" },
  { to: "/vendas", label: "Vendas" },
];

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegacao principal">
      <div className="navbar-brand">
        <span className="brand-mark" />
        <p>Barbearia Pro</p>
      </div>

      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;