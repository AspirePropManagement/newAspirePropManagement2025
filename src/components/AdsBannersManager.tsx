'use client';

import React, { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CreateBannerForm {
  title: string;
  imageBase64: string;
  imageMime: string;
  linkUrl?: string;
  altText?: string;
  displayLocation: 'home_top' | 'home_sidebar' | 'listing_top' | 'listing_sidebar' | 'footer';
  sortOrder: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

interface BannerRow {
  id: number;
  title: string;
  image_base64: string;
  image_mime: string;
  link_url: string | null;
  alt_text: string | null;
  display_location: string;
  sort_order: number;
  is_active: boolean;
  start_at: string | null;
  end_at: string | null;
}

/**
 * AdsBannersManager provides UI to upload and manage ads banners
 * - Image must be 4:1 aspect ratio (leaderboard). Tolerance ±5%.
 * - Stores base64 and MIME type in `ads_banners`.
 */
export function AdsBannersManager() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<CreateBannerForm>({
    title: '',
    imageBase64: '',
    imageMime: '',
    linkUrl: '',
    altText: '',
    displayLocation: 'listing_sidebar',
    sortOrder: 0,
    isActive: true,
    startAt: '',
    endAt: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  React.useEffect(() => {
    void fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      setLoading(true);
      setError(null);
      if (!supabase) throw new Error('Database connection not available');
      const { data, error } = await supabase
        .from('ads_banners')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });
      if (error) throw error;
      setBanners((data as BannerRow[]) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  }

  function withinRatio(width: number, height: number): boolean {
    const ratio = width / height;
    const target = 4 / 1; // 4:1
    const tolerance = 0.05; // 5%
    return Math.abs(ratio - target) <= target * tolerance;
  }

  async function onFileSelected(file: File) {
    setError(null);
    setSuccess(null);
    try {
      const imgUrl = URL.createObjectURL(file);
      const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve({ w: img.width, h: img.height });
        img.onerror = () => reject(new Error('Invalid image'));
        img.src = imgUrl;
      });
      if (!withinRatio(dims.w, dims.h)) {
        throw new Error('Image must be 4:1 ratio (e.g., 1600x400).');
      }

      const base64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, imageBase64: base64, imageMime: file.type }));
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const commaIndex = result.indexOf(',');
        const base64 = commaIndex >= 0 ? result.substring(commaIndex + 1) : result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (!supabase) throw new Error('Database connection not available');
      if (!form.title.trim()) throw new Error('Title is required');
      if (!form.imageBase64) throw new Error('Image is required');

      const payload: any = {
        title: form.title.trim(),
        image_base64: form.imageBase64,
        image_mime: form.imageMime,
        link_url: form.linkUrl || null,
        alt_text: form.altText || null,
        display_location: form.displayLocation,
        sort_order: form.sortOrder,
        is_active: form.isActive,
        start_at: form.startAt ? new Date(form.startAt).toISOString() : null,
        end_at: form.endAt ? new Date(form.endAt).toISOString() : null,
      };

      const { data, error } = await supabase
        .from('ads_banners')
        .insert([payload])
        .select('*')
        .single();
      if (error) throw error;
      setSuccess('Banner uploaded successfully');
      setForm((prev) => ({
        ...prev,
        title: '',
        imageBase64: '',
        imageMime: '',
        linkUrl: '',
        altText: '',
        sortOrder: 0,
        isActive: true,
        startAt: '',
        endAt: ''
      }));
      await fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Failed to upload banner');
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Ads Banners</h1>
        <p className="text-sm text-gray-500">Upload 4:1 banners (image-only, base64 stored)</p>
      </div>

      <form onSubmit={submitForm} className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Banner title"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">Banner Image (4:1)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileSelected(f);
              }}
              className="mt-1 block w-full text-sm text-gray-700"
            />
            <p className="text-xs text-gray-400 mt-1">Required ratio 4:1 (e.g., 1600x400)</p>
          </div>

          {form.imageBase64 && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${form.imageMime};base64,${form.imageBase64}`}
                alt="Preview"
                className="w-full h-auto"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600">Display location</label>
            <select
              value={form.displayLocation}
              onChange={(e) => setForm({ ...form, displayLocation: e.target.value as any })}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="home_top">Home Top</option>
              <option value="home_sidebar">Home Sidebar</option>
              <option value="listing_top">Listing Top</option>
              <option value="listing_sidebar">Listing Sidebar</option>
              <option value="footer">Footer</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600">Sort order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value || '0', 10) })}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center text-xs font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                />
                Active
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-xs text-gray-600 hover:text-gray-800 underline"
          >
            {showAdvanced ? 'Hide' : 'Show'} advanced options
          </button>

          {showAdvanced && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600">Click URL (optional)</label>
                <input
                  type="url"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Alt text (optional)</label>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) => setForm({ ...form, altText: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Accessible description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Start at</label>
                  <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">End at</label>
                  <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Banner'}
          </button>
        </div>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-800 mb-3">Existing Banners</h2>
        {banners.length === 0 ? (
          <p className="text-sm text-gray-500">No banners yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {banners.map((b) => (
              <li key={b.id} className="py-3 flex items-center gap-3">
                <div className="w-36 overflow-hidden rounded border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`data:${b.image_mime};base64,${b.image_base64}`} alt={b.alt_text || ''} className="w-full h-auto" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{b.title}</div>
                  <div className="text-xs text-gray-500 truncate">{b.display_location} · order {b.sort_order} · {b.is_active ? 'active' : 'inactive'}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


