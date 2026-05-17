import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const key = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY || '801df07212c14c5c7db6a2aee813d11b';

    // Forward the file to imgbb
    const imgbbForm = new FormData();
    imgbbForm.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body: imgbbForm,
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true, url: data.data.url });
    } else {
      console.error('imgbb error:', data);
      return NextResponse.json({ success: false, error: 'Upload failed', detail: data }, { status: 500 });
    }
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
