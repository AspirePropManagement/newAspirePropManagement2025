'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlogService } from '@/lib/blogService'
import { BlogPost } from '@/types/Blog'
import { InlinePreloader } from '@/components/Preloader'

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await BlogService.getPublished()
        setBlogs(rows)
      } catch (e: any) {
        setError(e?.message || 'Failed to load blogs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Blog</h1>
            <p className="text-lg text-gray-600 mt-3">Insights, guides, and updates</p>
          </div>

          {loading ? (
            <InlinePreloader text="Loading blogs..." />
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-gray-500">No blogs found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <Link key={b.id} href={`/blog/${b.slug}`} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative w-full h-48 bg-gray-100">
                    {b.featured_image_data ? (
                      <Image src={b.featured_image_data} alt={b.title} fill className="object-cover" />
                    ) : b.featured_image_url ? (
                      <Image src={b.featured_image_url} alt={b.title} fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{b.title}</h3>
                    {b.excerpt && <p className="text-gray-600 mt-2 line-clamp-3">{b.excerpt}</p>}
                    <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                      <span>{b.published_at ? new Date(b.published_at).toLocaleDateString() : ''}</span>
                      {b.reading_time_minutes ? <span>{b.reading_time_minutes} min read</span> : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


