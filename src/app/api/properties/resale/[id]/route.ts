import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log('Updating resale property:', id);
    console.log('Update data:', body);

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Filter out any undefined or null values
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([key, value]) => value !== null && value !== undefined)
    );

    console.log('Clean update data:', cleanBody);

    // Update the property in the database
    const { error } = await supabase
      .from('resale_properties')
      .update(cleanBody)
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Property updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Delete the property from the database
    const { error } = await supabase
      .from('resale_properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
