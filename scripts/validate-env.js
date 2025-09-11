#!/usr/bin/env node

/**
 * Environment validation script for build-time checks
 * This script validates that required environment variables are present
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_KEY'
]

const optionalEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'ADMIN_EMAIL',
  'DATABASE_URL'
]

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n')
  
  const missing = []
  const present = []
  
  // Check required variables
  for (const varName of requiredEnvVars) {
    if (process.env[varName]) {
      present.push(varName)
    } else {
      missing.push(varName)
    }
  }
  
  // Check optional variables
  const optionalMissing = []
  for (const varName of optionalEnvVars) {
    if (!process.env[varName]) {
      optionalMissing.push(varName)
    }
  }
  
  // Report results
  if (present.length > 0) {
    console.log('✅ Present environment variables:')
    present.forEach(varName => {
      const value = process.env[varName]
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') || varName.includes('PASS')
        ? '*'.repeat(Math.min(value.length, 8)) + '...'
        : value
      console.log(`   ${varName}: ${displayValue}`)
    })
    console.log('')
  }
  
  if (missing.length > 0) {
    console.log('❌ Missing required environment variables:')
    missing.forEach(varName => {
      console.log(`   ${varName}`)
    })
    console.log('')
  }
  
  if (optionalMissing.length > 0) {
    console.log('⚠️  Missing optional environment variables:')
    optionalMissing.forEach(varName => {
      console.log(`   ${varName}`)
    })
    console.log('')
  }
  
  if (missing.length === 0) {
    console.log('🎉 All required environment variables are present!')
    return true
  } else {
    console.log('💥 Build will fail due to missing required environment variables.')
    console.log('   Please set the missing variables in your environment or .env.local file.')
    return false
  }
}

// Run validation
const isValid = validateEnvironment()
process.exit(isValid ? 0 : 1)
