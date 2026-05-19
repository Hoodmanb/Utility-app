import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/storage';

const PRODUCTS_FILE = 'server/data/products.json';

export async function GET() {
  const products = await readJsonFile(PRODUCTS_FILE);
  // Sort by newest first
  const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(sorted);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, price, condition, category, description, images, status, featured } = body;

    // Validation
    if (!title || price === undefined || !condition || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, condition, category' },
        { status: 400 }
      );
    }

    const products = await readJsonFile(PRODUCTS_FILE);

    // Fallback images based on category if not provided
    let fallbackImage = '/uploads/phone.svg';
    if (category === 'laptops') fallbackImage = '/uploads/laptop.svg';
    else if (category === 'gaming') fallbackImage = '/uploads/gaming.svg';
    else if (category === 'appliances') fallbackImage = '/uploads/appliance.svg';
    else if (category === 'fashion') fallbackImage = '/uploads/fashion.svg';

    const newProduct = {
      id: `product_${Date.now()}`,
      title: title.trim(),
      price: Number(price),
      condition: condition.trim(),
      category: category.trim(),
      status: status || 'available',
      featured: Boolean(featured),
      description: (description || '').trim(),
      images: Array.isArray(images) && images.length > 0 ? images : [fallbackImage],
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    const success = await writeJsonFile(PRODUCTS_FILE, products);

    if (!success) {
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error('[API Products POST] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
