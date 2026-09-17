import {
  ApiErrorContext,
  formatApiError,
  HttpMethod,
  NetActuateContractError,
  NetActuateError,
  NetActuateNotFoundError
} from "./errors.js";
import { ClientOptions, appendApiKey, defaultTransport, redactedRequest, resolveApiKey, resolveUrl, Transport } from "./transport.js";
import {
  decodeNkeCluster,
  decodeStorageBucket,
  decodeVpc,
  NkeCluster,
  StorageBucket,
  Vpc
} from "./decoders.js";
import { nextOffsetPath, nextPagePath, parseV3ListPage } from "./vapi3-list.js";

/** Production vAPI3 endpoint. */
export const VAPI3_BASE_URL = "https://vapi3.netactuate.com";

/** Request body for creating a VPC. */
export interface CreateVpcRequest {
  /** VPC label. */
  label: string;
  /** VPC description. */
  description?: string;
  /** Location id. */
  location_id: number;
  /** Optional network settings. */
  network?: Record<string, unknown>;
  /** Optional nameserver settings. */
  nameservers?: Record<string, unknown>;
  /** Optional firewall settings. */
  firewalls?: Record<string, unknown>;
  /** Optional default settings. */
  defaults?: Record<string, unknown>;
}

/** Request body for updating a VPC. */
export interface UpdateVpcRequest {
  /** VPC label. */
  label?: string;
  /** VPC description. */
  description?: string;
  /** Optional firewall settings. */
  firewalls?: Record<string, unknown>;
}

/** Request body for creating a storage bucket. */
export interface CreateStorageBucketRequest {
  /** Location id. */
  locationId: number;
  /** Bucket label. */
  label: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether the bucket is private. */
  private?: boolean;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
}

/** Request body for updating a storage bucket. */
export interface UpdateStorageBucketRequest {
  /** Bucket label. */
  label?: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
  /** Whether the bucket is private. */
  private?: boolean;
}

/** Billing settings for creating an NKE cluster. */
export interface NkeBilling {
  /** Package id. */
  packageId: number;
  /** Location id. */
  locationId: number;
  /** Contract id. */
  contractId?: number;
}

/** Request body for creating an NKE cluster. */
export interface CreateNkeClusterRequest {
  /** Cluster name. */
  name: string;
  /** Kubernetes version. */
  version: string;
  /** Replica count. */
  replicas: number;
  /** Minimum nodes. */
  minimumNodes: number;
  /** Maximum nodes. */
  maximumNodes: number;
  /** Whether autoscaling is enabled. */
  doAutoscaling: boolean;
  /** Whether dual stack networking is enabled. */
  doDualStack: boolean;
  /** Billing settings. */
  billing: NkeBilling;
  /** Optional networking settings. */
  networking?: Record<string, unknown>;
  /** Optional add-ons. */
  addonsToInstall?: Record<string, unknown>;
  /** Optional tags. */
  tags?: Array<{ tagId: number }>;
}

/** Request body for updating an NKE cluster. */
export interface UpdateNkeClusterRequest {
  /** Cluster name. */
  name?: string;
  /** Kubernetes version. */
  version?: string;
  /** Whether autoscaling is enabled. */
  doAutoscaling?: boolean;
  /** Billing settings. */
  billing?: Record<string, unknown>;
  /** Node settings. */
  nodes?: Record<string, unknown>;
  /** Optional tags. */
  tags?: Array<{ tagId: number }>;
}

interface V3Envelope {
  code?: number;
  data?: unknown;
  message?: string;
  error?: string;
}

/** Client for vAPI3 endpoints. */
export class V3Client {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly transport: Transport;

  /** Creates a vAPI3 client. */
  public constructor(apiKeyOrOptions?: string | ClientOptions, baseUrl?: string) {
    const options = typeof apiKeyOrOptions === "object" ? apiKeyOrOptions : { apiKey: apiKeyOrOptions, baseUrl };
    this.apiKey = resolveApiKey(options.apiKey);
    this.baseUrl = options.baseUrl === undefined || options.baseUrl === "" ? VAPI3_BASE_URL : options.baseUrl;
    this.transport = options.transport ?? defaultTransport();
  }

  /** Lists VPCs and follows vAPI3 pagination to the end. */
  public async listVpcs(): Promise<Vpc[]> {
    const rows = await this.getList("/vpcs?limit=1000");
    return rows.map(decodeVpc);
  }

  /** Gets one VPC. */
  public async getVpc(vpcId: number): Promise<Vpc> {
    return decodeVpc(await this.request("GET", `/vpcs/${vpcId}`));
  }

  /** Creates a VPC. */
  public async createVpc(input: CreateVpcRequest): Promise<Vpc> {
    return decodeVpc(await this.request("POST", "/vpcs", input));
  }

  /** Updates a VPC. */
  public async updateVpc(vpcId: number, input: UpdateVpcRequest): Promise<Vpc> {
    return decodeVpc(await this.request("PATCH", `/vpcs/${vpcId}`, input));
  }

  /** Deletes a VPC. Deleting an already absent VPC is treated as success. */
  public async deleteVpc(vpcId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}`);
  }

  /** Lists storage buckets and follows vAPI3 pagination to the end. */
  public async listStorageBuckets(): Promise<StorageBucket[]> {
    const rows = await this.getList("/storage/buckets?limit=1000");
    return rows.map(decodeStorageBucket);
  }

  /** Gets one storage bucket. */
  public async getStorageBucket(bucketId: number): Promise<StorageBucket> {
    return decodeStorageBucket(await this.request("GET", `/storage/buckets/${bucketId}`));
  }

  /** Creates a storage bucket and returns its id. */
  public async createStorageBucket(input: CreateStorageBucketRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/storage/buckets", input));
    return numberField(row, "bucketId");
  }

  /** Updates a storage bucket. */
  public async updateStorageBucket(bucketId: number, input: UpdateStorageBucketRequest): Promise<void> {
    await this.request("PATCH", `/storage/buckets/${bucketId}`, input);
  }

  /** Deletes a storage bucket. Deleting an already absent bucket is treated as success. */
  public async deleteStorageBucket(bucketId: number): Promise<void> {
    await this.deleteIdempotent(`/storage/buckets/${bucketId}`);
  }

  /** Lists NKE versions. */
  public async listNkeVersions(): Promise<string[]> {
    const rows = await this.request("GET", "/nke/versions");
    if (!Array.isArray(rows) || !rows.every((row) => typeof row === "string")) {
      throw new Error("expected NKE versions to be a string array");
    }
    return rows;
  }

  /** Lists NKE clusters and follows vAPI3 pagination to the end. */
  public async listNkeClusters(): Promise<NkeCluster[]> {
    const rows = await this.getList("/nke/clusters");
    return rows.map(decodeNkeCluster);
  }

  /** Gets one NKE cluster. */
  public async getNkeCluster(clusterId: number): Promise<NkeCluster> {
    return decodeNkeCluster(await this.request("GET", `/nke/clusters/${clusterId}`));
  }

  /** Creates an NKE cluster and returns its id. */
  public async createNkeCluster(input: CreateNkeClusterRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/nke/clusters", input));
    return numberField(row, "clusterId");
  }

  /** Updates an NKE cluster. */
  public async updateNkeCluster(clusterId: number, input: UpdateNkeClusterRequest): Promise<void> {
    await this.request("PATCH", `/nke/clusters/${clusterId}`, input);
  }

  /** Deletes an NKE cluster. Deleting an already absent cluster is treated as success. */
  public async deleteNkeCluster(clusterId: number): Promise<void> {
    await this.deleteIdempotent(`/nke/clusters/${clusterId}`);
  }

  /** Generates a kubeconfig for an NKE cluster. */
  public async generateNkeKubeconfig(clusterId: number, expirationSeconds: number): Promise<string> {
    const data = await this.request("POST", `/nke/clusters/${clusterId}/kubeconfig`, { expirationSeconds });
    return typeof data === "string" ? data : JSON.stringify(data);
  }

  private async getList(path: string): Promise<unknown[]> {
    const first = parseV3ListPage(await this.request("GET", path));
    const rows = [...first.rows];
    let next = nextOffsetPath(path, first.meta) ?? nextPagePath(path, first.paginator);
    let guard = 0;
    while (next !== undefined) {
      guard += 1;
      if (guard > 1000) {
        throw new Error("vAPI3 pagination did not terminate");
      }
      const page = parseV3ListPage(await this.request("GET", next));
      rows.push(...page.rows);
      next = nextOffsetPath(next, page.meta) ?? nextPagePath(next, page.paginator);
    }
    return rows;
  }

  private async deleteIdempotent(path: string): Promise<void> {
    try {
      await this.request("DELETE", path);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  private async request(method: HttpMethod, path: string, body?: unknown): Promise<unknown> {
    const url = resolveUrl(this.baseUrl, appendApiKey(path, this.apiKey));
    const response = await this.transport(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" })
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const text = await response.text();
    if (response.status === 204) {
      return undefined;
    }
    if (isSemanticNotFound(response.status, text)) {
      throw new NetActuateNotFoundError({ ...redactedRequest(method, url), statusCode: response.status, body: text });
    }
    let envelope: V3Envelope;
    try {
      envelope = JSON.parse(text) as V3Envelope;
    } catch (error) {
      throw new NetActuateError(`could not unmarshal response (${text.length} bytes, redacted): ${(error as Error).message}`, {
        ...redactedRequest(method, url),
        statusCode: response.status
      });
    }
    this.throwForV3Error(method, url, response.status, envelope, text);
    return envelope.data;
  }

  private throwForV3Error(method: HttpMethod, url: string, statusCode: number, envelope: V3Envelope, text: string): void {
    const context: ApiErrorContext = {
      ...redactedRequest(method, url),
      statusCode,
      code: envelope.code,
      apiMessage: envelope.message ?? envelope.error,
      body: text
    };
    if (statusCode === 404 || statusCode === 410 || envelope.code === 404 || envelope.code === 410) {
      throw new NetActuateNotFoundError(context);
    }
    if (statusCode === 412 || envelope.code === 412) {
      throw new NetActuateContractError(context);
    }
    if ((statusCode < 200 || statusCode >= 300) || (envelope.code !== undefined && (envelope.code < 200 || envelope.code >= 300))) {
      throw new NetActuateError(formatApiError("got an error response", context), context);
    }
  }
}

function isSemanticNotFound(statusCode: number, body: string): boolean {
  if (statusCode === 404 || statusCode === 410) {
    return true;
  }
  const lower = body.toLowerCase();
  return lower.includes("does not exist") || lower.includes("not associated with your account") || lower.includes("not found");
}

function requireObject(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("expected an object payload");
  }
  return input as Record<string, unknown>;
}

function numberField(row: Record<string, unknown>, name: string): number {
  const value = row[name];
  if (typeof value !== "number") {
    throw new Error(`payload is missing numeric field ${name}`);
  }
  return value;
}
