import OpenAI from "openai";
import { NextResponse } from "next/server";

// Force Node runtime — OpenAI SDK needs it (no Edge here)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Fetch a remote image/mask URL and turn it into a File for the SDK
async function urlToFile(url: string, filename: string, mime = "image/png") {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return new File([buf], filename, { type: mime });
}

export async function POST(req: Request) {
  try {
    const {
      imageUrl,       // required: Cloudinary (or any) URL for the base photo
      maskUrl,        // optional: transparent PNG with same W/H as image
      roomType,       // e.g., "living room", "primary bedroom"
      style,          // e.g., "modern high-end", "coastal", "farmhouse"
      colors,         // optional palette text
      notes,          // optional extra instructions
      size = "2048x2048",
      background,     // optional: "transparent" if you want PNG with alpha
      // quality,     // optional: "high" (supported in gpt-image-1)
    } = await req.json();

    if (!imageUrl || !roomType || !style) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, roomType, style" },
        { status: 400 }
      );
    }

    const baseImage = await urlToFile(imageUrl, "base.png");
    const maskFile = maskUrl ? await urlToFile(maskUrl, "mask.png") : undefined;

    const prompt = [
      `Virtual-stage this ${roomType} in ${style} style.`,
      colors ? `Palette: ${colors}.` : null,
      `Add a cohesive layout, correctly sized rug, appropriate lighting, and tasteful wall art.`,
      `Preserve architecture (windows, doors, trim, flooring). Keep perspective, scale, shadows realistic.`,
      notes ? `Notes: ${notes}` : null,
      `Photorealistic result suitable for real-estate listing photos.`
    ].filter(Boolean).join(" ");

    const edit = await openai.images.edit({
      model: "gpt-image-1",
      image: baseImage,
      ...(maskFile ? { mask: maskFile } : {}),
      prompt,
      size,
      ...(background ? { background } : {}),
      // response_format defaults to b64_json
    });

    const b64 = edit.data?.[0]?.b64_json;
    if (!b64) throw new Error("OpenAI returned no image data");

    // If you prefer returning a data URL to preview inline:
    return NextResponse.json({ dataUrl: `data:image/png;base64,${b64}` });
  } catch (err: any) {
    // Surface useful details (the "digest" error hides these by default)
    console.error("stage route error:", err?.status, err?.message, err?.response?.data || err);
    return NextResponse.json(
      { error: err?.message ?? "Image edit failed", details: err?.response?.data ?? null },
      { status: 500 }
    );
  }
}
