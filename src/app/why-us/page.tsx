'use client'

import React from 'react'
import Link from 'next/link'
import { ScrollArrow } from '@/components/ScrollArrow'

/**
 * Why Us page component
 * Showcases the unique value propositions and competitive advantages of Aspire Property Management
 * Implements clean, modern design with compelling content and visual elements
 */

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-gray-100 hover:border-orange-200 group transform hover:-translate-y-1">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${color} rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

interface StatCardProps {
  number: string
  label: string
  description: string
}

const StatCard: React.FC<StatCardProps> = ({ number, label, description }) => {
  return (
    <div className="text-center p-3 sm:p-4">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 mb-2">{number}</div>
      <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2">{label}</div>
      <div className="text-gray-600 text-xs sm:text-sm">{description}</div>
    </div>
  )
}

export default function WhyUsPage() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: "Verified Properties",
      description: "Every property in our portfolio is thoroughly verified for legal compliance, documentation, and quality standards. We ensure you invest in legitimate, high-quality properties.",
      color: "bg-green-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      ),
      title: "Lightning Fast Service",
      description: "Our streamlined processes and advanced technology ensure quick property searches, instant loan calculations, and rapid transaction processing. Save time with our efficient platform.",
      color: "bg-blue-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
        </svg>
      ),
      title: "Transparent Pricing",
      description: "No hidden fees, no surprise charges. Our transparent pricing model ensures you know exactly what you're paying for. Get the best value for your investment.",
      color: "bg-purple-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"/>
        </svg>
      ),
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you with any queries or concerns. Our dedicated team is always ready to help you make informed decisions.",
      color: "bg-orange-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      title: "Expert Market Analysis",
      description: "Our team of real estate experts provides comprehensive market analysis, investment insights, and property valuation to help you make smart investment decisions.",
      color: "bg-indigo-500"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
      title: "Secure Transactions",
      description: "Bank-level security for all your transactions and personal data. Your information is protected with industry-standard encryption and security protocols.",
      color: "bg-red-500"
    }
  ]

  const stats = [
    {
      number: "5000+",
      label: "Properties Listed",
      description: "Wide selection across Pune"
    },
    {
      number: "10,000+",
      label: "Happy Customers",
      description: "Satisfied property buyers"
    },
    {
      number: "15+",
      label: "Years Experience",
      description: "In real estate industry"
    },
    {
      number: "99%",
      label: "Success Rate",
      description: "Successful transactions"
    }
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Property Buyer",
      content: "Aspire Property Management made my home buying journey seamless. Their expert guidance and transparent process helped me find the perfect property within my budget.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Real Estate Investor",
      content: "The investment advisory services are exceptional. I've seen 25% returns on my property investments thanks to their market insights and recommendations.",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "First-time Buyer",
      content: "As a first-time buyer, I was overwhelmed. The team at Aspire guided me through every step, from loan calculation to property selection. Highly recommended!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Why Choose Aspire Property Management?
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-orange-100 mb-6 sm:mb-8 leading-relaxed px-2">
              We&apos;re not just another property platform. We&apos;re your trusted partner in real estate success, 
              combining technology, expertise, and personalized service to deliver exceptional results.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/properties-listing"
                className="bg-white text-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-lg py-12 sm:py-16 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Our Track Record Speaks for Itself
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">
                Numbers that reflect our commitment to excellence and customer satisfaction
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                What Makes Us Different
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                We&apos;ve built our platform around your needs, combining cutting-edge technology with 
                personalized service to deliver an unmatched real estate experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white/80 backdrop-blur-lg py-12 sm:py-16 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                What Our Customers Say
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">
                Real stories from real customers who&apos;ve achieved their real estate goals with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-12 sm:py-16 shadow-xl">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
              Ready to Experience the Difference?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8 leading-relaxed px-2">
              Join thousands of satisfied customers who&apos;ve found their perfect property with Aspire Property Management. 
              Start your real estate journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/properties-listing"
                className="bg-white text-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Start Property Search
              </Link>
              <a 
                href="tel:+919226254182"
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                Call +91 92262 54182
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />
    </div>
  )
}
