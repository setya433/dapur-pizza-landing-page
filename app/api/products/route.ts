import { NextResponse } from "next/server";

const BASE_URL = process.env.STRAPI_API_URL;
const TOKEN = process.env.STRAPI_TOKEN;



export async function GET() {
  const res = await fetch(`${BASE_URL}/api/products?populate=*`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  console.log("TOKEN:", process.env.STRAPI_TOKEN);
  console.log("GET PRODUCTS:", data);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
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
  const { id } = await req.json();

  await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return NextResponse.json({ success: true });
}