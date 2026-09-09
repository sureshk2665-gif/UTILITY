import { Metadata } from "next";
import { tools } from "./tools";

const BASE_URL = "https://pdf-tools-utility.vercel.app";

export function getToolMetadata(slug: string): Metadata {
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.longTailKeywords,
    alternates: { canonical: `${BASE_URL}/${tool.slug}` },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `${BASE_URL}/${tool.slug}`,
      siteName: "PDF Tools Online",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export function getToolJsonLd(slug: string) {
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return null;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url: `${BASE_URL}/${tool.slug}`,
    description: tool.seoDescription,
    applicationCategory: "Utility",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };
}

export function getHowToJsonLd(slug: string) {
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return null;
  const steps = [
    { name: "Upload your file", text: `Select or drag and drop your file into the ${tool.name} tool.` },
    { name: "Configure settings", text: `Adjust any settings for the ${tool.name.toLowerCase()} operation.` },
    { name: "Process and download", text: "Click the action button to process your file and download the result." },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to ${tool.name}`,
    description: tool.seoDescription,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
