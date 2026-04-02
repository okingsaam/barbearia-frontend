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
import { createEntityService, getEntityId } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const agendamentosService = createEntityService("/agendamentos");
const vendasService = createEntityService("/vendas");
const clientesService = createEntityService("/clientes");
const barbeirosService = createEntityService("/barbeiros");
const servicosService = createEntityService("/servicos");

function asDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

function getAppointmentDate(row) {
  return (
    row.dataHora ||
    row.data ||
    row.horario ||
    row.createdAt ||
    row.updatedAt ||
    null
  );
}

function getSaleDate(row) {
  return row.data || row.dataHora || row.createdAt || row.updatedAt || null;
}

function getSaleTotal(row) {
  return Number(row.total ?? row.valor ?? row.precoTotal ?? 0) || 0;
}

function Dashboard() {
  const [rows, setRows] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clientNameMap = useMemo(
    () => new Map(clientes.map((item) => [String(getEntityId(item)), item.nome])),
    [clientes],
  );
  const barberNameMap = useMemo(
    () => new Map(barbeiros.map((item) => [String(getEntityId(item)), item.nome])),
    [barbeiros],
  );
  const serviceMap = useMemo(
    () => new Map(servicos.map((item) => [String(getEntityId(item)), item])),
    [servicos],
  );

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [agendamentos, vendasData, clientesData, barbeirosData, servicosData] = await Promise.all([
          agendamentosService.list(),
          vendasService.list(),
          clientesService.list(),
          barbeirosService.list(),
          servicosService.list(),
        ]);

        setRows(agendamentos);
        setVendas(vendasData);
        setClientes(clientesData);
        setBarbeiros(barbeirosData);
        setServicos(servicosData);
      } catch (loadError) {
        setError(loadError.message || "Nao foi possivel carregar o dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const todayData = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    const appointmentsToday = rows.filter((row) => {
      const rowDate = asDate(getAppointmentDate(row));
      return rowDate && rowDate >= todayStart && rowDate < tomorrowStart;
    });

    const salesToday = vendas.filter((row) => {
      const rowDate = asDate(getSaleDate(row));
      return rowDate && rowDate >= todayStart && rowDate < tomorrowStart;
    });

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    const appointmentsYesterday = rows.filter((row) => {
      const rowDate = asDate(getAppointmentDate(row));
      return rowDate && rowDate >= yesterdayStart && rowDate < todayStart;
    });

    const salesYesterday = vendas.filter((row) => {
      const rowDate = asDate(getSaleDate(row));
      return rowDate && rowDate >= yesterdayStart && rowDate < todayStart;
    });

    const todayRevenue = salesToday.reduce((sum, sale) => sum + getSaleTotal(sale), 0);
    const yesterdayRevenue = salesYesterday.reduce((sum, sale) => sum + getSaleTotal(sale), 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    const servedThisMonth = new Set(
      rows
        .filter((row) => {
          const rowDate = asDate(getAppointmentDate(row));
          return rowDate && rowDate >= monthStart;
        })
        .map((row) => String(row.clienteId ?? row.cliente?.id ?? row.cliente))
        .filter(Boolean),
    ).size;

    const servedPreviousMonth = new Set(
      rows
        .filter((row) => {
          const rowDate = asDate(getAppointmentDate(row));
          return rowDate && rowDate >= previousMonthStart && rowDate < previousMonthEnd;
        })
        .map((row) => String(row.clienteId ?? row.cliente?.id ?? row.cliente))
        .filter(Boolean),
    ).size;

    const ticketToday = salesToday.length > 0 ? todayRevenue / salesToday.length : 0;
    const ticketYesterday = salesYesterday.length > 0 ? yesterdayRevenue / salesYesterday.length : 0;

    return {
      appointmentsToday,
      todayRevenue,
      servedThisMonth,
      ticketToday,
      variationAppointments: computeVariation(appointmentsToday.length, appointmentsYesterday.length),
      variationRevenue: computeVariation(todayRevenue, yesterdayRevenue),
      variationServed: computeVariation(servedThisMonth, servedPreviousMonth),
      variationTicket: computeVariation(ticketToday, ticketYesterday),
    };
  }, [rows, vendas]);

  const agendaRows = useMemo(
    () =>
      [...todayData.appointmentsToday]
        .sort((a, b) => {
          const dateA = asDate(getAppointmentDate(a));
          const dateB = asDate(getAppointmentDate(b));
          return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
        })
        .map((row) => {
          const rowDate = asDate(getAppointmentDate(row));
          const clienteKey = String(row.clienteId ?? row.cliente?.id ?? row.cliente);
          const barbeiroKey = String(row.barbeiroId ?? row.barbeiro?.id ?? row.barbeiro);
          const servicoKey = String(row.servicoId ?? row.servico?.id ?? row.servico);
          const service = serviceMap.get(servicoKey);

          return {
            ...row,
            horario: rowDate ? rowDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-",
            clienteNome: row.cliente?.nome ?? clientNameMap.get(clienteKey) ?? "-",
            barbeiroNome: row.barbeiro?.nome ?? barberNameMap.get(barbeiroKey) ?? "-",
            servicoNome: row.servico?.nome ?? service?.nome ?? "-",
            valorServico: Number(row.valor ?? row.total ?? service?.preco ?? 0) || 0,
            statusLabel: normalizeStatus(row.status),
          };
        }),
    [todayData.appointmentsToday, clientNameMap, barberNameMap, serviceMap],
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
    const labels = [];
    const values = [];
    const today = startOfDay(new Date());

    for (let index = 6; index >= 0; index -= 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - index);

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const dayTotal = vendas
        .filter((sale) => {
          const saleDate = asDate(getSaleDate(sale));
          return saleDate && saleDate >= day && saleDate < nextDay;
        })
        .reduce((sum, sale) => sum + getSaleTotal(sale), 0);

      labels.push(
        day.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
        }),
      );
      values.push(Number(dayTotal.toFixed(2)));
    }

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
  }, [vendas]);

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
            <strong className="metric-value">{todayData.appointmentsToday.length}</strong>
            <span className="metric-trend">{formatPct(todayData.variationAppointments)} vs ontem</span>
          </article>

          <article className="metric-card">
            <p className="metric-label">Faturamento do Dia</p>
            <strong className="metric-value">{formatCurrency(todayData.todayRevenue)}</strong>
            <span className="metric-trend">{formatPct(todayData.variationRevenue)} vs ontem</span>
          </article>

          <article className="metric-card">
            <p className="metric-label">Clientes no Mes</p>
            <strong className="metric-value">{todayData.servedThisMonth}</strong>
            <span className="metric-trend">{formatPct(todayData.variationServed)} vs mes anterior</span>
          </article>

          <article className="metric-card">
            <p className="metric-label">Ticket Medio</p>
            <strong className="metric-value">{formatCurrency(todayData.ticketToday)}</strong>
            <span className="metric-trend">{formatPct(todayData.variationTicket)} vs ontem</span>
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
