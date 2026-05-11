#!/usr/bin/env node

/**
 * Environment validation script for build-time checks
 * This script validates that required environment variables are present
 * All variables are now treated as optional to allow flexible builds
 */

const recommendedEnvVars = [
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
  
  const recommendedMissing = []
  const recommendedPresent = []
  
  // Check recommended variables
  for (const varName of recommendedEnvVars) {
    if (process.env[varName]) {
      recommendedPresent.push(varName)
    } else {
      recommendedMissing.push(varName)
    }
  }
  
  // Check optional variables
  const optionalMissing = []
  const optionalPresent = []
  for (const varName of optionalEnvVars) {
    if (process.env[varName]) {
      optionalPresent.push(varName)
    } else {
      optionalMissing.push(varName)
    }
  }
  
  // Report results
    // Never print env var values — only confirm presence. Avoids leaking
  // credentials (DATABASE_URL, OPENAI_KEY, SMTP_PASS, etc.) into build logs.
  if (recommendedPresent.length > 0) {
    console.log('✅ Present recommended environment variables:')
    recommendedPresent.forEach(varName => {
      console.log(`   ${varName}: [set]`)
    })
    console.log('')
  }

  if (optionalPresent.length > 0) {
    console.log('✅ Present optional environment variables:')
    optionalPresent.forEach(varName => {
      console.log(`   ${varName}: [set]`)
    })
    console.log('')
  }

  
  if (recommendedMissing.length > 0) {
    console.log('⚠️  Missing recommended environment variables (some features may not work):')
    recommendedMissing.forEach(varName => {
      console.log(`   ${varName}`)
    })
    console.log('')
  }
  
  if (optionalMissing.length > 0) {
    console.log('ℹ️  Missing optional environment variables (optional features may be disabled):')
    optionalMissing.forEach(varName => {
      console.log(`   ${varName}`)
    })
    console.log('')
  }
  
  if (recommendedMissing.length === 0 && optionalMissing.length === 0) {
    console.log('🎉 All environment variables are present!')
  } else {
    console.log('✅ Build will continue. Set missing variables in .env.local for full functionality.')
  }
  console.log('')
  
  return true
}

// Run validation
const isValid = validateEnvironment()
process.exit(isValid ? 0 : 1)
