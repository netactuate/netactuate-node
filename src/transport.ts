import { HttpMethod, redactUrl } from "./errors.js";

/** Minimal response shape required from an injected transport. */
export interface TransportResponse {
  /** HTTP status code. */
  status: number;
  /** Response body as text. */
  text(): Promise<string>;
  /** Response body as raw bytes, required only for endpoints that return binary content. */
  arrayBuffer?(): Promise<ArrayBuffer>;
}

/** Request transport used by the SDK. */
export type Transport = (url: string, init: { method: HttpMethod; headers: Record<string, string>; body?: string }) => Promise<TransportResponse>;

/** Options accepted by both API clients. */
export interface ClientOptions {
  /** API key. Defaults to `NETACTUATE_API_KEY`. */
  apiKey?: string;
  /** Base URL. Empty means production. */
  baseUrl?: string;
  /** Transport used to send requests. Defaults to global `fetch`. */
  transport?: Transport;
}

/** Returns an API key from options or the environment. */
export function resolveApiKey(apiKey?: string): string {
  const resolved = apiKey ?? process.env.NETACTUATE_API_KEY;
  if (resolved === undefined || resolved === "") {
    throw new Error("NETACTUATE_API_KEY is required");
  }
  return resolved;
}

/** Returns a fetch-backed transport. */
export function defaultTransport(): Transport {
  return async (url, init) => {
    const response = await fetch(url, init);
    return {
      status: response.status,
      text: () => response.text(),
      arrayBuffer: () => response.arrayBuffer()
    };
  };
}

/** Appends the API key query parameter to a relative path. */
export function appendApiKey(path: string, apiKey: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}key=${encodeURIComponent(apiKey)}`;
}

/** Resolves a path against a base URL. */
export function resolveUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

/** Builds user-facing request context with a redacted URL. */
export function redactedRequest(method: HttpMethod, url: string): { method: HttpMethod; url: string } {
  return { method, url: redactUrl(url) };
}
