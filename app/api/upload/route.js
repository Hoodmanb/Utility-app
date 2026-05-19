import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = file.name || 'image.png';
    const ext = path.extname(originalName).toLowerCase();
    
    // Enforce allowed file formats
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, and WEBP are supported.' },
        { status: 400 }
      );
    }

    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique file name
    const uniqueFileName = `upload_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save the file
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${uniqueFileName}`
    });
  } catch (err) {
    console.error('[API Upload POST] Error:', err);
    // Graceful fallback to default image if upload fails
    return NextResponse.json({
      success: false,
      error: 'Upload failed',
      filePath: '/uploads/phone.svg' // default fallback placeholder
    });
  }
}
