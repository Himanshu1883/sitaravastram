interface SectionCopyFieldsProps {
  title: string;
  values: { overline?: string; title?: string; subtitle?: string; cta?: string };
  onChange: (v: SectionCopyFieldsProps['values']) => void;
  showCta?: boolean;
}

export default function SectionCopyFields({
  title,
  values,
  onChange,
  showCta,
}: SectionCopyFieldsProps) {
  const set = (patch: Partial<typeof values>) => onChange({ ...values, ...patch });

  return (
    <div className="p-4 rounded-xl border border-gray-100 bg-cream-100/30 space-y-3">
      <p className="text-sm font-semibold text-navy-700">{title}</p>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
          Overline
        </label>
        <input
          value={values.overline ?? ''}
          onChange={e => set({ overline: e.target.value })}
          className="input-field text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
          Title
        </label>
        <input
          value={values.title ?? ''}
          onChange={e => set({ title: e.target.value })}
          className="input-field text-sm"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
          Subtitle
        </label>
        <textarea
          value={values.subtitle ?? ''}
          onChange={e => set({ subtitle: e.target.value })}
          className="input-field text-sm min-h-[72px]"
        />
      </div>
      {showCta && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
            CTA label
          </label>
          <input
            value={values.cta ?? ''}
            onChange={e => set({ cta: e.target.value })}
            className="input-field text-sm"
          />
        </div>
      )}
    </div>
  );
}
