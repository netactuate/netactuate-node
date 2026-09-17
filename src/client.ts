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
  decodeDnsRecord,
  decodeDnsZone,
  decodeServer,
  DnsRecord,
  DnsZone,
  Server
} from "./decoders.js";

/** Production vAPI2 endpoint. */
export const VAPI2_BASE_URL = "https://vapi2.netactuate.com/api/";

/** Request body for creating a cloud server. */
export interface CreateServerRequest {
  /** Package plan name. */
  plan?: string;
  /** Location id. */
  location?: number;
  /** Image id. */
  image?: number;
  /** Fully qualified domain name. */
  fqdn?: string;
  /** SSH key text. */
  sshKey?: string;
  /** SSH key id. */
  sshKeyId?: number;
  /** Root password. */
  password?: string;
  /** Billing mode. */
  packageBilling?: string;
  /** Billing contract id. */
  packageBillingContractId?: string;
  /** Cloud-init or script content. */
  scriptContent?: string;
  /** Extra JSON params as a string. */
  params?: string;
  /** Cloud pool id. */
  cloudPoolId?: number;
  /** VPC id. */
  vpcId?: number;
}

/** vAPI2 server build response. */
export interface ServerBuild {
  /** Server id. */
  serverId: number;
  /** Status string. */
  status?: string;
  /** Build job id. */
  build?: number;
}

/** Request body for creating a DNS zone. */
export interface CreateDnsZoneRequest {
  /** Zone name. */
  name: string;
  /** Zone type. */
  type: string;
  /** Master IP for secondary zones. */
  ip?: string;
}

/** Request body for creating a DNS record. */
export interface CreateDnsRecordRequest {
  /** Zone id. */
  zoneId: number;
  /** Record name. */
  name?: string;
  /** Record type. */
  type: string;
  /** TTL. */
  ttl?: number;
  /** MX/SRV priority. */
  priority?: number;
  /** Record content. */
  recordContent: string;
}

/** Request body for updating a DNS record. */
export interface UpdateDnsRecordRequest extends CreateDnsRecordRequest {
  /** Record id. */
  id: number;
}

interface V2Envelope {
  result?: string;
  message?: string;
  data?: unknown;
  code?: number;
  fields?: Record<string, unknown>;
}

/** Client for vAPI2 endpoints. */
export class Client {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly transport: Transport;

  /** Creates a vAPI2 client. */
  public constructor(apiKeyOrOptions?: string | ClientOptions, baseUrl?: string) {
    const options = typeof apiKeyOrOptions === "object" ? apiKeyOrOptions : { apiKey: apiKeyOrOptions, baseUrl };
    this.apiKey = resolveApiKey(options.apiKey);
    this.baseUrl = options.baseUrl === undefined || options.baseUrl === "" ? VAPI2_BASE_URL : options.baseUrl;
    this.transport = options.transport ?? defaultTransport();
  }

  /** Lists cloud servers. */
  public async getServers(): Promise<Server[]> {
    const rows = await this.request("GET", "cloud/servers");
    return requireArray(rows).map(decodeServer);
  }

  /** Gets one cloud server. */
  public async getServer(id: number): Promise<Server> {
    return decodeServer(await this.request("GET", `cloud/server/${id}`));
  }

  /** Creates a cloud server with the vAPI2 buy and build flow. */
  public async createServer(input: CreateServerRequest): Promise<ServerBuild> {
    return decodeServerBuild(await this.request("POST", "cloud/server/buy_build", formBody(serverForm(input)), "application/x-www-form-urlencoded"));
  }

  /** Deletes a cloud server. Deleting an already absent server is treated as success. */
  public async deleteServer(id: number): Promise<void> {
    try {
      await this.request("POST", `cloud/server/${id}/delete`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Lists DNS zones of a type. */
  public async listZones(zoneType: string): Promise<DnsZone[]> {
    const rows = await this.request("GET", `dns/zones?type=${encodeURIComponent(zoneType)}`);
    return requireArray(rows).map(decodeDnsZone);
  }

  /** Gets one DNS zone. */
  public async getZone(id: number): Promise<DnsZone> {
    return decodeDnsZone(await this.request("GET", `dns/zone/${id}`));
  }

  /** Creates a DNS zone. */
  public async createZone(input: CreateDnsZoneRequest): Promise<DnsZone> {
    return decodeDnsZone(await this.request("POST", "dns/zone", formBody(input as unknown as Record<string, unknown>), "application/x-www-form-urlencoded"));
  }

  /** Deletes a DNS zone. Deleting an already absent zone is treated as success. */
  public async deleteZone(id: number): Promise<void> {
    try {
      await this.request("DELETE", `dns/zone/${id}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Lists DNS records for a zone. */
  public async listRecords(zoneId: number): Promise<DnsRecord[]> {
    const rows = await this.request("GET", `dns/records/${zoneId}`);
    return requireArray(rows).map(decodeDnsRecord);
  }

  /** Gets one DNS record. */
  public async getRecord(id: number): Promise<DnsRecord> {
    return decodeDnsRecord(await this.request("GET", `dns/record/${id}`));
  }

  /** Creates a DNS record. */
  public async createRecord(input: CreateDnsRecordRequest): Promise<DnsRecord> {
    return decodeDnsRecord(await this.request("POST", "dns/record", formBody(recordForm(input)), "application/x-www-form-urlencoded"));
  }

  /** Updates a DNS record. */
  public async updateRecord(input: UpdateDnsRecordRequest): Promise<DnsRecord> {
    return decodeDnsRecord(await this.request("PUT", "dns/record", formBody(recordForm(input)), "application/x-www-form-urlencoded"));
  }

  /** Deletes a DNS record. Deleting an already absent record is treated as success. */
  public async deleteRecord(id: number): Promise<void> {
    try {
      await this.request("DELETE", `dns/record/${id}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  private async request(method: HttpMethod, path: string, body?: string, contentType?: string): Promise<unknown> {
    const url = resolveUrl(this.baseUrl, appendApiKey(path, this.apiKey));
    const response = await this.transport(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(contentType === undefined ? {} : { "Content-Type": contentType })
      },
      ...(body === undefined ? {} : { body })
    });
    const text = await response.text();
    let envelope: V2Envelope;
    try {
      envelope = JSON.parse(text) as V2Envelope;
    } catch (error) {
      if (response.status === 404) {
        throw new NetActuateNotFoundError({ ...redactedRequest(method, url), statusCode: response.status, body: text });
      }
      throw new NetActuateError(`could not unmarshal response (${text.length} bytes, redacted): ${(error as Error).message}`, {
        ...redactedRequest(method, url),
        statusCode: response.status
      });
    }

    this.throwForV2Error(method, url, response.status, envelope, text);
    return unwrapV2Data(envelope.data);
  }

  private throwForV2Error(method: HttpMethod, url: string, statusCode: number, envelope: V2Envelope, text: string): void {
    const context: ApiErrorContext = {
      ...redactedRequest(method, url),
      statusCode,
      code: envelope.code,
      apiMessage: envelope.message,
      body: safeBody(envelope.data, text)
    };
    if (statusCode === 404 || envelope.code === 404 || isV2SemanticNotFound(envelope)) {
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

function unwrapV2Data(data: unknown): unknown {
  if (isObject(data) && isObject(data.paginator) && Array.isArray(data.paginator.data)) {
    return data.paginator.data;
  }
  if (isObject(data) && Array.isArray(data.data) && typeof data.current_page === "number") {
    return data.data;
  }
  return data;
}

function isV2SemanticNotFound(envelope: V2Envelope): boolean {
  if (!isObject(envelope.fields)) {
    return false;
  }
  return Object.values(envelope.fields).some((value) => Array.isArray(value) && value.some((entry) => typeof entry === "string" && (entry.includes("must be a valid") || entry.includes("could not be found"))));
}

function decodeServerBuild(input: unknown): ServerBuild {
  const row = requireObject(input);
  return {
    serverId: numberValue(row.mbpkgid) ?? numberValue(row.serverId) ?? 0,
    status: stringValue(row.status),
    build: numberValue(row.build)
  };
}

function serverForm(input: CreateServerRequest): Record<string, string | number | undefined> {
  return {
    plan: input.plan,
    location: input.location,
    image: input.image,
    fqdn: input.fqdn,
    ssh_key: input.sshKey,
    ssh_key_id: input.sshKeyId,
    password: input.password,
    package_billing: input.packageBilling,
    package_billing_contract_id: input.packageBillingContractId,
    script_content: input.scriptContent,
    script_type: input.scriptContent === undefined ? undefined : "user-data",
    params: input.params,
    cloud_pool_id: input.cloudPoolId,
    vpc_id: input.vpcId
  };
}

function recordForm(input: CreateDnsRecordRequest | UpdateDnsRecordRequest): Record<string, string | number | undefined> {
  return {
    id: "id" in input ? input.id : undefined,
    domain_id: input.zoneId,
    name: input.name,
    type: input.type,
    ttl: input.ttl,
    prio: input.priority,
    record_content: input.recordContent
  };
}

function formBody(input: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

function requireArray(input: unknown): unknown[] {
  if (!Array.isArray(input)) {
    throw new Error("expected an array payload");
  }
  return input;
}

function requireObject(input: unknown): Record<string, unknown> {
  if (!isObject(input)) {
    throw new Error("expected an object payload");
  }
  return input;
}

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function numberValue(input: unknown): number | undefined {
  return typeof input === "number" ? input : undefined;
}

function stringValue(input: unknown): string | undefined {
  return typeof input === "string" ? input : undefined;
}

function safeBody(data: unknown, fallback: string): string {
  try {
    return data === undefined ? fallback : JSON.stringify(data);
  } catch {
    return "[body redacted]";
  }
}
