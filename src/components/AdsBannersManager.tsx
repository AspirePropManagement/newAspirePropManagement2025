'use client';

import React, { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ScrollArrow } from './ScrollArrow';
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  XMarkIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon,
  LinkIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface CreateBannerForm {
  title: string;
  imageBase64: string;
  imageMime: string;
  linkUrl?: string;
  altText?: string;
  displayLocation: 'home_top' | 'home_sidebar' | 'listing_top' | 'listing_sidebar' | 'footer' | 'home_middle';
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
  created_at: string;
  updated_at: string;
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
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState<CreateBannerForm>({
    title: '',
    imageBase64: '',
    imageMime: '',
    linkUrl: '',
    altText: '',
    displayLocation: 'home_top',
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
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          if (!withinRatio(img.width, img.height)) {
            setError('Image must be 4:1 aspect ratio (e.g., 1600x400). Current: ' + img.width + 'x' + img.height);
            setIsUploading(false);
            return;
          }
          const mime = file.type;
          setForm({ ...form, imageBase64: base64, imageMime: mime });
          setIsUploading(false);
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      setIsUploading(false);
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.imageBase64) {
      setError('Image is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (!supabase) throw new Error('Database connection not available');

      const { data, error } = await supabase
        .from('ads_banners')
        .insert([{
          title: form.title.trim(),
          image_base64: form.imageBase64.split(',')[1],
          image_mime: form.imageMime,
          link_url: form.linkUrl?.trim() || null,
          alt_text: form.altText?.trim() || null,
          display_location: form.displayLocation,
          sort_order: form.sortOrder,
          is_active: form.isActive,
          start_at: form.startAt || null,
          end_at: form.endAt || null
        }])
        .select();

      if (error) throw error;

      setSuccess('Banner uploaded successfully!');
      setForm({
        title: '',
        imageBase64: '',
        imageMime: '',
        linkUrl: '',
        altText: '',
        displayLocation: 'home_top',
        sortOrder: 0,
        isActive: true,
        startAt: '',
        endAt: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchBanners();
    } catch (err: any) {
      setError(err.message || 'Failed to upload banner');
    } finally {
      setLoading(false);
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };


  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center px-3 sm:px-0">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
          <PhotoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Ads Banners Manager
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Upload and manage promotional banners with 4:1 aspect ratio. Create engaging visual content for your real estate platform.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
            Upload New Banner
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Create a new promotional banner for your platform</p>
        </div>

        <form onSubmit={submitForm} className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start sm:items-center animate-in slide-in-from-top-2 duration-300">
              <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm sm:text-base text-red-700 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start sm:items-center animate-in slide-in-from-top-2 duration-300">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm sm:text-base text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center">
              <TagIcon className="w-4 h-4 mr-2 text-gray-500" />
              Banner Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
              placeholder="Enter banner title..."
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Banner Image (4:1 Aspect Ratio)
            </label>
            
            {/* Drag & Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${form.imageBase64 ? 'border-green-400 bg-green-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileSelected(f);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 font-medium">Processing image...</p>
                </div>
              ) : form.imageBase64 ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Image uploaded successfully!</p>
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-gray-200 transition-colors">
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Drop your image here</p>
                    <p className="text-gray-500">or click to browse files</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG, WEBP • 4:1 ratio (e.g., 1600x400)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {form.imageBase64 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <div className="relative group">
                  <img
                    src={form.imageBase64}
                    alt="Banner preview"
                    className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, imageBase64: '', imageMime: '' });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300 transform scale-75 group-hover:scale-100"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options Toggle */}
          <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Advanced Options
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Alt Text (Optional)
                </label>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) => setForm({ ...form, altText: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="Descriptive text for accessibility"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Active Banner</span>
                </label>
                <p className="text-xs text-gray-500">Only active banners will be displayed</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end pt-4 sm:pt-6 border-t border-gray-100 gap-2 sm:gap-0">
            <button
              type="submit"
              disabled={loading || !form.title.trim() || !form.imageBase64}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Upload Banner
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Banners */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <PhotoIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-600" />
            Existing Banners ({banners.length})
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your uploaded banners</p>
        </div>

        <div className="p-4 sm:p-8">
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <PhotoIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">No banners uploaded yet</p>
              <p className="text-xs sm:text-sm text-gray-500">Upload your first banner using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={`data:${banner.image_mime};base64,${banner.image_base64}`}
                      alt={banner.alt_text || banner.title}
                      className="w-full h-24 sm:h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        <button className="p-1.5 sm:p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                          <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                          <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full ${
                        banner.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 truncate">{banner.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 capitalize">{banner.display_location.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(banner.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />
    </div>
  );
}