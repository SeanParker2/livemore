
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is missing' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug')
    .textSearch('title', query, {
      type: 'websearch',
      config: 'english',
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
