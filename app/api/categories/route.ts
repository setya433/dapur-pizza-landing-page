import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

const BASE_URL = process.env.STRAPI_API_URL;
const TOKEN = process.env.STRAPI_TOKEN;

console.log("STRAPI_API_URL:", BASE_URL);
console.log("STRAPI_TOKEN:", TOKEN);

// GET
export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${BASE_URL}/api/categories`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: "no-store",
  });

  const text = await res.text();
return NextResponse.json(text ? JSON.parse(text) : {});
}

// CREATE
export async function POST(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        name: body.name,
        slug: body.slug,
      },
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to create category", details: text },
      { status: res.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}

// UPDATE
export async function PUT(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.documentId) {
    return NextResponse.json(
      { error: "documentId is required" },
      { status: 400 }
    );
  }

  const res = await fetch(`${BASE_URL}/api/categories/${body.documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        name: body.name,
        slug: body.slug,
      },
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to update category", details: text },
      { status: res.status }
    );
  }

  return NextResponse.json(text ? JSON.parse(text) : {});
}

// DELETE
export async function DELETE(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await req.json();

  if (!documentId) {
    return NextResponse.json(
      { error: "documentId is required" },
      { status: 400 }
    );
  }

  const res = await fetch(`${BASE_URL}/api/categories/${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to delete category", details: text },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}