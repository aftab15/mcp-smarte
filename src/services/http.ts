// Lightweight HTTP helpers used by tools
// Uses global fetch available in Node 18+

import { config } from "../config/config";

export async function makeGETRequest<T>(
  url: string,
  accept?: string,
  extraHeaders?: Record<string, string>,
): Promise<T | null> {
  const headers: Record<string, string> = {
    ...(accept ? { Accept: accept } : {}),
    ...(config.userAgent ? { 'User-Agent': config.userAgent } : {}),
    ...(extraHeaders || {}),
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error('makeGETRequest error:', err);
    return null;
  }
}

export async function makePOSTRequest<T>(
  url: string,
  body: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders || {}),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body ?? {}),
    });
    if (!res.ok) {
      throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error('makePOSTRequest error:', err);
    return null;
  }
}

