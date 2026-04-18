import { NextResponse } from "next/server";

const BASE_URL = process.env.STRAPI_API_URL;
const TOKEN = process.env.STRAPI_TOKEN;

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}