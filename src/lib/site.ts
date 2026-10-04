export const basePath = '/dev-log';
export const site = {
  title: 'Dev Log',
  description: "shin4488's portfolio",
  url: `https://shin4488.github.io${basePath}/`,
  twitter: 'shin44880',
  // Proves ownership of the Search Console property for this URL. Keep it
  // published while the property is in use.
  googleSiteVerification: 'BpJ8UFxSjN-fSbSWVOPzCSSoK__ezemT3cC5chyN8q0',
};

export function localUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    return path;
  }
  return path === basePath || path.startsWith(`${basePath}/`)
    ? path
    : `${basePath}${path}`;
}
