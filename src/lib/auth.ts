/** HTTP Basic Auth check that works in both the Edge (middleware) and Node runtimes. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAuthorizedAdmin(authorization: string | null): boolean {
  const password = process.env.ADMIN_PASSWORD;
  const user = process.env.ADMIN_USER || 'admin';
  if (!password || !authorization) return false;
  const [scheme, encoded] = authorization.split(' ');
  if (scheme !== 'Basic' || !encoded) return false;
  let decoded = '';
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }
  const sep = decoded.indexOf(':');
  if (sep < 0) return false;
  return safeEqual(decoded.slice(0, sep), user) && safeEqual(decoded.slice(sep + 1), password);
}
