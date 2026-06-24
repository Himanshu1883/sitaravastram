import { VisaFlatRoundedIcon, MastercardFlatRoundedIcon } from 'react-svg-credit-card-payment-icons';

function UpiIcon({ width = 60 }: { width?: number }) {
  const h = Math.round((width / 780) * 500);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 780 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="UPI"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#ffffff" />
      <rect x="1" y="1" width="778" height="498" rx="39" stroke="#E5E7EB" strokeWidth="2" />

      <g transform="translate(390,250)" textAnchor="middle">
        <text
          x="-120"
          y="0"
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fontSize="200"
          dominantBaseline="middle"
          fill="#097939"
        >
          U
        </text>
        <text
          x="10"
          y="0"
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fontSize="200"
          dominantBaseline="middle"
          fill="#F26522"
        >
          P
        </text>
        <text
          x="130"
          y="0"
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fontSize="200"
          dominantBaseline="middle"
          fill="#097939"
        >
          I
        </text>
      </g>

      <path
        d="M430 100 L370 270 L415 270 L350 400 L480 220 L435 220 Z"
        fill="#097939"
        opacity="0.12"
      />
    </svg>
  );
}

function RazorpayIcon({ width = 60 }: { width?: number }) {
  const h = Math.round((width / 780) * 500);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 780 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Razorpay"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#072654" />

      <g transform="translate(130, 90)">
        <path d="M120 0 L0 200 L80 200 L0 320 L200 120 L120 120 Z" fill="#2DB8C5" />
      </g>

      <text
        x="310"
        y="285"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="98"
        fill="#ffffff"
        dominantBaseline="middle"
        letterSpacing="-2"
      >
        razorpay
      </text>
    </svg>
  );
}

function CodIcon({ width = 60 }: { width?: number }) {
  const h = Math.round((width / 780) * 500);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 780 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cash on Delivery"
      role="img"
    >
      <rect width="780" height="500" rx="40" fill="#F9FAFB" />
      <rect x="1" y="1" width="778" height="498" rx="39" stroke="#E5E7EB" strokeWidth="2" />

      <g transform="translate(80, 100)">
        <rect x="0" y="80" width="360" height="180" rx="12" fill="#1a2744" />
        <path d="M360 140 L360 260 L480 260 L480 170 L430 140 Z" fill="#1a2744" />
        <path d="M368 148 L368 220 L470 220 L470 175 L430 148 Z" fill="#93c5fd" />
        <circle cx="100" cy="270" r="40" fill="#374151" />
        <circle cx="100" cy="270" r="18" fill="#9ca3af" />
        <circle cx="410" cy="270" r="40" fill="#374151" />
        <circle cx="410" cy="270" r="18" fill="#9ca3af" />
        <text
          x="140"
          y="200"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="110"
          fill="#c9956b"
          dominantBaseline="middle"
        >
          ₹
        </text>
      </g>

      <text
        x="390"
        y="430"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900"
        fontSize="72"
        fill="#1a2744"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="6"
      >
        CASH ON DELIVERY
      </text>
    </svg>
  );
}

interface PaymentIconsProps {
  iconWidth?: number;
  showLabels?: boolean;
  className?: string;
}

export default function PaymentIcons({
  iconWidth = 52,
  showLabels = false,
  className = '',
}: PaymentIconsProps) {
  const icons = [
    { label: 'Visa', node: <VisaFlatRoundedIcon width={iconWidth} /> },
    { label: 'Mastercard', node: <MastercardFlatRoundedIcon width={iconWidth} /> },
    { label: 'UPI', node: <UpiIcon width={iconWidth} /> },
    { label: 'Razorpay', node: <RazorpayIcon width={iconWidth} /> },
    { label: 'Cash on Delivery', node: <CodIcon width={iconWidth} /> },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${className}`}>
      {icons.map(({ label, node }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span
            aria-label={label}
            title={label}
            className="inline-flex items-center transition-opacity hover:opacity-90"
          >
            {node}
          </span>
          {showLabels && (
            <span className="font-body text-[9px] tracking-wide text-white/40">{label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export { UpiIcon, RazorpayIcon, CodIcon };
export { VisaFlatRoundedIcon as VisaIcon, MastercardFlatRoundedIcon as MastercardIcon };
