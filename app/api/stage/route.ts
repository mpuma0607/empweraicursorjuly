import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// fetch http(s) into a Blob
async function fetchToBlob(url: string, mime = "image/png") {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const ab = await res.arrayBuffer();
  return new Blob([ab], { type: mime });
}

// turn data: URL into a Blob
function dataUrlToBlob(dataUrl: string) {
  const m = /^data:(.+);base64,(.*)$/.exec(dataUrl);
  if (!m) throw new Error("Invalid data URL");
  const [, mime, b64] = m;
  const bin = Buffer.from(b64, "base64");
  return new Blob([bin], { type: mime });
}

export async function POST(req: Request) {
  try {
    const OPENAI_API_KEY = need("OPENAI_API_KEY");
    const contentType = req.headers.get("content-type") || "";

    // Inputs
    let imageBlob: Blob | null = null;
    let maskBlob: Blob | null = null;
    let roomType = "";
    let style = "";
    let colors = "";
    let notes = "";
    let size: string = "1024x1024";

    if (contentType.includes("multipart/form-data")) {
      // ---- multipart: file upload from client ----
      const form = await req.formData();
      const img = form.get("image");
      if (!(img instanceof Blob)) {
        return NextResponse.json({ error: "Missing file field 'image'." }, { status: 400 });
      }
      imageBlob = img;

      const mask = form.get("mask");
      if (mask instanceof Blob) maskBlob = mask;

      roomType = String(form.get("roomType") || "");
      style = String(form.get("style") || "");
      colors = String(form.get("colors") || "");
      notes = String(form.get("notes") || "");
      size = (String(form.get("size") || "1024x1024") as any);
    } else {
      // ---- JSON: imageUrl (http/https or data:) ----
      const body = await req.json();
      const imageUrl: string | undefined = body?.imageUrl;
      const maskUrl: string | undefined = body?.maskUrl;

      roomType = String(body?.roomType || "");
      style = String(body?.style || "");
      colors = String(body?.colors || "");
      notes = String(body?.notes || "");
      size = (body?.size || "1024x1024") as any;

      if (!imageUrl) {
        return NextResponse.json({ error: "Missing required field: imageUrl" }, { status: 400 });
      }
      if (/^https?:\/\//i.test(imageUrl)) {
        imageBlob = await fetchToBlob(imageUrl);
      } else if (imageUrl.startsWith("data:")) {
        imageBlob = dataUrlToBlob(imageUrl);
      } else {
        return NextResponse.json(
          { error: "imageUrl must be http(s) or a data: URL. If you have a File, POST multipart/form-data." },
          { status: 400 }
        );
      }
      if (maskUrl) {
        if (/^https?:\/\//i.test(maskUrl)) maskBlob = await fetchToBlob(maskUrl);
        else if (maskUrl.startsWith("data:")) maskBlob = dataUrlToBlob(maskUrl);
      }
    }

    if (!roomType || !style) {
      return NextResponse.json(
        { error: "roomType and style are required." },
        { status: 400 }
      );
    }

    // Validate image blob
    if (!imageBlob) {
      return NextResponse.json(
        { error: "No image provided." },
        { status: 400 }
      );
    }

    // Check image size and type
    const maxSize = 20 * 1024 * 1024; // 20MB limit
    if (imageBlob.size > maxSize) {
      return NextResponse.json(
        { error: `Image too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    console.log(`Processing image: ${imageBlob.size} bytes, type: ${imageBlob.type}`);

    const prompt = [
      `Virtual-stage this ${roomType} in ${style} style.`,
      colors ? `Palette: ${colors}.` : null,
      `Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art.`,
      `Preserve architecture (windows, doors, trim, flooring). Realistic perspective, scale, and shadows.`,
      notes ? `Notes: ${notes}` : null,
      `Photorealistic, listing-quality output.`
    ].filter(Boolean).join(" ");

    // Validate and normalize size parameter
    const SUPPORTED_SIZES = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);
    const finalSize = SUPPORTED_SIZES.has(size) ? size : "auto";

    // Log image details for debugging
    console.log(`Processing image: ${imageBlob.size} bytes, type: ${imageBlob.type}`);

    // Build outbound form to OpenAI (use plain fetch to avoid SDK file quirks)
    const aiForm = new FormData();
    aiForm.append("prompt", prompt);
    aiForm.append("size", finalSize);
    aiForm.append("image", imageBlob!, "image.png");
    if (maskBlob) aiForm.append("mask", maskBlob, "mask.png");

    console.log(`Sending request to OpenAI with prompt: ${prompt.substring(0, 100)}...`);
    
    const aiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: aiForm,
    });

    console.log(`OpenAI response status: ${aiRes.status} ${aiRes.statusText}`);

    if (!aiRes.ok) {
      // Check content type to determine how to read the response
      const contentType = aiRes.headers.get('content-type');
      let errorData;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await aiRes.json();
          console.error("OpenAI JSON error response:", errorData);
        } catch (jsonError) {
          console.error("Failed to parse JSON error response:", jsonError);
          errorData = { error: { message: `OpenAI error ${aiRes.status}: ${aiRes.statusText}` } };
        }
      } else {
        try {
          const errorText = await aiRes.text();
          console.error("OpenAI text error response:", errorText);
          errorData = { error: { message: errorText } };
        } catch (textError) {
          console.error("Failed to read text error response:", textError);
          errorData = { error: { message: `OpenAI error ${aiRes.status}: ${aiRes.statusText}` } };
        }
      }
      
      return NextResponse.json(
        { error: errorData?.error?.message || `OpenAI error ${aiRes.status}`, details: errorData },
        { status: 502 }
      );
    }

    const json = await aiRes.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) throw new Error("OpenAI returned no image data");

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
    console.error("Stage route fatal:", err);
    return NextResponse.json({ error: err?.message || "Image edit failed" }, { status: 500 });
  }
}

// Useful to verify the route path is correct (GET should 405, not 404)
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
