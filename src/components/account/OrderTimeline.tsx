import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types';
import {
  ORDER_STATUS_META,
  formatTrackingDate,
  getOrderTrackingSteps,
  trackingProgressPercent,
  type TrackingStepState,
} from '../../lib/account/orderStatus';

function AnimatedTrack({
  progress,
  className,
  trackClassName = 'h-0.5',
  reduceMotion,
}: {
  progress: number;
  className?: string;
  trackClassName?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <div className={`absolute ${className ?? ''}`}>
      <div className={`w-full rounded-full bg-sky-100 ${trackClassName}`} />
      <motion.div
        className={`absolute left-0 top-0 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-emerald-400 ${trackClassName}`}
        initial={{ width: reduceMotion ? `${progress}%` : '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function CompactDot({
  done,
  current,
  reduceMotion,
}: {
  done: boolean;
  current: boolean;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative z-[1] flex h-3 w-3 items-center justify-center">
      {current && !reduceMotion && (
        <span className="absolute inset-0 rounded-full bg-sky-400/40 animate-ping" />
      )}
      <motion.span
        className={`relative block h-2.5 w-2.5 rounded-full border-2 ${
          done
            ? 'border-emerald-500 bg-emerald-500'
            : current
              ? 'border-sky-500 bg-sky-500 shadow-[0_0_0_3px_rgba(56,189,248,0.35)]'
              : 'border-sky-200 bg-white'
        }`}
        animate={
          current && !reduceMotion
            ? { scale: [1, 1.2, 1] }
            : { scale: 1 }
        }
        transition={
          current && !reduceMotion
            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
      />
    </div>
  );
}

function FullStepNode({
  step,
  locale,
  reduceMotion,
}: {
  step: TrackingStepState;
  locale: string;
  reduceMotion: boolean | null;
}) {
  const { t } = useTranslation();
  const Icon = step.icon;
  const done = step.state === 'completed';
  const current = step.state === 'current';
  const upcoming = step.state === 'upcoming';
  const time = formatTrackingDate(step.at, locale);

  return (
    <motion.div
      className="relative z-[1] flex w-1/4 flex-col items-center text-center"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: step.step === 'placed' ? 0 : step.step === 'shipped' ? 0.06 : step.step === 'in_transit' ? 0.12 : 0.18 }}
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        {current && !reduceMotion && (
          <span className="absolute inset-0 rounded-full bg-sky-400/30 animate-ping" />
        )}
        <motion.div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${
            done
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
              : current
                ? 'border-sky-500 bg-sky-500 text-navy-900 shadow-[0_0_0_4px_rgba(56,189,248,0.28)]'
                : 'border-sky-200 bg-white text-gray-400'
          }`}
          animate={
            current && !reduceMotion
              ? { scale: [1, 1.06, 1] }
              : done && !reduceMotion
                ? { scale: 1 }
                : { scale: 1 }
          }
          transition={
            current && !reduceMotion
              ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
              : undefined
          }
        >
          <Icon size={18} strokeWidth={1.75} />
        </motion.div>
      </div>

      <p
        className={`mt-3 font-body text-xs sm:text-sm ${
          current
            ? 'font-bold text-sky-700'
            : upcoming
              ? 'font-medium text-gray-400'
              : 'font-semibold text-navy-800'
        }`}
      >
        {t(step.labelKey)}
      </p>

      {current && (
        <span className="mt-1 inline-flex rounded-full bg-sky-100 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-sky-700">
          {t('account.inProgress')}
        </span>
      )}

      <p
        className={`mt-1 min-h-[2rem] font-body text-[10px] leading-snug sm:text-xs ${
          current ? 'font-medium text-navy-700' : 'text-gray-500'
        }`}
      >
        {time ?? (upcoming ? t('account.noUpdateYet') : t('account.awaitingUpdate'))}
      </p>

      {step.note && (
        <p className="mt-1 line-clamp-2 max-w-[7rem] font-body text-[10px] text-rosegold-600">
          {step.note}
        </p>
      )}
    </motion.div>
  );
}

export default function OrderTimeline({
  order,
  variant = 'full',
}: {
  order: Order;
  variant?: 'full' | 'compact';
}) {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const steps = getOrderTrackingSteps(order);
  const progress = trackingProgressPercent(order);
  const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
  const isTerminal = order.status === 'cancelled' || order.status === 'returned';

  if (isTerminal) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3 text-center">
        <p className="font-body text-sm font-medium text-red-600">
          {t(ORDER_STATUS_META[order.status].labelKey)}
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="mt-3">
        <div className="relative flex items-center justify-between px-0.5">
          <AnimatedTrack
            progress={progress}
            className="left-0 right-0 top-1/2 w-full -translate-y-1/2"
            trackClassName="h-0.5"
            reduceMotion={reduceMotion}
          />
          {steps.map(step => (
            <CompactDot
              key={step.step}
              done={step.state === 'completed'}
              current={step.state === 'current'}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between gap-1">
          {steps.map(step => (
            <span
              key={step.step}
              className={`w-1/4 text-center font-body text-[9px] leading-tight sm:text-[10px] ${
                step.state === 'current'
                  ? 'font-bold text-sky-700'
                  : step.state === 'upcoming'
                    ? 'text-gray-300'
                    : 'font-medium text-navy-700'
              }`}
            >
              {t(step.labelKey)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-start justify-between">
        <AnimatedTrack
          progress={progress}
          className="left-[12%] right-[12%] top-5 w-[76%]"
          trackClassName="h-1"
          reduceMotion={reduceMotion}
        />

        {steps.map(step => (
          <FullStepNode
            key={step.step}
            step={step}
            locale={locale}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}
