'use client'

import { useState } from 'react'
import { useSupabaseRoleAssignment } from '@/hooks/useSupabaseRoleAssignment'
import { useSupabase } from './SupabaseProvider'
import { FormInput } from './FormInput'

type UserRole = 'admin' | 'agent' | 'buyer' | 'builder' | 'owner'

interface RoleSelectionFormProps {
  onRoleSelected: (role: UserRole) => void
  onBack: () => void
  defaultRole?: UserRole
}

export default function RoleSelectionForm({ onRoleSelected, onBack, defaultRole = 'buyer' }: RoleSelectionFormProps) {
  const { user } = useSupabase()
  const { completeUserOnboarding, loading, error } = useSupabaseRoleAssignment()
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole)
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setShowRoleForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      const result = await completeUserOnboarding(user.id, selectedRole, {
        email: user.email,
        full_name: formData.full_name || user.user_metadata?.full_name || '',
        phone: formData.phone || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        roleData: formData
      })

      if (result.success) {
        onRoleSelected(selectedRole)
      }
    } catch (err) {
      console.error('Error completing onboarding:', err)
    }
  }

  const renderRoleForm = () => {
    switch (selectedRole) {
      case 'admin':
        return (
          <div className="space-y-4">
            <FormInput
              id="admin-full-name"
              name="admin-full-name"
              label="Full Name"
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <FormInput
              id="admin-phone"
              name="admin-phone"
              label="Phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Level
              </label>
              <select
                value={formData.admin_level || 'admin'}
                onChange={(e) => setFormData({ ...formData, admin_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
        )

      case 'agent':
        return (
          <div className="space-y-4">
            <FormInput
              id="agent-full-name"
              name="agent-full-name"
              label="Full Name"
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <FormInput
              id="agent-license"
              name="agent-license"
              label="License Number"
              type="text"
              value={formData.license_number || ''}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              required
            />
            <FormInput
              id="agent-experience"
              name="agent-experience"
              label="Experience (Years)"
              type="text"
              value={formData.experience_years || ''}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
            />
            <FormInput
              id="agent-commission"
              name="agent-commission"
              label="Commission Rate (%)"
              type="text"
              value={formData.commission_rate || '2.5'}
              onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
            />
          </div>
        )

      case 'buyer':
        return (
          <div className="space-y-4">
            <FormInput
              id="buyer-full-name"
              name="buyer-full-name"
              label="Full Name"
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <FormInput
              id="buyer-phone"
              name="buyer-phone"
              label="Phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="buyer-budget-min"
                name="buyer-budget-min"
                label="Min Budget"
                type="text"
                value={formData.budget_min || ''}
                onChange={(e) => setFormData({ ...formData, budget_min: parseFloat(e.target.value) })}
              />
              <FormInput
                id="buyer-budget-max"
                name="buyer-budget-max"
                label="Max Budget"
                type="text"
                value={formData.budget_max || ''}
                onChange={(e) => setFormData({ ...formData, budget_max: parseFloat(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="buyer-bedrooms"
                name="buyer-bedrooms"
                label="Min Bedrooms"
                type="text"
                value={formData.bedrooms_min || '1'}
                onChange={(e) => setFormData({ ...formData, bedrooms_min: parseInt(e.target.value) })}
              />
              <FormInput
                id="buyer-bathrooms"
                name="buyer-bathrooms"
                label="Min Bathrooms"
                type="text"
                value={formData.bathrooms_min || '1'}
                onChange={(e) => setFormData({ ...formData, bathrooms_min: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )

      case 'builder':
        return (
          <div className="space-y-4">
            <FormInput
              id="builder-full-name"
              name="builder-full-name"
              label="Full Name"
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <FormInput
              id="builder-company"
              name="builder-company"
              label="Company Name"
              type="text"
              value={formData.company_name || ''}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
            <FormInput
              id="builder-license"
              name="builder-license"
              label="License Number"
              type="text"
              value={formData.license_number || ''}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              required
            />
            <FormInput
              id="builder-experience"
              name="builder-experience"
              label="Experience (Years)"
              type="text"
              value={formData.experience_years || ''}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
            />
          </div>
        )

      case 'owner':
        return (
          <div className="space-y-4">
            <FormInput
              id="owner-full-name"
              name="owner-full-name"
              label="Full Name"
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <FormInput
              id="owner-phone"
              name="owner-phone"
              label="Phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormInput
              id="owner-properties-count"
              name="owner-properties-count"
              label="Number of Properties Owned"
              type="text"
              value={formData.properties_count || ''}
              onChange={(e) => setFormData({ ...formData, properties_count: parseInt(e.target.value) })}
            />
            <FormInput
              id="owner-primary-location"
              name="owner-primary-location"
              label="Primary Location of Properties"
              type="text"
              value={formData.primary_location || ''}
              onChange={(e) => setFormData({ ...formData, primary_location: e.target.value })}
            />
          </div>
        )

      default:
        return null
    }
  }

  if (!showRoleForm) {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>
        <p className="text-gray-600 text-center mb-8">
          Select the role that best describes your purpose on our platform
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('buyer')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-lg">🏠 Buyer</div>
            <div className="text-sm text-gray-600">Looking to purchase properties</div>
          </button>

          <button
            onClick={() => handleRoleSelect('agent')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-lg">👔 Real Estate Agent</div>
            <div className="text-sm text-gray-600">Help clients buy and sell properties</div>
          </button>

          <button
            onClick={() => handleRoleSelect('builder')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-lg">🏗️ Builder/Developer</div>
            <div className="text-sm text-gray-600">Create and sell new properties</div>
          </button>

          <button
            onClick={() => handleRoleSelect('owner')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-lg">🏡 Property Owner</div>
            <div className="text-sm text-gray-600">Own and manage properties</div>
          </button>

          <button
            onClick={() => handleRoleSelect('admin')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-lg">⚙️ Administrator</div>
            <div className="text-sm text-gray-600">Manage platform operations</div>
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-6 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Sign Up
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Complete Your {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderRoleForm()}

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowRoleForm(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
