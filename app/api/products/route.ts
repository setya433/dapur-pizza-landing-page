import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

const BASE_URL = process.env.STRAPI_API_URL;
const TOKEN = process.env.STRAPI_TOKEN;

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

function missingBaseUrl() {
  return NextResponse.json(
    { error: "STRAPI_API_URL is not set" },
    { status: 500 }
  );
}

function buildProductPayload(body: any) {
  return {
    name: body.name,
    slug: body.slug,
    price: body.price,
    description: body.description,
    category: body.category || null,
    badge: body.badge || null,
    minOrder: body.minOrder || null,
    ...(body.image ? { image: body.image } : {}),
  };
}

export async function GET() {
  const session = await getAdminSession();

  if (!session) return unauthorized();
  if (!BASE_URL) return missingBaseUrl();

  const res = await fetch(`${BASE_URL}/api/products?populate=*`, {
    headers: TOKEN
      ? {
          Authorization: `Bearer ${TOKEN}`,
        }
      : {},
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const session = await getAdminSession();

  if (!session) return unauthorized();
  if (!BASE_URL) return missingBaseUrl();

  const body = await req.json();
  const payload = buildProductPayload(body);

  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: payload }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();

  if (!session) return unauthorized();
  if (!BASE_URL) return missingBaseUrl();

  const body = await req.json();

  if (!body.documentId) {
    return NextResponse.json(
      { error: "documentId is required" },
      { status: 400 }
    );
  }

  const payload = buildProductPayload(body);

  const res = await fetch(`${BASE_URL}/api/products/${body.documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: JSON.stringify({ data: payload }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();

  if (!session) return unauthorized();
  if (!BASE_URL) return missingBaseUrl();

  const { documentId } = await req.json();

  if (!documentId) {
    return NextResponse.json(
      { error: "documentId is required" },
      { status: 400 }
    );
  }

  const res = await fetch(`${BASE_URL}/api/products/${documentId}`, {
    method: "DELETE",
    headers: TOKEN
      ? {
          Authorization: `Bearer ${TOKEN}`,
        }
      : {},
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to delete product", details: text },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}