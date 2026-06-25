import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import type { IOrder } from '../models/Order.js';
import { COD_CHARGE_DEFAULT, GST_RATE, getSellerDetails } from '../config/invoiceConfig.js';
import {
  CANCELLATION_POLICY_PDF_HEIGHT,
  drawCancellationPolicyOnInvoice,
} from '../config/cancellationPolicyContent.js';
import { formatInvoiceAmount } from './invoiceCurrency.js';
import { normalizeOrderLineItems, invoiceItemCount } from './normalizeOrderLineItems.js';

type PDFDoc = InstanceType<typeof PDFDocument>;

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

interface OrderAddress {
  name?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

const formatDate = (date: Date | string | undefined) => {
  const parsed = date ? new Date(date) : new Date();
  if (Number.isNaN(parsed.getTime())) return String(date ?? '');
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const resolveLogoPath = () => {
  const root = process.cwd();
  const candidates = [
    path.join(moduleDir, '../../assets/logo.png'),
    path.join(moduleDir, '../../assets/sitaravastram_logo.png'),
    path.join(root, 'server', 'assets', 'logo.png'),
    path.join(root, 'assets', 'logo.png'),
    path.join(root, 'public', 'assets', 'images', 'sitaravastram_logo.png'),
    path.join(root, 'public', 'assets', 'images', 'logo2.png'),
  ];
  return candidates.find(candidatePath => fs.existsSync(candidatePath));
};

const resolveFontPaths = () => {
  const normalCandidates = [
    'C:\\Windows\\Fonts\\Nirmala.ttf',
    'C:\\Windows\\Fonts\\segoeui.ttf',
    'C:\\Windows\\Fonts\\arial.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
  ];
  const boldCandidates = [
    'C:\\Windows\\Fonts\\NirmalaB.ttf',
    'C:\\Windows\\Fonts\\seguisb.ttf',
    'C:\\Windows\\Fonts\\arialbd.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  ];
  return {
    normal: normalCandidates.find(fontPath => fs.existsSync(fontPath)) || null,
    bold: boldCandidates.find(fontPath => fs.existsSync(fontPath)) || null,
  };
};

const drawCenteredWatermark = (
  doc: PDFDoc,
  imagePath: string | undefined,
  options: { topBoundary?: number; bottomBoundary?: number; opacity?: number } = {},
) => {
  if (!imagePath) return;

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const left = doc.page.margins.left;
  const right = pageWidth - doc.page.margins.right;
  const contentWidth = right - left;

  const topBoundary = Number(options.topBoundary ?? doc.page.margins.top);
  const bottomBoundary = Number(
    options.bottomBoundary ?? pageHeight - doc.page.margins.bottom,
  );
  const opacity = Number(options.opacity ?? 0.055);

  const safeTop = Math.max(doc.page.margins.top, topBoundary);
  const safeBottom = Math.min(pageHeight - doc.page.margins.bottom, bottomBoundary);
  const safeHeight = Math.max(safeBottom - safeTop, 120);
  const watermarkWidth = Math.min(contentWidth * 0.78, safeHeight * 0.92);
  const x = left + (contentWidth - watermarkWidth) / 2;
  const y = safeTop + (safeHeight - watermarkWidth) / 2;

  doc.save();
  doc.opacity(opacity);
  doc.image(imagePath, x, y, { width: watermarkWidth });
  doc.restore();
};

const fitSingleLine = (doc: PDFDoc, text: string, width: number) => {
  const raw = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  if (doc.widthOfString(raw) <= width) return raw;

  const ellipsis = '...';
  let low = 0;
  let high = raw.length;
  let best = '';

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = `${raw.slice(0, mid).trimEnd()}${ellipsis}`;
    if (doc.widthOfString(candidate) <= width) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best || ellipsis;
};

const fillRectSoft = (
  doc: PDFDoc,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  opacity: number,
) => {
  doc.save();
  doc.fillOpacity(opacity);
  doc.rect(x, y, width, height).fill(color);
  doc.restore();
};

const buildCompactBillTo = (address: OrderAddress | undefined, email?: string) => {
  if (!address || typeof address !== 'object') {
    return {
      identity: 'Customer address not provided',
      address: '',
    };
  }

  const fullName = address.name?.trim() || '';
  const phone = address.phone ? `Phone: +91 ${address.phone}` : '';
  const emailLine = email ? `Email: ${email}` : '';
  const identity = [fullName, phone, emailLine].filter(Boolean).join(' | ');

  const compactAddress = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
    address.country || 'India',
  ]
    .filter(Boolean)
    .map(part => String(part).trim())
    .filter(Boolean)
    .join(', ');

  return {
    identity: identity || 'Customer details not provided',
    address: compactAddress || 'Address not provided',
  };
};

const to2 = (value: unknown) => Number((Number(value) || 0).toFixed(2));

const computeInvoiceTotals = (
  order: IOrder,
  normalizedItems: { lineTotal: number }[],
) => {
  const isCOD = order.paymentMethod === 'cod';
  const lineSum = to2(normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const itemsAfterDiscount = to2(
    Math.max(0, (order.subtotal ?? lineSum) - (order.discount ?? 0)),
  );
  const itemsTotal = itemsAfterDiscount > 0 ? itemsAfterDiscount : lineSum;
  const codCharge = to2(order.codFee ?? (isCOD ? COD_CHARGE_DEFAULT : 0));
  const shipping = to2(order.shipping ?? 0);
  const gstRate = GST_RATE;
  const taxableValue = to2(itemsTotal / (1 + gstRate));
  const gstAmount = to2(itemsTotal - taxableValue);
  const computedGrandTotal = to2(itemsTotal + shipping + codCharge);
  const orderAmount = to2(order.total);
  const grandTotal =
    orderAmount > 0 && Math.abs(orderAmount - computedGrandTotal) <= 1
      ? orderAmount
      : computedGrandTotal;

  return {
    isCOD,
    itemsTotal,
    discount: to2(order.discount ?? 0),
    couponCode: order.couponCode,
    shipping,
    codCharge,
    taxableValue,
    gstAmount,
    gstRate,
    grandTotal,
  };
};

export const generateInvoiceBuffer = (order: IOrder) =>
  new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 48, bottom: 42, left: 46, right: 46 },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const fonts = resolveFontPaths();
      if (fonts.normal) doc.registerFont('InvoiceRegular', fonts.normal);
      if (fonts.bold) doc.registerFont('InvoiceBold', fonts.bold);

      const regularFont = fonts.normal ? 'InvoiceRegular' : 'Helvetica';
      const boldFont = fonts.bold ? 'InvoiceBold' : 'Helvetica-Bold';
      const useRupeeSymbol = Boolean(fonts.normal);

      const formatCurrency = (value = 0) =>
        formatInvoiceAmount(value, useRupeeSymbol);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const left = doc.page.margins.left;
      const right = pageWidth - doc.page.margins.right;
      const contentWidth = right - left;

      const brandColor = '#1F2937';
      const mutedColor = '#6B7280';
      const borderColor = '#D1D5DB';
      const headerBg = '#EEF2F7';
      const stripeBg = '#FAFAFA';

      const logoPath = resolveLogoPath();
      const seller = getSellerDetails();

      const invoiceNumber = `INV-${new Date().getFullYear()}-${order.orderId
        .replace(/\D/g, '')
        .slice(-6)
        .toUpperCase()}`;

      const issueDate = formatDate(order.createdAt ?? order.date);

      const normalizedItems = normalizeOrderLineItems({
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        customer: order.customer,
        orderId: order.orderId,
      });

      const {
        isCOD,
        itemsTotal,
        discount,
        couponCode,
        shipping,
        codCharge,
        taxableValue,
        gstAmount,
        gstRate,
        grandTotal,
      } = computeInvoiceTotals(order, normalizedItems);

      const headerTop = 46;
      if (logoPath) {
        doc.image(logoPath, left, headerTop, { width: 48, height: 48 });
      }

      doc
        .font(boldFont)
        .fontSize(20)
        .fillColor(brandColor)
        .text(seller.legalName, left + 58, headerTop + 4, { width: 260 })
        .font(regularFont)
        .fontSize(10)
        .fillColor(mutedColor)
        .text(seller.tagline, left + 58, headerTop + 24, { width: 260 })
        .text(seller.address, left + 58, headerTop + 38, { width: 260 });

      const sellerMeta = [
        seller.gstin ? `GSTIN: ${seller.gstin}` : '',
        seller.state,
      ]
        .filter(Boolean)
        .join(' | ');
      if (sellerMeta) {
        doc.text(sellerMeta, left + 58, headerTop + 52, { width: 260 });
      }

      const sellerContact = [seller.phone, seller.email].filter(Boolean).join(' | ');
      if (sellerContact) {
        doc.text(sellerContact, left + 58, headerTop + 66, { width: 260 });
      }

      doc
        .font(boldFont)
        .fontSize(28)
        .fillColor(brandColor)
        .text('INVOICE', right - 170, headerTop + 6, { width: 170, align: 'right' });

      doc
        .font(regularFont)
        .fontSize(10)
        .fillColor(mutedColor)
        .text(`Invoice No: ${invoiceNumber}`, right - 230, headerTop + 40, {
          width: 230,
          align: 'right',
        })
        .text(`Date: ${issueDate}`, right - 230, headerTop + 55, {
          width: 230,
          align: 'right',
        })
        .text(
          `Status: ${(order.status || 'placed').replace(/_/g, ' ')}`,
          right - 230,
          headerTop + 70,
          { width: 230, align: 'right' },
        );

      const billingTop = 155;
      const billBoxHeight = 84;
      const billBoxWidth = contentWidth * 0.63;
      const summaryBoxLeft = left + billBoxWidth + 12;
      const summaryBoxWidth = contentWidth - billBoxWidth - 12;

      doc.rect(left, billingTop, billBoxWidth, billBoxHeight).strokeColor(borderColor).stroke();
      doc
        .rect(summaryBoxLeft, billingTop, summaryBoxWidth, billBoxHeight)
        .strokeColor(borderColor)
        .stroke();

      const footerBaselineY = pageHeight - 42;
      const notesHeight = 68 + CANCELLATION_POLICY_PDF_HEIGHT;
      const summaryHeight = isCOD ? (discount > 0 ? 166 : 146) : discount > 0 ? 146 : 126;
      const gapTableToTotals = 14;
      const gapTotalsToNotes = 12;
      const gapNotesToFooter = 10;

      const tableTop = billingTop + billBoxHeight + 16;
      const tableBottomLimit =
        footerBaselineY -
        gapNotesToFooter -
        notesHeight -
        gapTotalsToNotes -
        summaryHeight -
        gapTableToTotals;
      const usableTableHeight = Math.max(tableBottomLimit - tableTop, 90);

      drawCenteredWatermark(doc, logoPath, {
        topBoundary: tableTop + 6,
        bottomBoundary: tableBottomLimit - 8,
        opacity: 0.06,
      });

      doc
        .font(boldFont)
        .fontSize(10)
        .fillColor(brandColor)
        .text('BILL TO', left + 10, billingTop + 8)
        .text('ORDER DETAILS', summaryBoxLeft + 10, billingTop + 8);

      const address = order.address as OrderAddress | undefined;
      const compactBillTo = buildCompactBillTo(address, order.email);
      const safeIdentityLine = fitSingleLine(
        doc.font(regularFont).fontSize(9.4),
        compactBillTo.identity,
        billBoxWidth - 20,
      );
      const safeAddressLine = fitSingleLine(
        doc.font(regularFont).fontSize(9.4),
        compactBillTo.address,
        billBoxWidth - 20,
      );

      doc
        .font(regularFont)
        .fontSize(9.4)
        .fillColor('#111827')
        .text(safeIdentityLine, left + 10, billingTop + 24, {
          width: billBoxWidth - 20,
          lineBreak: false,
        })
        .text(safeAddressLine, left + 10, billingTop + 42, {
          width: billBoxWidth - 20,
          lineBreak: false,
        });

      const safeOrderId = fitSingleLine(
        doc.font(regularFont).fontSize(9.4),
        String(order.orderId),
        summaryBoxWidth - 64,
      );

      doc
        .font(regularFont)
        .fontSize(9.4)
        .fillColor('#111827')
        .text(`Order ID: ${safeOrderId}`, summaryBoxLeft + 10, billingTop + 24, {
          width: summaryBoxWidth - 20,
          lineBreak: false,
        })
        .text(`Items: ${invoiceItemCount(normalizedItems)}`, summaryBoxLeft + 10, billingTop + 40, {
          width: summaryBoxWidth - 20,
          lineBreak: false,
        })
        .text(
          `Payment: ${isCOD ? 'COD' : 'PREPAID'}`,
          summaryBoxLeft + 10,
          billingTop + 56,
          { width: summaryBoxWidth - 20, lineBreak: false },
        );

      const headerRowHeight = 26;
      const minRowHeight = 16;
      const maxRowHeight = 24;
      const rowsCount = Math.max(normalizedItems.length, 1);

      const fitRowHeight = Math.floor((usableTableHeight - headerRowHeight) / rowsCount);
      const rowHeight = Math.max(minRowHeight, Math.min(maxRowHeight, fitRowHeight));

      const maxRowsByHeight = Math.max(
        Math.floor((usableTableHeight - headerRowHeight) / rowHeight),
        1,
      );

      const renderAllRows = normalizedItems.length <= maxRowsByHeight;
      let displayItems = renderAllRows
        ? [...normalizedItems]
        : normalizedItems.slice(0, Math.max(maxRowsByHeight - 1, 1));
      let hiddenCount = Math.max(normalizedItems.length - displayItems.length, 0);

      while (true) {
        const provisionalRowsDrawn = displayItems.length + (hiddenCount > 0 ? 1 : 0);
        const provisionalTableOuterHeight = headerRowHeight + provisionalRowsDrawn * rowHeight;
        const provisionalTotalsTop = tableTop + provisionalTableOuterHeight + gapTableToTotals;
        const provisionalNotesTop = footerBaselineY - gapNotesToFooter - notesHeight;
        const maxAllowedTotalsTop = provisionalNotesTop - gapTotalsToNotes - summaryHeight;

        if (provisionalTotalsTop <= maxAllowedTotalsTop || displayItems.length <= 1) break;

        displayItems = displayItems.slice(0, -1);
        hiddenCount = Math.max(normalizedItems.length - displayItems.length, 0);
      }

      const tablePaddingX = 10;
      const tLeft = left + tablePaddingX;
      const tRight = right - tablePaddingX;
      const colSrWidth = 34;
      const colQtyWidth = 48;
      const colUnitWidth = 108;
      const colAmountWidth = 114;
      const colGap = 10;

      const colAmountX = tRight - colAmountWidth;
      const colUnitX = colAmountX - colGap - colUnitWidth;
      const colQtyX = colUnitX - colGap - colQtyWidth;
      const colSrX = tLeft;
      const colDescX = colSrX + colSrWidth + colGap;
      const colDescWidth = Math.max(colQtyX - colGap - colDescX, 120);

      fillRectSoft(doc, left, tableTop, contentWidth, headerRowHeight, headerBg, 0.45);

      doc
        .font(boldFont)
        .fontSize(9.8)
        .fillColor(brandColor)
        .text('#', colSrX, tableTop + 8, { width: colSrWidth, align: 'center' })
        .text('Description', colDescX, tableTop + 8, { width: colDescWidth })
        .text('Qty', colQtyX, tableTop + 8, { width: colQtyWidth, align: 'right' })
        .text('Unit Price', colUnitX, tableTop + 8, { width: colUnitWidth, align: 'right' })
        .text('Amount', colAmountX, tableTop + 8, { width: colAmountWidth, align: 'right' });

      const rowFontSize = rowHeight <= 18 ? 8.8 : 9.4;
      const rowTextY = Math.max(Math.floor((rowHeight - rowFontSize) / 2), 3);

      const drawColumnDividers = (bottomY: number) => {
        const dividerXs = [
          colDescX - colGap / 2,
          colQtyX - colGap / 2,
          colUnitX - colGap / 2,
          colAmountX - colGap / 2,
        ];
        dividerXs.forEach(x => {
          doc
            .moveTo(x, tableTop)
            .lineTo(x, bottomY)
            .lineWidth(0.35)
            .strokeColor(borderColor)
            .stroke();
        });
      };

      displayItems.forEach((item, index) => {
        const y = tableTop + headerRowHeight + index * rowHeight;

        if (index % 2 === 0) {
          fillRectSoft(doc, left, y, contentWidth, rowHeight, stripeBg, 0.22);
        }

        const description = item.details ? `${item.title} (${item.details})` : item.title;

        doc
          .font(regularFont)
          .fontSize(rowFontSize)
          .fillColor('#111827')
          .text(String(item.srNo), colSrX, y + rowTextY, {
            width: colSrWidth,
            align: 'center',
            lineBreak: false,
          })
          .text(fitSingleLine(doc, description, colDescWidth), colDescX, y + rowTextY, {
            width: colDescWidth,
            lineBreak: false,
          })
          .text(
            fitSingleLine(doc, String(item.quantity), colQtyWidth),
            colQtyX,
            y + rowTextY,
            { width: colQtyWidth, align: 'right', lineBreak: false },
          )
          .text(
            fitSingleLine(doc, formatCurrency(item.unitPrice), colUnitWidth),
            colUnitX,
            y + rowTextY,
            { width: colUnitWidth, align: 'right', lineBreak: false },
          )
          .text(
            fitSingleLine(doc, formatCurrency(item.lineTotal), colAmountWidth),
            colAmountX,
            y + rowTextY,
            { width: colAmountWidth, align: 'right', lineBreak: false },
          );

        doc
          .moveTo(left, y + rowHeight)
          .lineTo(right, y + rowHeight)
          .lineWidth(0.45)
          .strokeColor(borderColor)
          .stroke();
      });

      let rowsDrawn = displayItems.length;
      if (hiddenCount > 0) {
        const y = tableTop + headerRowHeight + rowsDrawn * rowHeight;
        fillRectSoft(doc, left, y, contentWidth, rowHeight, stripeBg, 0.22);
        doc
          .font(regularFont)
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`+ ${hiddenCount} more item(s) included in totals`, colDescX, y + rowTextY, {
            width: colDescWidth,
            lineBreak: false,
          });
        rowsDrawn += 1;
      }

      const tableOuterHeight = headerRowHeight + rowsDrawn * rowHeight;
      drawColumnDividers(tableTop + tableOuterHeight);
      doc.rect(left, tableTop, contentWidth, tableOuterHeight).lineWidth(1).strokeColor(borderColor).stroke();

      const totalsTop = tableTop + tableOuterHeight + gapTableToTotals;
      const footerY = pageHeight - doc.page.margins.bottom - 16;
      const notesTop = footerY - gapNotesToFooter - notesHeight;

      if (normalizedItems.length === 0) {
        doc
          .font(regularFont)
          .fontSize(9.4)
          .fillColor(mutedColor)
          .text('No items found for this order.', colDescX, tableTop + headerRowHeight + rowTextY, {
            width: colDescWidth,
          });
      }

      const totalsWidth = 250;
      const totalsLeft = right - totalsWidth;

      doc.rect(totalsLeft, totalsTop, totalsWidth, summaryHeight).lineWidth(1).strokeColor(borderColor).stroke();

      const drawTotalRow = (label: string, value: string, y: number, bold = false) => {
        doc
          .font(bold ? boldFont : regularFont)
          .fontSize(10)
          .fillColor(bold ? brandColor : '#111827')
          .text(label, totalsLeft + 12, y, { width: 120 })
          .text(value, totalsLeft + 130, y, { width: 108, align: 'right' });
      };

      let totalRowY = totalsTop + 14;
      drawTotalRow('Items total (incl. GST)', formatCurrency(itemsTotal), totalRowY);
      totalRowY += 20;
      if (discount > 0) {
        drawTotalRow(
          `Discount${couponCode ? ` (${couponCode})` : ''}`,
          formatCurrency(-discount),
          totalRowY,
        );
        totalRowY += 20;
      }
      drawTotalRow(
        `GST (${(gstRate * 100).toFixed(0)}%) included`,
        formatCurrency(gstAmount),
        totalRowY,
      );
      totalRowY += 20;
      drawTotalRow('Taxable value', formatCurrency(taxableValue), totalRowY);
      totalRowY += 20;
      drawTotalRow(
        'Shipping',
        shipping === 0 ? 'Free' : formatCurrency(shipping),
        totalRowY,
      );
      totalRowY += 20;
      if (isCOD) {
        drawTotalRow('COD Charges', formatCurrency(codCharge), totalRowY);
        totalRowY += 20;
      }

      doc
        .moveTo(totalsLeft + 12, totalRowY)
        .lineTo(totalsLeft + totalsWidth - 12, totalRowY)
        .lineWidth(0.7)
        .strokeColor(borderColor)
        .stroke();

      drawTotalRow('Total', formatCurrency(grandTotal), totalRowY + 6, true);

      doc
        .font(regularFont)
        .fontSize(9)
        .fillColor(mutedColor)
        .text(`Order ID: ${order.orderId}`, left, notesTop)
        .text(`Payment Terms: ${isCOD ? 'Cash on Delivery' : 'Paid Online'}`, left, notesTop + 14)
        .text('All product prices are inclusive of GST.', left, notesTop + 28, {
          width: contentWidth * 0.75,
        })
        .text(
          'This is a computer-generated invoice and does not require a signature.',
          left,
          notesTop + 42,
          { width: contentWidth * 0.75 },
        );

      const policyStartY = notesTop + 58;
      drawCancellationPolicyOnInvoice(doc, {
        left,
        startY: policyStartY,
        width: contentWidth * 0.92,
        regularFont,
        boldFont,
        brandColor,
        mutedColor,
      });

      const footerText = 'Thank you for choosing Sitara Vastram';
      doc.font(boldFont).fontSize(10).fillColor(brandColor);
      const footerTextWidth = doc.widthOfString(footerText);
      const footerX = left + Math.max((contentWidth - footerTextWidth) / 2, 0);
      doc.text(footerText, footerX, footerY, { lineBreak: false });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
