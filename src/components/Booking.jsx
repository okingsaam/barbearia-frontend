import { useState } from "react";
import SectionDivider from "./SectionDivider";
import { api } from "../services/api";

const SERVICES = [
  "Corte de Cabelo",
  "Aparar Barba",
  "Barba com Navalha",
  "Corte + Barba",
];

const BARBERS = [
  "Rafael Júnior",
  "Marcos Costa",
  "Lucas Ferreira",
  "Qualquer Disponível",
];

const TIMES = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const INITIAL_FORM = {
  nomeCliente: "",
  telefone: "",
  servico: "",
  barbeiro: "",
  data: "",
  horario: "",
};

function Booking() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await api.post("/agendamentos", form);
      setFeedback({
        type: "success",
        message:
          "Agendamento realizado com sucesso! Confirmaremos via WhatsApp em breve.",
      });
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error("[Booking] Falha ao criar agendamento:", error.message);
      setFeedback({
        type: "error",
        message:
          "Não foi possível conectar ao servidor. Ligue diretamente ou tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionDivider />
      <section id="booking" className="booking-section">
        <div className="landing-container">
          <div className="section-title-wrap reveal" data-reveal>
            <span className="section-tag">Reserve Seu Horário</span>
            <h2 className="section-title light">Agendar Horário</h2>
            <p className="section-subtitle light">
              Agende sua visita e experimente a diferença da King of Cut.
            </p>
          </div>

          <div className="booking-wrapper">
            <div className="reveal" data-reveal>
              <div className="booking-info-item">
                <div className="booking-info-icon">📍</div>
                <div>
                  <div className="booking-info-label">Localização</div>
                  <div className="booking-info-value">
                    Rua da Barbearia, 123<br />Centro — São Paulo, SP
                  </div>
                </div>
              </div>

              <div className="booking-info-item">
                <div className="booking-info-icon">🕐</div>
                <div>
                  <div className="booking-info-label">Horário de Funcionamento</div>
                  <div className="booking-info-value">
                    Segunda – Sábado: 9h – 19h<br />Domingo: Fechado
                  </div>
                </div>
              </div>

              <div className="booking-info-item">
                <div className="booking-info-icon">📞</div>
                <div>
                  <div className="booking-info-label">Telefone &amp; WhatsApp</div>
                  <div className="booking-info-value">(11) 99999-0000</div>
                </div>
              </div>

              <div className="booking-info-item">
                <div className="booking-info-icon">✉️</div>
                <div>
                  <div className="booking-info-label">E-mail</div>
                  <div className="booking-info-value">contato@kingofcut.com.br</div>
                </div>
              </div>

              <div className="booking-divider-line" />

              <p style={{ color: "#6f6f6f", fontSize: "0.82rem", lineHeight: "1.85" }}>
                Clientes sem agendamento são bem-vindos conforme disponibilidade.
                Para garantir seu horário, recomendamos agendar com antecedência.
              </p>
            </div>

            <form className="booking-form reveal" data-reveal onSubmit={handleSubmit} noValidate>
              <h3 className="booking-form-title">Reserve Seu Horário</h3>

              {feedback && (
                <div className={`booking-feedback ${feedback.type}`}>
                  {feedback.message}
                </div>
              )}

              <div className="booking-form-grid">
                <div className="booking-form-group">
                  <label className="booking-form-label" htmlFor="bk-name">
                    Nome Completo
                  </label>
                  <input
                    id="bk-name"
                    name="nomeCliente"
                    className="booking-form-control"
                    placeholder="Seu nome completo"
                    value={form.nomeCliente}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-form-group">
                  <label className="booking-form-label" htmlFor="bk-phone">
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="bk-phone"
                    name="telefone"
                    className="booking-form-control"
                    placeholder="(11) 99999-0000"
                    value={form.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>

              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="bk-service">
                  Serviço
                </label>
                <select
                  id="bk-service"
                  name="servico"
                  className="booking-form-control"
                  value={form.servico}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="bk-barber">
                  Barbeiro
                </label>
                <select
                  id="bk-barber"
                  name="barbeiro"
                  className="booking-form-control"
                  value={form.barbeiro}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um barbeiro</option>
                  {BARBERS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="bk-date">
                  Data
                </label>
                <input
                  id="bk-date"
                  name="data"
                  type="date"
                  className="booking-form-control"
                  value={form.data}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="booking-form-group">
                <label className="booking-form-label" htmlFor="bk-time">
                  Horário
                </label>
                <select
                  id="bk-time"
                  name="horario"
                  className="booking-form-control"
                  value={form.horario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um horário</option>
                  {TIMES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              </div>

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={loading}
              >
                {loading ? "AGENDANDO..." : "CONFIRMAR AGENDAMENTO"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Booking;
