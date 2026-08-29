import { describe, expect, it } from "vitest";

import {
  localizedPageMetadata,
  localizedPathMetadata,
} from "@/lib/page-metadata";

describe("localized public-page metadata", () => {
  it("publishes route-specific canonical, language and social metadata", () => {
    const metadata = localizedPageMetadata({
      lang: "pl",
      routeKey: "model",
      title: "Model i założenia | ProcuraCost",
      description: "Kontrakt obliczeniowy modelu.",
    });

    expect(metadata).toMatchObject({
      title: "Model i założenia | ProcuraCost",
      description: "Kontrakt obliczeniowy modelu.",
      alternates: {
        canonical: "/model",
        languages: {
          "pl-PL": "/model",
          "en-GB": "/en/model",
        },
      },
      openGraph: {
        title: "Model i założenia | ProcuraCost",
        description: "Kontrakt obliczeniowy modelu.",
        url: "/model",
        siteName: "ProcuraCost",
        locale: "pl_PL",
        alternateLocale: ["en_GB"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Model i założenia | ProcuraCost",
        description: "Kontrakt obliczeniowy modelu.",
      },
    });
  });

  it("keeps the English-only paper canonical at /research", () => {
    const metadata = localizedPageMetadata({
      lang: "en",
      routeKey: "research",
      title: "Research paper | ProcuraCost",
      description: "Research paper.",
    });

    expect(metadata.alternates).toEqual({
      canonical: "/research",
      languages: { "en-GB": "/research" },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/research",
      locale: "en_GB",
    });
  });

  it("fails closed when a page is assigned to a missing locale", () => {
    expect(() =>
      localizedPageMetadata({
        lang: "pl",
        routeKey: "research",
        title: "Bad route",
        description: "Bad route.",
      }),
    ).toThrow(/does not define a pl path/i);
  });

  it("supports a route-specific canonical for a published editorial detail", () => {
    const metadata = localizedPathMetadata({
      lang: "pl",
      paths: { pl: "/shortcasty/koszt-zlego-opisu" },
      title: "Koszt złego opisu | ProcuraCost",
      description: "Materiał redakcyjny.",
    });

    expect(metadata.alternates).toEqual({
      canonical: "/shortcasty/koszt-zlego-opisu",
      languages: { "pl-PL": "/shortcasty/koszt-zlego-opisu" },
    });
    expect(metadata.openGraph).toMatchObject({
      url: "/shortcasty/koszt-zlego-opisu",
      locale: "pl_PL",
    });
  });
});
