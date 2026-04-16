const AMAZON_TAG = process.env.AMAZON_AFFILIATE_TAG ?? "yourtag-21";
const FLIPKART_ID = process.env.FLIPKART_AFFILIATE_ID ?? "your_flipkart_id";
const CUELINKS_TOKEN = process.env.CUELINKS_TOKEN ?? "";

export function amazonAffiliate(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("tag", AMAZON_TAG);
    u.searchParams.set("linkCode", "ogi");
    return u.toString();
  } catch {
    return `${url}?tag=${AMAZON_TAG}`;  
  }
}

function flipkartAffiliate(url: string): string {
  const base = "https://affiliate.flipkart.com/api/1/genie";
  const params = new URLSearchParams({ affid: FLIPKART_ID, url });
  return `${base}?${params.toString()}`;
}

function meeshoAffiliate(url: string): string {
  return `https://meesho.com/affiliate?url=${encodeURIComponent(url)}`;
}

function myntraAffiliate(url: string): string {
  const params = new URLSearchParams({ affid: FLIPKART_ID, url });
  return `https://affiliate.flipkart.com/api/1/genie?${params.toString()}`;
}

function cuelinksAffiliate(url: string): string {
  if (!CUELINKS_TOKEN) return url;
  return `https://linksredirect.com/?pub_id=${CUELINKS_TOKEN}&url=${encodeURIComponent(url)}`;
}

function appendTracking(url: string, source: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "findmyitem");
    u.searchParams.set("utm_medium", "affiliate");
    u.searchParams.set("utm_campaign", source);
    return u.toString();
  } catch {
    return url;
  }
}

export function attachAffiliate(url: string, source: string): string {
  let affiliateUrl: string;

  switch (source.toLowerCase()) {
    case "amazon":    affiliateUrl = amazonAffiliate(url); break;
    case "flipkart":  affiliateUrl = flipkartAffiliate(url); break;
    case "meesho":    affiliateUrl = meeshoAffiliate(url); break;
    case "myntra":    affiliateUrl = myntraAffiliate(url); break;
    default:          affiliateUrl = cuelinksAffiliate(url); break;
  }

  return appendTracking(affiliateUrl, source);
}

export function attachAffiliateToAll<T extends { url: string; source: string }>(
  products: T[]
): T[] {
  return products.map((p) => ({ ...p, url: attachAffiliate(p.url, p.source) }));
}