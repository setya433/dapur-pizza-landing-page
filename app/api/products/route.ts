import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

const BASE_URL = process.env.STRAPI_API_URL;
const TOKEN = process.env.STRAPI_TOKEN;

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${BASE_URL}/api/products?populate=*`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const payload = {
    name: body.name,
    price: body.price,
    description: body.description,
    category: body.category || null,
  };

  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const payload = {
    name: body.name,
    price: body.price,
    description: body.description,
    category: body.category || null,
  };

  const res = await fetch(`${BASE_URL}/api/products/${body.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return NextResponse.json({ success: true });
}
