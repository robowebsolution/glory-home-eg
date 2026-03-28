const DEFAULT_SITE_URL = "https://www.gloryhome-eg.com";

type JsonLdNode = Record<string, unknown>;

function normalizeSiteUrl(siteUrl?: string) {
  return (siteUrl || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function getGloryHomeStructuredData(siteUrl?: string): JsonLdNode {
  const baseUrl = normalizeSiteUrl(siteUrl);
  const organizationId = `${baseUrl}/#organization`;
  const localBusinessId = `${baseUrl}/#local-business`;
  const websiteId = `${baseUrl}/#website`;
  const homepageId = `${baseUrl}/#homepage`;
  const mernaId = `${baseUrl}/about#merna-magdy`;

  const logo = `${baseUrl}/logo.webp`;
  const heroImage = `${baseUrl}/2-7fb9c07a.webp`;

  const areasServed = [
    { "@type": "City", name: "6th of October City" },
    { "@type": "City", name: "New Cairo" },
    { "@type": "City", name: "Sheikh Zayed" },
    { "@type": "City", name: "Riyadh" },
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "Egypt" },
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "United Arab Emirates" },
  ];

  const offerCatalog = {
    "@type": "OfferCatalog",
    name: "Luxury Interior Design and Furniture Services",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Interior Design",
        itemListElement: [
          { "@type": "Service", name: "Luxury residential interior design" },
          { "@type": "Service", name: "Modern classic villa design" },
          { "@type": "Service", name: "Space planning for premium residences" },
          { "@type": "Service", name: "3D visualization and design presentation" },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Turnkey Finishing",
        itemListElement: [
          { "@type": "Service", name: "Turnkey interior finishing" },
          { "@type": "Service", name: "Luxury finishing specifications" },
          { "@type": "Service", name: "Smart home coordination" },
          { "@type": "Service", name: "Material and lighting selection" },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Furniture and Woodworks",
        itemListElement: [
          { "@type": "Service", name: "Bespoke furniture manufacturing" },
          { "@type": "Service", name: "Luxury doors and woodworks" },
          { "@type": "Service", name: "Custom bedrooms and living spaces" },
          { "@type": "Service", name: "Sustainable material sourcing" },
        ],
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Glory Home",
        alternateName: ["Glory Home Furniture", "Glory Home Egypt"],
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: logo,
        },
        image: [logo, heroImage],
        description:
          "Glory Home is an Egyptian luxury interior design, turnkey finishing, bespoke furniture manufacturing, and woodworks company serving premium residential clients in Greater Cairo and Gulf markets.",
        foundingDate: "2017",
        email: "info@gloryhome-eg.com",
        telephone: "+20 127 202 0575",
        sameAs: [
          "https://www.facebook.com/gloryhome2018",
          "https://www.instagram.com/glory.home.3517/",
        ],
        founder: {
          "@type": "Person",
          "@id": mernaId,
          name: "Merna Magdy",
          jobTitle: "Co-founder",
          worksFor: {
            "@id": organizationId,
          },
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: "+20 127 202 0575",
            email: "info@gloryhome-eg.com",
            areaServed: ["EG", "SA", "AE"],
            availableLanguage: ["en", "ar"],
          },
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+20 122 457 7773",
            email: "info@gloryhome-eg.com",
            areaServed: ["EG", "SA", "AE"],
            availableLanguage: ["en", "ar"],
          },
        ],
        knowsAbout: [
          "Luxury interior design",
          "Turnkey finishing",
          "Bespoke furniture manufacturing",
          "Luxury doors and woodworks",
          "Modern classic interiors",
          "Sustainable design",
          "Smart home integration",
          "3D visualization",
          "Premium material selection",
        ],
        areaServed: areasServed,
        hasOfferCatalog: offerCatalog,
      },
      {
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
        "@id": localBusinessId,
        name: "Glory Home",
        url: baseUrl,
        image: [logo, heroImage],
        parentOrganization: {
          "@id": organizationId,
        },
        description:
          "Luxury interior design studio and furniture manufacturing business based in 6th of October City, serving premium homes, villas, and hospitality-style residential projects in Egypt and selected Gulf markets.",
        priceRange: "$$$",
        email: "info@gloryhome-eg.com",
        telephone: "+20 127 202 0575",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5B Central Axis",
          addressLocality: "6th of October City",
          addressRegion: "Giza Governorate",
          addressCountry: "EG",
        },
        location: [
          {
            "@type": "Place",
            name: "Glory Home - 6th of October City",
            address: {
              "@type": "PostalAddress",
              streetAddress: "5B Central Axis",
              addressLocality: "6th of October City",
              addressRegion: "Giza Governorate",
              addressCountry: "EG",
            },
          },
          {
            "@type": "Place",
            name: "Glory Home - Central Axis Branch",
            address: {
              "@type": "PostalAddress",
              streetAddress: "45B Central Axis",
              addressLocality: "6th of October City",
              addressRegion: "Giza Governorate",
              addressCountry: "EG",
            },
          },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "11:00",
            closes: "23:59",
          },
        ],
        paymentAccepted: "Cash, Credit Card, Installments",
        currenciesAccepted: "EGP, SAR, AED",
        availableLanguage: ["en", "ar"],
        areaServed: areasServed,
        serviceType: [
          "Interior design",
          "Turnkey finishing",
          "Bespoke furniture manufacturing",
          "Luxury doors",
          "Smart home design coordination",
          "Sustainable material specification",
        ],
        hasOfferCatalog: offerCatalog,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: baseUrl,
        name: "Glory Home",
        inLanguage: ["en", "ar"],
        about: {
          "@id": organizationId,
        },
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": homepageId,
        url: baseUrl,
        name: "Glory Home | Luxury Interior Design, Turnkey Finishing & Bespoke Furniture",
        isPartOf: {
          "@id": websiteId,
        },
        about: [
          { "@id": organizationId },
          { "@id": localBusinessId },
        ],
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: heroImage,
        },
        description:
          "Luxury interior design, turnkey finishing, doors, and bespoke furniture manufacturing for premium residences in Egypt and Gulf markets.",
      },
      {
        "@type": "Person",
        "@id": mernaId,
        name: "Merna Magdy",
        jobTitle: "Co-founder",
        worksFor: {
          "@id": organizationId,
        },
        url: `${baseUrl}/about`,
      },
    ],
  };
}
