import AdUnit from "@/components/AdUnit";
import QrStudio from "@/components/QrStudio";

const topSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";
const bottomSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? "";

export default function Home() {
  return (
    <main className="shell">
      <header className="brand-block">
        <h1 className="brand">Dotmask</h1>
        <p className="lede">
          Free online QR code generator with module styles, finder patterns,
          colors, gradients, logos, and photo image masks. Export PNG or SVG in
          the browser.
        </p>
      </header>

      <AdUnit slot={topSlot} format="horizontal" className="ad-top" />

      <QrStudio />

      <AdUnit slot={bottomSlot} format="horizontal" className="ad-bottom" />

      <section className="seo-section" aria-labelledby="features-heading">
        <h2 id="features-heading">What you can customize</h2>
        <p>
          Dotmask is a free QR code maker for links, text, and branding. Shape
          modules and finder patterns, pick solid fills or gradients, drop in a
          center logo, or use a photo as an image mask while keeping the code
          scannable.
        </p>
        <ul>
          <li>Module styles: square, dots, rounded, classy, and soft</li>
          <li>Finder outer and center styles for brand-ready corners</li>
          <li>Solid colors, linear or radial gradients, and background color</li>
          <li>Image-mask mode that cuts your photo into styled QR modules</li>
          <li>Optional center logo with size control and high error correction</li>
          <li>Export PNG anytime, plus SVG outside mask mode</li>
        </ul>
      </section>

      <section className="seo-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading">QR generator FAQ</h2>
        <div className="faq-list">
          <details>
            <summary>Is Dotmask free to use?</summary>
            <p>
              Yes. Create and download styled QR codes in your browser at no
              charge. Ads may appear to help keep the tool online.
            </p>
          </details>
          <details>
            <summary>Will styled or masked QR codes still scan?</summary>
            <p>
              They should when contrast and error correction stay high. Prefer
              H-level correction for logos and image masks, and test with your
              phone camera before printing.
            </p>
          </details>
          <details>
            <summary>Which file format should I download?</summary>
            <p>
              Use PNG for social posts and most print jobs. Use SVG when you
              need crisp scaling in design tools. SVG export is available outside
              image-mask mode.
            </p>
          </details>
        </div>
      </section>

      <p className="foot">
        Export PNG anytime. SVG when you are not in mask mode.
      </p>
    </main>
  );
}
