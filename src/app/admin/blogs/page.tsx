'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { InlinePreloader } from '@/components/Preloader'
import { BlogService } from '@/lib/blogService'
import { BlogPost, CreateBlogPost, UpdateBlogPost } from '@/types/Blog'
import { useAuth } from '@/hooks/useAuth'
import { ScrollArrow } from '@/components/ScrollArrow'

export default function AdminBlogsPage() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [search, setSearch] = useState<string>('')

  const emptyForm: CreateBlogPost = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_data: '',
    status: 'DRAFT',
    tags: [],
    meta_title: '',
    meta_description: '',
    is_featured: false,
    is_pinned: false,
  }
  const [form, setForm] = useState<CreateBlogPost>(emptyForm)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const rows = await BlogService.getAll()
        setBlogs(rows)
      } catch (e: any) {
        setError(e?.message || 'Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showForm) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [showForm])

  const filtered = useMemo(() => {
    if (!search) return blogs
    const q = search.toLowerCase()
    return blogs.filter(b => b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q))
  }, [blogs, search])

  const handleCreate = async () => {
    setSaving(true)
    try {
      const created = await BlogService.create({ ...form, author_id: user?.id || '' })
      setBlogs(prev => [created, ...prev])
      setShowForm(false)
      setForm(emptyForm)
    } catch (e: any) {
      alert(e?.message || 'Failed to create blog')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const updates: UpdateBlogPost = { ...form }
      const updated = await BlogService.update(editing.id, updates)
      setBlogs(prev => prev.map(b => (b.id === editing.id ? updated : b)))
      setEditing(null)
      setShowForm(false)
      setForm(emptyForm)
    } catch (e: any) {
      alert(e?.message || 'Failed to update blog')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return
    try {
      await BlogService.remove(id)
      setBlogs(prev => prev.filter(b => b.id !== id))
    } catch (e: any) {
      alert(e?.message || 'Failed to delete blog')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blogs</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage blog posts</p>
          </div>
          <button
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            onClick={() => {
              setEditing(null)
              setForm(emptyForm)
              setShowForm(true)
            }}
          >
            Add Blog
          </button>
        </div>

        <div className="mb-3 sm:mb-4 flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="w-full sm:w-80 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
          />
        </div>

        {loading ? (
          <InlinePreloader text="Fetching blogs..." />
        ) : error ? (
          <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
            <p className="text-sm sm:text-base text-gray-500">No blogs yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Title</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Slug</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-32 sm:max-w-48">{b.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">{b.excerpt}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 truncate max-w-24 sm:max-w-32">{b.slug}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className="px-2 py-1 text-xs rounded whitespace-nowrap bg-gray-100 text-gray-700">{b.status}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                            onClick={() => {
                              setEditing(b)
                              setForm({
                                title: b.title,
                                slug: b.slug,
                                content: b.content,
                                excerpt: b.excerpt ?? '',
                                featured_image_data: b.featured_image_data ?? '',
                                status: b.status,
                                tags: b.tags ?? [],
                                meta_title: b.meta_title ?? '',
                                meta_description: b.meta_description ?? '',
                                is_featured: !!b.is_featured,
                                is_pinned: !!b.is_pinned,
                              })
                              setShowForm(true)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                            onClick={() => handleDelete(b.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-2 sm:p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <h2 className="text-base sm:text-lg font-semibold">{editing ? 'Edit Blog' : 'Add Blog'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-500 hover:text-gray-700 p-1 text-xl sm:text-2xl">✕</button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <input value={form.excerpt ?? ''} onChange={(e)=>setForm({...form, excerpt: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea value={form.content} onChange={(e)=>setForm({...form, content: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" rows={8} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Featured Image (upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        const base64 = ev.target?.result as string
                        setForm({ ...form, featured_image_data: base64 })
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                  />
                  {form.featured_image_data && (
                    <div className="mt-2">
                      <img src={form.featured_image_data} alt="Preview" className="w-28 h-20 sm:w-36 sm:h-24 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value as any})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input id="is_featured" type="checkbox" checked={!!form.is_featured} onChange={(e)=>setForm({...form, is_featured: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_featured" className="text-xs sm:text-sm text-gray-700">Featured</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input id="is_pinned" type="checkbox" checked={!!form.is_pinned} onChange={(e)=>setForm({...form, is_pinned: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_pinned" className="text-xs sm:text-sm text-gray-700">Pinned</label>
                </div>
              </div>
              </div>
              <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white">
                <button className="px-4 py-2.5 sm:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto" onClick={()=>{ setShowForm(false); setEditing(null); }}>Cancel</button>
                <button
                  className="px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                  disabled={saving || !form.title || !form.slug || !form.content}
                  onClick={editing ? handleUpdate : handleCreate}
                >
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scroll Arrow */}
        <ScrollArrow />
      </div>
    </DashboardLayout>
  )
}


