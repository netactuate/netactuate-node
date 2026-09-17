/** Metadata returned with offset-based vAPI3 lists. */
export interface V3ListMeta {
  /** Page limit. */
  limit?: number;
  /** Page offset. */
  offset?: number;
  /** Total row count. */
  total?: number;
}

/** Parsed vAPI3 list page. */
export interface V3ListPage {
  /** Rows on this page. */
  rows: unknown[];
  /** Offset pagination metadata, when present. */
  meta?: V3ListMeta;
  /** Laravel paginator metadata, when present. */
  paginator?: { currentPage: number; lastPage: number };
}

/** Extracts rows from all vAPI3 list envelope shapes. */
export function parseV3ListPage(data: unknown): V3ListPage {
  if (Array.isArray(data)) {
    return { rows: data };
  }
  if (!isObject(data)) {
    throw new Error("vAPI3 list response has no list data");
  }
  if (Array.isArray(data.data)) {
    return { rows: data.data, meta: parseMeta(data.meta) };
  }
  if (isObject(data.paginator) && Array.isArray(data.paginator.data)) {
    return {
      rows: data.paginator.data,
      paginator: {
        currentPage: numberOr(data.paginator.current_page, 1),
        lastPage: numberOr(data.paginator.last_page, 1)
      }
    };
  }
  if (isObject(data.data) && isObject(data.data.paginator) && Array.isArray(data.data.paginator.data)) {
    return parseV3ListPage(data.data);
  }
  for (const [key, value] of Object.entries(data)) {
    if (key === "meta") {
      continue;
    }
    if (!isObject(value) && !Array.isArray(value)) {
      continue;
    }
    try {
      return parseV3ListPage(value);
    } catch {
      continue;
    }
  }
  throw new Error("vAPI3 list response has no list data");
}

/** Returns the next offset path, or undefined when the list is complete. */
export function nextOffsetPath(path: string, meta: V3ListMeta | undefined): string | undefined {
  if (meta?.total === undefined || meta.limit === undefined || meta.offset === undefined) {
    return undefined;
  }
  if (meta.limit <= 0 || meta.offset + meta.limit >= meta.total) {
    return undefined;
  }
  const nextOffset = meta.offset + meta.limit;
  const url = new URL(path, "https://placeholder.invalid");
  url.searchParams.set("offset", String(nextOffset));
  url.searchParams.set("limit", String(meta.limit));
  return `${url.pathname}${url.search}`;
}

/** Returns the next Laravel page path, or undefined when the list is complete. */
export function nextPagePath(path: string, paginator: V3ListPage["paginator"]): string | undefined {
  if (paginator === undefined || paginator.currentPage >= paginator.lastPage) {
    return undefined;
  }
  const url = new URL(path, "https://placeholder.invalid");
  url.searchParams.set("page", String(paginator.currentPage + 1));
  return `${url.pathname}${url.search}`;
}

function parseMeta(input: unknown): V3ListMeta | undefined {
  if (!isObject(input)) {
    return undefined;
  }
  return {
    limit: numberValue(input.limit),
    offset: numberValue(input.offset),
    total: numberValue(input.total)
  };
}

function numberOr(input: unknown, fallback: number): number {
  return numberValue(input) ?? fallback;
}

function numberValue(input: unknown): number | undefined {
  return typeof input === "number" && Number.isFinite(input) ? input : undefined;
}

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
