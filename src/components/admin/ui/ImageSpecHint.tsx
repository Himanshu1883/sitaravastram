import { Info } from 'lucide-react';
import {
  HOMEPAGE_IMAGE_SPECS,
  type HomepageImageSpecKey,
} from '../../../lib/admin/homepageSpecs';

export default function ImageSpecHint({ specKey }: { specKey: HomepageImageSpecKey }) {
  const spec = HOMEPAGE_IMAGE_SPECS[specKey];

  return (
    <div className="rounded-xl border border-rosegold-100 bg-rosegold-50/40 px-3 py-2.5 text-xs text-gray-600 space-y-1">
      <div className="flex items-center gap-1.5 font-semibold text-rosegold-800">
        <Info size={13} className="flex-shrink-0" />
        Image spec — {spec.label}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
        <span>
          <span className="text-gray-400">Aspect:</span> {spec.aspect}
        </span>
        <span>
          <span className="text-gray-400">Size:</span> {spec.recommended}
          {spec.minSize ? ` (min ${spec.minSize})` : ''}
        </span>
        <span>
          <span className="text-gray-400">Max:</span> {spec.maxFile}
        </span>
        <span>
          <span className="text-gray-400">Format:</span> {spec.format}
        </span>
        <span className="col-span-2 sm:col-span-3">
          <span className="text-gray-400">CDN:</span> {spec.variant}
        </span>
      </div>
      <p className="text-gray-500 leading-relaxed pt-0.5">{spec.cropTip}</p>
    </div>
  );
}
