import { useEffect, useMemo, useState } from "react";
import SectionDivider from "./SectionDivider";
import { createEntityService, getEntityId } from "../services/api";

const TIMES = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const clientesService = createEntityService("/clientes");
const barbeirosService = createEntityService("/barbeiros");
const servicosService = createEntityService("/servicos");
const agendamentosService = createEntityService("/agendamentos");

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
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [catalogReloadKey, setCatalogReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const clienteByTelefone = useMemo(
    () => new Map(clientes.map((item) => [normalizePhone(item.telefone), item])),
    [clientes],
  );
  const barbeiroByNome = useMemo(
    () => new Map(barbeiros.map((item) => [normalizeName(item.nome), item])),
    [barbeiros],
  );
  const servicoByNome = useMemo(
    () => new Map(servicos.map((item) => [normalizeName(item.nome), item])),
    [servicos],
  );

  function normalizePhone(value) {
    return String(value ?? "").replace(/\D/g, "");
  }

  function normalizeName(value) {
    return String(value ?? "").trim().toLowerCase();
  }

  function buildDataHora(data, horario) {
    if (!data || !horario) {
      return "";
    }

    return `${data}T${horario}:00`;
  }

  function getTodayValue() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDateLabel(value) {
    const [year, month, day] = String(value ?? "").split("-");

    if (!year || !month || !day) {
      return value;
    }

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    let isActive = true;

    async function loadFormData() {
      try {
        setFeedback(null);
        setCatalogLoading(true);
        setCatalogError("");

        const [clientesResponse, barbeirosResponse, servicosResponse] = await Promise.all([
          clientesService.list(),
          barbeirosService.list(),
          servicosService.list(),
        ]);

        if (!isActive) {
          return;
        }

        setClientes(clientesResponse);
        setBarbeiros(barbeirosResponse);
        setServicos(servicosResponse);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("[Booking] Falha ao carregar cadastros:", error.message);
        setCatalogError("Nao foi possivel carregar barbeiros e servicos agora.");
        setFeedback({
          type: "error",
          message: "Nao foi possivel carregar os barbeiros e servicos. Tente novamente.",
        });
      } finally {
        if (isActive) {
          setCatalogLoading(false);
        }
      }
    }

    loadFormData();

    return () => {
      isActive = false;
    };
  }, [catalogReloadKey]);

  function handleRetryLoad() {
    setCatalogReloadKey((value) => value + 1);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const todayValue = getTodayValue();

      if (!form.data) {
        throw new Error("Selecione uma data para o agendamento.");
      }

      if (form.data < todayValue) {
        throw new Error("Nao permitimos datas passadas. Escolha um dia a partir de hoje.");
      }

      const telefoneNormalizado = normalizePhone(form.telefone);
      const clienteExistente = clienteByTelefone.get(telefoneNormalizado);
      const cliente =
        clienteExistente ??
        (await clientesService.create({
          nome: form.nomeCliente,
          telefone: form.telefone,
        }));
      const barbeiro = barbeiroByNome.get(normalizeName(form.barbeiro));
      const servico = servicoByNome.get(normalizeName(form.servico));
      const dataHora = buildDataHora(form.data, form.horario);

      if (!cliente || !getEntityId(cliente)) {
        throw new Error("Nao foi possivel identificar o cliente.");
      }

      if (!barbeiro || !getEntityId(barbeiro)) {
        throw new Error("Nao foi possivel identificar o barbeiro selecionado.");
      }

      if (!servico || !getEntityId(servico)) {
        throw new Error("Nao foi possivel identificar o servico selecionado.");
      }

      if (!dataHora) {
        throw new Error("Data e horario sao obrigatorios.");
      }

      await agendamentosService.create({
        clienteId: Number(getEntityId(cliente)),
        barbeiroId: Number(getEntityId(barbeiro)),
        servicoId: Number(getEntityId(servico)),
        dataHora,
      });
      setFeedback({
        type: "success",
        message: `Agendamento confirmado para ${formatDateLabel(form.data)} às ${form.horario}. Enviaremos a confirmação via WhatsApp.`,
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
                    Av. Almirante Marques de Leão, 348<br />Barra — Salvador, BA
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

              {catalogError ? (
                <div className="booking-catalog-error">
                  <span>{catalogError}</span>
                  <button type="button" className="booking-retry-button" onClick={handleRetryLoad}>
                    Tentar novamente
                  </button>
                </div>
              ) : null}

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
                  <div className="booking-select-shell">
                    <select
                      id="bk-service"
                      name="servico"
                      className="booking-form-control"
                      value={form.servico}
                      onChange={handleChange}
                      disabled={catalogLoading || Boolean(catalogError)}
                      required
                    >
                      <option value="">
                        {catalogLoading ? "Carregando serviços..." : "Selecione um serviço"}
                      </option>
                      {!catalogLoading && servicos.map((item) => (
                        <option key={getEntityId(item) ?? item.nome} value={item.nome}>
                          {item.nome}
                        </option>
                      ))}
                    </select>
                    {catalogLoading ? <span className="booking-select-spinner" aria-hidden="true" /> : null}
                  </div>
                </div>

                <div className="booking-form-group">
                  <label className="booking-form-label" htmlFor="bk-barber">
                    Barbeiro
                  </label>
                  <div className="booking-select-shell">
                    <select
                      id="bk-barber"
                      name="barbeiro"
                      className="booking-form-control"
                      value={form.barbeiro}
                      onChange={handleChange}
                      disabled={catalogLoading || Boolean(catalogError)}
                      required
                    >
                      <option value="">
                        {catalogLoading ? "Carregando barbeiros..." : "Selecione um barbeiro"}
                      </option>
                      {!catalogLoading && barbeiros.map((item) => (
                        <option key={getEntityId(item) ?? item.nome} value={item.nome}>
                          {item.nome}
                        </option>
                      ))}
                    </select>
                    {catalogLoading ? <span className="booking-select-spinner" aria-hidden="true" /> : null}
                  </div>
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
                    min={getTodayValue()}
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
                disabled={loading || catalogLoading || Boolean(catalogError)}
                aria-busy={loading}
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
