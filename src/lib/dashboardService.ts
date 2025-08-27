import { supabase } from './supabase'

/**
 * Dashboard service for fetching statistics and recent activity
 * Implements the Single Responsibility Principle by only handling dashboard data operations
 */
export interface DashboardStats {
  totalProperties: number
  totalUsers: number
  totalAgents: number
  totalBuilders: number
  totalBuyers: number
  totalResaleProperties: number
  totalRentalProperties: number
  totalNewProjects: number
  recentActivity: RecentActivity[]
  usersByRole: {
    buyers: UserInfo[]
    builders: UserInfo[]
    agents: UserInfo[]
  }
}

export interface UserInfo {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
  is_active: boolean
}

export interface RecentActivity {
  id: string
  type: 'property_added' | 'user_registered' | 'property_sold' | 'property_rented' | 'project_launched'
  title: string
  description: string
  timestamp: string
  userId?: string
  userName?: string
  propertyId?: string
}

/**
 * Fetches comprehensive dashboard statistics from the database
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Fetch user counts by role
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, role, first_name, last_name, created_at, email, is_active')
      .eq('is_active', true)

    if (usersError) throw usersError

    // Fetch property counts from resale_properties table
    const { data: resaleProperties, error: resaleError } = await supabase
      .from('resale_properties')
      .select('id, created_at, status, seller_name, asking_price')
      .eq('status', 'available')

    if (resaleError) throw resaleError

    // Fetch property counts from rental_properties table
    const { data: rentalProperties, error: rentalError } = await supabase
      .from('rental_properties')
      .select('id, created_at, status, owner_name, rent_amount')
      .eq('status', 'available')

    if (rentalError) throw rentalError

    // Fetch project counts from new_projects table
    const { data: newProjects, error: projectsError } = await supabase
      .from('new_projects')
      .select('id, created_at, status, project_name, crafted_by')
      .eq('status', 'active')

    if (projectsError) throw projectsError

    // Calculate statistics
    const totalUsers = users?.length || 0
    const totalAgents = users?.filter(u => u.role === 'AGENT').length || 0
    const totalBuilders = users?.filter(u => u.role === 'BUILDER').length || 0
    const totalBuyers = users?.filter(u => u.role === 'BUYER').length || 0
    const totalResaleProperties = resaleProperties?.length || 0
    const totalRentalProperties = rentalProperties?.length || 0
    const totalNewProjects = newProjects?.length || 0
    const totalProperties = totalResaleProperties + totalRentalProperties + totalNewProjects

    // Organize users by role
    const usersByRole = {
      buyers: users?.filter(u => u.role === 'BUYER') || [],
      builders: users?.filter(u => u.role === 'BUILDER') || [],
      agents: users?.filter(u => u.role === 'AGENT') || []
    }

    // Fetch recent activity
    const recentActivity = await getRecentActivity(users, resaleProperties, rentalProperties, newProjects)

    return {
      totalProperties,
      totalUsers,
      totalAgents,
      totalBuilders,
      totalBuyers,
      totalResaleProperties,
      totalRentalProperties,
      totalNewProjects,
      recentActivity,
      usersByRole
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

/**
 * Generates recent activity from various data sources
 */
async function getRecentActivity(
  users: any[],
  resaleProperties: any[],
  rentalProperties: any[],
  newProjects: any[]
): Promise<RecentActivity[]> {
  const activities: RecentActivity[] = []

  // Add recent user registrations (last 7 days)
  const recentUsers = users
    ?.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 5)
    .map(user => ({
      id: user.id,
      type: 'user_registered' as const,
      title: 'New User Registration',
      description: `${user.first_name || 'User'} ${user.last_name || ''} registered as ${user.role}`,
      timestamp: user.created_at,
      userId: user.id,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim()
    }))

  // Add recent resale property additions (last 7 days)
  const recentResale = resaleProperties
    ?.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 5)
    .map(property => ({
      id: property.id,
      type: 'property_added' as const,
      title: 'New Resale Property',
      description: `${property.seller_name} added resale property for ₹${property.asking_price?.toLocaleString() || 'N/A'}`,
      timestamp: property.created_at,
      propertyId: property.id
    }))

  // Add recent rental property additions (last 7 days)
  const recentRental = rentalProperties
    ?.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 5)
    .map(property => ({
      id: property.id,
      type: 'property_added' as const,
      title: 'New Rental Property',
      description: `${property.owner_name} added rental property for ₹${property.rent_amount?.toLocaleString() || 'N/A'}/month`,
      timestamp: property.created_at,
      propertyId: property.id
    }))

  // Add recent new project launches (last 7 days)
  const recentProjects = newProjects
    ?.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 5)
    .map(project => ({
      id: project.id,
      type: 'project_launched' as const,
      title: 'New Project Launched',
      description: `${project.project_name} by ${project.crafted_by} - ${project.construction_type}`,
      timestamp: project.created_at,
      propertyId: project.id
    }))

  // Combine and sort by timestamp, then limit to 20 total records
  activities.push(...(recentUsers || []), ...(recentResale || []), ...(recentRental || []), ...(recentProjects || []))
  
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20) // Limit to 20 records for better UI performance
}

/**
 * Fetches property analytics for charts and detailed statistics
 */
export async function getPropertyAnalytics() {
  try {
    // Get resale properties analytics
    const { data: resaleProperties, error: resaleError } = await supabase
      .from('resale_properties')
      .select('asking_price, status, property_type, created_at')

    if (resaleError) throw resaleError

    // Get rental properties analytics
    const { data: rentalProperties, error: rentalError } = await supabase
      .from('rental_properties')
      .select('rent_amount, status, property_type, created_at')

    if (rentalError) throw rentalError

    // Calculate analytics
    const totalResaleValue = resaleProperties?.reduce((sum, p) => sum + (p.asking_price || 0), 0) || 0
    const totalRentalValue = rentalProperties?.reduce((sum, p) => sum + (p.rent_amount || 0), 0) || 0
    
    const availableResaleProperties = resaleProperties?.filter(p => p.status === 'available').length || 0
    const availableRentalProperties = rentalProperties?.filter(p => p.status === 'available').length || 0

    // Property type distribution
    const resaleTypeDistribution = {
      apartment: resaleProperties?.filter(p => p.property_type === 'apartment').length || 0,
      gated_community: resaleProperties?.filter(p => p.property_type === 'gated_community_villa_or_bungalow').length || 0,
      independent_house: resaleProperties?.filter(p => p.property_type === 'independent_house').length || 0
    }

    const rentalTypeDistribution = {
      apartment: rentalProperties?.filter(p => p.property_type === 'apartment').length || 0,
      gated_community: rentalProperties?.filter(p => p.property_type === 'gated_community_villa_or_bungalow').length || 0,
      independent_house: rentalProperties?.filter(p => p.property_type === 'independent_house').length || 0
    }

    return {
      totalResaleValue,
      totalRentalValue,
      availableResaleProperties,
      availableRentalProperties,
      resaleTypeDistribution,
      rentalTypeDistribution
    }
  } catch (error) {
    console.error('Error fetching property analytics:', error)
    throw error
  }
}
