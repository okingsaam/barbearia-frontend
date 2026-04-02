import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import crownIcon from "../assets/icon-crown.svg";
import Button from "../components/Button";
import Input from "../components/Input";
import { getAuthToken, login as authenticate } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (getAuthToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await authenticate({ email, senha });
      navigate("/dashboard");
    } catch (error) {
      setErro("Email ou senha incorretos.");
      console.error("[Login] Falha na autenticação:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-label="Login administrativo">
        <div className="login-mark">
          <img src={crownIcon} alt="King of Cut" />
        </div>
        <div className="login-brand">
          <span className="login-eyebrow">King of Cut</span>
          <h1>Painel Admin</h1>
          <p>
            Entre com seu email e senha para acessar os módulos administrativos.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {erro ? <p className="login-error">{erro}</p> : null}

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            autoComplete="current-password"
            required
          />

          <Button type="submit" variant="secondary" fullWidth disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default Login;
