# Database Tables Schema

This folder contains all the SQL files needed to set up the Aspire Property Management database schema.

## 📋 **Table Structure**

### **Core Tables**
- `01_users.sql` - Base user profiles
- `02_admins.sql` - Admin roles and permissions
- `03_agents.sql` - Real estate agents
- `04_buyers.sql` - Property buyers
- `05_builders.sql` - Property developers
- `06_properties.sql` - Property listings

### **Helper Functions**
- `07_functions.sql` - Database functions for role management

## 🚀 **Setup Instructions**

1. **Execute tables in order** (01, 02, 03, 04, 05, 06, 07)
2. **Copy each SQL file** into your Supabase SQL Editor
3. **Run the SQL** to create tables and policies
4. **Verify** all tables are created successfully

## 🔒 **Security Features**

- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** with granular permissions
- **Data isolation** between different user types
- **Admin hierarchy** with super_admin, admin, and moderator levels

## 📊 **Data Relationships**

```
users (1) ←→ (1) admins
users (1) ←→ (1) agents  
users (1) ←→ (1) buyers
users (1) ←→ (1) builders
agents (1) ←→ (many) properties
builders (1) ←→ (many) properties
```

## 🧪 **Testing**

After setup, test:
- User registration and authentication
- Role assignment and permissions
- Data access based on user roles
- Property management by agents/builders
