import { NextResponse } from "next/server";

const BASE_URL = process.env.STRAPI_API_URL;
const TOKEN = process.env.STRAPI_TOKEN;

// GET
export async function GET() {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: "no-store",
  });

  return NextResponse.json(await res.json());
}

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ data: body }),
  });

  return NextResponse.json(await res.json());
}

// UPDATE
export async function PUT(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${BASE_URL}/api/categories/${body.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        data: body,
      }),
    }
  );

  return NextResponse.json(await res.json());
}

// DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return NextResponse.json({ success: true });
}