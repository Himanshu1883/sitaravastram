import ExcelJS from 'exceljs';
import { BRAND_NAME, STORE_CONTACT, storeAddressLine, storeContactLine } from '../brand';
import type { InvoiceData } from './types';
import { formatInvoiceAmount, formatInvoiceDate, paymentMethodLabel } from './format';
import { downloadBlob } from './download';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFD3D3D3' },
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell(cell => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, size: 10 };
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: 'middle' };
  });
}

function styleBodyCell(cell: ExcelJS.Cell, alignRight = false) {
  cell.border = THIN_BORDER;
  cell.font = { size: 10 };
  cell.alignment = { vertical: 'middle', horizontal: alignRight ? 'right' : 'left' };
}

export async function buildInvoiceWorkbook(data: InvoiceData): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Invoice', {
    pageSetup: { paperSize: 9, orientation: 'portrait' },
  });

  ws.columns = [
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
  ];

  ws.mergeCells('A1:D4');
  const companyCell = ws.getCell('A1');
  companyCell.value = {
    richText: [
      { text: `${BRAND_NAME}\n`, font: { bold: true, size: 14 } },
      { text: `${STORE_CONTACT.line1}\n`, font: { size: 10 } },
      { text: `${storeAddressLine()}\n`, font: { size: 10 } },
      { text: `Phone: ${STORE_CONTACT.phone}`, font: { size: 10 } },
    ],
  };
  companyCell.alignment = { vertical: 'top', wrapText: true };

  ws.mergeCells('F1:H2');
  const titleCell = ws.getCell('F1');
  titleCell.value = 'INVOICE';
  titleCell.font = { bold: true, size: 22, color: { argb: 'FF8C8C8C' } };
  titleCell.alignment = { horizontal: 'right', vertical: 'top' };

  ws.mergeCells('F3:G3');
  ws.mergeCells('H3:H3');
  const metaHeader = ws.getRow(3);
  metaHeader.getCell(6).value = 'INVOICE #';
  metaHeader.getCell(7).value = '';
  metaHeader.getCell(8).value = 'DATE';
  styleHeaderRow(metaHeader);
  metaHeader.getCell(6).alignment = { horizontal: 'center' };
  metaHeader.getCell(8).alignment = { horizontal: 'center' };

  ws.mergeCells('F4:G4');
  const metaRow = ws.getRow(4);
  metaRow.getCell(6).value = data.invoiceNumber;
  metaRow.getCell(8).value = formatInvoiceDate(data.invoiceDate);
  [6, 7, 8].forEach(c => styleBodyCell(metaRow.getCell(c), c === 8));
  metaRow.getCell(6).alignment = { horizontal: 'center' };
  metaRow.getCell(8).alignment = { horizontal: 'center' };

  const billToHeaderRow = 6;
  ws.mergeCells(`A${billToHeaderRow}:D${billToHeaderRow}`);
  const billToHeader = ws.getRow(billToHeaderRow);
  billToHeader.getCell(1).value = 'BILL TO';
  styleHeaderRow(billToHeader);

  const billToLines = [data.billTo.identity, data.billTo.address].filter(Boolean);

  let rowIdx = billToHeaderRow + 1;
  for (const line of billToLines) {
    ws.mergeCells(`A${rowIdx}:D${rowIdx}`);
    const row = ws.getRow(rowIdx);
    row.getCell(1).value = line;
    row.getCell(1).font = { size: 10 };
    rowIdx += 1;
  }

  rowIdx += 1;
  const tableHeaderRow = rowIdx;
  ws.mergeCells(`A${tableHeaderRow}:G${tableHeaderRow}`);
  const tableHeader = ws.getRow(tableHeaderRow);
  tableHeader.getCell(1).value = 'DESCRIPTION';
  tableHeader.getCell(8).value = 'AMOUNT';
  styleHeaderRow(tableHeader);
  tableHeader.getCell(8).alignment = { horizontal: 'right' };

  rowIdx += 1;
  for (const item of data.lineItems) {
    ws.mergeCells(`A${rowIdx}:G${rowIdx}`);
    const row = ws.getRow(rowIdx);
    const description = item.details
      ? `${item.title} (${item.details}) × ${item.quantity}`
      : `${item.title} × ${item.quantity}`;
    row.getCell(1).value = description;
    row.getCell(8).value = formatInvoiceAmount(item.lineTotal);
    styleBodyCell(row.getCell(1));
    styleBodyCell(row.getCell(8), true);
    rowIdx += 1;
  }

  const emptyRows = Math.max(0, 6 - data.lineItems.length);
  for (let i = 0; i < emptyRows; i++) {
    ws.mergeCells(`A${rowIdx}:G${rowIdx}`);
    const row = ws.getRow(rowIdx);
    styleBodyCell(row.getCell(1));
    styleBodyCell(row.getCell(8), true);
    rowIdx += 1;
  }

  ws.mergeCells(`A${rowIdx}:G${rowIdx}`);
  const totalRow = ws.getRow(rowIdx);
  totalRow.getCell(1).value = 'Thank you for your business!';
  totalRow.getCell(1).font = { italic: true, size: 10 };
  totalRow.getCell(7).value = 'TOTAL';
  totalRow.getCell(7).font = { bold: true, size: 10 };
  totalRow.getCell(8).value = `₹${formatInvoiceAmount(data.totals.grandTotal)}`;
  totalRow.getCell(8).font = { bold: true, size: 10 };
  styleBodyCell(totalRow.getCell(1));
  styleBodyCell(totalRow.getCell(7));
  styleBodyCell(totalRow.getCell(8), true);
  totalRow.getCell(7).alignment = { horizontal: 'right' };
  totalRow.getCell(8).alignment = { horizontal: 'right' };

  const footerRow = rowIdx + 2;
  ws.mergeCells(`A${footerRow}:H${footerRow}`);
  ws.getCell(`A${footerRow}`).value = `Payment: ${paymentMethodLabel(data.paymentMethod)}`;
  ws.getCell(`A${footerRow}`).font = { size: 9 };

  const contactRow = footerRow + 1;
  ws.mergeCells(`A${contactRow}:H${contactRow}`);
  ws.getCell(`A${contactRow}`).value =
    `If you have any questions about this invoice, please contact ${storeContactLine()}`;
  ws.getCell(`A${contactRow}`).font = { size: 9 };
  ws.getCell(`A${contactRow}`).alignment = { horizontal: 'center', wrapText: true };

  // Outline border around line-items block
  for (let r = tableHeaderRow; r <= rowIdx; r++) {
    for (let c = 1; c <= 8; c++) {
      const cell = ws.getRow(r).getCell(c);
      if (!cell.border) styleBodyCell(cell, c === 8);
    }
  }

  void tableHeaderRow;
  return wb;
}

export async function downloadInvoiceExcel(data: InvoiceData) {
  const wb = await buildInvoiceWorkbook(data);
  const buffer = await wb.xlsx.writeBuffer();
  downloadBlob(
    buffer,
    `invoice-${data.invoiceNumber}.xlsx`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
}
