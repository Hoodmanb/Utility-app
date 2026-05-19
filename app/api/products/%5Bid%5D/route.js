import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/storage';

const PRODUCTS_FILE = 'server/data/products.json';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const products = await readJsonFile(PRODUCTS_FILE);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('[API Product GET] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const products = await readJsonFile(PRODUCTS_FILE);
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentProduct = products[productIndex];
    
    // Merge updates safely
    const updatedProduct = {
      ...currentProduct,
      ...body,
      // Prevent changing immutable values unless explicitly needed
      id: currentProduct.id,
      createdAt: currentProduct.createdAt
    };

    // Ensure price is saved as a number if updated
    if (body.price !== undefined) {
      updatedProduct.price = Number(body.price);
    }
    // Ensure featured is saved as boolean if updated
    if (body.featured !== undefined) {
      updatedProduct.featured = Boolean(body.featured);
    }

    products[productIndex] = updatedProduct;
    const success = await writeJsonFile(PRODUCTS_FILE, products);

    if (!success) {
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error('[API Product PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const products = await readJsonFile(PRODUCTS_FILE);
    const filtered = products.filter((p) => p.id !== id);

    if (products.length === filtered.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const success = await writeJsonFile(PRODUCTS_FILE, filtered);

    if (!success) {
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully', id });
  } catch (err) {
    console.error('[API Product DELETE] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
