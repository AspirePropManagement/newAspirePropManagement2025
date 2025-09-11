# Deployment Guide

This guide explains how to deploy the Aspire Property Management application to Vercel.

## Environment Variables

The application requires several environment variables to function properly. These must be set in your Vercel project settings.

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `OPENAI_KEY` | Your OpenAI API key | `sk-...` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |
| `ADMIN_EMAIL` | Admin email address | - |
| `DATABASE_URL` | Database connection string | - |

## Vercel Deployment Steps

### 1. Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all required environment variables
4. Make sure to set them for all environments (Production, Preview, Development)

### 2. Deploy the Application

The application will automatically deploy when you push to your main branch. The build process includes environment validation to catch missing variables early.

### 3. Verify Deployment

After deployment, check that:
- The application loads without errors
- Authentication works properly
- Database connections are established
- API routes respond correctly

## Build Process

The build process includes several safety measures:

1. **Environment Validation**: Checks for required environment variables before building
2. **Graceful Degradation**: The application can run with missing optional variables
3. **Error Handling**: Proper error handling for missing Supabase or OpenAI configurations

### Build Commands

- `npm run build` - Full build with environment validation
- `npm run build:skip-validation` - Build without environment validation (for development)
- `npm run validate-env` - Validate environment variables only

## Troubleshooting

### Common Issues

1. **"supabaseUrl is required" Error**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel environment variables
   - Check that the variable is set for the correct environment (Production/Preview)

2. **OpenAI API Errors**
   - Verify `OPENAI_KEY` is set correctly
   - Check that the API key has sufficient credits

3. **Database Connection Issues**
   - Verify Supabase credentials are correct
   - Check that the Supabase project is active
   - Ensure RLS policies are properly configured

4. **Build Failures**
   - Run `npm run validate-env` locally to check environment variables
   - Check Vercel build logs for specific error messages

### Environment Variable Validation

You can validate your environment variables locally:

```bash
npm run validate-env
```

This will check all required and optional environment variables and report any missing ones.

## Security Notes

- Never commit environment variables to version control
- Use Vercel's environment variable system for production secrets
- Regularly rotate API keys and secrets
- Use different keys for different environments when possible

## Support

If you encounter issues during deployment:

1. Check the Vercel build logs for specific error messages
2. Verify all environment variables are set correctly
3. Test the application locally with the same environment variables
4. Contact the development team for assistance

## Database Setup

Make sure your Supabase database is properly set up with:

1. All required tables created
2. RLS policies configured
3. Service role key has appropriate permissions
4. Database functions are deployed

Refer to the `tables/` directory for SQL scripts to set up the database schema.
