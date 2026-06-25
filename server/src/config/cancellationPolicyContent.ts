import type PDFKit from 'pdfkit';

export const CANCELLATION_POLICY_PDF_HEIGHT = 58;

const POLICY_LINES = [
  'Returns & Cancellation Policy',
  '• Returns accepted within 7 days of delivery for unused items with original tags.',
  '• Refunds are processed within 5–7 business days after quality inspection.',
  '• COD orders: refund via UPI or bank transfer after pickup confirmation.',
  '• For exchanges or cancellations before shipping, contact care@sitaravastram.com.',
];

export function drawCancellationPolicyOnInvoice(
  doc: PDFKit.PDFDocument,
  options: {
    left: number;
    startY: number;
    width: number;
    regularFont: string;
    boldFont: string;
    brandColor: string;
    mutedColor: string;
  },
) {
  const { left, startY, width, regularFont, boldFont, brandColor, mutedColor } = options;
  let y = startY;

  POLICY_LINES.forEach((line, index) => {
    const isTitle = index === 0;
    doc
      .font(isTitle ? boldFont : regularFont)
      .fontSize(isTitle ? 9.5 : 8.5)
      .fillColor(isTitle ? brandColor : mutedColor)
      .text(line, left, y, { width, lineGap: 1 });
    y += isTitle ? 14 : 12;
  });
}
