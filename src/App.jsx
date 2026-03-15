import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Agendamentos from "./pages/Agendamentos";
import Barbeiros from "./pages/Barbeiros";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Servicos from "./pages/Servicos";
import Vendas from "./pages/Vendas";

function App() {
  return (
    <div className="koc-app-shell">
      <Navbar />

      <main className="koc-main">
        <Header />

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

      <Footer />
    </div>
  );
}

export default App;