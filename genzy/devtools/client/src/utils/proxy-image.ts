export function getImageProxyUrl(url: string): string {
  return `${(window as any)?.API_URL}/images?url=${url}`;
}
