export const basePath = '/dev-log';
export const site = {
  title: 'Dev Log',
  description: "shin4488's development log",
  url: `https://shin4488.github.io${basePath}/`,
  twitter: 'shin44880',
};

export function localUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    return path;
  }
  return path === basePath || path.startsWith(`${basePath}/`)
    ? path
    : `${basePath}${path}`;
}
