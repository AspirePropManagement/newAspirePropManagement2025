'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { BlogService } from '@/lib/blogService'
import { BlogPost } from '@/types/Blog'
import { InlinePreloader } from '@/components/Preloader'
import { ScrollArrow } from '@/components/ScrollArrow'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      setLoading(true)
      setError(null)
      try {
        const blogData = await BlogService.getBySlug(slug)
        if (!blogData) {
          setError('Blog post not found')
        } else {
          setBlog(blogData)
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load blog')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
              <InlinePreloader text="Loading blog..." />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Not Found</h3>
                <p className="text-red-600 mb-4">{error || 'The blog post you are looking for does not exist.'}</p>
                <Link
                  href="/blog"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const publishedDate = blog.published_at 
    ? new Date(blog.published_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(blog.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>

          {/* Blog Content */}
          <article className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Featured Image */}
            {(blog.featured_image_data || blog.featured_image_url) && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                {blog.featured_image_data ? (
                  <Image
                    src={blog.featured_image_data}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : blog.featured_image_url ? (
                  <Image
                    src={blog.featured_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : null}
              </div>
            )}

            {/* Blog Header */}
            <div className="p-6 sm:p-8 md:p-10">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                  Blog
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{publishedDate}</span>
                </div>
              </div>

              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-6 sm:mb-8">
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium italic border-l-4 border-blue-500 pl-4">
                    {blog.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div 
                className="blog-content text-gray-700 leading-relaxed"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75rem'
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Back to Blogs Button */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Blogs
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />
    </div>
  )
}

