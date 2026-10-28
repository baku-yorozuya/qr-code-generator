import { NextResponse } from "next/server";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  if (!client) {
    return new NextResponse(
      "# Set NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-xxxxxxxxxxxxxxxx) in Vercel env vars\n",
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  }

  const publisherId = client.startsWith("ca-") ? client.slice(3) : client;
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
