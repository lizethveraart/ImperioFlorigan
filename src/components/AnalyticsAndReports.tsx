import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { exportMonthlyReportPDF } from '../services/pdfService';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Sparkles,
  MapPin,
  Award,
} from 'lucide-react';

export const AnalyticsAndReports: React.FC = () => {
  const { getMonthlyReport, orders, currentUser } = useApp();

  // Get available month keys from orders
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    const now = new Date();
    const curKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    set.add(curKey);
    orders.forEach(o => set.add(o.monthKey));
    return Array.from(set).sort().reverse();
  }, [orders]);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(availableMonths[0] || '2026-10');

  const report = useMemo(() => {
    return getMonthlyReport(selectedMonthKey);
  }, [getMonthlyReport, selectedMonthKey]);

  const avgTicket = report.totalOrders > 0
    ? Math.round(report.totalCatalogSales / report.totalOrders)
    : 0;

  const handleDownloadPDF = () => {
    exportMonthlyReportPDF(report, currentUser.role === 'vendedor' ? currentUser.name : undefined);
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Award className="w-8 h-8 text-[#b3925d]" />
        </div>
        <h2 className="font-cinzel text-xl font-bold text-[#141211]">Acceso Administrativo Requerido</h2>
        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
          Los reportes mensuales consolidados y balances en formato PDF son de visualización exclusiva para cuentas administrativas autorizadas de Imperio Florigan.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#b3925d]/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#141211] text-[#ecd08c] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141211]">
              Análisis en Tiempo Real & Reportes Mensuales
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Monitorea el volumen de ventas, distribución geográfica de fletes nacionales, ganancias de comisiones y genera reportes oficiales en PDF.
          </p>
        </div>

        {/* Month Selector & PDF Export Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200 text-xs">
            <Calendar className="w-4 h-4 text-[#b3925d]" />
            <select
              value={selectedMonthKey}
              onChange={e => setSelectedMonthKey(e.target.value)}
              className="bg-transparent font-bold text-zinc-800 focus:outline-none"
            >
              {availableMonths.map(k => (
                <option key={k} value={k}>
                  Periodo: {k}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4145a] via-[#e8226e] to-[#b3925d] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4145a]/25 hover:brightness-110 active:scale-98 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte Mensual PDF
          </button>
        </div>
      </div>

      {/* Financial KPIs Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ventas Catálogo</span>
            <DollarSign className="w-4 h-4 text-[#d4145a]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#141211]">
            ${report.totalCatalogSales.toLocaleString('es-MX')}
          </div>
          <span className="text-[10px] text-zinc-400 block mt-1">Precio oficial catálogo</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Comisión Vendedoras</span>
            <Sparkles className="w-4 h-4 text-[#b3925d]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#b3925d]">
            ${report.totalCommissions.toLocaleString('es-MX')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Margen promedio del 35%</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pedidos Totales</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#141211]">
            {report.totalOrders} <span className="text-xs font-normal text-zinc-500">órdenes</span>
          </div>
          <span className="text-[10px] text-zinc-400 block mt-1">Ticket Promedio: ${avgTicket} MXN</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Fletes Nacionales</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#141211]">
            ${report.totalShippingCollected.toLocaleString('es-MX')}
          </div>
          <span className="text-[10px] text-zinc-400 block mt-1">Estafeta, FedEx, Redpack, DHL</span>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Top 5 Products Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d4145a]" />
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#141211]">
                Top 5 Productos Más Vendidos del Mes
              </h3>
            </div>
            <span className="text-xs text-[#b3925d] font-semibold">{report.monthName}</span>
          </div>

          <div className="space-y-3 pt-2">
            {report.topProducts.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-8">No hay ventas registradas en este periodo.</p>
            ) : (
              report.topProducts.map((p, idx) => {
                const maxRevenue = Math.max(...report.topProducts.map(tp => tp.revenue), 1);
                const percentage = Math.round((p.revenue / maxRevenue) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-zinc-800">
                        {idx + 1}. {p.name}
                      </span>
                      <span className="text-zinc-500 font-semibold">
                        {p.quantity} pzas • <strong className="text-[#d4145a]">${p.revenue.toLocaleString('es-MX')} MXN</strong>
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#d4145a] to-[#b3925d] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Geographic Distribution (Envíos por Estado) */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#b3925d]" />
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#141211]">
              Envíos Nacionales por Estado
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {report.salesByState.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-8">Sin envíos registrados.</p>
            ) : (
              report.salesByState.map((st, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 text-xs">
                  <div>
                    <span className="font-bold text-[#141211] block">{st.state}</span>
                    <span className="text-[10px] text-zinc-500">{st.count} paquetes enviados</span>
                  </div>
                  <span className="font-bold text-[#d4145a]">
                    ${st.total.toLocaleString('es-MX')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Sales by Line breakdown */}
      <div className="mt-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#141211]">
          Ventas por Línea Herbolaria Florigan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {report.salesByLine.map((line, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#b3925d]/20 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#b3925d] block">
                {line.line}
              </span>
              <div className="flex justify-between items-end mt-2">
                <span className="text-zinc-500">{line.count} productos vendidos</span>
                <span className="text-sm font-black text-[#141211]">
                  ${line.total.toLocaleString('es-MX')} MXN
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Export Banner */}
      <div className="mt-6 p-6 rounded-3xl imperial-dark-gradient border border-[#b3925d]/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ecd08c]">
            Documento Oficial Certificado
          </span>
          <h4 className="font-cinzel text-lg font-bold text-white mt-0.5">
            Descargar Reporte Mensual Completo en Formato PDF
          </h4>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Genera al instante un documento PDF formal con logotipo oficial, desglose financiero, comisiones por vendedora y paqueterías nacionales para rendición de cuentas.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="px-5 py-3 rounded-xl bg-[#b3925d] hover:bg-[#ecd08c] text-[#141211] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar PDF Ahora
        </button>
      </div>

    </div>
  );
};
