import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.crafted_by || !body.project_name || !body.project_type || !body.construction_type || !body.project_location || !body.created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: crafted_by, project_name, project_type, construction_type, project_location, created_by' },
        { status: 400 }
      );
    }

    // Set default values
    const insertData = {
      ...body,
      currency_code: body.currency_code || 'INR',
      status: body.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('new_projects')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating new project:', error);
      return NextResponse.json({ error: 'Failed to create new project' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    console.log('New projects API GET request received');
    
    if (!supabase) {
      console.error('Supabase connection not available');
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('User ID from search params:', userId);

    let query = supabase
      .from('new_projects')
      .select('*')
      .order('created_at', { ascending: false });

    // If userId is provided, filter by that user's properties
    if (userId) {
      query = query.eq('created_by', userId);
    }

    console.log('Executing query for new projects...');
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching new project properties:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    console.log('New projects query result:', { count: data?.length || 0, data });
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in new projects API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
