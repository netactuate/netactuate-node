/** HTTP method names supported by the SDK transport. */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Context attached to an API error without exposing credentials. */
export interface ApiErrorContext {
  /** HTTP method used for the request. */
  method: HttpMethod;
  /** Request URL with any API key redacted. */
  url: string;
  /** HTTP status code returned by the transport. */
  statusCode: number;
  /** API envelope code, when the response body supplied one. */
  code?: number;
  /** API error message, when present. */
  apiMessage?: string;
  /** Redacted response body or data snippet. */
  body?: string;
}

/** Base error for NetActuate API failures. */
export class NetActuateError extends Error {
  /** HTTP method used for the request. */
  public readonly method: HttpMethod;
  /** Request URL with any API key redacted. */
  public readonly url: string;
  /** HTTP status code returned by the transport. */
  public readonly statusCode: number;
  /** API envelope code, when the response body supplied one. */
  public readonly code?: number;
  /** API error message, when present. */
  public readonly apiMessage?: string;
  /** Redacted response body or data snippet. */
  public readonly body?: string;

  /** Creates a NetActuate API error. */
  public constructor(message: string, context: ApiErrorContext) {
    super(message);
    this.name = "NetActuateError";
    this.method = context.method;
    this.url = context.url;
    this.statusCode = context.statusCode;
    this.code = context.code;
    this.apiMessage = context.apiMessage;
    this.body = context.body;
  }
}

/** Error returned when the platform reports that a resource is gone or absent. */
export class NetActuateNotFoundError extends NetActuateError {
  /** Creates a distinguishable not found error. */
  public constructor(context: ApiErrorContext) {
    super(formatApiError("resource not found", context), context);
    this.name = "NetActuateNotFoundError";
  }
}

/** Error returned when the account contract does not allow the requested capability. */
export class NetActuateContractError extends NetActuateError {
  /** Creates a distinguishable contract gated error. */
  public constructor(context: ApiErrorContext) {
    super(formatApiError("contract refused", context), context);
    this.name = "NetActuateContractError";
  }
}

/** Returns true when an error is a NetActuate not found error. */
export function isNotFoundError(error: unknown): error is NetActuateNotFoundError {
  return error instanceof NetActuateNotFoundError;
}

/** Returns true when an error is a NetActuate contract gated error. */
export function isContractError(error: unknown): error is NetActuateContractError {
  return error instanceof NetActuateContractError;
}

/** Redacts the API key query parameter from a URL string. */
export function redactUrl(value: string): string {
  try {
    const parsed = new URL(value);
    if (parsed.searchParams.has("key")) {
      parsed.searchParams.set("key", "REDACTED");
    }
    return parsed.toString();
  } catch {
    return "[url redacted]";
  }
}

/** Formats an API error without including a secret-bearing URL. */
export function formatApiError(prefix: string, context: ApiErrorContext): string {
  const code = context.code === undefined ? "-" : String(context.code);
  const message = context.apiMessage === undefined ? "" : `, response: ${context.apiMessage}`;
  const body = context.body === undefined ? "" : ` / ${context.body}`;
  return `${prefix} on ${context.method} ${context.url}: code ${context.statusCode} / ${code}${message}${body}`;
}
