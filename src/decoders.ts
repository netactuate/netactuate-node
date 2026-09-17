/** Unknown JSON object. */
export type JsonObject = Record<string, unknown>;

/** Shared vAPI3 location object. */
export interface V3Location {
  /** Location id. */
  id: number;
  /** Location display name. */
  name: string;
  /** Optional flag code. */
  flag?: string;
}

/** Shared vAPI3 package object. */
export interface V3Package {
  /** Package id. */
  id: number;
  /** Package name. */
  name: string;
}

/** Cloud server returned by vAPI2. */
export interface Server {
  /** Server id. */
  id: number;
  /** Server FQDN. */
  name: string;
  /** Operating system name. */
  os?: string;
  /** Operating system id. */
  osId?: number;
  /** Primary IPv4 address. */
  primaryIpv4?: string;
  /** Primary IPv6 address. */
  primaryIpv6?: string;
  /** Plan id. */
  planId?: number;
  /** Package name. */
  package?: string;
  /** Contract id used for billing. */
  packageBillingContractId?: number;
  /** Location display name. */
  location?: string;
  /** Location id. */
  locationId?: number;
  /** Server status. */
  serverStatus?: string;
  /** Power status. */
  powerStatus?: string;
  /** Installed flag from vAPI2. */
  installed?: number;
  /** Cloud pool id. */
  cloudPoolId?: number;
  /** VPC id. */
  vpcId?: number;
}

/** DNS zone returned by vAPI2. */
export interface DnsZone {
  /** Zone id. */
  id: number;
  /** Zone name. */
  name: string;
  /** Zone type. */
  type: string;
  /** Master IP for secondary zones. */
  ip?: string;
  /** Master server on list responses. */
  master?: string;
  /** Zone TTL. */
  ttl?: string;
  /** Zone records, when included. */
  records?: DnsRecord[];
}

/** DNS record returned by vAPI2. */
export interface DnsRecord {
  /** Record id. */
  id: number;
  /** Zone id. */
  zoneId: number;
  /** Record name. */
  name: string;
  /** Record type. */
  type: string;
  /** Record content. */
  content: string;
  /** TTL as a string because the API returns both strings and numbers. */
  ttl: string;
  /** MX/SRV priority. */
  priority: number;
}

/** VPC metadata returned by vAPI3. */
export interface VpcMetadata {
  /** Created timestamp. */
  createdOn?: string;
  /** Label. */
  label: string;
  /** Description. */
  description?: string;
  /** Ready timestamp. */
  readyOn?: string;
  /** Status. */
  status?: string;
  /** Uptime in seconds. */
  uptimeSeconds?: number;
}

/** VPC returned by vAPI3. */
export interface Vpc {
  /** VPC id. */
  vpcId: number;
  /** VPC metadata. */
  metadata: VpcMetadata;
  /** Location. */
  location?: V3Location;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** Storage capacity summary. */
export interface StorageCapacity {
  /** Whether autoscaling is enabled. */
  autoscaling?: boolean;
  /** Requested capacity in GB. */
  requestedGB?: number;
  /** Total capacity in GB. */
  totalGB?: number;
}

/** Storage bucket metadata. */
export interface StorageBucketMetadata {
  /** Bucket id. */
  bucketId: number;
  /** Label. */
  label: string;
  /** Ready flag. */
  ready?: boolean;
  /** Private flag. */
  private?: boolean;
  /** Assigned timestamp. */
  assignedOn?: string;
  /** Location. */
  location?: V3Location;
  /** Capacity. */
  capacity?: StorageCapacity;
}

/** Storage bucket returned by vAPI3. */
export interface StorageBucket {
  /** Bucket credentials, present on single GET responses. */
  credentials?: JsonObject;
  /** Bucket metadata. */
  metadata: StorageBucketMetadata;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** NKE cluster returned by vAPI3. */
export interface NkeCluster {
  /** Cluster id. */
  clusterId: number;
  /** Cluster name. */
  name: string;
  /** Contract id. */
  contractId?: number;
  /** VPC id. */
  vpcId?: number;
  /** Replica count. */
  replicas?: number;
  /** Cluster status object. */
  status?: JsonObject;
  /** Active and requested Kubernetes versions. */
  version?: JsonObject;
  /** Location. */
  location?: V3Location;
  /** Package. */
  package?: V3Package;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** Decodes a cloud server from either flat or metadata-nested shape. */
export function decodeServer(input: unknown): Server {
  const row = objectFromMaybeMetadata(input);
  const id = numberField(row, "mbpkgid", "id");
  const name = stringField(row, "fqdn", "name", "label");
  return {
    id,
    name,
    os: optionalString(row.os),
    osId: optionalNumber(row.os_id),
    primaryIpv4: optionalString(row.ip),
    primaryIpv6: optionalString(row.ipv6),
    planId: optionalNumber(row.plan_id),
    package: optionalString(row.package),
    packageBillingContractId: optionalNumber(row.contract_id),
    location: optionalString(row.city),
    locationId: optionalNumber(row.location_id),
    serverStatus: optionalString(row.status),
    powerStatus: optionalString(row.state),
    installed: optionalNumber(row.installed),
    cloudPoolId: optionalNumber(row.cloud_pool_id),
    vpcId: optionalNumber(row.vpc_id)
  };
}

/** Decodes a DNS zone from either flat or metadata-nested shape. */
export function decodeDnsZone(input: unknown): DnsZone {
  const row = objectFromMaybeMetadata(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    type: stringField(row, "type"),
    ip: optionalString(row.ip),
    master: optionalString(row.master),
    ttl: optionalFlexibleString(row.ttl),
    records: Array.isArray(row.records) ? row.records.map(decodeDnsRecord) : undefined
  };
}

/** Decodes a DNS record from either flat or metadata-nested shape. */
export function decodeDnsRecord(input: unknown): DnsRecord {
  const row = objectFromMaybeMetadata(input);
  return {
    id: numberField(row, "id"),
    zoneId: numberField(row, "domain_id", "zoneId"),
    name: stringField(row, "name"),
    type: stringField(row, "type"),
    content: stringField(row, "content", "record_content"),
    ttl: optionalFlexibleString(row.ttl) ?? "",
    priority: optionalNumber(row.prio) ?? optionalNumber(row.priority) ?? 0
  };
}

/** Decodes a VPC from either flat list row or metadata-nested single GET shape. */
export function decodeVpc(input: unknown): Vpc {
  const raw = requireObject(input);
  const metadata = requireObject(isObject(raw.metadata) ? raw.metadata : raw);
  const id = optionalNumber(raw.vpcId) ?? optionalNumber(raw.id) ?? optionalNumber(metadata.vpcId) ?? optionalNumber(metadata.id);
  if (id === undefined) {
    throw new Error("VPC payload is missing vpcId or id");
  }
  return {
    vpcId: id,
    metadata: {
      createdOn: optionalString(metadata.createdOn),
      label: stringField(metadata, "label", "name"),
      description: optionalString(metadata.description),
      readyOn: optionalString(metadata.readyOn),
      status: optionalString(metadata.status),
      uptimeSeconds: optionalNumber(metadata.uptimeSeconds)
    },
    location: isObject(raw.location) ? decodeLocation(raw.location) : undefined,
    raw
  };
}

/** Decodes a storage bucket from either flat list row or metadata-nested single GET shape. */
export function decodeStorageBucket(input: unknown): StorageBucket {
  const raw = requireObject(input);
  const metadata = requireObject(isObject(raw.metadata) ? raw.metadata : raw);
  return {
    credentials: isObject(raw.credentials) ? raw.credentials : undefined,
    metadata: {
      bucketId: numberField(metadata, "bucketId", "id"),
      label: stringField(metadata, "label", "name"),
      ready: optionalBoolean(metadata.ready),
      private: optionalBoolean(metadata.private),
      assignedOn: optionalString(metadata.assignedOn),
      location: isObject(metadata.location) ? decodeLocation(metadata.location) : undefined,
      capacity: isObject(metadata.capacity) ? decodeStorageCapacity(metadata.capacity) : undefined
    },
    raw
  };
}

/** Decodes an NKE cluster from either flat list row or metadata-nested single GET shape. */
export function decodeNkeCluster(input: unknown): NkeCluster {
  const raw = requireObject(input);
  const row = requireObject(isObject(raw.metadata) ? { ...raw.metadata, ...raw } : raw);
  const id = optionalNumber(row.clusterId) ?? optionalNumber(row.id);
  if (id === undefined) {
    throw new Error("NKE cluster payload is missing clusterId or id");
  }
  return {
    clusterId: id,
    name: stringField(row, "name", "label"),
    contractId: optionalNumber(row.contractId),
    vpcId: optionalNumber(row.vpcId),
    replicas: optionalNumber(row.replicas),
    status: isObject(row.status) ? row.status : undefined,
    version: isObject(row.version) ? row.version : undefined,
    location: isObject(row.location) ? decodeLocation(row.location) : undefined,
    package: isObject(row.package) ? decodePackage(row.package) : undefined,
    raw
  };
}

/** Decodes a shared location object. */
export function decodeLocation(input: unknown): V3Location {
  const row = requireObject(input);
  return { id: numberField(row, "id"), name: stringField(row, "name"), flag: optionalString(row.flag) };
}

/** Decodes a shared package object. */
export function decodePackage(input: unknown): V3Package {
  const row = requireObject(input);
  return { id: numberField(row, "id"), name: stringField(row, "name") };
}

function decodeStorageCapacity(input: unknown): StorageCapacity {
  const row = requireObject(input);
  return {
    autoscaling: optionalBoolean(row.autoscaling),
    requestedGB: optionalNumber(row.requestedGB),
    totalGB: optionalNumber(row.totalGB)
  };
}

function objectFromMaybeMetadata(input: unknown): JsonObject {
  const raw = requireObject(input);
  return requireObject(isObject(raw.metadata) ? raw.metadata : raw);
}

function requireObject(input: unknown): JsonObject {
  if (!isObject(input)) {
    throw new Error("expected an object payload");
  }
  return input;
}

function isObject(input: unknown): input is JsonObject {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function numberField(row: JsonObject, ...names: string[]): number {
  for (const name of names) {
    const value = optionalNumber(row[name]);
    if (value !== undefined) {
      return value;
    }
  }
  throw new Error(`payload is missing numeric field ${names.join(" or ")}`);
}

function stringField(row: JsonObject, ...names: string[]): string {
  for (const name of names) {
    const value = optionalString(row[name]);
    if (value !== undefined) {
      return value;
    }
  }
  throw new Error(`payload is missing string field ${names.join(" or ")}`);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function optionalFlexibleString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}
