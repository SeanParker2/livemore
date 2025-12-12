import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export const alt = 'Livemore';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface PostData {
  title: string;
  profiles: {
    full_name: string;
  } | null;
}

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select(`
      title,
      profiles (
        full_name
      )
    `)
    .eq('slug', params.slug)
    .single<PostData>();

  // Fonts
  const libreBaskervilleBold = fetch(
    new URL('https://fonts.gstatic.com/s/librebaskerville/v14/kmKiZrc3Hgbbcjq75U4uslyuy4kn0qviTf_6gA.woff2')
  ).then((res) => res.arrayBuffer());

  const interRegular = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2')
  ).then((res) => res.arrayBuffer());
    
  const interBold = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2')
  ).then((res) => res.arrayBuffer());


  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1c1917', // bg-stone-950
          color: '#e7e5e4', // text-stone-200
          padding: '60px',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
        }}>
          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontFamily: '"Libre Baskerville"',
              fontWeight: 700,
              lineHeight: 1.1,
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            {post?.title || 'Livemore Analysis'}
          </h1>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            fontSize: '24px',
            fontFamily: '"Inter"',
          }}>
            <span style={{ fontFamily: '"Libre Baskerville"', fontWeight: 700, fontSize: '32px' }}>
              Livemore
            </span>
            <span>
              By {post?.profiles?.full_name || 'The Livemore Team'}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Libre Baskerville',
          data: await libreBaskervilleBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter',
          data: await interRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: await interBold,
          style: 'normal',
          weight: 700,
        }
      ],
    }
  );
}
