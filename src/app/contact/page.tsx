'use client';

import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Enquiry
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 leading-relaxed">
              Get in touch with our expert team. We're here to help you with all your real estate needs.
            </p>
          </div>
        </div>
      </div>


      {/* Contact Information & Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Ready to start your real estate journey? Contact our team of experts who are dedicated to helping you find the perfect property or maximize your investment potential.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <PhoneIcon className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600 mb-1">+91 8080 190190</p>
                    <p className="text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-1">info@aspireprop.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Address</h3>
                    <p className="text-gray-600 mb-1">Mumbai, Maharashtra, India</p>
                    <p className="text-sm text-gray-500">Visit us for in-person consultations</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unified Contact & Enquiry Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6">
                Whether you have a general question or are looking for a specific property, we're here to help. 
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg bg-white"
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
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    If you're looking for a specific property, please fill out these details to help us assist you better.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Property Type */}
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg bg-white"
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
                      <label htmlFor="bhkType" className="block text-sm font-medium text-gray-700 mb-2">
                        BHK Type
                      </label>
                      <select
                        id="bhkType"
                        name="bhkType"
                        value={formData.bhkType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg bg-white"
                      >
                        <option value="">Select BHK Type</option>
                        <option value="1-rk">1 RK</option>
                        <option value="1-bhk">1 BHK</option>
                        <option value="2-bhk">2 BHK</option>
                        <option value="3-bhk">3 BHK</option>
                        <option value="4-bhk">4 BHK</option>
                        <option value="5-bhk">5 BHK</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="duplex">Duplex</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg bg-white"
                      >
                        <option value="">Select Budget Range</option>
                        <option value="under-50-lakhs">Under ₹50 Lakhs</option>
                        <option value="50-lakhs-1-crore">₹50 Lakhs - ₹1 Crore</option>
                        <option value="1-2-crore">₹1 Crore - ₹2 Crore</option>
                        <option value="2-5-crore">₹2 Crore - ₹5 Crore</option>
                        <option value="5-10-crore">₹5 Crore - ₹10 Crore</option>
                        <option value="above-10-crore">Above ₹10 Crore</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg"
                        placeholder="Enter preferred location"
                      />
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="mt-4">
                    <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg bg-white"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                          <p>Thank you for contacting us. We'll get back to you within 24 hours with a personalized response.</p>
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
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How quickly do you respond to inquiries?
                </h3>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at +91 8080 190190.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do I need to fill out all the property details?
                </h3>
                <p className="text-gray-600">
                  No, the property details section is optional. If you're just asking a general question, you only need to fill out the basic contact information and message. Property details help us provide more targeted assistance for property-related inquiries.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What areas do you serve?
                </h3>
                <p className="text-gray-600">
                  We primarily serve Mumbai and surrounding areas, but we also have partnerships across Maharashtra for property investments and consultations.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I schedule a site visit or property tour?
                </h3>
                <p className="text-gray-600">
                  Absolutely! Select "Site Visit Request" or "Virtual Tour Request" as your subject and provide your property preferences. We'll coordinate with you to arrange the best time for your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
