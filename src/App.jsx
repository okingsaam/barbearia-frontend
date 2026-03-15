import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Agendamentos from "./pages/Agendamentos";
import Barbeiros from "./pages/Barbeiros";
import Clientes from "./pages/Clientes";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Servicos from "./pages/Servicos";
import Vendas from "./pages/Vendas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AdminLayout />}>
        <Route path="/clientes"     element={<Clientes />} />
        <Route path="/barbeiros"    element={<Barbeiros />} />
        <Route path="/servicos"     element={<Servicos />} />
        <Route path="/produtos"     element={<Produtos />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/vendas"       element={<Vendas />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;