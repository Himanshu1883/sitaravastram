import { useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadMedia, mediaUrl } from '../../../lib/api';
import ImageSpecHint from './ImageSpecHint';
import type { HomepageImageSpecKey } from '../../../lib/admin/homepageSpecs';

interface HomepageImageUploadProps {
  specKey: HomepageImageSpecKey;
  value: string;
  onChange: (url: string) => void;
  previewClassName?: string;
  label?: string;
}

export default function HomepageImageUpload({
  specKey,
  value,
  onChange,
  previewClassName = 'aspect-video max-h-40',
  label = 'Image',
}: HomepageImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadMedia(file);
      onChange(url);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <ImageSpecHint specKey={specKey} />
      {value ? (
        <div className={`relative rounded-xl overflow-hidden border border-gray-100 ${previewClassName}`}>
          <img src={mediaUrl(value)} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-rosegold-300 text-sm font-medium text-rosegold-600 hover:bg-rosegold-50 cursor-pointer transition-colors">
        <ImagePlus size={16} />
        {uploading ? 'Uploading…' : value ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={handleUpload}
        />
        {uploading && <Loader2 size={14} className="animate-spin" />}
      </label>
    </div>
  );
}
