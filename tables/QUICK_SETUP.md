# 🚀 Quick Setup Guide

## 📋 **What You Need**

1. **Supabase Project** ✅ (You already have this)
2. **Environment Variables** ✅ (Already configured)
3. **Database Tables** (Need to create these)

## ⚡ **Fast Setup (Recommended)**

### **Option 1: Copy-Paste Method**
1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste each file in order:
   - `01_users.sql`
   - `02_admins.sql`
   - `03_agents.sql`
   - `04_buyers.sql`
   - `05_builders.sql`
   - `06_properties.sql`
   - `07_functions.sql`

### **Option 2: Individual File Method**
1. Open each `.sql` file
2. Copy the content
3. Paste into Supabase SQL Editor
4. Click "Run" for each file

## 🔒 **What Gets Created**

| Table | Purpose | RLS Enabled |
|-------|---------|-------------|
| `users` | Base user profiles | ✅ |
| `admins` | Admin roles & permissions | ✅ |
| `agents` | Real estate agents | ✅ |
| `buyers` | Property buyers | ✅ |
| `builders` | Property developers | ✅ |
| `properties` | Property listings | ✅ |

## 🛡️ **Security Features**

- **Row Level Security (RLS)** on all tables
- **Role-based access control**
- **Granular permissions** for admins
- **Data isolation** between user types

## 🧪 **Test After Setup**

1. **Create a test user** in Supabase Auth
2. **Assign a role** using the functions
3. **Verify data access** based on role
4. **Test property creation** (if agent/builder)

## 🚨 **Troubleshooting**

### **Common Issues**
- **Permission denied**: Check RLS policies
- **Function not found**: Ensure functions were created
- **Table not found**: Verify table creation order

### **Verification Queries**
```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check functions
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

## 📞 **Need Help?**

- Check the `README.md` for detailed explanations
- Review each `.sql` file for table structure
- Test with sample data (uncomment in setup script)
- Verify all indexes and triggers are created

## 🎯 **Next Steps**

After setup:
1. **Update your TypeScript types** (already done)
2. **Test authentication flow**
3. **Implement role assignment**
4. **Build role-specific dashboards**

---

**⏱️ Estimated Setup Time: 5-10 minutes**
**🔧 Difficulty: Easy**
**📚 Prerequisites: Basic SQL knowledge**
