import type { Faq } from "../components/FaqSection.astro";
import type { services } from "../data/services";

const SITE = "https://mellsnap.co.uk";
const BUSINESS = { "@id": `${SITE}/#business` };

type Service = (typeof services)[number];

/** Service (with price) and FAQ structured data for a package page. */
export function packageJsonLd(service: Service, path: string, description: string, faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE}${path}#service`,
        name: service.title,
        serviceType: "Photography",
        description,
        url: `${SITE}${path}`,
        provider: BUSINESS,
        areaServed: { "@type": "City", name: "London" },
        offers: {
          "@type": "Offer",
          price: service.price.replace("£", ""),
          priceCurrency: "GBP",
          description: `${service.price} / ${service.duration}`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}${path}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

/** BlogPosting structured data for a blog post. */
export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  date: Date;
  path: string;
  imageUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.date.toISOString(),
    url: `${SITE}${post.path}`,
    mainEntityOfPage: `${SITE}${post.path}`,
    author: { "@id": `${SITE}/#gaby`, "@type": "Person", name: "Gaby" },
    publisher: BUSINESS,
    inLanguage: "en-GB",
  };
}
