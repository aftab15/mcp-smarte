import { AsyncLocalStorage } from "async_hooks";

type HeaderStore = { headers: Record<string, string | string[] | undefined> };

export const requestContext = new AsyncLocalStorage<HeaderStore>();

export function runWithRequestContext<T>(
  headers: HeaderStore["headers"],
  fn: () => Promise<T>,
): Promise<T> {
  return requestContext.run({ headers }, fn);
}

export function getForwardedHeaders(): Record<string, string> {
  const store = requestContext.getStore();
  const inbound = store?.headers || {};

  const auth = (inbound["authorization"] as string | undefined) || undefined;
  const apiKey = (inbound["apikey"] as string | undefined) || undefined;

  const out: Record<string, string> = {};
  if (auth) out["Authorization"] = auth;
  if (apiKey) out["apikey"] = apiKey;
  return out;
}

