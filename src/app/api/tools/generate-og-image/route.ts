import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  url: z.string().url("Invalid URL"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = requestSchema.parse(body);

    // Check if DocAPI key is available
    const apiKey = process.env.DOCAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Screenshot service is not configured." },
        { status: 500 }
      );
    }

    // Call DocAPI Screenshot API
    const screenshotResponse = await fetch("https://api.docapi.co/v1/screenshot", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "User-Agent": "DocAPI-OGImageGenerator/1.0",
        "Accept": "image/png",
      },
      body: JSON.stringify({
        url,
        options: {
          width: 1200,
          height: 630,
          type: "png",
          fullPage: false,
        },
      }),
    });

    if (!screenshotResponse.ok) {
      const errorText = await screenshotResponse.text();
      console.error("DocAPI screenshot error:", errorText);
      return NextResponse.json(
        { error: "Failed to capture screenshot. Please check the URL and try again." },
        { status: 500 }
      );
    }

    const imageBuffer = await screenshotResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="og-image.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("OG image generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate OG image" },
      { status: 500 }
    );
  }
}
