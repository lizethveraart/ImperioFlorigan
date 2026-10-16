import { jsPDF } from 'jspdf';
import { MonthlyReportData, Order } from '../types';

export function exportMonthlyReportPDF(report: MonthlyReportData, vendorName?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background Banner - Deep Imperial Charcoal & Gold Accent
  doc.setFillColor(20, 18, 17);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar
  doc.setFillColor(179, 146, 93);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Brand Name
  doc.setTextColor(236, 208, 140);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('IMPERIO FLORIGAN', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(240, 240, 240);
  doc.text('DESDE 1975 • MEDIO SIGLO AMANDO LA NATURALEZA', 14, 25);
  doc.text('REPORTE OFICIAL MENSUAL DE VENTAS Y COMISIONES', 14, 32);

  // Period / Date Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`PERIODO: ${report.monthName.toUpperCase()}`, pageWidth - 14, 18, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, pageWidth - 14, 25, { align: 'right' });
  if (vendorName) {
    doc.text(`Emperatriz: ${vendorName}`, pageWidth - 14, 32, { align: 'right' });
  }

  let y = 54;

  // KPI Summary Cards
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 18, 17);
  doc.text('1. RESUMEN EJECUTIVO FINANCIERO', 14, y);
  y += 6;

  const cardWidth = 42;
  const cardHeight = 22;
  const cards = [
    { label: 'Total Pedidos', val: `${report.totalOrders} pedidos`, color: [248, 249, 250], textColor: [20, 18, 17] },
    { label: 'Ventas Catálogo', val: `$${report.totalCatalogSales.toLocaleString('es-MX')} MXN`, color: [253, 242, 246], textColor: [212, 20, 90] },
    { label: 'Comisiones Vendedoras', val: `$${report.totalCommissions.toLocaleString('es-MX')} MXN`, color: [254, 250, 240], textColor: [179, 146, 93] },
    { label: 'Fletes Nacionales', val: `$${report.totalShippingCollected.toLocaleString('es-MX')} MXN`, color: [243, 244, 246], textColor: [55, 65, 81] },
  ];

  cards.forEach((c, i) => {
    const x = 14 + i * (cardWidth + 4);
    doc.setFillColor(c.color[0], c.color[1], c.color[2]);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(c.label, x + 4, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(c.textColor[0], c.textColor[1], c.textColor[2]);
    doc.text(c.val, x + 4, y + 16);
  });

  y += cardHeight + 12;

  // Top Products Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 18, 17);
  doc.text('2. PRODUCTOS MÁS VENDIDOS (TOP PERFORMERS)', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(36, 32, 30);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('PRODUCTO', 18, y + 5);
  doc.text('UNIDADES VENDIDAS', 125, y + 5);
  doc.text('TOTAL RECAUDADO', pageWidth - 18, y + 5, { align: 'right' });
  y += 7;

  report.topProducts.forEach((p, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 248, 245);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`${idx + 1}. ${p.name}`, 18, y + 4.5);
    doc.text(`${p.quantity} pzas`, 130, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${p.revenue.toLocaleString('es-MX')} MXN`, pageWidth - 18, y + 4.5, { align: 'right' });
    y += 6.5;
  });

  y += 10;

  // Sales by Category Line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 18, 17);
  doc.text('3. DESGLOSE POR LÍNEA FLORIGAN', 14, y);
  y += 6;

  doc.setFillColor(179, 146, 93);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('LÍNEA HERBOLARIA', 18, y + 5);
  doc.text('PEDIDOS', 125, y + 5);
  doc.text('SUBTOTAL', pageWidth - 18, y + 5, { align: 'right' });
  y += 7;

  report.salesByLine.forEach((line, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 248, 245);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(line.line, 18, y + 4.5);
    doc.text(`${line.count} items`, 130, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${line.total.toLocaleString('es-MX')} MXN`, pageWidth - 18, y + 4.5, { align: 'right' });
    y += 6.5;
  });

  y += 10;

  // Geographic Distribution
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 18, 17);
  doc.text('4. DISTRIBUCIÓN GEOGRÁFICA DE ENVÍOS NACIONALES', 14, y);
  y += 6;

  doc.setFillColor(212, 20, 90);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('ESTADO DE DESTINO', 18, y + 5);
  doc.text('ENVÍOS REALIZADOS', 125, y + 5);
  doc.text('TOTAL VENTAS ESTADO', pageWidth - 18, y + 5, { align: 'right' });
  y += 7;

  report.salesByState.slice(0, 6).forEach((st, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(250, 248, 245);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(st.state, 18, y + 4.5);
    doc.text(`${st.count} envíos`, 130, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${st.total.toLocaleString('es-MX')} MXN`, pageWidth - 18, y + 4.5, { align: 'right' });
    y += 6.5;
  });

  // Footer notes & Certification stamp
  const footerY = 278;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, footerY, pageWidth - 14, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Florigan® Desde 1975 • Envíos a todo México con cobertura asegurada • Irapuato, Gto. • Tel. 000 000 0000', 14, footerY + 5);
  doc.text('Documento oficial generado por la Plataforma Imperio Florigan App.', pageWidth - 14, footerY + 5, { align: 'right' });

  // Save PDF
  const filename = `Reporte_Imperio_Florigan_${report.monthKey}.pdf`;
  doc.save(filename);
}

export function exportOrderReceiptPDF(order: Order) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(20, 18, 17);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setFillColor(179, 146, 93);
  doc.rect(0, 36, pageWidth, 2, 'F');

  doc.setTextColor(236, 208, 140);
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('IMPERIO FLORIGAN', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(240, 240, 240);
  doc.text('REMISIÓN Y NOTA DE PEDIDO NACIONAL', 14, 23);
  doc.text('FLORIGAN HERBOLARIA Y BELLEZA • IRAPUATO, GTO.', 14, 29);

  // Order Number Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`PEDIDO: ${order.orderNumber}`, pageWidth - 14, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Fecha: ${order.date}`, pageWidth - 14, 23, { align: 'right' });
  doc.text(`Estatus: ${order.status.toUpperCase()}`, pageWidth - 14, 29, { align: 'right' });

  let y = 48;

  // Client Details Box
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(179, 146, 93);
  doc.text('DATOS DEL DESTINATARIO Y ENVÍO NACIONAL:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(`Cliente: ${order.clientName}`, 18, y + 12);
  doc.text(`Teléfono: ${order.clientPhone}`, 18, y + 17);
  doc.text(`Dirección: ${order.clientAddress}, ${order.clientCity}, ${order.clientState} CP ${order.clientPostalCode}`, 18, y + 22);

  doc.text(`Paquetería: ${order.shippingCarrier}`, 120, y + 12);
  doc.text(`Guía Rastreo: ${order.trackingNumber || 'Generándose en sucursal'}`, 120, y + 17);
  doc.text(`Peso Total: ${(order.totalWeightGrams / 1000).toFixed(2)} kg`, 120, y + 22);

  y += 36;

  // Products Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 18, 17);
  doc.text('PRODUCTOS DEL PEDIDO:', 14, y);
  y += 5;

  doc.setFillColor(36, 32, 30);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('DESCRIPCIÓN', 18, y + 4.8);
  doc.text('PRESENTACIÓN', 95, y + 4.8);
  doc.text('CANT', 130, y + 4.8);
  doc.text('P. UNIT', 150, y + 4.8);
  doc.text('TOTAL', pageWidth - 18, y + 4.8, { align: 'right' });
  y += 7;

  order.items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(252, 250, 248);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(item.productName, 18, y + 4.5);
    doc.text(item.size, 95, y + 4.5);
    doc.text(`${item.quantity}`, 133, y + 4.5);
    doc.text(`$${item.unitPrice}`, 150, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${item.subtotal}`, pageWidth - 18, y + 4.5, { align: 'right' });
    y += 6.5;
  });

  y += 8;

  // Totals Box
  const totalBoxX = pageWidth - 80;
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(totalBoxX, y, 66, 36, 2, 2, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(totalBoxX, y, 66, 36, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text('Subtotal Catálogo:', totalBoxX + 4, y + 7);
  doc.text(`$${order.subtotalCatalog.toLocaleString('es-MX')} MXN`, totalBoxX + 62, y + 7, { align: 'right' });

  doc.text('Envío Nacional:', totalBoxX + 4, y + 13);
  doc.text(`$${order.shippingCost.toLocaleString('es-MX')} MXN`, totalBoxX + 62, y + 13, { align: 'right' });

  if (order.userRole === 'vendedor') {
    doc.setTextColor(179, 146, 93);
    doc.text('Ganancia Vendedora:', totalBoxX + 4, y + 19);
    doc.text(`-$${order.vendorCommission.toLocaleString('es-MX')} MXN`, totalBoxX + 62, y + 19, { align: 'right' });
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(totalBoxX + 4, y + 23, totalBoxX + 62, y + 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(212, 20, 90);
  doc.text('TOTAL A PAGAR:', totalBoxX + 4, y + 30);
  doc.text(`$${order.grandTotal.toLocaleString('es-MX')} MXN`, totalBoxX + 62, y + 30, { align: 'right' });

  // Payment note
  y += 42;
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 20, 40);
  doc.text(`MÉTODO DE PAGO: ${order.paymentMethod.toUpperCase()} | ESTATUS: ${order.paymentStatus}`, 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`Referencia: ${order.paymentReference || 'N/A'} - Facturación o dudas: WhatsApp (+52) 000 000 0000 • Irapuato, Gto.`, 18, y + 10.5);

  const filename = `Nota_${order.orderNumber}.pdf`;
  doc.save(filename);
}
