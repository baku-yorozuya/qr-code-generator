import QrStudio from "@/components/QrStudio";

export default function Home() {
  return (
    <main className="shell">
      <header className="brand-block">
        <h1 className="brand">Dotmask</h1>
        <p className="lede">
          Shape scannable marks with module styles, color fills, gradients, or
          a photo used as a QR mask.
        </p>
      </header>

      <QrStudio />

      <p className="foot">Export PNG anytime. SVG when you are not in mask mode.</p>
    </main>
  );
}
