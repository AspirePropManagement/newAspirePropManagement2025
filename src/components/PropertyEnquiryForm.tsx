'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';

interface PropertyEnquiryFormProps {
	propertyTitle: string;
	propertyId: string | number;
	propertyType: string;
	propertyPrice?: string;
	propertyLocation?: string;
	onEnquirySubmitted?: () => void;
}

/**
 * PropertyEnquiryForm
 * Compact enquiry form for property detail page (right-side card)
 * Submits to the same SMTP-backed /api/enquiry endpoint
 */
export function PropertyEnquiryForm({ propertyTitle, propertyId, propertyType, propertyPrice, propertyLocation, onEnquirySubmitted }: PropertyEnquiryFormProps) {
	const [formData, setFormData] = useState({
		fullName: '',
		mobileNumber: '',
		email: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		if (name === 'mobileNumber') {
			const numericValue = value.replace(/\D/g, '').slice(0, 10);
			setFormData(prev => ({ ...prev, mobileNumber: numericValue }));
			return;
		}
		setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.mobileNumber || !formData.email) {
			showToast('Please fill in all required fields', 'error');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			showToast('Please enter a valid email address', 'error');
			return;
		}

		const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
		if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
			showToast('Please enter a valid 10-digit Indian mobile number starting with 6-9', 'error');
			return;
		}

		setIsSubmitting(true);
		try {
			// Reuse same SMTP-backed endpoint; set userType to buyer for property enquiry
			const response = await fetch('/api/enquiry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					userType: 'buyer',
					propertyTitle,
					propertyId,
					propertyType,
					propertyPrice,
					propertyLocation
				})
			});
			const data = await response.json();
			if (response.ok) {
				showToast('Enquiry sent successfully! We will contact you soon.', 'success');
				setFormData({ fullName: '', mobileNumber: '', email: '' });
				// Call callback to reveal owner information
				if (onEnquirySubmitted) {
					onEnquirySubmitted();
				}
			} else {
				showToast(data.error || 'Failed to submit enquiry. Please try again.', 'error');
			}
		} catch (err) {
			showToast('Failed to submit enquiry. Please try again.', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
			<h3 className="text-xl font-semibold text-gray-900 mb-3">Enquire about this property</h3>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
					<input
						type="text"
						id="fullName"
						name="fullName"
						value={formData.fullName}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
						placeholder="Enter your full name"
						required
					/>
				</div>

				<div>
					<label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
					<input
						type="tel"
						id="mobileNumber"
						name="mobileNumber"
						value={formData.mobileNumber}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
						placeholder="10-digit mobile number"
						maxLength={10}
						required
					/>
				</div>

				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
						placeholder="Enter your email"
						required
					/>
				</div>

				{/* WhatsApp toggle removed per request */}

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
				>
					{isSubmitting ? 'Submitting...' : 'Request Call Back'}
				</button>
			</form>
		</div>
	);
}


