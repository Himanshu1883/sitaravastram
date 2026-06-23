import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { formatMarketLabel, getMarketById, markets } from '../../data/markets';
import { selectMarketId, setMarket } from '../../store/currencySlice';
import type { RootState } from '../../store';

type CurrencySelectorVariant = 'desktop' | 'compact' | 'menu';

interface CurrencySelectorProps {
  variant?: CurrencySelectorVariant;
  className?: string;
  onSelect?: () => void;
}

function TriggerChevron({ open, size = 14 }: { open: boolean; size?: number }) {
  return (
    <ChevronDown
      size={size}
      strokeWidth={1.75}
      className={`flex-shrink-0 text-navy-700 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    />
  );
}

export default function CurrencySelector({
  variant = 'desktop',
  className = '',
  onSelect,
}: CurrencySelectorProps) {
  const dispatch = useDispatch();
  const marketId = useSelector((state: RootState) => selectMarketId(state));
  const market = getMarketById(marketId);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSelect = (id: string) => {
    dispatch(setMarket(id));
    setOpen(false);
    onSelect?.();
  };

  const triggerLabel =
    variant === 'compact'
      ? `${market.currencyCode} ${market.currencySymbol}`
      : formatMarketLabel(market);

  const triggerClass =
    variant === 'compact'
      ? 'flex items-center gap-1 px-1 py-2 text-[11px] font-body text-navy-800 hover:text-rosegold-500 transition-colors duration-200'
      : variant === 'menu'
        ? 'flex w-full items-center justify-between gap-2 py-2.5 px-3 text-xs font-body text-navy-800 border border-rosegold-200 rounded-sm hover:border-rosegold-400 transition-colors duration-200'
        : 'flex items-center gap-1.5 text-[13px] font-body text-navy-800 hover:text-rosegold-500 transition-colors duration-200';

  const listItemClass = (selected: boolean) =>
    `flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left font-body transition-colors duration-150 ${
      selected
        ? 'bg-cream-100 font-semibold text-navy-700'
        : 'text-navy-700/90 hover:bg-cream-50'
    }`;

  if (variant === 'menu') {
    return (
      <div ref={rootRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={triggerClass}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="truncate text-left">{triggerLabel}</span>
          <TriggerChevron open={open} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div
                role="listbox"
                className="mt-2 max-h-52 overflow-y-auto rounded-sm border border-rosegold-100 bg-cream-50 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-rosegold-200"
              >
                {markets.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={item.id === marketId}
                    onClick={() => handleSelect(item.id)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-body transition-colors duration-150 ${
                      item.id === marketId
                        ? 'bg-white font-semibold text-navy-700'
                        : 'text-navy-700/90 hover:bg-white/80'
                    }`}
                  >
                    <span className="truncate">{formatMarketLabel(item)}</span>
                    {item.id === marketId && <Check size={14} className="flex-shrink-0 text-rosegold-600" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Change country / currency"
      >
        <span className={variant === 'compact' ? 'whitespace-nowrap' : ''}>{triggerLabel}</span>
        <TriggerChevron open={open} size={variant === 'compact' ? 12 : 14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full z-[70] mt-2 w-[min(18rem,calc(100vw-2rem))] max-h-80 overflow-y-auto rounded-sm border border-rosegold-100 bg-white py-1 shadow-luxury-lg [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-rosegold-200"
          >
            {markets.map(item => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === marketId}
                onClick={() => handleSelect(item.id)}
                className={`${listItemClass(item.id === marketId)} text-sm`}
              >
                <span className="truncate">{formatMarketLabel(item)}</span>
                {item.id === marketId && <Check size={15} className="flex-shrink-0 text-rosegold-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
