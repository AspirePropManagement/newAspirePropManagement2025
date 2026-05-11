'use client';

import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';
import { ScrollArrow } from '@/components/ScrollArrow';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budget: '',
    location: '',
    bhkType: '',
    preferredContact: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Determine if it's a property enquiry based on subject
      const isPropertyEnquiry = [
        'property-inquiry',
        'property-valuation', 
        'investment-consultation',
        'rental-services',
        'site-visit',
        'virtual-tour'
      ].includes(formData.subject);

      const endpoint = isPropertyEnquiry ? '/api/enquiry' : '/api/contact';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          propertyType: '',
          budget: '',
          location: '',
          bhkType: '',
          preferredContact: 'email'
        });
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Full-screen loader overlay for form submission */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 max-w-md mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-lg font-semibold text-gray-900">Submitting your message...</p>
            <p className="text-sm text-gray-600 text-center">Please wait while we process your request</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
              Enquiry
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8 leading-relaxed px-2">
              Get in touch with our expert team. We&apos;re here to help you with all your real estate needs.
            </p>
          </div>
        </div>
      </div>


      {/* Contact Information & Form */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 sm:mb-6">Get in Touch</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  Ready to start your real estate journey? Contact our team of experts who are dedicated to helping you find the perfect property or maximize your investment potential.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4 sm:space-y-6">
                {/* Phone */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                        <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Phone</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-1 font-medium">+91 92262 54182</p>
                      <p className="text-xs sm:text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                        <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Email</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-1 font-medium">aspireprop07@gmail.com</p>
                      <p className="text-xs sm:text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                        <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Office Address</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-1 font-medium">Office No 1, Dreams Rachana, Autadwadi Handewadi, Shiv Nagar, Hadapsar, Pune, Maharashtra 411028</p>
                      <p className="text-xs sm:text-sm text-gray-500">Visit us for in-person consultations</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                        <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Business Hours</h3>
                      <div className="text-sm sm:text-base text-gray-600 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unified Contact & Enquiry Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                Whether you have a general question or are looking for a specific property, we&apos;re here to help. 
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg bg-white"
                  >
                    <option value="">Select a subject</option>
                    <optgroup label="Property Related">
                      <option value="property-inquiry">Property Inquiry</option>
                      <option value="property-valuation">Property Valuation</option>
                      <option value="investment-consultation">Investment Consultation</option>
                      <option value="rental-services">Rental Services</option>
                      <option value="site-visit">Site Visit Request</option>
                      <option value="virtual-tour">Virtual Tour Request</option>
                    </optgroup>
                    <optgroup label="General">
                      <option value="general-inquiry">General Inquiry</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </optgroup>
                  </select>
                </div>

                {/* Property Details (Optional) */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Property Details (Optional)</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    If you&apos;re looking for a specific property, please fill out these details to help us assist you better.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Property Type */}
                    <div>
                      <label htmlFor="propertyType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Property Type
                      </label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg bg-white"
                      >
                        <option value="">Select Property Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="plot">Plot</option>
                        <option value="commercial">Commercial</option>
                        <option value="office">Office Space</option>
                        <option value="shop">Shop</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* BHK Type */}
                    <div>
                      <label htmlFor="bhkType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        BHK Type
                      </label>
                      <select
                        id="bhkType"
                        name="bhkType"
                        value={formData.bhkType}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg bg-white"
                      >
                        <option value="">Select BHK Type</option>
                        <option value="1_rk">1 RK</option>
                        <option value="1_bhk">1 BHK</option>
                        <option value="2_bhk">2 BHK</option>
                        <option value="3_bhk">3 BHK</option>
                        <option value="4_bhk">4 BHK</option>
                        <option value="5_bhk">5 BHK</option>
                        <option value="5_plus_bhk">5+ BHK</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="duplex">Duplex</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label htmlFor="budget" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg bg-white"
                      >
                        <option value="">Select Budget Range</option>
                        <option value="under-40-lakhs">Under ₹40 Lakhs</option>
                        <option value="40-70-lakhs">₹40 Lakhs - ₹70 Lakhs</option>
                        <option value="70-lakhs-1-crore">₹70 Lakhs - ₹1 Crore</option>
                        <option value="1-2-crore">₹1 Crore - ₹2 Crore</option>
                        <option value="above-2-crore">Above ₹2 Crore</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Preferred Location
                      </label>
                      <GooglePlacesAutocomplete
                        value={formData.location}
                        onChange={handleLocationChange}
                        placeholder="Enter preferred location (e.g., Pune, Maharashtra)"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg"
                        id="location"
                        name="location"
                      />
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="mt-3 sm:mt-4">
                    <label htmlFor="preferredContact" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg bg-white"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="any">Any Method</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base md:text-lg resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Message Sent Successfully!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Thank you for contacting us. We&apos;ll get back to you within 24 hours with a personalized response.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 11.414l2.707-2.707a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error Sending Message
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>Sorry, there was an error sending your message. Please try again.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white/80 backdrop-blur-lg py-12 sm:py-16 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent text-center mb-8 sm:mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  How quickly do you respond to inquiries?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at +91 92262 54182.
                </p>
              </div>

              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Do I need to fill out all the property details?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  No, the property details section is optional. If you&apos;re just asking a general question, you only need to fill out the basic contact information and message. Property details help us provide more targeted assistance for property-related inquiries.
                </p>
              </div>

              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  What areas do you serve?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We primarily serve Mumbai and surrounding areas, but we also have partnerships across Maharashtra for property investments and consultations.
                </p>
              </div>

              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Can I schedule a site visit or property tour?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Absolutely! Select &quot;Site Visit Request&quot; or &quot;Virtual Tour Request&quot; as your subject and provide your property preferences. We&apos;ll coordinate with you to arrange the best time for your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />
      </div>
    </>
  );
}
