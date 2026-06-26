import { ApiError } from '../middleware/errorHandler.js';

export const CUSTOM_FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'boolean',
  'list',
  'url',
  'image',
  'video',
] as const;

export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];

export interface ProductCustomFieldInput {
  id: string;
  label: string;
  key?: string;
  type: CustomFieldType;
  value: unknown;
  showOnStorefront?: boolean;
  order?: number;
}

const MAX_FIELDS = 25;
const MEDIA_URL_RE = /^\/api\/media\/[a-f0-9]{24}$/i;
const URL_RE = /^https?:\/\/.+/i;

function slugifyKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}

function validateValue(type: CustomFieldType, value: unknown): unknown {
  switch (type) {
    case 'text': {
      if (typeof value !== 'string') throw new ApiError(400, 'Text field value must be a string');
      const v = stripHtml(value);
      if (v.length > 500) throw new ApiError(400, 'Text field value is too long (max 500 characters)');
      return v;
    }
    case 'textarea': {
      if (typeof value !== 'string') throw new ApiError(400, 'Textarea field value must be a string');
      const v = stripHtml(value);
      if (v.length > 5000) throw new ApiError(400, 'Textarea value is too long (max 5000 characters)');
      return v;
    }
    case 'number': {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n)) throw new ApiError(400, 'Number field value must be a valid number');
      return n;
    }
    case 'boolean':
      return Boolean(value);
    case 'list': {
      const arr = Array.isArray(value)
        ? value.map(String)
        : String(value ?? '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
      if (arr.length > 20) throw new ApiError(400, 'List field allows at most 20 items');
      return arr.map(stripHtml);
    }
    case 'url': {
      if (typeof value !== 'string' || !URL_RE.test(value.trim())) {
        throw new ApiError(400, 'URL field must start with http:// or https://');
      }
      return value.trim();
    }
    case 'image':
    case 'video': {
      if (typeof value !== 'string' || !MEDIA_URL_RE.test(value)) {
        throw new ApiError(400, `${type} field must use an uploaded media URL`);
      }
      return value;
    }
    default:
      throw new ApiError(400, 'Invalid custom field type');
  }
}

export function validateProductCustomFields(raw: unknown): ProductCustomFieldInput[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) throw new ApiError(400, 'customFields must be an array');
  if (raw.length > MAX_FIELDS) throw new ApiError(400, `At most ${MAX_FIELDS} custom fields allowed`);

  const keys = new Set<string>();
  return raw.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new ApiError(400, `Invalid custom field at index ${index}`);
    }
    const row = item as Record<string, unknown>;
    const label = stripHtml(String(row.label ?? ''));
    if (label.length < 2 || label.length > 80) {
      throw new ApiError(400, 'Custom field label must be 2–80 characters');
    }
    const type = String(row.type ?? '') as CustomFieldType;
    if (!CUSTOM_FIELD_TYPES.includes(type)) {
      throw new ApiError(400, `Invalid custom field type: ${row.type}`);
    }
    const key = slugifyKey(String(row.key || label));
    if (!key) throw new ApiError(400, 'Custom field key could not be generated');
    if (keys.has(key)) throw new ApiError(400, `Duplicate custom field key: ${key}`);
    keys.add(key);

    const id = String(row.id ?? '').trim() || `cf-${index}-${Date.now()}`;
    const value = validateValue(type, row.value);
    const isEmpty =
      value === '' ||
      value === false ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty && type !== 'boolean') {
      throw new ApiError(400, `Custom field "${label}" requires a value`);
    }

    return {
      id,
      label,
      key,
      type,
      value,
      showOnStorefront: row.showOnStorefront !== false,
      order: typeof row.order === 'number' ? row.order : index,
    };
  });
}
