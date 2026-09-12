const AUTH_KEY = 'cbq-admin-auth';

/** SHA-256 hex of the configured admin password (UTF-8). Plaintext is not stored. */
const PASSWORD_HASH =
  'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === PASSWORD_HASH;
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(AUTH_KEY, '1');
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
}
