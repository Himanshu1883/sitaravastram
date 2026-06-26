import { useState } from 'react';
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import type { ProductCustomField, ProductCustomFieldType } from '../../types';
import { uploadMedia, mediaUrl } from '../../lib/api';
import { defaultValueForFieldType, MEDIA_LIMITS, validateMediaFile } from '../../lib/admin/mediaValidation';
import { slugify } from '../../lib/admin/productUtils';

const FIELD_TYPES: { value: ProductCustomFieldType; label: string }[] = [
  { value: 'text', label: 'Short text' },
  { value: 'textarea', label: 'Long text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes / No' },
  { value: 'list', label: 'Bullet list' },
  { value: 'url', label: 'Link' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
];

function newField(order: number): ProductCustomField {
  return {
    id: crypto.randomUUID(),
    label: '',
    key: '',
    type: 'text',
    value: '',
    showOnStorefront: true,
    order,
  };
}

export default function ProductCustomFieldsEditor({
  fields,
  onChange,
  disabled,
}: {
  fields: ProductCustomField[];
  onChange: (fields: ProductCustomField[]) => void;
  disabled?: boolean;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const updateField = (id: string, patch: Partial<ProductCustomField>) => {
    onChange(
      fields.map(f => {
        if (f.id !== id) return f;
        const next = { ...f, ...patch };
        if (patch.label !== undefined && !patch.key) {
          next.key = slugify(patch.label);
        }
        return next;
      }),
    );
  };

  const changeType = (id: string, type: ProductCustomFieldType) => {
    updateField(id, { type, value: defaultValueForFieldType(type) });
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next.map((f, i) => ({ ...f, order: i })));
  };

  const removeField = (id: string) => {
    onChange(fields.filter(f => f.id !== id).map((f, i) => ({ ...f, order: i })));
  };

  const addField = () => {
    if (fields.length >= 25) {
      setError('Maximum 25 custom fields per product.');
      return;
    }
    setError('');
    onChange([...fields, newField(fields.length)]);
  };

  const handleMediaUpload = async (
    field: ProductCustomField,
    file: File,
    kind: 'image' | 'video',
  ) => {
    const check = validateMediaFile(file, kind);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError('');
    setUploadingId(field.id);
    try {
      const { url } = await uploadMedia(file);
      updateField(field.id, { value: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-rosegold-600">
          Additional fields
        </p>
        <button
          type="button"
          onClick={addField}
          disabled={disabled || fields.length >= 25}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-rosegold-300 px-3 py-1.5 text-xs font-semibold text-rosegold-600 transition-colors hover:bg-rosegold-50 disabled:opacity-50"
        >
          <Plus size={14} />
          Add field
        </button>
      </div>

      <p className="mb-4 text-xs text-gray-500">
        Add extra product details shown on the storefront product page. Works for new and edited
        products.
      </p>

      {error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-8 text-center text-sm text-gray-500">
          No extra fields yet. Click &quot;Add field&quot; to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Label
                    </label>
                    <input
                      value={field.label}
                      onChange={e => updateField(field.id, { label: e.target.value })}
                      disabled={disabled}
                      className="input-field"
                      placeholder="e.g. Embroidery type"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Type
                    </label>
                    <select
                      value={field.type}
                      onChange={e => changeType(field.id, e.target.value as ProductCustomFieldType)}
                      disabled={disabled}
                      className="input-field"
                    >
                      {FIELD_TYPES.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1 pt-6">
                  <button
                    type="button"
                    onClick={() => moveField(index, -1)}
                    disabled={disabled || index === 0}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveField(index, 1)}
                    disabled={disabled || index === fields.length - 1}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    disabled={disabled}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove field"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Value
                </label>
                {field.type === 'textarea' && (
                  <textarea
                    value={String(field.value ?? '')}
                    onChange={e => updateField(field.id, { value: e.target.value })}
                    disabled={disabled}
                    className="input-field min-h-[88px]"
                    placeholder="Enter details…"
                  />
                )}
                {field.type === 'text' && (
                  <input
                    value={String(field.value ?? '')}
                    onChange={e => updateField(field.id, { value: e.target.value })}
                    disabled={disabled}
                    className="input-field"
                    placeholder="Enter value…"
                  />
                )}
                {field.type === 'number' && (
                  <input
                    type="number"
                    value={Number(field.value) || ''}
                    onChange={e => updateField(field.id, { value: Number(e.target.value) })}
                    disabled={disabled}
                    className="input-field"
                  />
                )}
                {field.type === 'boolean' && (
                  <label className="flex items-center gap-2 text-sm text-navy-700">
                    <input
                      type="checkbox"
                      checked={Boolean(field.value)}
                      onChange={e => updateField(field.id, { value: e.target.checked })}
                      disabled={disabled}
                      className="rounded border-gray-300 text-rosegold-500"
                    />
                    Yes
                  </label>
                )}
                {field.type === 'list' && (
                  <input
                    value={Array.isArray(field.value) ? field.value.join(', ') : String(field.value ?? '')}
                    onChange={e =>
                      updateField(field.id, {
                        value: e.target.value
                          .split(',')
                          .map(s => s.trim())
                          .filter(Boolean),
                      })
                    }
                    disabled={disabled}
                    className="input-field"
                    placeholder="Item one, item two, item three"
                  />
                )}
                {field.type === 'url' && (
                  <input
                    type="url"
                    value={String(field.value ?? '')}
                    onChange={e => updateField(field.id, { value: e.target.value })}
                    disabled={disabled}
                    className="input-field"
                    placeholder="https://…"
                  />
                )}
                {(field.type === 'image' || field.type === 'video') && (
                  <div className="space-y-2">
                    {typeof field.value === 'string' && field.value && (
                      <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        {field.type === 'image' ? (
                          <img
                            src={mediaUrl(field.value)}
                            alt=""
                            className="max-h-32 w-full object-contain"
                          />
                        ) : (
                          <video
                            src={mediaUrl(field.value)}
                            controls
                            className="max-h-32 w-full"
                          />
                        )}
                      </div>
                    )}
                    <label
                      className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 ${
                        disabled || uploadingId === field.id
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:bg-gray-50'
                      }`}
                    >
                      {uploadingId === field.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ImagePlus size={16} />
                      )}
                      {uploadingId === field.id
                        ? 'Uploading…'
                        : field.value
                          ? `Replace ${field.type}`
                          : `Upload ${field.type}`}
                      <input
                        type="file"
                        accept={MEDIA_LIMITS[field.type].accept}
                        className="hidden"
                        disabled={disabled || uploadingId === field.id}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload(field, file, field.type as 'image' | 'video');
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-400">{MEDIA_LIMITS[field.type].label}</p>
                  </div>
                )}
              </div>

              <label className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={field.showOnStorefront}
                  onChange={e => updateField(field.id, { showOnStorefront: e.target.checked })}
                  disabled={disabled}
                  className="rounded border-gray-300 text-rosegold-500"
                />
                Show on product page
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
