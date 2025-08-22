# Extended Tables Documentation

## Overview
This document describes the additional database tables created for the Aspire Property Management system, specifically designed to handle different types of property listings based on the forms provided.

## Table Structure

### 1. Resale Properties (`resale_properties`)
**Purpose**: Stores information about properties being sold by their current owners.

**Key Fields**:
- **Seller Information**: `seller_name`, `seller_email`, `seller_contact_no`, `seller_alternate_no`
- **Property Details**: `property_type`, `bhk_type`, `square_feet`, `carpet_area`, `location`
- **Pricing**: `asking_price`, `is_negotiable`
- **Features**: `parking_type`, `furnishing_type`, `property_age`, `has_amenities`
- **Tracking**: `created_by`, `last_modified_by`, `created_at`, `updated_at`

**Property Types**:
- `apartment` - Standard apartment units
- `gated_community_villa` - Villas in gated communities
- `independent_house` - Standalone houses

**BHK Types**:
- `1_rk_1_bhk` - 1 Room Kitchen or 1 Bedroom Hall Kitchen
- `2_bhk` - 2 Bedroom Hall Kitchen
- `3_bhk` - 3 Bedroom Hall Kitchen
- `4_bhk` - 4 Bedroom Hall Kitchen
- `5_bhk` - 5 Bedroom Hall Kitchen
- `5_plus_bhk` - 5+ Bedroom Hall Kitchen

### 2. Rental Properties (`rental_properties`)
**Purpose**: Stores information about properties available for rent.

**Key Fields**:
- **Owner Information**: `owner_name`, `owner_email`, `owner_contact_no`, `owner_alternate_no`
- **Property Details**: `property_type`, `bhk_type`, `location`
- **Rental Terms**: `rent_amount`, `rent_negotiable`, `deposit_amount`, `deposit_negotiable`
- **Tenant Restrictions**: `allowed_for_family`, `allowed_for_bachelor`, `allowed_for_anyone`, `pets_allowed`
- **Possession**: `immediate_possession`, `available_from_date`
- **Tracking**: `created_by`, `last_modified_by`, `created_at`, `updated_at`

**Special Features**:
- Tenant type restrictions (family, bachelor, anyone)
- Pet allowance settings
- Flexible possession dates

### 3. New Projects (`new_projects`)
**Purpose**: Stores information about new construction projects and developments.

**Key Fields**:
- **Project Information**: `project_name`, `crafted_by`, `project_type`, `construction_type`
- **Location**: `project_location`
- **Contact Details**: Multiple contact persons with names and numbers
- **Approval Status**: Government approval, RERA approval, loan availability
- **Marketing**: Social media marketing permissions
- **Tracking**: `created_by`, `last_modified_by`, `created_at`, `updated_at`

**Project Types**:
- `residence` - Residential projects
- `gated_community_villa` - Gated community developments
- `commercial` - Commercial properties
- `land_plot` - Land and plot sales

**Construction Types**:
- `new_launching` - Newly launched projects
- `under_construction` - Projects under construction
- `ready_to_move` - Ready to move in projects

### 4. Project Units (`project_units`)
**Purpose**: Stores individual unit details within new projects.

**Key Fields**:
- **Unit Specifications**: `land_area`, `tower_name`, `total_floors`, `carpet_area`
- **Pricing**: `starting_price_with_taxes`
- **Configuration**: `bhk_type`
- **Possession**: `possession_date`, `possession_years`
- **Status**: `available`, `booked`, `sold`, `reserved`
- **Tracking**: `created_by`, `last_modified_by`, `created_at`, `updated_at`

### 5. Project Amenities (`project_amenities`)
**Purpose**: Stores amenity information for new projects.

**Amenity Categories**:
- **Recreational**: `club_house`, `swimming_pool`, `children_play_area`, `gym`, `park`
- **Essential Services**: `power_backup`, `house_keeping`, `lift`, `security`
- **Infrastructure**: `gas_pipeline`, `rain_water_harvesting`, `sewage_treatment_plant`
- **Safety**: `fire_safety`, `visitor_parking`

### 6. Project Approvals (`project_approvals`)
**Purpose**: Stores regulatory and approval information for new projects.

**Key Fields**:
- **RERA Information**: `rera_number`
- **Availability**: `units_available_for_sale`
- **Performance**: `project_conversion_rate`
- **Tracking**: `created_by`, `last_modified_by`, `created_at`, `updated_at`

### 7. Property Activity Tracking (`property_activity_tracking`)
**Purpose**: Comprehensive monitoring of all property-related activities.

**Activity Types**:
- `property_view`, `property_save`, `property_share`, `property_inquiry`
- `contact_request`, `brochure_download`, `virtual_tour_view`
- `property_visit_scheduled`, `property_visit_completed`
- `offer_made`, `offer_accepted`, `offer_rejected`
- `property_status_change`, `price_update`, `amenity_update`
- `image_upload`, `document_upload`, `review_posted`, `rating_given`

### 8. Property Inquiries (`property_inquiries`)
**Purpose**: Detailed tracking of property inquiries and lead management.

**Inquiry Types**:
- `general_info`, `price_inquiry`, `visit_request`, `virtual_tour`
- `brochure_request`, `loan_inquiry`, `payment_plan`, `availability_check`
- `comparison_request`, `custom_requirement`

**Features**:
- Priority scoring and urgency levels
- Follow-up scheduling and notes
- Response tracking and assignment
- Budget and preference tracking

### 9. Property Views (`property_views`)
**Purpose**: Detailed analytics of property viewing behavior.

**Tracking Features**:
- View duration and engagement metrics
- Device and browser information
- Return visitor detection
- Interaction level classification
- Pages and content viewed

## Database Relationships

```
users (1) ←→ (1) agents
users (1) ←→ (1) builders
users (1) ←→ (1) admins

agents (1) ←→ (many) resale_properties
agents (1) ←→ (many) rental_properties

builders (1) ←→ (many) new_projects
new_projects (1) ←→ (many) project_units
new_projects (1) ←→ (1) project_amenities
new_projects (1) ←→ (1) project_approvals

users (1) ←→ (many) property_activity_tracking
users (1) ←→ (many) property_inquiries
users (1) ←→ (many) property_views

-- Property references in tracking tables
resale_properties (1) ←→ (many) property_activity_tracking
rental_properties (1) ←→ (many) property_activity_tracking
new_projects (1) ←→ (many) property_activity_tracking
```

## Row Level Security (RLS)

All tables implement Row Level Security with the following policies:

### Property Tables
- **View**: All authenticated users can view
- **Create**: Users can create properties (auth.uid() = created_by)
- **Update**: Users can update their own properties (auth.uid() = created_by)
- **Manage**: Assigned agents, builders, and admins can manage

### Activity Tracking Tables
- **View**: Users can view their own activities, agents can view for their properties, admins can view all
- **Create**: Users can create their own activities
- **Update**: Assigned agents can update inquiries

## Views

### 1. `resale_properties_view`
Combines resale properties with agent and creator information.

### 2. `rental_properties_view`
Combines rental properties with agent and creator information.

### 3. `new_projects_view`
Combines new projects with builder, approval, and creator information.

### 4. `property_analytics_summary`
Comprehensive analytics combining all property types with activity metrics.

## Data Validation

### Constraints
- **Contact Numbers**: Must match phone number format (+91XXXXXXXXXX)
- **Email Addresses**: Must be valid email format
- **Prices**: Must be positive numbers
- **Dates**: Must be valid dates
- **BHK Types**: Must be from predefined list
- **Property Types**: Must be from predefined list
- **Activity References**: Only one property reference allowed per activity

### Business Rules
- At least one tenant restriction must be selected for rental properties
- Property age and amenities are optional but tracked
- Negotiable flags for pricing flexibility
- Status tracking for property lifecycle management
- Comprehensive activity monitoring for all interactions

## Usage Examples

### Creating a Resale Property
```sql
INSERT INTO resale_properties (
  seller_name, seller_email, seller_contact_no,
  property_type, bhk_type, location, asking_price,
  furnishing_type, status, agent_id, created_by
) VALUES (
  'John Smith', 'john@email.com', '+919876543210',
  'apartment', '3_bhk', 'Mumbai', 8500000,
  'semi_furnished', 'available', 'agent-uuid-here', 'user-uuid-here'
);
```

### Creating a Rental Property
```sql
INSERT INTO rental_properties (
  owner_name, owner_email, owner_contact_no,
  property_type, bhk_type, location, rent_amount,
  furnishing_type, allowed_for_family, status, agent_id, created_by
) VALUES (
  'Jane Doe', 'jane@email.com', '+919876543211',
  'apartment', '2_bhk', 'Pune', 25000,
  'fully_furnished', true, 'available', 'agent-uuid-here', 'user-uuid-here'
);
```

### Creating a New Project
```sql
INSERT INTO new_projects (
  project_name, crafted_by, project_type, construction_type,
  project_location, status, builder_id, created_by
) VALUES (
  'Sunrise Residency', 'Premium Builders Inc', 'residence', 'new_launching',
  'Pune, Maharashtra', 'active', 'builder-uuid-here', 'user-uuid-here'
);
```

### Tracking Property Activity
```sql
INSERT INTO property_activity_tracking (
  activity_type, resale_property_id, user_id, activity_data
) VALUES (
  'property_view', 'property-uuid-here', 'user-uuid-here',
  '{"view_duration": 120, "pages_viewed": ["overview", "amenities"]}'
);
```

## Performance Considerations

### Indexes
- Primary keys on all tables
- Foreign key indexes for relationships
- Search indexes on location, price, and status fields
- Activity tracking indexes for analytics
- User and creator indexes for security

### Query Optimization
- Use views for complex joins
- Leverage RLS policies for security
- Implement pagination for large result sets
- Use appropriate data types for efficient storage
- Activity aggregation for analytics

## Security Features

### Authentication
- All tables require authenticated users
- UUID-based primary keys for security
- Timestamp tracking for audit trails

### Authorization
- Role-based access control
- Creator-specific data isolation
- Agent-specific property management
- Builder-specific project management
- Admin oversight capabilities

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection through proper escaping
- Audit logging for sensitive operations
- Comprehensive activity tracking

## Migration Notes

### From Existing System
1. Run `setup_all_tables.sql` first
2. Execute `setup_extended_tables.sql` for new tables
3. Verify all tables and policies are created
4. Test with sample data before production use

### Data Import
- Ensure data format compliance
- Validate foreign key relationships
- Check constraint compliance
- Test RLS policies with imported data
- Include created_by field for all properties

## Maintenance

### Regular Tasks
- Monitor table sizes and growth
- Check index performance
- Review RLS policy effectiveness
- Update statistics for query optimization
- Monitor activity tracking performance

### Backup Considerations
- Include all new tables in backup strategy
- Test restore procedures with new schema
- Document any custom functions or triggers
- Maintain version control for schema changes
- Backup activity tracking data separately if needed

## Analytics and Reporting

### Key Metrics
- Property views and engagement
- Inquiry conversion rates
- User interaction patterns
- Performance by property type
- Agent and builder performance

### Reporting Views
- `property_analytics_summary` - Comprehensive property performance
- Activity tracking for user behavior analysis
- Inquiry management and follow-up tracking
- View analytics for optimization
