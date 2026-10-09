import { getImage } from "astro:assets";

const SITE = "https://mellsnap.co.uk";

/**
 * Crops a photo to the 1200x630 size social networks expect for link
 * previews and returns its absolute URL.
 */
export async function shareImageUrl(src: string | ImageMetadata): Promise<string> {
  const image = await getImage({
    src,
    ...(typeof src === "string" ? { inferSize: true } : {}),
    width: 1200,
    height: 630,
    fit: "cover",
    format: "jpg",
  });
  return new URL(image.src, SITE).href;
}
