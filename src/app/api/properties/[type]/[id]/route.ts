import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id parameter' }, { status: 400 });
    }

    let tableName = '';
    switch (type) {
      case 'resale':
        tableName = 'resale_properties';
        break;
      case 'rental':
        tableName = 'rental_properties';
        break;
      case 'new_project':
        tableName = 'new_projects';
        break;
      default:
        return NextResponse.json({ error: 'Invalid property type' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${type} property:`, error);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
