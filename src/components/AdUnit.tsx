"use client";

import { useEffect, useId } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdUnitProps = {
  slot: string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
};

export default function AdUnit({
  slot,
  format = "auto",
  className = "",
}: AdUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const reactId = useId();

  useEffect(() => {
    if (!client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense may throw on remount in development.
    }
  }, [client, slot, reactId]);

  if (!client || !slot) return null;

  return (
    <aside className={`ad-slot ${className}`.trim()} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
