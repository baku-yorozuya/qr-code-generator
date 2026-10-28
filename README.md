# Dotmask

A browser QR code studio with module styles, solid colors, gradients, optional center logos, and image-mask mode.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live

https://pic-qr-code-generator.vercel.app

## Deploy on Vercel (GitHub)

Repo: https://github.com/baku-yorozuya/qr-code-generator

Connected to Vercel — pushes to `main` redeploy automatically.

## Google AdSense

1. Create / approve the site in [Google AdSense](https://www.google.com/adsense/).
2. In Vercel → Project → Settings → Environment Variables, set:

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://pic-qr-code-generator.vercel.app` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-xxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_ADSENSE_SLOT_TOP` | ad unit slot id |
| `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM` | ad unit slot id |

3. Redeploy. Ads and `/ads.txt` stay hidden until `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
4. Confirm `https://pic-qr-code-generator.vercel.app/ads.txt` matches your publisher ID.

## SEO

Built-in:

- Canonical URL, Open Graph, Twitter cards
- `sitemap.xml` and `robots.txt`
- JSON-LD `WebApplication` schema
- Generated Open Graph image
- Feature + FAQ copy for indexing

After go-live, submit the sitemap in [Google Search Console](https://search.google.com/search-console):  
`https://pic-qr-code-generator.vercel.app/sitemap.xml`

## Stack

- Next.js App Router
- `qr-code-styling` for styled / gradient / mask codes
- Google AdSense via `next/script` + slot components
