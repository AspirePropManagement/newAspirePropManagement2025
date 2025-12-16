'use client'

import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { ServicesService } from '@/lib/serviceService'
import { Service, ServiceCreateData, ServiceUpdateData } from '@/types/Service'
import { InlinePreloader } from '@/components/Preloader'
import { ScrollArrow } from '@/components/ScrollArrow'

// Custom styles for dual range slider thumbs
const rangeSliderStyles = `
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    position: relative;
    z-index: 30;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 8px rgba(0,0,0,0.4);
  }
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    position: relative;
    z-index: 30;
  }
  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 8px rgba(0,0,0,0.4);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    background: transparent;
  }
  input[type="range"]::-moz-range-track {
    height: 8px;
    background: transparent;
  }
`

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [search, setSearch] = useState<string>('')

  const emptyForm: ServiceCreateData = {
    service_name: '',
    short_description: '',
    description: '',
    image_data: '',
    image_alt: '',
    min_price: 0,
    max_price: 100000,
    is_active: true,
    sort_order: 0,
  }
  const [form, setForm] = useState<ServiceCreateData>(emptyForm)

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
      s.service_name.toLowerCase().includes(q)
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
      const updates: ServiceUpdateData = { ...form }
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
      <style>{rangeSliderStyles}</style>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage services displayed on the website</p>
          </div>
          <button
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            onClick={() => {
              setEditing(null)
              setForm(emptyForm)
              setShowForm(true)
            }}
          >
            Add Service
          </button>
        </div>

        <div className="mb-3 sm:mb-4 flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full sm:w-80 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
          />
        </div>

        {loading ? (
          <InlinePreloader text="Fetching services..." />
        ) : error ? (
          <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛠️</div>
            <p className="text-sm sm:text-base text-gray-500">No services yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Service</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Price Range</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Active</th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-32 sm:max-w-48">{s.service_name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">{s.short_description}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                        {s.min_price !== undefined && s.max_price !== undefined 
                          ? `₹${s.min_price.toLocaleString('en-IN')} - ₹${s.max_price.toLocaleString('en-IN')}`
                          : 'Not set'
                        }
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {s.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                            onClick={() => {
                              setEditing(s)
                              setForm({
                                service_name: s.service_name,
                                short_description: s.short_description ?? '',
                                description: s.description ?? '',
                                image_data: s.image_data ?? '',
                                image_alt: s.image_alt ?? '',
                                min_price: s.min_price ?? 0,
                                max_price: s.max_price ?? 100000,
                                is_active: s.is_active,
                                sort_order: s.sort_order,
                              })
                              setShowForm(true)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                            onClick={() => handleDelete(s.id)}
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
                <h2 className="text-base sm:text-lg font-semibold">{editing ? 'Edit Service' : 'Add Service'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-500 hover:text-gray-700 p-1 text-xl sm:text-2xl">✕</button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input value={form.service_name} onChange={(e)=>setForm({...form, service_name: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input value={form.short_description ?? ''} onChange={(e)=>setForm({...form, short_description: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description ?? ''} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" rows={4} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Image (upload)</label>
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
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                  />
                  {form.image_data && (
                    <div className="mt-2">
                      <img src={form.image_data} alt="Preview" className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Image Alt</label>
                  <input value={form.image_alt ?? ''} onChange={(e)=>setForm({...form, image_alt: e.target.value})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">Price Range (₹)</label>
                  <div className="space-y-4">
                    {/* Dual Range Slider - Single slider with two thumbs */}
                    <div className="relative py-8">
                      {/* Track background */}
                      <div className="relative h-2 bg-gray-200 rounded-lg">
                        {/* Active range track (highlighted portion between min and max) */}
                        <div
                          className="absolute h-2 bg-blue-600 rounded-lg"
                          style={{
                            left: `${((form.min_price ?? 0) / 10000000) * 100}%`,
                            width: `${(((form.max_price ?? 100000) - (form.min_price ?? 0)) / 10000000) * 100}%`
                          }}
                        />
                      </div>
                      
                      {/* Min range input (left thumb) */}
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="1000"
                        value={form.min_price ?? 0}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          if (newMin <= (form.max_price ?? 100000)) {
                            setForm({ ...form, min_price: newMin });
                          }
                        }}
                        className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 pointer-events-auto"
                        style={{
                          background: 'transparent'
                        }}
                      />
                      
                      {/* Max range input (right thumb) */}
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="1000"
                        value={form.max_price ?? 100000}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          if (newMax >= (form.min_price ?? 0)) {
                            setForm({ ...form, max_price: newMax });
                          }
                        }}
                        className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-20 pointer-events-auto"
                        style={{
                          background: 'transparent'
                        }}
                      />
                      
                      {/* Value labels above thumbs */}
                      <div className="relative -mt-6">
                        <div
                          className="absolute transform -translate-x-1/2 text-center"
                          style={{
                            left: `${((form.min_price ?? 0) / 10000000) * 100}%`
                          }}
                        >
                          <div className="text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded shadow-sm border border-blue-200">
                            ₹{((form.min_price ?? 0) / 1000).toFixed(0)}K
                          </div>
                        </div>
                        <div
                          className="absolute transform -translate-x-1/2 text-center"
                          style={{
                            left: `${((form.max_price ?? 100000) / 10000000) * 100}%`
                          }}
                        >
                          <div className="text-xs font-semibold text-blue-600 bg-white px-2 py-1 rounded shadow-sm border border-blue-200">
                            ₹{((form.max_price ?? 100000) / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Number inputs for precise values */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Minimum Price (₹)</label>
                        <input
                          type="number"
                          min="0"
                          max={form.max_price ?? 100000}
                          value={form.min_price ?? 0}
                          onChange={(e) => {
                            const newMin = Number(e.target.value);
                            if (newMin <= (form.max_price ?? 100000)) {
                              setForm({ ...form, min_price: newMin });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Maximum Price (₹)</label>
                        <input
                          type="number"
                          min={form.min_price ?? 0}
                          max="10000000"
                          value={form.max_price ?? 100000}
                          onChange={(e) => {
                            const newMax = Number(e.target.value);
                            if (newMax >= (form.min_price ?? 0)) {
                              setForm({ ...form, max_price: newMax });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order ?? 0} onChange={(e)=>setForm({...form, sort_order: Number(e.target.value)})} className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base" />
                </div>
                <div className="flex items-center space-x-2">
                  <input id="is_active" type="checkbox" checked={!!form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="is_active" className="text-xs sm:text-sm text-gray-700">Active</label>
                </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white">
                <button className="px-4 py-2.5 sm:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto" onClick={()=>{ setShowForm(false); setEditing(null); }}>Cancel</button>
                <button
                  className="px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                  disabled={saving || !form.service_name}
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


