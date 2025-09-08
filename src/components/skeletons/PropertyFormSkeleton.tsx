'use client'

/**
 * PropertyFormSkeleton component that displays a loading state for property forms
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function PropertyFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Form Header Skeleton */}
      <div className="mb-8">
        <div className="skeleton h-8 w-64 mb-2"></div>
        <div className="skeleton h-4 w-96"></div>
      </div>

      {/* Progress Steps Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className="skeleton h-8 w-8 rounded-full"></div>
              {step < 5 && <div className="skeleton h-1 w-16 mx-2"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-48 border-b pb-2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-40 border-b pb-2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-18"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-32 border-b pb-2"></div>
            
            <div className="space-y-2">
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-10 w-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-28 border-b pb-2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="skeleton h-4 w-4 rounded"></div>
              <div className="skeleton h-4 w-32"></div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-36 border-b pb-2"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="skeleton h-4 w-4 rounded"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-32 border-b pb-2"></div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="skeleton h-12 w-12 mx-auto mb-4"></div>
              <div className="skeleton h-4 w-48 mx-auto mb-2"></div>
              <div className="skeleton h-3 w-32 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="skeleton h-20 w-full rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions Skeleton */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div className="skeleton h-10 w-24"></div>
          <div className="flex space-x-4">
            <div className="skeleton h-10 w-20"></div>
            <div className="skeleton h-10 w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * PropertyFormStepSkeleton for individual form steps
 */
export function PropertyFormStepSkeleton({ stepNumber = 1 }: { stepNumber?: number }) {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <div className="skeleton h-8 w-48 mx-auto mb-2"></div>
        <div className="skeleton h-4 w-64 mx-auto"></div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <div className="skeleton h-10 w-20"></div>
        <div className="skeleton h-10 w-24"></div>
      </div>
    </div>
  )
}

/**
 * PropertyFormFieldSkeleton for individual form fields
 */
export function PropertyFormFieldSkeleton({ 
  labelWidth = "w-24", 
  fieldHeight = "h-10" 
}: { 
  labelWidth?: string; 
  fieldHeight?: string; 
}) {
  return (
    <div className="space-y-2">
      <div className={`skeleton h-4 ${labelWidth}`}></div>
      <div className={`skeleton ${fieldHeight} w-full`}></div>
    </div>
  )
}
