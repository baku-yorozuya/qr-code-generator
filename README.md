# Dotmask

A browser QR code studio with module styles, solid colors, gradients, optional center logos, and image-mask mode.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel (GitHub)

1. Push this repo to GitHub under your account (`bakuyorozuya` / Baku Yorozuya).
2. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
3. Import the `qr-code-generator` repository.
4. Keep the default Next.js settings and click **Deploy**.

Or with the Vercel CLI after `npm i -g vercel`:

```bash
npx vercel
```

## Stack

- Next.js App Router
- `qr-code-styling` for styled / gradient codes
- `qrcode` + canvas for image-mask compositing
