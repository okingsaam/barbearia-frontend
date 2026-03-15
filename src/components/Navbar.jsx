import { NavLink } from "react-router-dom";
import crownIcon from "../assets/icon-crown.svg";

const navItems = [
  { to: "/clientes", label: "HOME" },
  { to: "/barbeiros", label: "BARBEIROS" },
  { to: "/servicos", label: "SERVICOS" },
  { to: "/produtos", label: "PRODUTOS" },
  { to: "/agendamentos", label: "AGENDA" },
  { to: "/vendas", label: "VENDAS" },
];

function Navbar() {
  return (
    <nav className="koc-navbar" aria-label="Navegacao principal">
      <div className="koc-navbar-brand">
        <img src={crownIcon} alt="Coroa King of Cut" />
        <div>
          <p>King of Cut</p>
          <span>Barber Shop</span>
        </div>
      </div>

      <ul className="koc-navbar-links">
        {navItems.map((item) => (
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

      <NavLink to="/agendamentos" className="koc-book-link">
        BOOK APPOINTMENT
      </NavLink>
    </nav>
  );
}

export default Navbar;