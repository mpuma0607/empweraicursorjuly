import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

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
      imageUrl,          // required: public URL of the base photo
      maskUrl,           // optional: PNG, same W/H as base; transparent where edits allowed
      roomType,          // required: "living room", "primary bedroom", etc.
      style,             // required: "modern high-end", "farmhouse", etc.
      colors,            // optional: "warm neutrals, walnut, brass"
      notes,             // optional: extra guidance
      size = "1024x1024" // use "2048x2048" for finals; 1024 is faster for previews
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
      `Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art.`,
      `Preserve architecture (windows, doors, trim, flooring). Realistic perspective, scale, and shadows.`,
      notes ? `Notes: ${notes}` : null,
      `Photorealistic, listing-quality output.`
    ].filter(Boolean).join(" ");

    const args: Parameters<typeof openai.images.edit>[0] = {
      model: "gpt-image-1",
      image: baseImage,
      prompt,
      size,
      response_format: "b64_json",
      // background: "transparent", // uncomment if you need alpha PNG
      // n: 1,                      // set 2–4 for variations
    };
    if (maskFile) (args as any).mask = maskFile;

    const result = await openai.images.edit(args);
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image returned from OpenAI.");

    const bin = Buffer.from(b64, "base64");
    return new Response(bin, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(bin.length),
        "Cache-Control": "no-store",
        "Content-Disposition": 'inline; filename="staged.png"',
      },
    });
  } catch (err: any) {
    console.error("Stage route error:", err?.response?.data || err);
    return NextResponse.json(
      { error: err?.message || "Image edit failed", details: err?.response?.data ?? null },
      { status: 500 }
    );
  }
}
