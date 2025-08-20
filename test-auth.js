/**
 * Simple test script to verify authentication system
 * Run this in the browser console after setting up the system
 */

// Test authentication service methods
async function testAuthSystem() {
  console.log('🧪 Testing Authentication System...')
  
  try {
    // Test 1: Check if authService is available
    if (typeof window !== 'undefined' && window.authService) {
      console.log('✅ authService is available')
    } else {
      console.log('❌ authService not found')
    }
    
    // Test 2: Check if NavigationService is available
    if (typeof window !== 'undefined' && window.NavigationService) {
      console.log('✅ NavigationService is available')
    } else {
      console.log('❌ NavigationService not found')
    }
    
    // Test 3: Test role-based routing
    const testRoles = ['ADMIN', 'AGENT', 'BUYER', 'BUILDER']
    testRoles.forEach(role => {
      const route = window.NavigationService?.getDashboardRoute(role)
      console.log(`📍 ${role} → ${route}`)
    })
    
    // Test 4: Check localStorage for user session
    const userRole = localStorage.getItem('userRole')
    if (userRole) {
      console.log(`👤 Current user role: ${userRole}`)
    } else {
      console.log('👤 No user session found')
    }
    
    console.log('🎉 Authentication system test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Test form validation
function testFormValidation() {
  console.log('🧪 Testing Form Validation...')
  
  const emailInput = document.querySelector('input[type="email"]')
  const passwordInput = document.querySelector('input[type="password"]')
  
  if (emailInput && passwordInput) {
    console.log('✅ Form inputs found')
    
    // Test email validation
    const testEmails = [
      'test@example.com',
      'invalid-email',
      'user@domain'
    ]
    
    testEmails.forEach(email => {
      const isValid = email.includes('@') && email.includes('.')
      console.log(`📧 ${email}: ${isValid ? 'Valid' : 'Invalid'}`)
    })
    
  } else {
    console.log('❌ Form inputs not found')
  }
}

// Test role-based access
function testRoleAccess() {
  console.log('🧪 Testing Role-Based Access...')
  
  const testCases = [
    { userRole: 'ADMIN', requiredRole: 'ADMIN', expected: true },
    { userRole: 'ADMIN', requiredRole: ['ADMIN', 'AGENT'], expected: true },
    { userRole: 'AGENT', requiredRole: 'ADMIN', expected: false },
    { userRole: 'BUYER', requiredRole: ['ADMIN', 'AGENT'], expected: false }
  ]
  
  testCases.forEach(testCase => {
    const hasAccess = window.NavigationService?.hasRouteAccess(
      testCase.userRole, 
      testCase.requiredRole
    )
    const result = hasAccess === testCase.expected ? '✅' : '❌'
    console.log(`${result} ${testCase.userRole} → ${testCase.requiredRole}: ${hasAccess}`)
  })
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Authentication System Tests...')
  console.log('=' .repeat(50))
  
  testAuthSystem()
  console.log('')
  
  testFormValidation()
  console.log('')
  
  testRoleAccess()
  console.log('')
  
  console.log('=' .repeat(50))
  console.log('🏁 All tests completed!')
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAuthSystem = testAuthSystem
  window.testFormValidation = testFormValidation
  window.testRoleAccess = testRoleAccess
  window.runAllTests = runAllTests
  
  console.log('🧪 Authentication test functions loaded!')
  console.log('Run runAllTests() to test the system')
}
