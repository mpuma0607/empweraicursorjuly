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
  console.log('StageIT API called with method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('Request timestamp:', new Date().toISOString());
  
  try {
    const OPENAI_API_KEY = need("OPENAI_API_KEY");
    console.log('OpenAI API key found, length:', OPENAI_API_KEY.length);
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
      `CRITICAL: Do not add, remove, resize, or modify any existing windows, doors, or architectural elements.`,
      `Do not change the size, shape, or position of any existing windows, doors, trim, or structural features.`,
      `Only add furniture, decor, and staging elements. Preserve the exact room layout and architecture.`,
      colors ? `Palette: ${colors}.` : null,
      `Cohesive furniture layout; correct rug size; layered lighting; tasteful wall art.`,
      `Preserve ALL existing architecture (windows, doors, trim, flooring, walls) exactly as shown with identical size and proportions.`,
      `Maintain the exact same window dimensions, door positions, and room proportions as the original.`,
      notes ? `Notes: ${notes}` : null,
      `Photorealistic, listing-quality output.`
    ].filter(Boolean).join(" ");

    // Validate image before processing
    console.log(`Image validation: ${imageBlob.size} bytes, type: ${imageBlob.type}`);
    console.log('Image blob details:', {
      size: imageBlob.size,
      type: imageBlob.type,
      sizeInMB: (imageBlob.size / (1024 * 1024)).toFixed(2)
    });
    
    // Check file size (OpenAI has limits)
    if (imageBlob.size > 20 * 1024 * 1024) { // 20MB limit
      console.log('Image too large:', imageBlob.size);
      return NextResponse.json(
        { error: "Image too large. Please use an image smaller than 20MB." },
        { status: 400 }
      );
    }
    
    // Check file type - OpenAI image editing requires PNG
    if (!imageBlob.type.startsWith('image/')) {
      console.log('Invalid file type:', imageBlob.type);
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image file." },
        { status: 400 }
      );
    }
    
    // Log image type for debugging
    console.log('Image type detected:', imageBlob.type);
    if (!imageBlob.type.includes('png') && !imageBlob.type.includes('jpeg') && !imageBlob.type.includes('jpg')) {
      console.log('Warning: Image type may not be supported by OpenAI:', imageBlob.type);
    }
    
    console.log('Image validation passed, proceeding with OpenAI request...');

    // Validate and normalize size parameter
    const SUPPORTED_SIZES = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"]);
    const finalSize = SUPPORTED_SIZES.has(size) ? size : "auto";

    // Build outbound form to OpenAI (use plain fetch to avoid SDK file quirks)
    const aiForm = new FormData();
    aiForm.append("model", "gpt-image-1");
    aiForm.append("prompt", prompt);
    aiForm.append("size", finalSize);
    aiForm.append("image", imageBlob!, "image.png");
    if (maskBlob) aiForm.append("mask", maskBlob, "mask.png");

    console.log(`Sending request to OpenAI with prompt: ${prompt.substring(0, 100)}...`);
    console.log(`OpenAI request details: size=${finalSize}, imageSize=${imageBlob.size}, imageType=${imageBlob.type}`);
    console.log('About to make OpenAI API call...');

    const aiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: aiForm,
    }).catch(fetchError => {
      console.error('Fetch error occurred:', fetchError);
      console.error('Fetch error details:', {
        message: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack
      });
      throw fetchError;
    });

    console.log(`OpenAI response status: ${aiRes.status} ${aiRes.statusText}`);

    if (!aiRes.ok) {
      // Get detailed error information
      let errorDetails;
      try {
        errorDetails = await aiRes.json();
        console.error("OpenAI JSON error response:", errorDetails);
      } catch (jsonError) {
        try {
          const errorText = await aiRes.text();
          console.error("OpenAI text error response:", errorText);
          errorDetails = { text: errorText };
        } catch (textError) {
          console.error("Failed to read error response:", textError);
          errorDetails = { message: `OpenAI error ${aiRes.status}: ${aiRes.statusText}` };
        }
      }
      
      return NextResponse.json(
        { 
          error: errorDetails?.error?.message || errorDetails?.text || `OpenAI error ${aiRes.status}`, 
          details: errorDetails,
          status: aiRes.status,
          statusText: aiRes.statusText
        },
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
    console.error("Error stack:", err?.stack);
    console.error("Error details:", {
      name: err?.name,
      message: err?.message,
      cause: err?.cause,
      code: err?.code
    });
    
    // More specific error messages based on error type
    let errorMessage = "Image edit failed";
    if (err?.message?.includes("OPENAI_API_KEY")) {
      errorMessage = "OpenAI API configuration error";
    } else if (err?.message?.includes("fetch")) {
      errorMessage = "Network error connecting to AI service";
    } else if (err?.message?.includes("image")) {
      errorMessage = "Image processing error";
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: {
        originalError: err?.message,
        errorType: err?.name,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// Useful to verify the route path is correct (GET should 405, not 404)
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
