import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper function to get current user ID from localStorage
 */
function getCurrentUserId(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.id;
      }
    }
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
  }
  return null;
}

export interface PropertyFormData {
  // Basic Information
  sellerName: string;
  sellerEmail: string;
  contactNumber: string;
  alternateNumber?: string;
  bhkType: string;
  propertyType: string;
  location: string;
  
  // Property Details
  societyName?: string;
  flatNo?: string;
  wingNo?: string;
  floorNo?: string;
  facing?: string;
  parkingType?: string;
  furnishingType: string;
  squareFeet?: string;
  carpetArea?: string;
  askingPrice?: string;
  rentAmount?: string;
  depositAmount?: string;
  isNegotiable?: boolean;
  propertyAge?: string;
  hasAmenities?: boolean;
  allowedForFamily?: boolean;
  allowedForBachelor?: boolean;
  allowedForAnyone?: boolean;
  petsAllowed?: boolean;
  immediatePossession?: boolean;
  availableFromDate?: string;
  visitDetails?: string;
  notes?: string;
  
  // Images & Documents
  propertyImages: any;
  
  // Amenities
  amenities: any;
  
  // Status
  status: string;
}

export interface ResalePropertyData extends PropertyFormData {
  askingPrice: string;
  isNegotiable: boolean;
  propertyAge: string;
}

export interface RentalPropertyData extends PropertyFormData {
  rentAmount: string;
  depositAmount?: string;
  allowedForFamily: boolean;
  allowedForBachelor: boolean;
  allowedForAnyone: boolean;
  petsAllowed: boolean;
  immediatePossession: boolean;
  availableFromDate?: string;
}

export interface NewProjectData extends PropertyFormData {
  craftedBy: string;
  projectName: string;
  projectType: string;
  constructionType: string;
  projectLocation: string;
  roomsPerFloor?: string;
  cpSables?: string;
  otherNotes?: string;
  contactName1?: string;
  contactNumber1?: string;
  contactName2?: string;
  contactNumber2?: string;
  isGovtApproved?: boolean;
  isReraApproved?: boolean;
  loanAvailable?: boolean;
  socialMediaMarketingAllowed?: boolean;
  importantNotes?: string;
  unitsAvailableForSale?: string;
  reraNumber?: string;
  projectConversionRate?: string;
}

/**
 * Creates a new resale property in the database
 */
export async function createResaleProperty(data: ResalePropertyData, userId?: string) {
  try {
    // Get current user ID if not provided
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
      return { success: false, error: 'No user logged in. Please login first.' };
    }
    
    console.log('Creating resale property with data:', data);
    console.log('User ID:', currentUserId);
    
    const insertData = {
      seller_name: data.sellerName,
      seller_email: data.sellerEmail,
      seller_contact_no: data.contactNumber,
      seller_alternate_no: data.alternateNumber,
      property_type: data.propertyType,
      society_name: data.societyName,
      bhk_type: data.bhkType,
      square_feet: data.squareFeet ? parseInt(data.squareFeet) : null,
      carpet_area: data.carpetArea ? parseInt(data.carpetArea) : null,
      location: data.location,
      flat_no: data.flatNo,
      wing_no: data.wingNo,
      floor_no: data.floorNo,
      facing: data.facing,
      parking_type: data.parkingType,
      furnishing_type: data.furnishingType,
      asking_price: data.askingPrice ? parseFloat(data.askingPrice) : null,
      is_negotiable: data.isNegotiable,
      property_age: data.propertyAge,
      has_amenities: data.hasAmenities,
      status: data.status,
      property_images: data.propertyImages ? data.propertyImages : {},
      amenities: data.amenities || {},
      documents: [],
      notes: data.notes,
      // New resale fields mapping
      ownership_type: (data as any).ownershipType || null,
      loan_on_property: (data as any).loanOnProperty === 'true' ? true : (data as any).loanOnProperty === 'false' ? false : null,
      loan_amount: (data as any).loanAmount ? parseFloat((data as any).loanAmount) : null,
      bank_name: (data as any).bankName || null,
      reason_for_sale: (data as any).reasonForSale || null,
      flats_per_floor: (data as any).flatsPerFloor || null,
      society_area_size: (data as any).societyAreaSize || null,
      rera_id: (data as any).reraId || null,
      parking_vehicles: (data as any).parkingVehicles || [],
      visit_days_weekend: (data as any).visitDaysWeekend || null,
      visit_timing_weekend: ((data as any).visitTimingWeekendFrom && (data as any).visitTimingWeekendTo)
        ? `${(data as any).visitTimingWeekendFrom}-${(data as any).visitTimingWeekendTo}`
        : null,
      visit_days_weekdays: (data as any).visitDaysWeekdays || null,
      visit_timing_weekdays: ((data as any).visitTimingWeekdaysFrom && (data as any).visitTimingWeekdaysTo)
        ? `${(data as any).visitTimingWeekdaysFrom}-${(data as any).visitTimingWeekdaysTo}`
        : null,
      listed_by: (data as any).listedBy || null,
      created_by: currentUserId
    };
    
    console.log('Insert data prepared:', insertData);
    
    const { data: property, error } = await supabase
      .from('resale_properties')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Property created successfully:', property);
    return { success: true, data: property };
  } catch (error) {
    console.error('Error creating resale property:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Creates a new rental property in the database
 */
export async function createRentalProperty(data: RentalPropertyData, userId?: string) {
  try {
    // Get current user ID if not provided
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
      return { success: false, error: 'No user logged in. Please login first.' };
    }
    
    const { data: property, error } = await supabase
      .from('rental_properties')
      .insert({
        owner_name: data.sellerName,
        owner_email: data.sellerEmail,
        owner_contact_no: data.contactNumber,
        owner_alternate_no: data.alternateNumber,
        property_type: data.propertyType,
        society_name: data.societyName,
        bhk_type: data.bhkType,
        location: data.location,
        flat_no: data.flatNo,
        wing_no: data.wingNo,
        floor_no: data.floorNo,
        rent_amount: data.rentAmount ? parseFloat(data.rentAmount) : null,
        rent_negotiable: data.isNegotiable,
        deposit_amount: data.depositAmount ? parseFloat(data.depositAmount) : null,
        deposit_negotiable: data.isNegotiable,
        allowed_for_family: data.allowedForFamily,
        allowed_for_bachelor: data.allowedForBachelor,
        allowed_for_anyone: data.allowedForAnyone,
        pets_allowed: data.petsAllowed,
        parking_type: data.parkingType,
        furnishing_type: data.furnishingType,
        immediate_possession: data.immediatePossession,
        available_from_date: data.availableFromDate,
        visit_details: data.visitDetails,
        has_amenities: data.hasAmenities,
        status: data.status,
        property_images: data.propertyImages ? data.propertyImages : {},
        amenities: data.amenities || {},
        documents: [],
        notes: data.notes,
        created_by: currentUserId
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: property };
  } catch (error) {
    console.error('Error creating rental property:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Creates a new project in the database
 */
export async function createNewProject(data: NewProjectData, userId?: string) {
  try {
    // Get current user ID if not provided
    const currentUserId = userId || getCurrentUserId();
    if (!currentUserId) {
      return { success: false, error: 'No user logged in. Please login first.' };
    }
    
    const { data: project, error } = await supabase
      .from('new_projects')
      .insert({
        crafted_by: data.craftedBy || data.sellerName,
        project_name: data.projectName || `Project in ${data.location}`,
        project_type: data.projectType,
        construction_type: data.constructionType || 'new_launching',
        project_location: data.location,
        rooms_per_floor: data.roomsPerFloor,
        cp_sables: data.cpSables,
        other_notes: data.otherNotes,
        contact_name_1: data.contactName1 || data.sellerName,
        contact_number_1: data.contactNumber1 || data.contactNumber,
        contact_name_2: data.contactName2,
        contact_number_2: data.contactNumber2,
        is_govt_approved: data.isGovtApproved,
        is_rera_approved: data.isReraApproved,
        loan_available: data.loanAvailable,
        social_media_marketing_allowed: data.socialMediaMarketingAllowed,
        important_notes: data.importantNotes,
        units_available_for_sale: data.unitsAvailableForSale,
        rera_number: data.reraNumber,
        project_conversion_rate: data.projectConversionRate,
        status: data.status,
        property_images: data.propertyImages ? data.propertyImages : {},
        amenities: data.amenities || {},
        documents: [],
        created_by: currentUserId
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: project };
  } catch (error) {
    console.error('Error creating new project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Fetches all properties by type from the database
 */
export async function getPropertiesByType(type: 'resale' | 'rental' | 'new_project', userId?: string) {
  try {
    let query;
    
    switch (type) {
      case 'resale':
        query = supabase.from('resale_properties').select('*');
        break;
      case 'rental':
        query = supabase.from('rental_properties').select('*');
        break;
      case 'new_project':
        query = supabase.from('new_projects').select('*');
        break;
      default:
        throw new Error('Invalid property type');
    }

    if (userId) {
      query = query.eq('created_by', userId);
    }

    const { data: properties, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: properties };
  } catch (error) {
    console.error(`Error fetching ${type} properties:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Fetches a single property by ID
 */
export async function getPropertyById(type: 'resale' | 'rental' | 'new_project', id: string) {
  try {
    let query;
    
    switch (type) {
      case 'resale':
        query = supabase.from('resale_properties').select('*').eq('id', id);
        break;
      case 'rental':
        query = supabase.from('rental_properties').select('*').eq('id', id);
        break;
      case 'new_project':
        query = supabase.from('new_projects').select('*').eq('id', id);
        break;
      default:
        throw new Error('Invalid property type');
    }

    const { data: property, error } = await query.single();

    if (error) throw error;
    return { success: true, data: property };
  } catch (error) {
    console.error(`Error fetching ${type} property:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Updates a property by ID
 */
export async function updateProperty(
  type: 'resale' | 'rental' | 'new_project', 
  id: string, 
  data: Partial<PropertyFormData>
) {
  try {
    let query;
    
    switch (type) {
      case 'resale':
        query = supabase.from('resale_properties').update(data).eq('id', id);
        break;
      case 'rental':
        query = supabase.from('rental_properties').update(data).eq('id', id);
        break;
      case 'new_project':
        query = supabase.from('new_projects').update(data).eq('id', id);
        break;
      default:
        throw new Error('Invalid property type');
    }

    const { data: property, error } = await query.select().single();

    if (error) throw error;
    return { success: true, data: property };
  } catch (error) {
    console.error(`Error updating ${type} property:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Deletes a property by ID
 */
export async function deleteProperty(type: 'resale' | 'rental' | 'new_project', id: string) {
  try {
    let query;
    
    switch (type) {
      case 'resale':
        query = supabase.from('resale_properties').delete().eq('id', id);
        break;
      case 'rental':
        query = supabase.from('rental_properties').delete().eq('id', id);
        break;
      case 'new_project':
        query = supabase.from('new_projects').delete().eq('id', id);
        break;
      default:
        throw new Error('Invalid property type');
    }

    const { error } = await query;

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${type} property:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

/**
 * Test function to create a simple property for debugging
 */
export async function testPropertySubmission() {
  try {
    console.log('Starting test property submission...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Get logged-in user from localStorage
    let userId: string | null = null;
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          userId = user.id;
          console.log('Found logged-in user:', user);
        } else {
          console.log('No user found in localStorage');
        }
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }
    
    if (!userId) {
      return { success: false, error: 'No user logged in. Please login first.' };
    }
    
    console.log('Using user ID:', userId);
    
    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    console.log('Database connection test:', { testData, testError });
    
    if (testError) {
      console.error('Database connection failed:', testError);
      return { success: false, error: `Database connection failed: ${testError.message}` };
    }
    
    const testPropertyData = {
      sellerName: 'Test Seller',
      sellerEmail: 'test@example.com',
      contactNumber: '+911234567890',
      alternateNumber: '+911234567891',
      bhkType: '2_bhk',
      propertyType: 'apartment',
      location: 'Test Location',
      societyName: 'Test Society',
      flatNo: 'A-101',
      wingNo: 'A',
      floorNo: '1',
      facing: 'North',
      parkingType: 'covered_parking',
      furnishingType: 'semi_furnished',
      squareFeet: '1000',
      carpetArea: '900',
      askingPrice: '500000',
      isNegotiable: true,
      propertyAge: '2',
      hasAmenities: true,
      notes: 'Test property for debugging',
      status: 'available',
      propertyImages: {},
      amenities: {}
    };

    console.log('Test data prepared:', testPropertyData);
    
    // First, let's check if the table exists and what the structure is
    const { data: tableInfo, error: tableError } = await supabase
      .from('resale_properties')
      .select('*')
      .limit(1);
    
    console.log('Table structure test:', { tableInfo, tableError });
    
    if (tableError) {
      console.error('Table access error:', tableError);
      return { success: false, error: `Table access failed: ${tableError.message}` };
    }
    
    // Let's also try to get the table schema information
    try {
      const { data: schemaInfo, error: schemaError } = await supabase
        .rpc('get_table_columns', { table_name: 'resale_properties' });
      console.log('Schema info:', { schemaInfo, schemaError });
    } catch (schemaError) {
      console.log('Could not get schema info:', schemaError);
    }
    
    // Let's try a simple insert with minimal fields to see what the actual error is
    console.log('Attempting simple insert...');
    
    // Create property with created_by field using correct field names
    console.log('Trying insert with correct field names...');
    const { data: property, error: insertError } = await supabase
      .from('resale_properties')
      .insert({
        seller_name: testPropertyData.sellerName,
        seller_email: testPropertyData.sellerEmail,
        seller_contact_no: testPropertyData.contactNumber,
        property_type: testPropertyData.propertyType,
        bhk_type: testPropertyData.bhkType,
        location: testPropertyData.location,
        furnishing_type: testPropertyData.furnishingType,
        asking_price: parseFloat(testPropertyData.askingPrice),
        status: testPropertyData.status,
        property_images: {},
        amenities: {},
        created_by: userId
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Simple insert error:', insertError);
      return { success: false, error: `Insert failed: ${insertError.message}` };
    }
    
    console.log('Simple property created:', property);
    return { success: true, data: property };
  } catch (error) {
    console.error('Test property submission error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}
