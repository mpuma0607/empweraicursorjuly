import OpenAI from "openai";
import { NextResponse } from "next/server";
import { toFile } from "openai/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // headroom for image jobs

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function urlToFile(url: string, filename: string, mime = "image/png") {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return await toFile(buf, filename, { type: mime });
}

export async function POST(req: Request) {
  try {
    const {
      imageUrl,         // required
      maskUrl,          // optional: same W/H as image; transparent where edits allowed
      roomType,         // e.g. "living room"
      style,            // e.g. "modern high-end"
      colors,           // optional text palette
      notes,            // optional extra guidance
      size = "1024x1024" // use "2048x2048" for final export; 1024 is faster for previews
    } = await req.json();

    if (!imageUrl || !roomType || !style) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, roomType, style" },
        { status: 400 }
      );
    }

    const baseImage = await urlToFile(imageUrl, "base.png");

    const prompt = [
      `Virtual-stage this ${roomType} in ${style} style.`,
      colors ? `Palette: ${colors}.` : null,
      `Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art.`,
      `Preserve architecture (windows, doors, trim, flooring). Keep realistic perspective, scale, and shadows.`,
      notes ? `Notes: ${notes}` : null,
      `Photorealistic, listing-quality output.`
    ].filter(Boolean).join(" ");

    const editArgs: Parameters<typeof openai.images.edit>[0] = {
      model: "gpt-image-1",
      image: baseImage,
      prompt,
      size,
      response_format: "b64_json",
    };

    if (maskUrl) {
      const maskFile = await urlToFile(maskUrl, "mask.png");
      (editArgs as any).mask = maskFile; // mask must be same W/H; transparent = editable
    }

    const result = await openai.images.edit(editArgs);
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image returned from OpenAI");

    // Return a data URL for immediate preview in the UI
    return NextResponse.json({ dataUrl: `data:image/png;base64,${b64}`, prompt });
  } catch (err: any) {
    console.error("Stage API error:", err?.response?.data || err);
    return NextResponse.json(
      { error: err?.message || "Image edit failed", details: err?.response?.data ?? null },
      { status: 500 }
    );
  }
}
