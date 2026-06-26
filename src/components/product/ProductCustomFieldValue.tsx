import type { ProductCustomField } from '../../types';
import { mediaUrl } from '../../lib/api';

export default function ProductCustomFieldValue({ field }: { field: ProductCustomField }) {
  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <p className="font-body text-sm leading-relaxed text-gray-700">
          {field.type === 'url' && typeof field.value === 'string' ? (
            <a
              href={field.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rosegold-600 underline-offset-2 hover:underline"
            >
              {field.value}
            </a>
          ) : (
            String(field.value ?? '')
          )}
        </p>
      );
    case 'textarea':
      return (
        <p className="whitespace-pre-line font-body text-sm leading-relaxed text-gray-700">
          {String(field.value ?? '')}
        </p>
      );
    case 'number':
      return (
        <p className="font-body text-sm tabular-nums text-gray-700">{String(field.value ?? '')}</p>
      );
    case 'boolean':
      return (
        <p className="font-body text-sm text-gray-700">{field.value ? 'Yes' : 'No'}</p>
      );
    case 'list': {
      const items = Array.isArray(field.value) ? field.value : [];
      if (!items.length) return null;
      return (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 font-body text-sm text-gray-700">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-navy-700" />
              {item}
            </li>
          ))}
        </ul>
      );
    }
    case 'image':
      if (typeof field.value !== 'string' || !field.value) return null;
      return (
        <img
          src={mediaUrl(field.value)}
          alt={field.label}
          className="max-h-80 w-full rounded-sm object-contain"
        />
      );
    case 'video':
      if (typeof field.value !== 'string' || !field.value) return null;
      return (
        <video
          src={mediaUrl(field.value)}
          controls
          className="max-h-80 w-full rounded-sm bg-black"
        />
      );
    default:
      return null;
  }
}
