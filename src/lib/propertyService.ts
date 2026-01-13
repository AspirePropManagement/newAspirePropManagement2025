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
  furnishingType?: string;
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
  openSpace?: string;
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
  availableBhkTypes?: string[];
  // Property details fields
  carpetArea?: string;
  squareFeet?: string;
  propertyAge?: string;
  floorNo?: string;
  facing?: string;
  parkingType?: string;
  furnishingType?: string;
  askingPrice?: string;
  description?: string;
  societyName?: string;
  documents?: string[];
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
    
    // Build insert data with all available fields from the actual schema
    const insertData: any = {
      // Required fields
      seller_name: data.sellerName,
      seller_email: data.sellerEmail,
      seller_contact_no: data.contactNumber,
      property_type: data.propertyType,
      bhk_type: data.bhkType,
      location: data.location,
      furnishing_type: data.furnishingType,
      asking_price: data.askingPrice ? parseFloat(data.askingPrice) : null,
      status: data.status || 'available',
      created_by: currentUserId
    };

    // Optional basic fields
    if (data.alternateNumber) insertData.seller_alternate_no = data.alternateNumber;
    if (data.societyName) insertData.society_name = data.societyName;
    if (data.squareFeet && data.squareFeet.trim() !== '') {
      const squareFeetValue = parseInt(data.squareFeet, 10);
      if (!isNaN(squareFeetValue) && squareFeetValue > 0) {
        insertData.square_feet = squareFeetValue;
      }
    }
    if (data.carpetArea && data.carpetArea.trim() !== '') {
      const carpetAreaValue = parseInt(data.carpetArea, 10);
      if (!isNaN(carpetAreaValue) && carpetAreaValue > 0) {
        insertData.carpet_area = carpetAreaValue;
      }
    }
    if (data.floorNo) insertData.floor_no = data.floorNo;
    if (data.facing) insertData.facing = data.facing;
    if (data.parkingType) insertData.parking_type = data.parkingType;
    if (data.isNegotiable !== undefined) insertData.is_negotiable = data.isNegotiable;
    if (data.propertyAge) insertData.property_age = data.propertyAge;
    if (data.hasAmenities !== undefined) insertData.has_amenities = data.hasAmenities;
    if (data.notes) insertData.notes = data.notes;
    
    // Extended resale fields that exist in the actual schema
    if ((data as any).ownershipType) insertData.ownership_type = (data as any).ownershipType;
    if ((data as any).loanOnProperty !== undefined) insertData.loan_on_property = (data as any).loanOnProperty === 'true';
    if ((data as any).loanAmount) insertData.loan_amount = parseFloat((data as any).loanAmount);
    if ((data as any).bankName) insertData.bank_name = (data as any).bankName;
    if ((data as any).reasonForSale) insertData.reason_for_sale = (data as any).reasonForSale;
    if ((data as any).flatsPerFloor) insertData.flats_per_floor = (data as any).flatsPerFloor;
    if ((data as any).societyAreaSize) insertData.society_area_size = (data as any).societyAreaSize;
    if ((data as any).reraId) insertData.rera_id = (data as any).reraId;
    if ((data as any).parkingVehicles) insertData.parking_vehicles = (data as any).parkingVehicles;
    if ((data as any).visitDaysWeekend) insertData.visit_days_weekend = (data as any).visitDaysWeekend;
    if ((data as any).visitTimingWeekendFrom && (data as any).visitTimingWeekendTo) {
      insertData.visit_timing_weekend = `${(data as any).visitTimingWeekendFrom}-${(data as any).visitTimingWeekendTo}`;
    }
    if ((data as any).visitDaysWeekdays) insertData.visit_days_weekdays = (data as any).visitDaysWeekdays;
    if ((data as any).visitTimingWeekdaysFrom && (data as any).visitTimingWeekdaysTo) {
      insertData.visit_timing_weekdays = `${(data as any).visitTimingWeekdaysFrom}-${(data as any).visitTimingWeekdaysTo}`;
    }
    if ((data as any).listedBy) insertData.listed_by = (data as any).listedBy;
    
    // Additional fields from the schema
    if ((data as any).addressLine) insertData.address_line = (data as any).addressLine;
    if ((data as any).city) insertData.city = (data as any).city;
    if ((data as any).state) insertData.state = (data as any).state;
    if ((data as any).country) insertData.country = (data as any).country;
    if ((data as any).postalCode) insertData.postal_code = (data as any).postalCode;
    if ((data as any).latitude) insertData.latitude = parseFloat((data as any).latitude);
    if ((data as any).longitude) insertData.longitude = parseFloat((data as any).longitude);
    if ((data as any).totalFloors) insertData.total_floors = parseInt((data as any).totalFloors);
    if ((data as any).possessionStatus) insertData.possession_status = (data as any).possessionStatus;
    if ((data as any).possessionDate) insertData.possession_date = (data as any).possessionDate;
    if ((data as any).availableFrom) insertData.available_from = (data as any).availableFrom;
    if ((data as any).maintenanceCharge) insertData.maintenance_charge = parseFloat((data as any).maintenanceCharge);
    if ((data as any).maintenanceFrequency) insertData.maintenance_frequency = (data as any).maintenanceFrequency;
    
    // JSON fields - Extract from propertyImages structure
    insertData.property_images = data.propertyImages ? data.propertyImages : {};
    insertData.amenities = data.amenities || {};
    
    // Map individual image fields from propertyImages
    if (data.propertyImages) {
      insertData.general_photos = data.propertyImages.general_photos || {};
      insertData.floor_plans = data.propertyImages.floor_plans || {};
      insertData.legal_docs = data.propertyImages.legal_docs || [];
      insertData.virtual_content = data.propertyImages.virtual_content || [];
    } else {
      insertData.general_photos = {};
      insertData.floor_plans = {};
      insertData.legal_docs = [];
      insertData.virtual_content = [];
    }
    insertData.documents = [];
    
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
    
    // Build insert data with all available fields from the actual schema
    const insertData: any = {
      // Required fields
      owner_name: data.sellerName,
      owner_email: data.sellerEmail,
      owner_contact_no: data.contactNumber,
      property_type: data.propertyType,
      bhk_type: data.bhkType,
      location: data.location,
      furnishing_type: data.furnishingType,
      rent_amount: data.rentAmount ? parseFloat(data.rentAmount) : null,
      status: data.status || 'available',
      created_by: currentUserId
    };

    // Optional basic fields
    if (data.alternateNumber) insertData.owner_alternate_no = data.alternateNumber;
    if (data.societyName) insertData.society_name = data.societyName;
    if (data.floorNo) insertData.floor_no = data.floorNo;
    if (data.isNegotiable !== undefined) insertData.rent_negotiable = data.isNegotiable;
    if (data.depositAmount) insertData.deposit_amount = parseFloat(data.depositAmount);
    if (data.depositAmount && data.isNegotiable !== undefined) insertData.deposit_negotiable = data.isNegotiable;
    if (data.petsAllowed !== undefined) insertData.pets_allowed = data.petsAllowed;
    if (data.parkingType) insertData.parking_type = data.parkingType;
    if (data.immediatePossession !== undefined) insertData.immediate_possession = data.immediatePossession;
    if (data.availableFromDate) insertData.available_from_date = data.availableFromDate;
    if (data.visitDetails) insertData.visit_details = data.visitDetails;
    if (data.hasAmenities !== undefined) insertData.has_amenities = data.hasAmenities;
    if (data.notes) insertData.notes = data.notes;
    
    // Extended rental fields that exist in the actual schema
    if ((data as any).tenantType) insertData.tenant_type = (data as any).tenantType;
    if ((data as any).parkingVehicles) insertData.parking_vehicles = (data as any).parkingVehicles;
    if ((data as any).visitDaysWeekend) insertData.visit_days_weekend = (data as any).visitDaysWeekend;
    if ((data as any).visitTimingWeekendFrom && (data as any).visitTimingWeekendTo) {
      insertData.visit_timing_weekend = `${(data as any).visitTimingWeekendFrom}-${(data as any).visitTimingWeekendTo}`;
    }
    if ((data as any).visitDaysWeekdays) insertData.visit_days_weekdays = (data as any).visitDaysWeekdays;
    if ((data as any).visitTimingWeekdaysFrom && (data as any).visitTimingWeekdaysTo) {
      insertData.visit_timing_weekdays = `${(data as any).visitTimingWeekdaysFrom}-${(data as any).visitTimingWeekdaysTo}`;
    }
    if ((data as any).listedBy) insertData.listed_by = (data as any).listedBy;
    
    // JSON fields - Extract from propertyImages structure
    insertData.property_images = data.propertyImages ? data.propertyImages : {};
    insertData.amenities = data.amenities || {};
    
    // Map individual image fields from propertyImages
    if (data.propertyImages) {
      insertData.general_photos = data.propertyImages.general_photos || {};
      insertData.floor_plans = data.propertyImages.floor_plans || {};
      insertData.legal_docs = data.propertyImages.legal_docs || [];
      insertData.virtual_content = data.propertyImages.virtual_content || [];
    } else {
      insertData.general_photos = {};
      insertData.floor_plans = {};
      insertData.legal_docs = [];
      insertData.virtual_content = [];
    }
    insertData.documents = [];

    console.log('Rental property insert data:', insertData);
    
    const { data: property, error } = await supabase
      .from('rental_properties')
      .insert(insertData)
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
    
    // Debug: Log the incoming data
    console.log('New project data received:', data);
    
    // Validate required fields
    const projectType = data.projectType || data.propertyType;
    console.log('Project type resolved:', projectType);
    
    if (!projectType) {
      return { success: false, error: 'Project type is required' };
    }

    // Validate project type against database constraints
    const validProjectTypes = ['residence', 'gated_community_villa_or_bungalow', 'commercial', 'land_or_plot'];
    if (!validProjectTypes.includes(projectType)) {
      return { success: false, error: `Invalid project type. Must be one of: ${validProjectTypes.join(', ')}` };
    }

    // Validate construction type against database constraints
    const validConstructionTypes = ['new_launching', 'under_construction', 'ready_to_move', 'partial_ready_to_move'];
    if (data.constructionType && !validConstructionTypes.includes(data.constructionType)) {
      return { success: false, error: `Invalid construction type. Must be one of: ${validConstructionTypes.join(', ')}` };
    }

    // Build insert data with all available fields from the actual schema
    const insertData: any = {
      // Required fields
      crafted_by: data.craftedBy || data.sellerName,
      project_name: data.projectName || `Project in ${data.location}`,
      project_type: projectType,
      construction_type: data.constructionType || 'new_launching',
      project_location: data.location,
      status: data.status || 'active',
      created_by: currentUserId
    };

    // Optional basic fields
    if (data.roomsPerFloor) insertData.rooms_per_floor = data.roomsPerFloor;
    if (data.openSpace) insertData.open_space = parseFloat(data.openSpace);
    if (data.cpSables) insertData.cp_sables = data.cpSables;
    if (data.otherNotes) insertData.project_description = data.otherNotes;
    if (data.contactName1 || data.sellerName) insertData.contact_name_1 = data.contactName1 || data.sellerName;
    if (data.contactNumber1 || data.contactNumber) insertData.contact_number_1 = data.contactNumber1 || data.contactNumber;
    if (data.contactName2) insertData.contact_name_2 = data.contactName2;
    if (data.contactNumber2) insertData.contact_number_2 = data.contactNumber2;
    // Set compliance and approval fields as hardcoded (as requested)
    insertData.is_govt_approved = false;
    insertData.is_rera_approved = false;
    insertData.loan_available = false;
    insertData.social_media_marketing_allowed = false;
    if (data.unitsAvailableForSale) insertData.units_available_for_sale = data.unitsAvailableForSale;
    if (data.reraNumber) insertData.rera_number = data.reraNumber;
    if (data.projectConversionRate) insertData.project_conversion_rate = data.projectConversionRate;
    
    // Extended new project fields that exist in the actual schema
    if ((data as any).totalProjectAreaSize) insertData.total_project_area_size = (data as any).totalProjectAreaSize;
    if ((data as any).towersCount) insertData.towers_count = parseInt((data as any).towersCount);
    if ((data as any).totalFloors) insertData.total_floors = parseInt((data as any).totalFloors);
    if ((data as any).puggestionDate) insertData.puggestion_date = (data as any).puggestionDate;
    if ((data as any).puggestionYear) insertData.puggestion_year = parseInt((data as any).puggestionYear);
    if ((data as any).flatsPerFloor) insertData.flats_per_floor = (data as any).flatsPerFloor;
    if ((data as any).roi) insertData.roi = (data as any).roi;
    if ((data as any).rentalYield) insertData.rental_yield = parseFloat((data as any).rentalYield);
    if ((data as any).marketedBy) insertData.marketed_by = (data as any).marketedBy;
    if ((data as any).listedBy) insertData.listed_by = (data as any).listedBy;
    if ((data as any).facingVastu) insertData.facing_vastu = (data as any).facingVastu;
    
    // Available BHK types for new projects
    if ((data as any).availableBhkTypes && Array.isArray((data as any).availableBhkTypes)) {
      insertData.available_bhk_types = (data as any).availableBhkTypes;
    } else {
      insertData.available_bhk_types = [];
    }

    // Property details fields
    if ((data as any).carpetArea && String((data as any).carpetArea).trim() !== '') {
      const carpetAreaValue = parseFloat(String((data as any).carpetArea));
      if (!isNaN(carpetAreaValue) && carpetAreaValue > 0) {
        insertData.carpet_area = carpetAreaValue;
      }
    }
    if ((data as any).squareFeet && String((data as any).squareFeet).trim() !== '') {
      const squareFeetValue = parseFloat(String((data as any).squareFeet));
      if (!isNaN(squareFeetValue) && squareFeetValue > 0) {
        insertData.square_feet = squareFeetValue;
      }
    }
    if ((data as any).propertyAge) insertData.property_age = (data as any).propertyAge;
    if ((data as any).floorNo) insertData.floor_no = (data as any).floorNo;
    if ((data as any).facing) insertData.facing = (data as any).facing;
    if ((data as any).parkingType) insertData.parking_type = (data as any).parkingType;
    if ((data as any).furnishingType) insertData.furnishing_type = (data as any).furnishingType;
    if ((data as any).askingPrice) insertData.asking_price = parseFloat((data as any).askingPrice);
    if ((data as any).description) insertData.description = (data as any).description;
    if ((data as any).societyName) insertData.society_name = (data as any).societyName;
    // Set latitude and longitude as empty (hardcoded as requested)
    insertData.latitude = null;
    insertData.longitude = null;
    if ((data as any).launchDate) insertData.launch_date = (data as any).launchDate;
    if ((data as any).possessionDate) insertData.possession_date = (data as any).possessionDate;
    if ((data as any).minPrice) insertData.min_price = parseFloat((data as any).minPrice);
    if ((data as any).websiteUrl) insertData.website_url = (data as any).websiteUrl;
    if ((data as any).brochureUrl) insertData.brochure_url = (data as any).brochureUrl;
    
    // Set default currency code
    insertData.currency_code = 'INR';
    
    // Amenities boolean fields from the schema - extract from amenities object
    if (data.amenities && typeof data.amenities === 'object') {
      insertData.club_house = Boolean(data.amenities.club_house);
      insertData.swimming_pool = Boolean(data.amenities.swimming_pool);
      insertData.children_play_area = Boolean(data.amenities.children_play_area);
      insertData.power_backup = Boolean(data.amenities.power_backup);
      insertData.house_keeping = Boolean(data.amenities.house_keeping);
      insertData.lift = Boolean(data.amenities.lift);
      insertData.gym = Boolean(data.amenities.gym);
      insertData.park = Boolean(data.amenities.park);
      insertData.security = Boolean(data.amenities.security);
      insertData.gas_pipeline = Boolean(data.amenities.gas_pipeline);
      insertData.rain_water_harvesting = Boolean(data.amenities.rain_water_harvesting);
      insertData.sewage_treatment_plant = Boolean(data.amenities.sewage_treatment_plant);
      insertData.visitor_parking = Boolean(data.amenities.visitor_parking);
      insertData.fire_safety = Boolean(data.amenities.fire_safety);
    } else {
      // Set all amenities to false if no amenities data
      insertData.club_house = false;
      insertData.swimming_pool = false;
      insertData.children_play_area = false;
      insertData.power_backup = false;
      insertData.house_keeping = false;
      insertData.lift = false;
      insertData.gym = false;
      insertData.park = false;
      insertData.security = false;
      insertData.gas_pipeline = false;
      insertData.rain_water_harvesting = false;
      insertData.sewage_treatment_plant = false;
      insertData.visitor_parking = false;
      insertData.fire_safety = false;
    }
    
    // JSON fields - Extract from propertyImages structure
    insertData.property_images = data.propertyImages ? data.propertyImages : {};
    insertData.amenities = data.amenities || {};
    
    // Map individual image fields from propertyImages
    if (data.propertyImages) {
      insertData.general_photos = data.propertyImages.general_photos || {};
      insertData.floor_plans = data.propertyImages.floor_plans || {};
      insertData.project_images = data.propertyImages.project_images || [];
      insertData.legal_docs = data.propertyImages.legal_docs || [];
      insertData.virtual_content = data.propertyImages.virtual_content || [];
    } else {
      insertData.general_photos = {};
      insertData.floor_plans = {};
      insertData.project_images = [];
      insertData.legal_docs = [];
      insertData.virtual_content = [];
    }
    insertData.documents = data.documents || [];

    console.log('New project insert data:', insertData);
    
    const { data: project, error } = await supabase
      .from('new_projects')
      .insert(insertData)
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
