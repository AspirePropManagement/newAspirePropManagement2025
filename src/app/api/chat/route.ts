import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseServer } from '@/lib/supabase-server'

/**
 * API route for handling chatbot conversations with OpenAI
 * Implements the Single Responsibility Principle by only handling chat API requests
 * Enhanced with user authentication and database access
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, userId, userRole } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Check if user is asking about personal data without being logged in
    const isPersonalDataQuery = checkPersonalDataQuery(message)
    if (isPersonalDataQuery && !userId) {
      return NextResponse.json({
        response: "I'd be happy to help you with your personal data! However, you need to be logged in to access your account information. Please log in to continue.",
        requiresLogin: true,
        timestamp: new Date().toISOString()
      })
    }

    // Get user-specific data if logged in
    let userData = null
    if (userId) {
      console.log('Fetching user data for:', { userId, userRole })
      userData = await getUserData(userId, userRole)
      console.log('User data fetched:', userData)
    }

    // Create a conversation with Kriti, the property assistant
    const systemPrompt = createSystemPrompt(userData, userRole)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request. Please try again."

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback response if OpenAI API fails
    const fallbackResponse = getFallbackResponse(message)
    
    return NextResponse.json({ 
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      isFallback: true
    })
  }
}

/**
 * Fallback response function for when OpenAI API is unavailable
 * Provides basic property-related responses
 */
function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase()
  
  // Check for personal data queries
  const personalDataKeywords = [
    'my properties', 'my account', 'my profile', 'my data', 'my information',
    'my favorites', 'my saved', 'my listings', 'my bookings', 'my transactions',
    'show my', 'view my', 'check my', 'update my', 'change my'
  ]
  
  const isPersonalDataQuery = personalDataKeywords.some(keyword => input.includes(keyword))
  
  if (isPersonalDataQuery) {
    return 'I\'d be happy to help you with your personal data! However, you need to be logged in to access your account information. Please log in to continue, or if you\'re already logged in, the requested information is not available at the moment. Please try again later or contact our support team at +91 8080 190190.'
  }
  
  if (input.includes('property') || input.includes('house') || input.includes('apartment')) {
    return 'Hi! I\'m Kriti, your property assistant. I can help you find the perfect property! You can browse our listings or tell me about your specific requirements like location, budget, or property type. How can I assist you today?'
  }
  
  if (input.includes('price') || input.includes('cost') || input.includes('budget')) {
    return 'Hello! I\'d be happy to help with pricing information! Our properties range from affordable options to luxury homes. What\'s your budget range? I can connect you with our expert agents for detailed pricing information.'
  }
  
  if (input.includes('location') || input.includes('area') || input.includes('neighborhood')) {
    return 'Hi there! We have properties in various prime locations across Pune! Could you tell me which area you\'re most interested in? I can help you find the perfect neighborhood that matches your lifestyle.'
  }
  
  if (input.includes('agent') || input.includes('contact') || input.includes('help')) {
    return 'Hello! I can connect you with our expert real estate agents! They\'re available to provide personalized assistance with your property needs. You can also call our toll-free number: +91 8080 190190'
  }
  
  if (input.includes('loan') || input.includes('mortgage') || input.includes('financing')) {
    return 'Hi! We offer various financing options and can help you with loan calculations. Check out our EMI calculator tool for detailed calculations! Our agents can also guide you through the financing process.'
  }
  
  if (input.includes('rent') || input.includes('rental')) {
    return 'Hello! We have excellent rental properties available! You can filter by rent amount, location, and amenities on our properties page. What type of rental property are you looking for?'
  }
  
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return 'Hello! I\'m Kriti, your property assistant at Aspire Property Management. I\'m here to help you with all your real estate needs! How can I assist you today?'
  }
  
  return 'Hello! I\'m Kriti, your property assistant. Thank you for your message! I\'m here to help with property-related questions. You can ask me about properties, pricing, locations, or connect with our agents. How can I help you today?'
}

/**
 * Check if the user query is asking about personal data
 */
function checkPersonalDataQuery(message: string): boolean {
  const personalDataKeywords = [
    'my properties', 'my account', 'my profile', 'my data', 'my information',
    'my favorites', 'my saved', 'my listings', 'my bookings', 'my transactions',
    'show my', 'view my', 'check my', 'update my', 'change my'
  ]
  
  const lowerMessage = message.toLowerCase()
  return personalDataKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Get user-specific data from database
 */
async function getUserData(userId: string, userRole: string) {
  try {
    console.log('getUserData called with:', { userId, userRole })
    const userData: any = { userId, userRole, hasData: false }

    // Get user's properties based on role
    if (userRole === 'AGENT') {
      console.log('Fetching agent properties for user:', userId)
      const { data: agentProperties, error } = await supabaseServer
        .from('properties')
        .select('*')
        .eq('agent_id', userId)
        .limit(5)
      
      console.log('Agent properties result:', { data: agentProperties, error })
      
      if (error) {
        console.error('Error fetching agent properties:', error)
        userData.properties = []
        userData.propertiesError = 'Unable to fetch your properties at the moment'
      } else {
        userData.properties = agentProperties || []
        userData.hasData = (agentProperties && agentProperties.length > 0) || false
      }
    } else if (userRole === 'BUILDER') {
      console.log('Fetching builder properties for user:', userId)
      const { data: builderProperties, error } = await supabaseServer
        .from('properties')
        .select('*')
        .eq('builder_id', userId)
        .limit(5)
      
      console.log('Builder properties result:', { data: builderProperties, error })
      
      if (error) {
        console.error('Error fetching builder properties:', error)
        userData.properties = []
        userData.propertiesError = 'Unable to fetch your projects at the moment'
      } else {
        userData.properties = builderProperties || []
        userData.hasData = (builderProperties && builderProperties.length > 0) || false
      }
    } else if (userRole === 'BUYER') {
      // Get user's favorite properties (stored in localStorage on frontend)
      userData.favorites = 'Ask user to check their favorites page'
      userData.hasData = false // Will be determined by frontend
    }

    // Get user profile
    console.log('Fetching user profile for:', userId)
    const { data: profile, error: profileError } = await supabaseServer
      .from('users')
      .select('first_name, last_name, email, phone, role')
      .eq('id', userId)
      .single()
    
    console.log('User profile result:', { data: profile, error: profileError })
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      userData.profile = null
      userData.profileError = 'Unable to fetch your profile information'
    } else {
      userData.profile = profile
    }

    console.log('Final userData:', userData)
    return userData
  } catch (error) {
    console.error('Error fetching user data:', error)
    return { 
      userId, 
      userRole, 
      error: 'Failed to fetch user data',
      hasData: false,
      dataUnavailable: true
    }
  }
}

/**
 * Create system prompt based on user data and role
 */
function createSystemPrompt(userData: any, userRole: string): string {
  let basePrompt = `You are Kriti, a friendly and knowledgeable property assistant for Aspire Property Management. You help users with:

- Property searches and recommendations
- Pricing information and market insights
- Location details and neighborhood information
- Connecting users with real estate agents
- Loan and financing guidance
- Rental property information
- General real estate questions

Always be helpful, professional, and encouraging. Keep responses concise but informative.

Company: Aspire Property Management
Tagline: "NO ONE TARGETS YOUR NEED BETTER"
Toll-free: +91 8080 190190`

  if (userData && userData.profile) {
    const { first_name, last_name, role } = userData.profile
    const userName = first_name ? `${first_name} ${last_name || ''}`.trim() : 'there'
    
    basePrompt += `\n\nCurrent User: ${userName} (${role})`
    
    // Handle data availability
    if (userData.dataUnavailable) {
      basePrompt += `\n\nIMPORTANT: User data is currently unavailable. If they ask about their personal data, properties, or account information, politely inform them that the requested information is not available at the moment and suggest they try again later or contact support.`
    } else if (userData.propertiesError) {
      basePrompt += `\n\nIMPORTANT: Unable to fetch user's properties/projects. If they ask about their listings or projects, inform them that this information is not available right now.`
    } else if (userData.properties && userData.properties.length > 0) {
      basePrompt += `\n\nUser's Properties:`
      userData.properties.forEach((prop: any, index: number) => {
        basePrompt += `\n${index + 1}. ${prop.title} - ${prop.location} - ₹${prop.price.toLocaleString()}`
      })
    } else if (userData.hasData === false) {
      basePrompt += `\n\nIMPORTANT: User has no properties/projects in the system yet. If they ask about their listings or projects, inform them that no data is available at the moment.`
    }
    
    if (role === 'AGENT') {
      basePrompt += `\n\nAs an agent, you can help with: managing your listings, updating property information, viewing inquiries, and connecting with potential buyers.`
    } else if (role === 'BUILDER') {
      basePrompt += `\n\nAs a builder, you can help with: managing your projects, updating construction status, viewing sales data, and connecting with agents.`
    } else if (role === 'BUYER') {
      basePrompt += `\n\nAs a buyer, you can help with: finding properties matching your criteria, checking your favorites, getting loan assistance, and connecting with agents.`
    }
  }

  basePrompt += `\n\nIMPORTANT: If user asks about data that is not available, always respond politely that the requested information is not available at the moment and suggest they try again later or contact support at +91 8080 190190.`
  basePrompt += `\n\nRespond as Kriti would - warmly and professionally.`
  
  return basePrompt
}
