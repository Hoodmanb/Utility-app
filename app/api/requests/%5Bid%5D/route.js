import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/storage';

const REQUESTS_FILE = 'server/data/requests.json';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const requests = await readJsonFile(REQUESTS_FILE);
    const itemRequest = requests.find((r) => r.id === id);

    if (!itemRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(itemRequest);
  } catch (err) {
    console.error('[API Request GET] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const requests = await readJsonFile(REQUESTS_FILE);
    const requestIndex = requests.findIndex((r) => r.id === id);

    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const currentRequest = requests[requestIndex];

    // Merge updates safely
    const updatedRequest = {
      ...currentRequest,
      ...body,
      id: currentRequest.id, // cannot change id
      createdAt: currentRequest.createdAt // cannot change date
    };

    requests[requestIndex] = updatedRequest;
    const success = await writeJsonFile(REQUESTS_FILE, requests);

    if (!success) {
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json(updatedRequest);
  } catch (err) {
    console.error('[API Request PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const requests = await readJsonFile(REQUESTS_FILE);
    const filtered = requests.filter((r) => r.id !== id);

    if (requests.length === filtered.length) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const success = await writeJsonFile(REQUESTS_FILE, filtered);

    if (!success) {
      return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Request deleted successfully', id });
  } catch (err) {
    console.error('[API Request DELETE] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
