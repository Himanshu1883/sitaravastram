import { Check, ChevronRight, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type CheckoutStep = {
  id: number;
  labelKey: string;
  icon: LucideIcon;
};

export default function CheckoutStepper({
  steps,
  currentStep,
}: {
  steps: CheckoutStep[];
  currentStep: number;
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step, i) => (
        <div key={step.id} className="flex flex-shrink-0 items-center gap-2">
          <div
            className={`flex items-center gap-2 ${
              currentStep === step.id
                ? 'text-rosegold-500'
                : currentStep > step.id
                  ? 'text-emerald-600'
                  : 'text-gray-400'
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                currentStep === step.id
                  ? 'border-rosegold-500 bg-rosegold-50'
                  : currentStep > step.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300'
              }`}
            >
              {currentStep > step.id ? <Check size={14} /> : <step.icon size={14} />}
            </div>
            <span className="hidden font-body text-xs font-medium sm:block">
              {t(step.labelKey)}
            </span>
          </div>
          {i < steps.length - 1 && <ChevronRight size={14} className="flex-shrink-0 text-gray-300" />}
        </div>
      ))}
    </div>
  );
}
