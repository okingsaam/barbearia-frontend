import { useEffect, useMemo, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Table from "../components/Table";
import { api } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const defaultDashboardData = {
  agendamentosHoje: 0,
  agendamentosOntem: 0,
  faturamentoHoje: 0,
  faturamentoOntem: 0,
  clientesMes: 0,
  clientesMesAnterior: 0,
  ticketMedio: 0,
  faturamento7dias: {},
  agendamentosDoDia: [],
};

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const raw = String(value).trim();
  const directDate = new Date(raw);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const parts = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!parts) {
    return null;
  }

  const day = Number(parts[1]);
  const month = Number(parts[2]);
  const year = Number(parts[3]);
  const parsed = new Date(year, month - 1, day);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatHour(value) {
  if (!value) {
    return "-";
  }

  if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  const parsed = parseDate(value);
  if (!parsed) {
    return "-";
  }

  return parsed.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}

function formatPct(value) {
  const signal = value > 0 ? "+" : "";
  return `${signal}${value.toFixed(1)}%`;
}

function computeVariation(current, previous) {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

function normalizeStatus(status) {
  const clean = String(status || "").trim().toLowerCase();

  if (clean.includes("confirm")) {
    return "Confirmado";
  }

  if (clean.includes("conclu")) {
    return "Concluido";
  }

  if (clean.includes("cancel")) {
    return "Cancelado";
  }

  return "Aguardando";
}

function statusClassName(status) {
  switch (normalizeStatus(status)) {
    case "Confirmado":
      return "status-badge status-badge-confirmado";
    case "Concluido":
      return "status-badge status-badge-concluido";
    case "Cancelado":
      return "status-badge status-badge-cancelado";
    default:
      return "status-badge status-badge-aguardando";
  }
}

function normalizeAgendaRow(row) {
  const scheduleValue =
    row.dataHora || row.horario || row.data || row.inicio || row.createdAt || null;

  return {
    ...row,
    horario: formatHour(row.horario || row.hora || scheduleValue),
    clienteNome: row.clienteNome || row.cliente?.nome || row.cliente || "-",
    barbeiroNome: row.barbeiroNome || row.barbeiro?.nome || row.barbeiro || "-",
    servicoNome: row.servicoNome || row.servico?.nome || row.servico || "-",
    valorServico: toNumber(
      row.servico?.preco ?? row.valorServico ?? row.valor ?? row.total,
    ),
    statusLabel: normalizeStatus(row.status || row.situacao),
  };
}

function normalizeDashboardPayload(payload) {
  return {
    ...defaultDashboardData,
    ...payload,
    faturamento7dias: payload?.faturamento7dias || {},
    agendamentosDoDia: Array.isArray(payload?.agendamentosDoDia)
      ? payload.agendamentosDoDia
      : [],
  };
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard");
        setDashboardData(normalizeDashboardPayload(response.data));
      } catch (loadError) {
        setError(loadError.message || "Nao foi possivel carregar o dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const summary = useMemo(() => {
    const agendamentosHoje = toNumber(dashboardData.agendamentosHoje);
    const faturamentoHoje = toNumber(dashboardData.faturamentoHoje);
    const clientesMes = toNumber(dashboardData.clientesMes);
    const ticketMedio = toNumber(dashboardData.ticketMedio);

    return {
      agendamentosHoje,
      faturamentoHoje,
      clientesMes,
      ticketMedio,
      variationAppointments: computeVariation(
        agendamentosHoje,
        toNumber(dashboardData.agendamentosOntem),
      ),
      variationRevenue: computeVariation(
        faturamentoHoje,
        toNumber(dashboardData.faturamentoOntem),
      ),
      variationClientesMes: computeVariation(
        clientesMes,
        toNumber(dashboardData.clientesMesAnterior),
      ),
    };
  }, [dashboardData]);

  const agendaRows = useMemo(
    () => dashboardData.agendamentosDoDia.map(normalizeAgendaRow),
    [dashboardData.agendamentosDoDia],
  );

  const agendaColumns = useMemo(
    () => [
      { key: "horario", label: "Horario" },
      { key: "clienteNome", label: "Cliente" },
      { key: "barbeiroNome", label: "Barbeiro" },
      { key: "servicoNome", label: "Servico" },
      {
        key: "valorServico",
        label: "Valor",
        render: (row) => formatCurrency(row.valorServico),
      },
      {
        key: "statusLabel",
        label: "Status",
        render: (row) => (
          <span className={statusClassName(row.statusLabel)}>{row.statusLabel}</span>
        ),
      },
    ],
    [],
  );

  const chartModel = useMemo(() => {
    const rawSeries = dashboardData.faturamento7dias;

    const entries = Array.isArray(rawSeries)
      ? rawSeries.map((item, index) => [item?.data || item?.dia || String(index), item?.valor || item?.faturamento || 0])
      : Object.entries(rawSeries || {});

    const normalizedEntries = entries
      .map(([key, value]) => ({
        key,
        value: toNumber(value),
        parsedDate: parseDate(key),
      }))
      .sort((a, b) => {
        if (!a.parsedDate || !b.parsedDate) {
          return String(a.key).localeCompare(String(b.key));
        }

        return a.parsedDate.getTime() - b.parsedDate.getTime();
      });

    const labels = normalizedEntries.map((entry) => {
      if (!entry.parsedDate) {
        return String(entry.key);
      }

      return entry.parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    });

    const values = normalizedEntries.map((entry) => Number(entry.value.toFixed(2)));

    return {
      data: {
        labels,
        datasets: [
          {
            label: "Faturamento (R$)",
            data: values,
            borderRadius: 10,
            maxBarThickness: 34,
            backgroundColor: "rgba(212, 175, 55, 0.86)",
            hoverBackgroundColor: "rgba(232, 205, 123, 0.95)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#d9d9d9",
              font: {
                size: 12,
                weight: "600",
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => formatCurrency(context.raw),
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#a8a8a8",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
          },
          y: {
            ticks: {
              color: "#a8a8a8",
              callback: (value) => formatCurrency(value),
            },
            grid: {
              color: "rgba(255, 255, 255, 0.08)",
            },
          },
        },
      },
    };
  }, [dashboardData.faturamento7dias]);

  return (
    <section className="dashboard-shell">
      <header className="page-card dashboard-intro">
        <div className="page-headline">
          <div>
            <h2>Dashboard</h2>
            <p className="page-subtitle">Resumo operacional de hoje e desempenho semanal.</p>
          </div>
        </div>

        <div className="metrics-grid">
          <article className="metric-card">
            <p className="metric-label">Agendamentos Hoje</p>
            <strong className="metric-value">{summary.agendamentosHoje}</strong>
            <span className="metric-trend">{formatPct(summary.variationAppointments)} vs ontem</span>
          </article>

          <article className="metric-card">
            <p className="metric-label">Faturamento do Dia</p>
            <strong className="metric-value">{formatCurrency(summary.faturamentoHoje)}</strong>
            <span className="metric-trend">{formatPct(summary.variationRevenue)} vs ontem</span>
          </article>

          <article className="metric-card">
            <p className="metric-label">Clientes no Mes</p>
            <strong className="metric-value">{summary.clientesMes}</strong>
            <span className="metric-trend">{formatPct(summary.variationClientesMes)} vs mes anterior</span>
          </article>

          <article className="metric-card">
            <p className="metric-label">Ticket Medio</p>
            <strong className="metric-value">{formatCurrency(summary.ticketMedio)}</strong>
            <span className="metric-trend">Baseado no dia atual</span>
          </article>
        </div>
      </header>

      {error ? <p className="feedback feedback-error">{error}</p> : null}

      <section className="page-card dashboard-table-card">
        <div className="page-headline">
          <div>
            <h2>Agenda do Dia</h2>
            <p className="page-subtitle">Acompanhamento dos atendimentos com status em tempo real.</p>
          </div>
        </div>

        <Table
          columns={agendaColumns}
          rows={agendaRows}
          loading={loading}
          emptyText="Nenhum agendamento encontrado para hoje."
        />
      </section>

      <section className="page-card dashboard-chart-card">
        <div className="page-headline">
          <div>
            <h2>Faturamento dos Ultimos 7 Dias</h2>
            <p className="page-subtitle">Comparativo diario para apoiar decisoes operacionais.</p>
          </div>
        </div>

        <div className="dashboard-chart-wrap">
          <Bar data={chartModel.data} options={chartModel.options} />
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
