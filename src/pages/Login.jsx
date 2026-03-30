import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/auth/login", { email, senha });
      localStorage.setItem("token", response.data.token);
      navigate("/clientes");
    } catch {
      setErro("Email ou senha incorretos.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#111",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#1a1a1a",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ color: "#c9a84c", textAlign: "center" }}>
          Admin - King of Cut
        </h2>

        {erro && <p style={{ color: "red", textAlign: "center" }}>{erro}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background: "#c9a84c",
            color: "#111",
            fontWeight: "bold",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
