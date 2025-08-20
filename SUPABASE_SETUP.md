# Supabase Setup Guide for Aspire Property Management

This guide will help you set up Supabase authentication and database for the Aspire Property Management application.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- Basic knowledge of SQL and database management

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `aspire-prop-management`
   - Database Password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually 2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon (public) key
3. Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 3: Set Up Database Tables

Run the following SQL in your Supabase SQL Editor:

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'agent', 'buyer', 'builder')) NOT NULL DEFAULT 'buyer',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Organizations Table
```sql
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE organization_id = organizations.id AND id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all organizations" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Properties Table
```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT CHECK (property_type IN ('residential', 'commercial', 'land')) NOT NULL,
  status TEXT CHECK (status IN ('available', 'sold', 'pending')) NOT NULL DEFAULT 'available',
  agent_id UUID REFERENCES users(id) NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Agents can manage their own properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'agent')
    ) AND agent_id = auth.uid()
  );

CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Step 4: Set Up Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add your production domain when ready
3. Enable Email confirmations (recommended for production)
4. Configure email templates if needed

## Step 5: Set Up Row Level Security (RLS)

The SQL above already includes RLS policies, but you can customize them based on your needs:

1. Go to Authentication > Policies in your Supabase dashboard
2. Review the created policies
3. Modify or add new policies as needed

## Step 6: Test the Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Navigate to `/auth` and try to create an account
4. Check the Supabase dashboard to see if the user was created

## Step 7: Create Initial Admin User

After your first user signs up, you'll need to manually set their role to 'admin' in the database:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## Step 8: Environment Variables

Make sure your `.env.local` file contains:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: Database URL for direct connections
DATABASE_URL=your_database_connection_string
```

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check your environment variables
2. **Database connection issues**: Verify your Supabase project is active
3. **RLS policy errors**: Ensure policies are correctly configured
4. **CORS issues**: Check your Supabase site URL configuration

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com)

## Security Considerations

1. **Row Level Security**: Always enabled for user data
2. **API Keys**: Never expose service role keys in client code
3. **Environment Variables**: Keep sensitive data in `.env.local`
4. **Regular Updates**: Keep Supabase packages updated

## Next Steps

1. Set up email templates for better user experience
2. Configure webhooks for real-time updates
3. Set up backup and monitoring
4. Configure production environment variables
