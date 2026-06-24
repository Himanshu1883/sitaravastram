import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { useHomepageAdmin } from '../../../hooks/useHomepageAdmin';
import type { InstagramMeta } from '../../../lib/api';
import AdminCard from '../ui/AdminCard';
import HomepageImageUpload from '../ui/HomepageImageUpload';

type Api = ReturnType<typeof useHomepageAdmin>;
type IgPost = { image: string; url: string };

export default function HomepageInstagramPanel({ api }: { api: Api }) {
  const [posts, setPosts] = useState<IgPost[]>([]);
  const [meta, setMeta] = useState<InstagramMeta>({ handle: '@sitaravastram', profileUrl: 'https://www.instagram.com/sitaravastram/' });
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (api.data) {
      setPosts(api.data.instagramPosts ?? []);
      setMeta(api.data.instagramMeta ?? meta);
      setDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api.data?.instagramPosts, api.data?.instagramMeta]);

  const save = async () => {
    await api.saveBlock('instagramPosts', posts);
    await api.saveBlock('instagramMeta', meta);
    setDirty(false);
    setToast('Instagram section saved');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-4">
      {toast && <div className="text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">{toast}</div>}
      <AdminCard padding="md" className="space-y-3">
        <p className="font-semibold text-navy-700">Profile & heading</p>
        <input
          value={meta.handle}
          onChange={e => { setMeta({ ...meta, handle: e.target.value }); setDirty(true); }}
          className="input-field"
          placeholder="@handle"
        />
        <input
          value={meta.profileUrl}
          onChange={e => { setMeta({ ...meta, profileUrl: e.target.value }); setDirty(true); }}
          className="input-field"
          placeholder="Profile URL"
        />
      </AdminCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.map((post, i) => (
          <AdminCard key={i} padding="sm" className="space-y-2">
            <HomepageImageUpload
              specKey="instagram"
              value={post.image}
              onChange={url => {
                const next = [...posts];
                next[i] = { ...post, image: url };
                setPosts(next);
                setDirty(true);
              }}
              previewClassName="aspect-square"
            />
            <input
              value={post.url}
              onChange={e => {
                const next = [...posts];
                next[i] = { ...post, url: e.target.value };
                setPosts(next);
                setDirty(true);
              }}
              className="input-field text-xs"
              placeholder="Post URL"
            />
          </AdminCard>
        ))}
      </div>
      <button type="button" onClick={save} disabled={!dirty || api.saving} className="btn-primary text-sm inline-flex items-center gap-2">
        {api.saving && <Loader2 size={14} className="animate-spin" />}
        Save Instagram
      </button>
    </div>
  );
}
