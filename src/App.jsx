import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Agendamentos from "./pages/Agendamentos";
import Barbeiros from "./pages/Barbeiros";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Servicos from "./pages/Servicos";
import Vendas from "./pages/Vendas";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/clientes" replace />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/barbeiros" element={<Barbeiros />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="*" element={<Navigate to="/clientes" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Barbearia Pro • Painel de gestao • 2026</p>
      </footer>
    </div>
  );
}

export default App;