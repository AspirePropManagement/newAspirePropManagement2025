'use client'

/**
 * FilterModalSkeleton component that displays a loading state for filter modals
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function FilterModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="skeleton h-6 w-32"></div>
          <div className="skeleton h-6 w-6 rounded"></div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search Section */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-24"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>

          {/* Location Section */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-20"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>

          {/* Property Type Section */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-28"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="skeleton h-4 w-4 rounded"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Section */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-16"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-12"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-12"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>
          </div>

          {/* BHK Type Section */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-20"></div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="skeleton h-4 w-4 rounded"></div>
                  <div className="skeleton h-4 w-16"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-24"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="skeleton h-4 w-4 rounded"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="skeleton h-10 w-24"></div>
          <div className="flex space-x-3">
            <div className="skeleton h-10 w-20"></div>
            <div className="skeleton h-10 w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * FilterSectionSkeleton for individual filter sections
 */
export function FilterSectionSkeleton({ 
  title, 
  showCheckboxes = true, 
  showInputs = false 
}: { 
  title?: string; 
  showCheckboxes?: boolean; 
  showInputs?: boolean; 
}) {
  return (
    <div className="space-y-3">
      {/* Section Title */}
      <div className="skeleton h-5 w-24"></div>
      
      {/* Section Content */}
      {showCheckboxes && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="skeleton h-4 w-4 rounded"></div>
              <div className="skeleton h-4 w-20"></div>
            </div>
          ))}
        </div>
      )}
      
      {showInputs && (
        <div className="space-y-2">
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      )}
    </div>
  )
}

/**
 * FilterCheckboxSkeleton for individual filter checkboxes
 */
export function FilterCheckboxSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <div className="skeleton h-4 w-4 rounded"></div>
      <div className="skeleton h-4 w-20"></div>
    </div>
  )
}

/**
 * FilterRangeSkeleton for range inputs
 */
export function FilterRangeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="skeleton h-4 w-12"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-12"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      </div>
      
      {/* Range Slider */}
      <div className="space-y-2">
        <div className="skeleton h-2 w-full rounded"></div>
        <div className="flex justify-between">
          <div className="skeleton h-3 w-8"></div>
          <div className="skeleton h-3 w-8"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * FilterModalHeaderSkeleton for modal header
 */
export function FilterModalHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div className="skeleton h-6 w-32"></div>
      <div className="skeleton h-6 w-6 rounded"></div>
    </div>
  )
}

/**
 * FilterModalFooterSkeleton for modal footer
 */
export function FilterModalFooterSkeleton() {
  return (
    <div className="flex items-center justify-between p-6 border-t bg-gray-50">
      <div className="skeleton h-10 w-24"></div>
      <div className="flex space-x-3">
        <div className="skeleton h-10 w-20"></div>
        <div className="skeleton h-10 w-24"></div>
      </div>
    </div>
  )
}
