"use client";

import { getToolJsonLd, getHowToJsonLd } from "@/lib/seo";

export function ToolJsonLd({ slug }: { slug: string }) {
  const softwareApp = getToolJsonLd(slug);
  const howTo = getHowToJsonLd(slug);
  return (
    <>
      {softwareApp && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      )}
      {howTo && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      )}
    </>
  );
}
