'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { ServicesService } from '@/lib/serviceService'
import { CreateServiceItem, ServiceItem, UpdateServiceItem } from '@/types/Service'
import { InlinePreloader } from '@/components/Preloader'

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [search, setSearch] = useState<string>('')

  const emptyForm: CreateServiceItem = {
    service_name: '',
    slug: '',
    short_description: '',
    description: '',
    image_data: '',
    image_alt: '',
    is_active: true,
    sort_order: 0,
  }
  const [form, setForm] = useState<CreateServiceItem>(emptyForm)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const rows = await ServicesService.getAll()
        setServices(rows)
      } catch (e: any) {
        setError(e?.message || 'Failed to load services')
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
    if (!search) return services
    const q = search.toLowerCase()
    return services.filter(s =>
      s.service_name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q)
    )
  }, [services, search])

  const handleCreate = async () => {
    setSaving(true)
    try {
      const created = await ServicesService.create({
        ...form,
        sort_order: services.length,
      })
      setServices(prev => [...prev, created])
      setShowForm(false)
      setForm(emptyForm)
    } catch (e: any) {
      alert(e?.message || 'Failed to create service')
    } finally {
      setSaving(false)
    }
  };

  const handleUpdate = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const updates: UpdateServiceItem = { ...form }
      const updated = await ServicesService.update(editing.id, updates)
      setServices(prev => prev.map(s => (s.id === editing.id ? updated : s)))
      setEditing(null)
      setShowForm(false)
      setForm(emptyForm)
    } catch (e: any) {
      alert(e?.message || 'Failed to update service')
    } finally {
      setSaving(false)
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try {
      await ServicesService.remove(id)
      setServices(prev => prev.filter(s => s.id !== id))
    } catch (e: any) {
      alert(e?.message || 'Failed to delete service')
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600">Create and manage services displayed on the website</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              setEditing(null)
              setForm(emptyForm)
              setShowForm(true)
            }}
          >
            Add Service
          </button>
        </div>

        <div className="mb-4 flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {loading ? (
          <InlinePreloader text="Fetching services..." />
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No services yet.</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{s.service_name}</div>
                      <div className="text-gray-500 text-sm line-clamp-2">{s.short_description}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{s.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                        onClick={() => {
                          setEditing(s)
                          setForm({
                            service_name: s.service_name,
                            slug: s.slug,
                            short_description: s.short_description ?? '',
                            description: s.description ?? '',
                            image_data: s.image_data ?? '',
                            image_alt: s.image_alt ?? '',
                            is_active: s.is_active,
                            sort_order: s.sort_order,
                          })
                          setShowForm(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold">{editing ? 'Edit Service' : 'Add Service'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input value={form.service_name} onChange={(e)=>setForm({...form, service_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input value={form.short_description ?? ''} onChange={(e)=>setForm({...form, short_description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description ?? ''} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded" rows={4} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (ev) => {
                        const base64 = ev.target?.result as string
                        setForm({ ...form, image_data: base64 })
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {form.image_data && (
                    <div className="mt-2">
                      <img src={form.image_data} alt="Preview" className="w-28 h-28 object-cover rounded" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt</label>
                  <input value={form.image_alt ?? ''} onChange={(e)=>setForm({...form, image_alt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order ?? 0} onChange={(e)=>setForm({...form, sort_order: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <input id="is_active" type="checkbox" checked={!!form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                </div>
                </div>
              </div>
              <div className="p-4 border-t flex justify-end sticky bottom-0 bg-white">
                <button className="px-4 py-2 bg-gray-100 rounded mr-3" onClick={()=>{ setShowForm(false); setEditing(null); }}>Cancel</button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  disabled={saving || !form.service_name || !form.slug}
                  onClick={editing ? handleUpdate : handleCreate}
                >
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}


