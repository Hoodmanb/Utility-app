import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/storage';

const REQUESTS_FILE = 'server/data/requests.json';

export async function GET() {
  const requests = await readJsonFile(REQUESTS_FILE);
  // Sort by newest first
  const sorted = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(sorted);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { itemName, budget, condition, description, contact } = body;

    // Validation
    if (!itemName || budget === undefined || !condition || !contact) {
      return NextResponse.json(
        { error: 'Missing required fields: itemName, budget, condition, contact' },
        { status: 400 }
      );
    }

    const requests = await readJsonFile(REQUESTS_FILE);

    const newRequest = {
      id: `request_${Date.now()}`,
      itemName: itemName.trim(),
      budget: Number(budget),
      condition: condition.trim(),
      description: (description || '').trim(),
      contact: contact.trim(),
      status: 'pending', // CRITICAL: Always default to pending
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    const success = await writeJsonFile(REQUESTS_FILE, requests);

    if (!success) {
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (err) {
    console.error('[API Requests POST] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
