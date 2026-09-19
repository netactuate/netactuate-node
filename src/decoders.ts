import { parseV3ListPage } from "./vapi3-list.js";

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

/** A resource currently assigned to a tag (a server, an NKE cluster, and so on). */
export interface TagResource {
  /** Assignment row id. */
  id: number;
  /** Id of the resource-tag association. */
  resourceTagId: number;
  /** Resource type name, such as "server" or "nke_cluster". */
  resourceName: string;
  /** Primary numeric id of the assigned resource. */
  identifier: number;
  /** Creation timestamp. */
  createdAt?: string;
}

/** NetActuate tag returned by vAPI2. Tags are global and can be assigned to many resources. */
export interface Tag {
  /** Tag id. */
  id: number;
  /** Tag name. */
  name: string;
  /** Tag description. */
  description?: string;
  /** Icon identifier. */
  icon?: string;
  /** Display color. */
  color?: string;
  /** Whether this is the account's default tag. */
  isDefault: boolean;
  /** Whether this tag is marked as a favorite. */
  isFavorite: boolean;
  /** Whether this tag is locked against deletion or reassignment. */
  isLocked: boolean;
  /** Whether this tag is shown on the dashboard. */
  showDashboard: boolean;
  /** Creation timestamp. */
  createdAt?: string;
  /** Owning account id. */
  mbId?: number;
  /** Count of resources currently assigned to this tag. */
  resourcesCount?: number;
  /** Resources currently assigned to this tag, when included in the response. */
  resources?: TagResource[];
}

/** Log entry recorded against a tag. */
export interface TagLog {
  /** Log entry id. */
  id?: number;
  /** Tag id the entry belongs to. */
  tagId?: number;
  /** Action name. */
  action?: string;
  /** Log message. */
  message?: string;
  /** Creation timestamp. */
  createdAt?: string;
  /** Original payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** SSH key registered on the account. */
export interface SshKey {
  /** SSH key id. */
  id: number;
  /** SSH key name. */
  name: string;
  /** Public key text. */
  key: string;
  /** Key fingerprint. */
  fingerprint?: string;
}

/** Optional ICMP match refinement for a firewall rule. */
export interface FirewallMatchOptions {
  /** ICMP type to match. */
  icmpType?: string;
}

/** Match criteria carried by a firewall rule. */
export interface FirewallMatchCriteria {
  /** Protocol matched by the rule. */
  protocol?: string;
  /** Source networks in CIDR form. */
  sourceNet?: string[];
  /** Destination networks in CIDR form. */
  destinationNet?: string[];
  /** First port in the matched source range. */
  sourcePortStart?: number;
  /** Last port in the matched source range. */
  sourcePortEnd?: number;
  /** First port in the matched destination range. */
  destinationPortStart?: number;
  /** Last port in the matched destination range. */
  destinationPortEnd?: number;
  /** IP version the rule matches, 4 or 6. */
  ipVersionNumber?: number;
  /** Additional protocol-specific options. */
  options?: FirewallMatchOptions;
}

/** A cloud firewall rule belonging to a firewall set. */
export interface FirewallRule {
  /** Rule id. */
  id: number;
  /** Id of the firewall set the rule belongs to. */
  firewallSetId: number;
  /** IP version the rule matches. */
  ipVersion: string;
  /** Traffic direction, "in" or "out". */
  direction: string;
  /** Action taken on matching traffic, such as "accept" or "drop". */
  action: string;
  /** Whether the rule is enabled. */
  enabled: boolean;
  /** Match criteria for the rule. */
  matchCriteria?: FirewallMatchCriteria;
  /** Operator-supplied comment. */
  adminComment?: string;
  /** Priority used to order rule evaluation. */
  rulePriority: number;
  /** Creation timestamp. */
  created?: string;
  /** Last update timestamp. */
  lastUpdated?: string;
}

/** A cloud firewall set, the container that firewall rules and VMs attach to. */
export interface FirewallSet {
  /** Firewall set id. */
  id: number;
  /** Set name. */
  name: string;
  /** Set description. */
  description?: string;
  /** Whether the set is enabled. */
  enabled: boolean;
  /** Whether this set is a draft awaiting publish. */
  isDraft: boolean;
  /** Id of the draft set created from this one, when one exists. */
  draftFirewallSetId?: number;
  /** Creation timestamp. */
  created?: string;
  /** Last update timestamp. */
  lastUpdated?: string;
}

/** An external IP set available for use in firewall match criteria. */
export interface FirewallExternalIpSet {
  /** External IP set id. */
  id: number;
  /** Set name. */
  name?: string;
  /** Set description. */
  description?: string;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** Whether cloud firewall management is available for the account. */
export interface FirewallManageEnabled {
  /** Whether firewall management is enabled. */
  enabled: boolean;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** A VM attached to a cloud firewall set. */
export interface FirewallSetVm {
  /** Attachment relation id. */
  id: number;
  /** Server package id. */
  mbpkgid: number;
  /** Network interface id the set is attached through. */
  interfaceId: number;
  /** Id of the firewall set this attachment belongs to. */
  firewallSetId: number;
  /** Evaluation priority among the sets attached to the VM. */
  setPriority: number;
  /** Creation timestamp. */
  created?: string;
  /** Last update timestamp. */
  lastUpdated?: string;
  /** IATA code of the VM's location. */
  iataCode?: string;
  /** VM location display name. */
  location?: string;
  /** VM hostname. */
  hostname?: string;
}

/** Reads a bool that the platform may send as a boolean, a 0/1 number, or a "1"/"true" string. */
function toBoolFlexible(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  if (typeof value === "string") {
    return value === "1" || value === "true";
  }
  return false;
}

/** Reads an int that the platform may send as a number or a numeric string. */
function toIntFlexible(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

/** Decodes firewall rule match criteria, when present. */
export function decodeFirewallMatchCriteria(input: unknown): FirewallMatchCriteria | undefined {
  if (!isObject(input)) {
    return undefined;
  }
  const options = isObject(input.options) ? { icmpType: optionalString(input.options.icmp_type) } : undefined;
  return {
    protocol: optionalString(input.protocol),
    sourceNet: Array.isArray(input.source_net) ? input.source_net.filter((entry): entry is string => typeof entry === "string") : undefined,
    destinationNet: Array.isArray(input.destination_net) ? input.destination_net.filter((entry): entry is string => typeof entry === "string") : undefined,
    sourcePortStart: optionalNumber(input.source_port_start),
    sourcePortEnd: optionalNumber(input.source_port_end),
    destinationPortStart: optionalNumber(input.destination_port_start),
    destinationPortEnd: optionalNumber(input.destination_port_end),
    ipVersionNumber: optionalNumber(input.ip_version_number),
    options
  };
}

/** Decodes a cloud firewall rule. */
export function decodeFirewallRule(input: unknown): FirewallRule {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    firewallSetId: toIntFlexible(row.firewall_set_id),
    ipVersion: stringField(row, "ip_version"),
    direction: stringField(row, "direction"),
    action: stringField(row, "action"),
    enabled: toBoolFlexible(row.enabled),
    matchCriteria: decodeFirewallMatchCriteria(row.match_criteria),
    adminComment: optionalString(row.admin_comment),
    rulePriority: optionalNumber(row.rule_priority) ?? 0,
    created: optionalString(row.created),
    lastUpdated: optionalString(row.last_updated)
  };
}

/** Decodes a cloud firewall set. */
export function decodeFirewallSet(input: unknown): FirewallSet {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    enabled: toBoolFlexible(row.enabled),
    isDraft: toBoolFlexible(row.is_draft),
    draftFirewallSetId: optionalNumber(row.draft_firewall_set_id),
    created: optionalString(row.created),
    lastUpdated: optionalString(row.last_updated)
  };
}

/** Decodes an external IP set, preserving the full payload alongside the common fields. */
export function decodeFirewallExternalIpSet(input: unknown): FirewallExternalIpSet {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: optionalString(row.name),
    description: optionalString(row.description),
    raw: row
  };
}

/** Decodes the firewall management availability flag, preserving the full payload. */
export function decodeFirewallManageEnabled(input: unknown): FirewallManageEnabled {
  const row = requireObject(input);
  return { enabled: toBoolFlexible(row.enabled), raw: row };
}

/** Decodes a VM attached to a cloud firewall set. */
export function decodeFirewallSetVm(input: unknown): FirewallSetVm {
  const row = requireObject(input);
  return {
    id: toIntFlexible(row.id),
    mbpkgid: toIntFlexible(row.mbpkgid),
    interfaceId: toIntFlexible(row.interface_id),
    firewallSetId: toIntFlexible(row.firewall_set_id),
    setPriority: toIntFlexible(row.set_priority),
    created: optionalString(row.created),
    lastUpdated: optionalString(row.last_updated),
    iataCode: optionalString(row.iata_code),
    location: optionalString(row.location),
    hostname: optionalString(row.hostname)
  };
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

/** A backend host attached to a VPC backend template. */
export interface VpcBackend {
  /** Backend host id, present once the platform has assigned one. */
  backendHostId?: number;
  /** Backend name. */
  name?: string;
  /** Public address. */
  address?: string;
  /** Address reachable from inside the VPC. */
  internalAddress?: string;
}

/** VPC backend template, grouping backend hosts behind a load balancer. */
export interface VpcBackendTemplate {
  /** Backend template id. */
  backendTemplateId: number;
  /** Template name. */
  name?: string;
  /** Template description. */
  description?: string;
  /** Backend hosts in the template, when included. */
  backendHosts?: VpcBackend[];
}

/** Bastion addresses for a VPC's SSH access. */
export interface VpcSshBastion {
  /** Bastion IPv4 address. */
  ipv4?: string;
  /** Bastion IPv6 address. */
  ipv6?: string;
}

/** An SSH key authorized for bastion access into a VPC. */
export interface VpcSshKey {
  /** Key id. */
  id: number;
  /** SSH key id this entry references. */
  sshKeyId?: number;
  /** Key name. */
  name?: string;
  /** Key fingerprint. */
  fingerprint?: string;
  /** Public key text. */
  publicKey?: string;
  /** Whether the key is currently enabled for the VPC. */
  enabled: boolean;
  /** Timestamp the key was added to the VPC. */
  createdAt?: string;
}

/** Bastion SSH settings for a VPC. */
export interface VpcSshSettings {
  /** Bastion SSH port, when set. */
  port?: number;
  /** Whether bastion SSH access is enabled. */
  enabled: boolean;
  /** Keys authorized for bastion access. */
  keys: VpcSshKey[];
  /** Bastion addresses. */
  bastion?: VpcSshBastion;
}

/** IP reservations held by a VPC, grouped by consumer. The platform's own shapes for each group vary, so each is kept as opaque JSON. */
export interface VpcIpReservations {
  /** Reservations used by VPC gateways. */
  gateways?: unknown;
  /** Reservations used by VPC network interfaces. */
  interfaces?: unknown;
  /** Reservations used by VMs in the VPC. */
  vms?: unknown;
}

/** A floating IP attached to a VPC. */
export interface VpcFloatingIp {
  /** Floating IP id. */
  floatingIpId: number;
  /** The floating IP address. */
  address: string;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Reverse DNS pointer record. */
  ptr?: string;
  /** Whether this is the VPC's primary floating IP. */
  isPrimary: boolean;
}

/** A start/end port range used by VPC gateway rules. */
export interface VpcPortRange {
  /** First port in the range. */
  start?: number;
  /** Last port in the range. */
  end?: number;
}

/** A VPC gateway firewall rule. */
export interface VpcFirewallRule {
  /** Firewall rule id. */
  firewallRuleId: number;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Traffic direction, "inbound" or "outbound". */
  direction: string;
  /** Protocol matched by the rule. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** CIDR network matched by the rule. */
  network?: string;
  /** Matched address, on rules returned with a resolved address rather than a network. */
  address?: string;
  /** Prefix length, on rules returned with a resolved address rather than a network. */
  prefixLength?: number;
  /** Port range matched by the rule. */
  port?: VpcPortRange;
}

/** The internal CIDR matched by a VPC SNAT rule. */
export interface VpcSnatMatch {
  /** Internal CIDR the rule matches. */
  internalCidr?: string;
}

/** A start/end address range used by a VPC SNAT rule's translation. */
export interface VpcSnatAddressRange {
  /** First address in the range. */
  start?: string;
  /** Last address in the range. */
  end?: string;
}

/** The translation applied by a VPC SNAT rule. */
export interface VpcSnatTranslation {
  /** Address range traffic is translated to. */
  address?: VpcSnatAddressRange;
  /** Port range traffic is translated to. */
  port?: VpcPortRange;
}

/** A VPC gateway SNAT rule. */
export interface VpcSnatRule {
  /** SNAT rule id. */
  snatRuleId: number;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol matched by the rule. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** Traffic matched by the rule. */
  match?: VpcSnatMatch;
  /** Translation applied to matched traffic. */
  translation?: VpcSnatTranslation;
}

/** The address and port matched by a VPC DNAT rule. */
export interface VpcDnatMatch {
  /** Address the rule matches. */
  address?: string;
  /** Port range the rule matches. */
  port?: VpcPortRange;
}

/** The translation applied by a VPC DNAT rule. */
export interface VpcDnatTranslation {
  /** Address traffic is translated to. */
  address: string;
  /** Port range traffic is translated to. */
  port?: VpcPortRange;
}

/** A VPC gateway DNAT rule. */
export interface VpcDnatRule {
  /** DNAT rule id. */
  dnatRuleId: number;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol matched by the rule. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** Traffic matched by the rule. */
  match?: VpcDnatMatch;
  /** Translation applied to matched traffic. */
  translation?: VpcDnatTranslation;
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

/** Hardware class backing a storage resource. */
export interface StorageHardwareClass {
  /** Hardware class id. */
  id: number;
  /** Hardware class name. */
  name: string;
  /** Hardware class description. */
  description?: string;
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
  /** Hardware class. */
  hardwareClass?: StorageHardwareClass;
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

/** Storage object store metadata. */
export interface StorageObjectStoreMetadata {
  /** Object store id. */
  objectStoreId: number;
  /** Label. */
  label: string;
  /** Ready flag. */
  ready?: boolean;
  /** Assigned timestamp. */
  assignedOn?: string;
  /** Location. */
  location?: V3Location;
  /** Capacity. */
  capacity?: StorageCapacity;
  /** Hardware class. */
  hardwareClass?: StorageHardwareClass;
}

/** Storage object store returned by vAPI3. */
export interface StorageObjectStore {
  /** Object store credentials, present on single GET responses. */
  credentials?: JsonObject;
  /** Object store metadata. */
  metadata: StorageObjectStoreMetadata;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** Storage block namespace metadata. */
export interface StorageBlockNamespaceMetadata {
  /** Block namespace id. */
  blockNamespaceId: number;
  /** Label. */
  label: string;
  /** Ready flag. */
  ready?: boolean;
  /** Assigned timestamp. */
  assignedOn?: string;
  /** Location. */
  location?: V3Location;
  /** Capacity. */
  capacity?: StorageCapacity;
  /** Hardware class. */
  hardwareClass?: StorageHardwareClass;
}

/** Storage block namespace returned by vAPI3. */
export interface StorageBlockNamespace {
  /** Block namespace credentials, present on single GET responses. */
  credentials?: JsonObject;
  /** Block namespace metadata. */
  metadata: StorageBlockNamespaceMetadata;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/**
 * Storage block volume metadata.
 *
 * `blockVolumeId` decodes to 0 when read back from the single-volume GET endpoint, which
 * has a platform defect that returns object-store shaped metadata carrying no volume id at
 * all. See {@link V3Client.getStorageBlockVolume}.
 */
export interface StorageBlockVolumeMetadata {
  /** Block volume id. */
  blockVolumeId: number;
  /** Label. */
  label: string;
  /** Ready flag. */
  ready?: boolean;
  /** Assigned timestamp. */
  assignedOn?: string;
  /** Location. */
  location?: V3Location;
  /** Capacity. */
  capacity?: StorageCapacity;
  /** Hardware class. */
  hardwareClass?: StorageHardwareClass;
}

/** Storage block volume returned by vAPI3. */
export interface StorageBlockVolume {
  /** Block volume credentials, present on single GET responses. */
  credentials?: JsonObject;
  /** Block volume metadata. */
  metadata: StorageBlockVolumeMetadata;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** A location where storage can be provisioned, paired with the hardware class serving it. */
export interface StorageLocation {
  /** Location. */
  location: V3Location;
  /** Hardware class serving the location. */
  hardware: StorageHardwareClass;
}

/** A storage type offered by the account, such as an S3 bucket or a block volume. */
export interface StorageType {
  /** Type code, such as "s3" or "block". */
  type?: string;
  /** Display name. */
  name?: string;
  /** Description. */
  description?: string;
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

/** Access URLs for reaching an NKE cluster's API, Prometheus and dashboard endpoints. */
export interface NkeAccessUrls {
  /** API endpoint URL. */
  api?: string;
  /** Prometheus endpoint URL. */
  prometheus?: string;
  /** Kubernetes dashboard URL. */
  kubernetesDashboard?: string;
}

/** One entry in an NKE cluster's activity log. */
export interface NkeLogEntry {
  /** Timestamp the entry was recorded. */
  recordedOn: string;
  /** Log message. */
  message: string;
}

/** Worker node belonging to an NKE cluster. */
export interface NkeWorkerNode {
  /** Worker node id. */
  workerNodeId: number;
  /** Id of the cluster this node belongs to. */
  clusterId?: number;
  /** Node name. */
  name: string;
  /** Server package id backing this node. */
  mbpkgid?: number;
  /** Location id. */
  locationId?: number;
  /** Whether the node reports ready. */
  ready?: boolean;
  /** Package. */
  package?: V3Package;
  /** Location. */
  location?: V3Location;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** Addon catalog entry describing one installable NKE addon version. */
export interface NkeAddonCatalogEntry {
  /** Addon id. */
  addonId: number;
  /** Addon type, such as "netactuate-dns" or "storage". */
  addonType: string;
  /** Addon version. */
  version?: string;
  /** Release channel. */
  channel?: string;
  /** Display name. */
  displayName?: string;
  /** Minimum Kubernetes version this addon supports. */
  minKubernetesVersion?: string;
  /** Maximum Kubernetes version this addon supports. */
  maxKubernetesVersion?: string;
  /** Whether this is the default version for its addon type. */
  isDefault?: boolean;
  /** Whether this addon requires the cluster to be VPC networked. */
  requiresVpc?: boolean;
}

/** DNS zone binding reported by the netactuate-dns addon's config. */
export interface NkeDnsAddonZone {
  /** DNS zone id. */
  dnsZoneId: number;
  /** Zone name. */
  zone: string;
  /** Sync mode. */
  mode?: string;
}

/** StorageClass binding reported by the storage addon's config. */
export interface NkeStorageAddonIntegration {
  /** Storage integration id. */
  storageIntegrationId: number;
  /** Backing block namespace id. */
  blockNamespaceId?: number;
  /** StorageClass name in the cluster. */
  storageClassName?: string;
  /** VolumeSnapshotClass name in the cluster. */
  volumeSnapshotClassName?: string;
  /** Whether this is the cluster's default StorageClass. */
  isDefaultClass?: boolean;
  /** Reclaim policy applied to volumes. */
  reclaimPolicy?: string;
}

/**
 * Config an addon reports back, which is not the shape it was written with. Both known addon
 * types return a list keyed by their own concern: the netactuate-dns addon under `zones`, the
 * storage addon under `integrations`.
 */
export interface NkeAddonConfig {
  /** DNS zones, when this is a netactuate-dns addon. */
  zones?: NkeDnsAddonZone[];
  /** StorageClass integrations, when this is a storage addon. */
  integrations?: NkeStorageAddonIntegration[];
}

/** Addon installed on an NKE cluster. */
export interface NkeAddon {
  /** Installation row id. */
  id: number;
  /** Addon catalog id. */
  addonId?: number;
  /** Cluster id. */
  clusterId?: number;
  /** Addon type. */
  addonType: string;
  /** Installed version. */
  version?: string;
  /** Release channel. */
  channel?: string;
  /** Display name. */
  displayName?: string;
  /** Installation state. */
  state?: string;
  /** Whether a newer version is available. */
  updateAvailable?: boolean;
  /** Catalog metadata for the installed addon. */
  catalog?: JsonObject;
  /** Reported health. */
  health?: JsonObject;
  /** Reported workload health. */
  workloadHealth?: JsonObject;
  /** Addon-specific config as reported back by the platform. */
  config?: NkeAddonConfig;
  /** Lifecycle timestamps. */
  timestamps?: JsonObject;
  /** Reason the addon failed, when it has. */
  failureReason?: string;
  /** Timestamp of the next install retry, when one is scheduled. */
  installRetryOn?: string;
  /** Number of failed install attempts. */
  installFailureCt?: number;
  /** Original payload for fields not yet modeled. */
  raw: JsonObject;
}

/** DNS zone attached to an NKE cluster through the netactuate-dns addon. */
export interface NkeClusterDnsZone {
  /** DNS zone id. */
  dnsZoneId: number;
  /** Cluster id. */
  clusterId?: number;
  /** Zone name. */
  zone: string;
  /** Sync mode. */
  mode?: string;
  /** Reason the zone failed, when it has. */
  failureReason?: string;
  /** Zone state. */
  state?: string;
  /** Reported health, kept as opaque JSON. */
  health?: unknown;
  /** Lifecycle timestamps, kept as opaque JSON. */
  timestamps?: unknown;
}

/** Dedicated device row returned by the availability filter. Fields vary by device type. */
export type DedicatedDevice = JsonObject;

/** Dedicated server plan row for a location. Fields vary by plan. */
export type DedicatedPlan = JsonObject;

/** Dedicated server power status payload. Shape varies by the action queried. */
export type DedicatedPowerStatus = JsonObject;

/** Location where dedicated servers can be deployed. */
export interface DedicatedLocation {
  /** Short location code. */
  shortName: string;
  /** Public-facing description. */
  pubDescription?: string;
  /** Location id. */
  locationId: number;
}

/** Named id pair used inside a dedicated OS profile's disk layouts and scripts. */
export interface DedicatedIdName {
  /** Item id. */
  id: number;
  /** Item name. */
  name: string;
}

/** OS profile compatible with a dedicated device. */
export interface DedicatedOsProfile {
  /** OS profile id. */
  osId: number;
  /** OS name. */
  name: string;
  /** OS group name. */
  groupName: string;
  /** Tags describing the OS. */
  tags: string[];
  /** Disk layouts compatible with this OS. */
  diskLayouts: DedicatedIdName[];
  /** Build scripts compatible with this OS. */
  scripts: DedicatedIdName[];
  /** Default disk layout id. */
  defaultDiskLayout: number;
  /** Default build script ids. */
  defaultScripts: number[];
  /** Whether SSH keys can be injected at build time. */
  allowSshKeys: boolean;
  /** Whether a root password can be set at build time. */
  setRootPassword: boolean;
  /** Whether this OS is a rescue image. */
  rescueImage: boolean;
  /** Whether this OS is publicly listed. */
  public: boolean;
  /** Whether this OS is enabled for new builds. */
  enabled: boolean;
  /** Creation timestamp. */
  created: string;
  /** Last update timestamp. */
  lastUpdated: string;
  /** Profile id. */
  profileId: number;
  /** CPU architecture. */
  arch: string;
  /** OS flavor. */
  flavor: string;
  /** Location id this profile is scoped to, when scoped. */
  locationId?: number;
}

/** Rescue OS profile compatible with a dedicated device. Shares its wire shape with {@link DedicatedOsProfile}. */
export type DedicatedRescueOsProfile = DedicatedOsProfile;

/** Disk layout offered for a dedicated OS profile. */
export interface DedicatedDiskLayout {
  /** Disk layout id. */
  layoutId: number;
  /** Layout name. */
  name: string;
  /** OS profile the layout applies to. */
  profile: string;
  /** Minimum number of disks required by the layout. */
  minDisks: number;
}

/** Boot profile available for booting a cloud server. */
export interface BootProfile {
  /** Boot profile id. */
  bootProfileId: number;
  /** Profile name. */
  name: string;
  /** Profile type. */
  type: string;
  /** Profile description. */
  description: string;
  /** Boot builder identifier. */
  builder: string;
  /** Kernel identifier. */
  kernel: string;
  /** Boot mode. */
  boot: string;
  /** Serial console setting. */
  serial: string;
  /** Disk representation string. */
  diskRepresent: string;
  /** Backing image template id, or 0 when the profile has none. */
  imageTemplate: number;
  /** Last update timestamp. */
  lastUpdated: string;
  /** Extra boot parameters, when set. */
  extra?: string;
  /** VNC display setting, when set. */
  vncDisplay?: string;
  /** Root disk device, when set. */
  diskRoot?: string;
  /** Bootloader identifier, when set. */
  bootloader?: string;
  /** Ramdisk path, when set. */
  ramdisk?: string;
  /** Initrd path, when set. */
  initrd?: string;
  /** Creation timestamp, when set. */
  created?: string;
  /** Whether PAE is enabled. */
  pae: number;
  /** Whether ACPI is enabled. */
  acpi: number;
  /** Whether APIC is enabled. */
  apic: number;
  /** Whether the guest clock uses localtime. */
  xLocaltime: number;
  /** Whether SDL display is enabled. */
  sdl: number;
  /** Whether VNC is enabled. */
  vnc: number;
  /** Whether the VNC console is enabled. */
  vncConsole: number;
  /** Whether VNC uses an unused port. */
  vncUnused: number;
  /** Whether the profile is hidden. */
  hide: number;
  /** Whether KVM acceleration is enabled. */
  kvm: number;
}

/** Build job returned when purchasing, deploying or rebuilding a dedicated server. */
export interface MetalBuild {
  /** Server package id. */
  mbPkgId: number;
  /** Build status. */
  status?: string;
  /** Build job id. */
  build?: number;
}

/** Dedicated server (metal package) returned by the account listing. */
export interface Metal {
  /** Row id. */
  id: number;
  /** Datacenter id. */
  datacenterId: number;
  /** Whether the server is scheduled for cancellation. */
  canceling: boolean;
  /** Server package id. */
  mbPkgId: number;
  /** Billing price. */
  price: string;
  /** Server hostname. */
  hostname: string;
  /** Primary NIC MAC address. */
  eth0Mac: string;
  /** Secondary NIC MAC address, when present. */
  eth1Mac?: string;
  /** IPMI NIC MAC address. */
  ipmiMac: string;
  /** Primary IPv4 address. */
  primaryIp: string;
  /** Primary IPv6 address, when assigned. */
  primaryIpv6?: string;
  /** Whether NPS is installed. */
  npsInstalled: boolean;
  /** Operating system reported by NPS. */
  npsOs: string;
  /** Motherboard model, when known. */
  mbModel?: string;
  /** First CPU model. */
  cpu0Model: string;
  /** Second CPU model, when present. */
  cpu1Model?: string;
  /** Total RAM in MB. */
  totalRam: number;
  /** IPMI public IP. */
  ipmiPubIp: string;
  /** IPMI console username, when set. */
  ipmiCxUser?: string;
  /** IPMI console password, when set. */
  ipmiCxPass?: string;
  /** IPMI status code. */
  ipmiStatus: number;
  /** Whether the server is locked against changes. */
  locked: boolean;
  /** Reason the server is locked, when locked. */
  lockedMsg?: string;
  /** Timestamp of the last IPMI status change. */
  ipmiStatusTime: string;
  /** Order book id. Accepted from the platform as a number or a string and normalized to a string. */
  obId: string;
  /** Free-form info text. */
  info: string;
  /** Display title. */
  title: string;
  /** Whether IPMI status auto-refresh is enabled. */
  ipmiRefreshEnabled: boolean;
  /** Location display name. */
  location: string;
  /** IP subnet id. */
  ipSubnetId: number;
  /** IP subnet name. */
  ipSubnetName: string;
  /** Package billing status. */
  packageStatus: string;
  /** In-progress build detail, present only while a build is running. */
  building?: JsonObject;
}

/** Metadata for an active or completed image capture job. */
export interface ImageBuild {
  /** Job id. */
  id: number;
  /** Job status code. */
  status: number;
  /** Command the job runs. */
  command: string;
  /** Timestamp the job was inserted. */
  tsInsert: string;
  /** Source server row id. */
  mbId: number;
  /** Source server package id. */
  mbPkgId: number;
  /** Job parameters, as sent to the platform. */
  params: string;
  /** Raw build packet sent to the platform. */
  buildPacket: string;
  /** Raw platform response. */
  response: string;
  /** Creation timestamp. */
  created: string;
  /** Last update timestamp. */
  lastUpdated: string;
}

/** Cloud deployment location returned by vAPI2. */
export interface CloudLocation {
  /** Location id. */
  id: number;
  /** Location name. */
  name: string;
  /** Location code. */
  location: string;
  /** City name. */
  city: string;
  /** Country name. */
  country: string;
  /** IATA airport code. */
  iataCode: string;
  /** Flag icon code. */
  flag: string;
  /** Latitude, when known. */
  latitude?: string;
  /** Longitude, when known. */
  longitude?: string;
}

/** Cloud pool describing a set of hardware capabilities available for deployment. */
export interface CloudPool {
  /** Pool id. */
  id: number;
  /** Pool name. */
  name: string;
  /** Pool description. */
  description: string;
  /** CPU model the pool requires, when constrained. This is a model string such as "EPYC-Milan", not a vcpu count. */
  requiredVcpu?: string;
  /** Capabilities every server in the pool has. */
  hardCapabilities: string[];
  /** Capabilities available on a best-effort basis. */
  softCapabilities: string[];
  /** Whether the pool is private to the account. */
  isPrivate: boolean;
  /** Fallback pool id used when this pool is unavailable. */
  backupCloudPoolId?: number;
  /** Default hourly RAM price. */
  defaultRamPrice: string;
  /** Default hourly CPU price. */
  defaultCpuPrice: string;
  /** Default hourly disk price. */
  defaultDiskPrice: string;
  /** Last update timestamp. */
  lastUpdated: string;
  /** Creation timestamp. */
  created: string;
  /** Contract id the pool is scoped to, when scoped. */
  contractId?: number;
}

/** Boot kernel option available for cloud servers. */
export interface Kernel {
  /** Kernel id. */
  id: number;
  /** Kernel name. */
  name: string;
  /** Kernel description, when set. */
  description?: string;
}

/** Status of an asynchronous cloud server build. */
export interface ServerBuildStatus {
  /** Build id. */
  id: number;
  /** Build status. */
  status: string;
  /** Completion percentage. */
  percent: number;
  /** Raw platform response text. */
  response: string;
  /** Full payload, preserved because the platform sends fields beyond the ones modeled here. */
  raw: JsonObject;
}

/** IPv4 or IPv6 address attached to a cloud server. */
export interface ServerIPAddress {
  /** Address row id. */
  id: number;
  /** IP address. */
  ip: string;
  /** Reverse DNS hostname, when set. */
  reverse?: string;
  /** Netmask, when applicable. */
  netmask?: string;
  /** Gateway address, when applicable. */
  gateway?: string;
  /** Address type. */
  type?: string;
  /** Whether this is the server's primary address of its family. */
  primary?: number;
  /** Full payload, preserved because the platform sends fields beyond the ones modeled here. */
  raw: JsonObject;
}

/** Power and provisioning status of a cloud server. */
export interface ServerStatus {
  /** Server status. */
  status: string;
  /** Power state. */
  state: string;
  /** Full payload, preserved because the platform sends fields beyond the ones modeled here. */
  raw: JsonObject;
}

/** Usage contract governing a server package's resource limits and discounts. */
export interface ContractUsage {
  /** Contract row id. */
  id?: number;
  /** Server package id the contract covers. */
  contractMbPkgId?: number;
  /** Parent contract id, when this contract is nested under another. */
  parentContractId?: number;
  /** Brand the contract is scoped to. */
  brand?: string;
  /** Owning account id. */
  mbId?: number;
  /** Contract type. */
  contractType?: string;
  /** Whether the contract is free of charge. */
  isFree?: number;
  /** Whether bandwidth is included in the contract. */
  includeBandwidth?: number;
  /** Customer purchase order reference. */
  customerPo?: string;
  /** Customer-supplied description. */
  customerDescription?: string;
  /** Monthly purchase order spending limit. */
  poMonthlyLimit?: number;
  /** Monthly billing discount percentage. */
  monthlyDiscount?: number;
  /** Hourly billing discount percentage. */
  hourlyDiscount?: number;
  /** Maximum vCPUs allowed under the contract. */
  maxCpus?: number;
  /** Maximum RAM in MB allowed under the contract. */
  maxRam?: number;
  /** Maximum disk in GB allowed under the contract. */
  maxDisk?: number;
  /** Whether usage beyond the contract limits is allowed. */
  allowOverage?: number;
}

/** Deploy size (plan) available at a location. */
export interface Size {
  /** Plan id. */
  planId: number;
  /** Plan name. */
  plan: string;
  /** RAM size. */
  ram: string;
  /** Disk size. */
  disk: string;
  /** Transfer allowance. */
  transfer: string;
  /** Plan price. */
  price: string;
  /** CPU count. */
  cpu: number;
  /** Port speed. */
  port: string;
  /** Availability, as a fractional quantity. */
  available: number;
}

/** Response returned when deleting a cloud server. */
export interface DeleteServerResponse {
  /** Id of the deleted server. */
  id: number;
}

/** Custom image captured from a server. */
export interface Image {
  /** Image id. */
  id: number;
  /** Image name. */
  name: string;
  /** Image description, when set. */
  description?: string;
  /** Image type. */
  type: string;
  /** Image subtype. */
  subtype: string;
  /** Architecture bits, such as "64". */
  bits: string;
  /** Underlying virtualization technology. */
  tech: string;
  /** Image size. */
  size: string;
  /** Image category. */
  category: string;
  /** Whether the image is enabled for use, when known. */
  enabled?: boolean;
  /** Whether a bash build script can be used with this image. */
  scriptBash: number;
  /** Whether a cloud-init build script can be used with this image. */
  scriptCloudinit: number;
  /** Creation timestamp. */
  created: string;
  /** Last update timestamp. */
  updated: string;
  /** Detail of the build job that produced this image, when it is still tracked. */
  activeBuild?: ImageBuild;
}

/** Response returned when queuing an image capture job. */
export interface CreateImageResponse {
  /** Queue id used to poll job progress. */
  queueId: number;
}

/** Response returned when queuing an image deletion job. */
export interface DeleteImageResponse {
  /** Queue id used to poll job progress. */
  queueId: number;
}

/** Progress of a queued image job. */
export interface ImageQueueStatus {
  /** Job status, such as "Pending", "Running", "Complete" or "Failed". */
  status: string;
  /** Completion percentage. */
  percent: number;
  /** Raw platform response, populated on completion or failure. */
  response: string;
  /** Resulting image id. */
  imageId: number;
  /** Resulting image name. */
  imageName: string;
  /** Help text for the current status. */
  imageHelp: string;
  /** Location the source server runs in. */
  location: string;
  /** Source server package id. */
  mbPkgId: number;
  /** Source server FQDN. */
  fqdn: string;
  /** Source server operating system. */
  os: string;
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

/** Decodes a single tag-resource assignment row. */
export function decodeTagResource(input: unknown): TagResource {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    resourceTagId: optionalNumber(row.resource_tag_id) ?? 0,
    resourceName: stringField(row, "resource_name"),
    identifier: numberField(row, "identifier"),
    createdAt: optionalString(row.created_at)
  };
}

/** Decodes a tag, including its embedded resource assignments when present. */
export function decodeTag(input: unknown): Tag {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    icon: optionalString(row.icon),
    color: optionalString(row.color),
    isDefault: optionalFlag(row.is_default),
    isFavorite: optionalFlag(row.is_favorite),
    isLocked: optionalFlag(row.is_locked),
    showDashboard: optionalFlag(row.show_dashboard),
    createdAt: optionalString(row.created_at),
    mbId: optionalNumber(row.mb_id),
    resourcesCount: optionalNumber(row.resources_count),
    resources: Array.isArray(row.resources) ? row.resources.map(decodeTagResource) : undefined
  };
}

/** Decodes a tag log entry, preserving the full payload alongside the common fields. */
export function decodeTagLog(input: unknown): TagLog {
  const row = requireObject(input);
  return {
    id: optionalNumber(row.id),
    tagId: optionalNumber(row.tag_id),
    action: optionalString(row.action),
    message: optionalString(row.message),
    createdAt: optionalString(row.created_at),
    raw: row
  };
}

/**
 * Decodes an SSH key.
 *
 * A missing key comes back from vAPI2 as HTTP 200 with a null data payload rather than a
 * 404, so a null or undefined input decodes to a zero-valued key (id 0) instead of throwing.
 * Callers that fetch a single key by id use that zero id to recognize the key is gone.
 */
export function decodeSshKey(input: unknown): SshKey {
  if (input === null || input === undefined) {
    return { id: 0, name: "", key: "" };
  }
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    key: stringField(row, "ssh_key"),
    fingerprint: optionalString(row.fingerprint)
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

/** Decodes a VPC backend host. */
export function decodeVpcBackend(input: unknown): VpcBackend {
  const row = requireObject(input);
  return {
    backendHostId: optionalNumber(row.backendHostId),
    name: optionalString(row.name),
    address: optionalString(row.address),
    internalAddress: optionalString(row.internalAddress)
  };
}

/** Decodes a VPC backend template, including its backend hosts when present. */
export function decodeVpcBackendTemplate(input: unknown): VpcBackendTemplate {
  const row = requireObject(input);
  return {
    backendTemplateId: numberField(row, "backendTemplateId"),
    name: optionalString(row.name),
    description: optionalString(row.description),
    backendHosts: Array.isArray(row.backendHosts) ? row.backendHosts.map(decodeVpcBackend) : undefined
  };
}

/** Decodes a VPC bastion SSH key. A key is enabled when it carries a dates.enabled timestamp. */
export function decodeVpcSshKey(input: unknown): VpcSshKey {
  const row = requireObject(input);
  const dates = isObject(row.dates) ? row.dates : undefined;
  return {
    id: numberField(row, "id", "sshKeyId"),
    sshKeyId: optionalNumber(row.sshKeyId),
    name: optionalString(row.name),
    fingerprint: optionalString(row.fingerprint),
    publicKey: optionalString(row.publicKey),
    enabled: dates !== undefined && dates.enabled !== undefined && dates.enabled !== null,
    createdAt: dates === undefined ? undefined : optionalString(dates.created)
  };
}

/**
 * Decodes VPC bastion SSH settings.
 *
 * The port arrives as a bare number, a numeric string, or an object carrying the number under
 * a "port", "value" or "number" key. The keys collection arrives either as a map of key id to
 * key object, or wrapped in the {data:[...]} list envelope used elsewhere in this API. Both
 * shapes are handled so a caller does not need to know which one the platform returned.
 */
export function decodeVpcSshSettings(input: unknown): VpcSshSettings {
  const row = requireObject(input);
  return {
    port: row.port === undefined || row.port === null ? undefined : decodeVpcSshPort(row.port),
    enabled: optionalBoolean(row.enabled) ?? false,
    keys: decodeVpcSshKeys(row.keys),
    bastion: isObject(row.bastion) ? decodeVpcSshBastion(row.bastion) : undefined
  };
}

function decodeVpcSshPort(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    throw new Error(`VPC SSH port string is not numeric: ${value}`);
  }
  if (isObject(value)) {
    for (const key of ["port", "value", "number"]) {
      if (value[key] !== undefined) {
        return decodeVpcSshPort(value[key]);
      }
    }
  }
  throw new Error("VPC SSH port has an unrecognized shape");
}

function decodeVpcSshKeys(value: unknown): VpcSshKey[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (isObject(value) && Array.isArray(value.data)) {
    return value.data.map(decodeVpcSshKey);
  }
  if (isObject(value)) {
    return Object.values(value).map(decodeVpcSshKey);
  }
  throw new Error("VPC SSH keys has an unrecognized shape");
}

function decodeVpcSshBastion(input: unknown): VpcSshBastion {
  const row = requireObject(input);
  return { ipv4: optionalString(row.ipv4), ipv6: optionalString(row.ipv6) };
}

/** Decodes VPC IP reservations, keeping each group as opaque JSON. */
export function decodeVpcIpReservations(input: unknown): VpcIpReservations {
  const row = requireObject(input);
  return { gateways: row.gateways, interfaces: row.interfaces, vms: row.vms };
}

/** Decodes a VPC floating IP. */
export function decodeVpcFloatingIp(input: unknown): VpcFloatingIp {
  const row = requireObject(input);
  return {
    floatingIpId: numberField(row, "floatingIpId"),
    address: stringField(row, "address"),
    ipVersion: numberField(row, "ipVersion"),
    ptr: optionalString(row.ptr),
    isPrimary: optionalBoolean(row.isPrimary) ?? false
  };
}

/** Decodes a port range shared by VPC firewall, SNAT and DNAT rules. */
export function decodeVpcPortRange(input: unknown): VpcPortRange {
  const row = requireObject(input);
  return { start: optionalNumber(row.start), end: optionalNumber(row.end) };
}

/** Decodes a VPC gateway firewall rule. */
export function decodeVpcFirewallRule(input: unknown): VpcFirewallRule {
  const row = requireObject(input);
  return {
    firewallRuleId: numberField(row, "firewallRuleId"),
    ipVersion: numberField(row, "ipVersion"),
    direction: stringField(row, "direction"),
    protocol: optionalString(row.protocol),
    description: optionalString(row.description),
    network: optionalString(row.network),
    address: optionalString(row.address),
    prefixLength: optionalNumber(row.prefixLength),
    port: isObject(row.port) ? decodeVpcPortRange(row.port) : undefined
  };
}

function decodeVpcSnatMatch(input: unknown): VpcSnatMatch {
  const row = requireObject(input);
  return { internalCidr: optionalString(row.internalCidr) };
}

function decodeVpcSnatAddressRange(input: unknown): VpcSnatAddressRange {
  const row = requireObject(input);
  return { start: optionalString(row.start), end: optionalString(row.end) };
}

function decodeVpcSnatTranslation(input: unknown): VpcSnatTranslation {
  const row = requireObject(input);
  return {
    address: isObject(row.address) ? decodeVpcSnatAddressRange(row.address) : undefined,
    port: isObject(row.port) ? decodeVpcPortRange(row.port) : undefined
  };
}

/** Decodes a VPC gateway SNAT rule. */
export function decodeVpcSnatRule(input: unknown): VpcSnatRule {
  const row = requireObject(input);
  return {
    snatRuleId: numberField(row, "snatRuleId"),
    ipVersion: numberField(row, "ipVersion"),
    protocol: optionalString(row.protocol),
    description: optionalString(row.description),
    match: isObject(row.match) ? decodeVpcSnatMatch(row.match) : undefined,
    translation: isObject(row.translation) ? decodeVpcSnatTranslation(row.translation) : undefined
  };
}

function decodeVpcDnatMatch(input: unknown): VpcDnatMatch {
  const row = requireObject(input);
  return {
    address: optionalString(row.address),
    port: isObject(row.port) ? decodeVpcPortRange(row.port) : undefined
  };
}

function decodeVpcDnatTranslation(input: unknown): VpcDnatTranslation {
  const row = requireObject(input);
  return {
    address: stringField(row, "address"),
    port: isObject(row.port) ? decodeVpcPortRange(row.port) : undefined
  };
}

/** Decodes a VPC gateway DNAT rule. */
export function decodeVpcDnatRule(input: unknown): VpcDnatRule {
  const row = requireObject(input);
  return {
    dnatRuleId: numberField(row, "dnatRuleId"),
    ipVersion: numberField(row, "ipVersion"),
    protocol: optionalString(row.protocol),
    description: optionalString(row.description),
    match: isObject(row.match) ? decodeVpcDnatMatch(row.match) : undefined,
    translation: isObject(row.translation) ? decodeVpcDnatTranslation(row.translation) : undefined
  };
}

/** Decodes a hardware class backing a storage resource. */
export function decodeStorageHardwareClass(input: unknown): StorageHardwareClass {
  const row = requireObject(input);
  return { id: numberField(row, "id"), name: stringField(row, "name"), description: optionalString(row.description) };
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
      capacity: isObject(metadata.capacity) ? decodeStorageCapacity(metadata.capacity) : undefined,
      hardwareClass: isObject(metadata.hardwareClass) ? decodeStorageHardwareClass(metadata.hardwareClass) : undefined
    },
    raw
  };
}

/** Decodes a storage object store from either flat list row or metadata-nested single GET shape. */
export function decodeStorageObjectStore(input: unknown): StorageObjectStore {
  const raw = requireObject(input);
  const metadata = requireObject(isObject(raw.metadata) ? raw.metadata : raw);
  return {
    credentials: isObject(raw.credentials) ? raw.credentials : undefined,
    metadata: {
      objectStoreId: numberField(metadata, "objectStoreId", "id"),
      label: stringField(metadata, "label", "name"),
      ready: optionalBoolean(metadata.ready),
      assignedOn: optionalString(metadata.assignedOn),
      location: isObject(metadata.location) ? decodeLocation(metadata.location) : undefined,
      capacity: isObject(metadata.capacity) ? decodeStorageCapacity(metadata.capacity) : undefined,
      hardwareClass: isObject(metadata.hardwareClass) ? decodeStorageHardwareClass(metadata.hardwareClass) : undefined
    },
    raw
  };
}

/** Decodes a storage block namespace from either flat list row or metadata-nested single GET shape. */
export function decodeStorageBlockNamespace(input: unknown): StorageBlockNamespace {
  const raw = requireObject(input);
  const metadata = requireObject(isObject(raw.metadata) ? raw.metadata : raw);
  return {
    credentials: isObject(raw.credentials) ? raw.credentials : undefined,
    metadata: {
      blockNamespaceId: numberField(metadata, "blockNamespaceId", "id"),
      label: stringField(metadata, "label", "name"),
      ready: optionalBoolean(metadata.ready),
      assignedOn: optionalString(metadata.assignedOn),
      location: isObject(metadata.location) ? decodeLocation(metadata.location) : undefined,
      capacity: isObject(metadata.capacity) ? decodeStorageCapacity(metadata.capacity) : undefined,
      hardwareClass: isObject(metadata.hardwareClass) ? decodeStorageHardwareClass(metadata.hardwareClass) : undefined
    },
    raw
  };
}

/**
 * Decodes a storage block volume from either flat list row or metadata-nested single GET shape.
 *
 * The single-volume GET endpoint has a platform defect where the response carries
 * object-store shaped metadata with no block volume id field at all, so `blockVolumeId`
 * decodes to 0 in that case rather than throwing. {@link V3Client.getStorageBlockVolume}
 * fills in the id that was requested when this happens, since every other field still
 * matches the volume asked for.
 */
export function decodeStorageBlockVolume(input: unknown): StorageBlockVolume {
  const raw = requireObject(input);
  const metadata = requireObject(isObject(raw.metadata) ? raw.metadata : raw);
  return {
    credentials: isObject(raw.credentials) ? raw.credentials : undefined,
    metadata: {
      blockVolumeId: optionalNumber(metadata.blockVolumeId) ?? optionalNumber(metadata.id) ?? 0,
      label: stringField(metadata, "label", "name"),
      ready: optionalBoolean(metadata.ready),
      assignedOn: optionalString(metadata.assignedOn),
      location: isObject(metadata.location) ? decodeLocation(metadata.location) : undefined,
      capacity: isObject(metadata.capacity) ? decodeStorageCapacity(metadata.capacity) : undefined,
      hardwareClass: isObject(metadata.hardwareClass) ? decodeStorageHardwareClass(metadata.hardwareClass) : undefined
    },
    raw
  };
}

/** Decodes a storage location paired with the hardware class serving it. */
export function decodeStorageLocation(input: unknown): StorageLocation {
  const row = requireObject(input);
  return { location: decodeLocation(row.location), hardware: decodeStorageHardwareClass(row.hardware) };
}

/** Decodes a single storage type entry. Used both for array rows and for values keyed by type code. */
export function decodeStorageType(input: unknown): StorageType {
  const row = requireObject(input);
  return { type: optionalString(row.type), name: optionalString(row.name), description: optionalString(row.description), raw: row };
}

/**
 * Decodes the storage types available to the account.
 *
 * The endpoint answers with any of three shapes: a bare array, a vAPI3 list envelope, or an
 * object keyed by type code (with "s3", "block" and so on as keys and "meta"/"data" absent
 * or ignored). The keyed shape has no guaranteed order, so its keys are sorted for a
 * deterministic result, and a missing `type` field is filled in from the key.
 */
export function decodeStorageTypes(input: unknown): StorageType[] {
  if (Array.isArray(input)) {
    return input.map(decodeStorageType);
  }
  try {
    return parseV3ListPage(input).rows.map(decodeStorageType);
  } catch {
    // Not a recognized list envelope; fall through to the keyed-object shape.
  }
  const object = requireObject(input);
  const keys = Object.keys(object)
    .filter((key) => key !== "meta" && key !== "data")
    .sort();
  return keys.map((typeCode) => {
    const storageType = decodeStorageType(object[typeCode]);
    return storageType.type === undefined ? { ...storageType, type: typeCode } : storageType;
  });
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

/** Decodes NKE cluster access URLs. */
export function decodeNkeAccessUrls(input: unknown): NkeAccessUrls {
  const row = requireObject(input);
  return {
    api: optionalString(row.api),
    prometheus: optionalString(row.prometheus),
    kubernetesDashboard: optionalString(row.kubernetesDashboard)
  };
}

/** Decodes one NKE cluster log entry. */
export function decodeNkeLogEntry(input: unknown): NkeLogEntry {
  const row = requireObject(input);
  return {
    recordedOn: stringField(row, "recordedOn"),
    message: stringField(row, "message")
  };
}

/** Decodes an NKE worker node from either flat list row or nested status shape. */
export function decodeNkeWorkerNode(input: unknown): NkeWorkerNode {
  const row = requireObject(input);
  const status = isObject(row.status) ? row.status : undefined;
  return {
    workerNodeId: numberField(row, "workerNodeId"),
    clusterId: optionalNumber(row.clusterId),
    name: stringField(row, "name"),
    mbpkgid: optionalNumber(row.mbpkgid),
    locationId: optionalNumber(row.locationId),
    ready: status === undefined ? undefined : optionalBoolean(status.ready),
    package: isObject(row.package) ? decodePackage(row.package) : undefined,
    location: isObject(row.location) ? decodeLocation(row.location) : undefined,
    raw: row
  };
}

/** Decodes one entry from the NKE addon catalog. */
export function decodeNkeAddonCatalogEntry(input: unknown): NkeAddonCatalogEntry {
  const row = requireObject(input);
  return {
    addonId: numberField(row, "addonId"),
    addonType: stringField(row, "addonType"),
    version: optionalString(row.version),
    channel: optionalString(row.channel),
    displayName: optionalString(row.displayName),
    minKubernetesVersion: optionalString(row.minKubernetesVersion),
    maxKubernetesVersion: optionalString(row.maxKubernetesVersion),
    isDefault: optionalBoolean(row.isDefault),
    requiresVpc: optionalBoolean(row.requiresVpc)
  };
}

function decodeNkeDnsAddonZone(input: unknown): NkeDnsAddonZone {
  const row = requireObject(input);
  return {
    dnsZoneId: numberField(row, "dnsZoneId"),
    zone: stringField(row, "zone"),
    mode: optionalString(row.mode)
  };
}

function decodeNkeStorageAddonIntegration(input: unknown): NkeStorageAddonIntegration {
  const row = requireObject(input);
  return {
    storageIntegrationId: numberField(row, "storageIntegrationId"),
    blockNamespaceId: optionalNumber(row.blockNamespaceId),
    storageClassName: optionalString(row.storageClassName),
    volumeSnapshotClassName: optionalString(row.volumeSnapshotClassName),
    isDefaultClass: optionalBoolean(row.isDefaultClass),
    reclaimPolicy: optionalString(row.reclaimPolicy)
  };
}

function decodeNkeAddonConfig(input: unknown): NkeAddonConfig {
  const row = requireObject(input);
  return {
    zones: Array.isArray(row.zones) ? row.zones.map(decodeNkeDnsAddonZone) : undefined,
    integrations: Array.isArray(row.integrations) ? row.integrations.map(decodeNkeStorageAddonIntegration) : undefined
  };
}

/** Decodes an addon installed on an NKE cluster. */
export function decodeNkeAddon(input: unknown): NkeAddon {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    addonId: optionalNumber(row.addonId),
    clusterId: optionalNumber(row.clusterId),
    addonType: stringField(row, "addonType"),
    version: optionalString(row.version),
    channel: optionalString(row.channel),
    displayName: optionalString(row.displayName),
    state: optionalString(row.state),
    updateAvailable: optionalBoolean(row.updateAvailable),
    catalog: isObject(row.catalog) ? row.catalog : undefined,
    health: isObject(row.health) ? row.health : undefined,
    workloadHealth: isObject(row.workloadHealth) ? row.workloadHealth : undefined,
    config: isObject(row.config) ? decodeNkeAddonConfig(row.config) : undefined,
    timestamps: isObject(row.timestamps) ? row.timestamps : undefined,
    failureReason: optionalString(row.failureReason),
    installRetryOn: optionalString(row.installRetryOn),
    installFailureCt: optionalNumber(row.installFailureCt),
    raw: row
  };
}

/** Decodes a DNS zone attached to an NKE cluster through the netactuate-dns addon. */
export function decodeNkeClusterDnsZone(input: unknown): NkeClusterDnsZone {
  const row = requireObject(input);
  return {
    dnsZoneId: numberField(row, "dnsZoneId"),
    clusterId: optionalNumber(row.clusterId),
    zone: stringField(row, "zone"),
    mode: optionalString(row.mode),
    failureReason: optionalString(row.failureReason),
    state: optionalString(row.state),
    health: row.health,
    timestamps: row.timestamps
  };
}

/** OIDC client key returned by vAPI3. */
export interface OidcClientKey {
  /** Key id. */
  keyId: number;
  /** Key label. */
  label?: string;
  /** Key description. */
  description?: string;
  /** Timestamp the key was provided. */
  providedOn?: string;
  /** Timestamp the key was revoked, when it has been. */
  revokedOn?: string;
  /** Key type. */
  type?: string;
  /** Key material, on responses that include it. */
  value?: string;
  /** Public key text. */
  publicKey?: string;
}

/** Authentication log entry recorded against an OIDC client. */
export interface OidcClientAuthLog {
  /** Log entry id. */
  logId: number;
  /** Timestamp the token was issued. */
  issuedOn?: string;
  /** Timestamp the token expires. */
  expiresOn?: string;
  /** JWT id of the issued token. */
  jti?: string;
}

/** Change log entry recorded against an OIDC client's keys. */
export interface OidcClientChangeLog {
  /** Id of the key the change applies to. */
  keyId: number;
  /** Timestamp the change was recorded. */
  recordedOn?: string;
  /** Change type. */
  type?: string;
}

/** A virtual machine allowed to authenticate against an OIDC client. */
export interface OidcClientVm {
  /** Server package id. */
  mbpkgid: number;
  /** Original payload, for fields not yet modeled. */
  raw: unknown;
}

/** A bare metal server allowed to authenticate against an OIDC client. */
export interface OidcClientBareMetalServer {
  /** Server package id. */
  mbpkgid: number;
  /** Original payload, for fields not yet modeled. */
  raw: unknown;
}

/** OIDC client returned by vAPI3. */
export interface OidcClient {
  /** Client id. */
  clientId: number;
  /** Creation timestamp. */
  createdOn?: string;
  /** Timestamp the client last issued a token, when it has. */
  lastUsedOn?: string;
  /** Client label. */
  label: string;
  /** Client description. */
  description?: string;
  /** JWKS URI used to verify tokens presented to this client. */
  jwksUri?: string;
  /** Whether this is the account's default OIDC client. */
  accountDefault: boolean;
  /** Default audience claim issued for tokens from this client. */
  defaultAudience?: string;
  /** Token time-to-live in seconds. */
  ttl?: number;
  /** Whether token issuance is restricted to the VM and bare metal allow lists. */
  enforceAllowList: boolean;
  /** Owning account tenant id. */
  tenant?: string;
  /** Keys registered on the client, present once merged in by {@link decodeOidcClientDetail}. */
  keys?: OidcClientKey[];
  /** Authentication logs, present once merged in by {@link decodeOidcClientDetail}. */
  authLogs?: OidcClientAuthLog[];
  /** Change logs, present once merged in by {@link decodeOidcClientDetail}. */
  changeLogs?: OidcClientChangeLog[];
}

/** Fields carried by the single-OIDC-client detail endpoint, merged onto a list row to build a full {@link OidcClient}. */
export interface OidcClientDetail {
  /** Creation timestamp. */
  createdOn?: string;
  /** Timestamp the client last issued a token, when it has. */
  lastUsedOn?: string;
  /** Client label. */
  label?: string;
  /** Client description. */
  description?: string;
  /** JWKS URI used to verify tokens presented to this client. */
  jwksUri?: string;
  /** Keys registered on the client. */
  keys: OidcClientKey[];
  /** Authentication logs. */
  authLogs: OidcClientAuthLog[];
  /** Change logs. */
  changeLogs: OidcClientChangeLog[];
}

/** Decodes an OIDC client key. */
export function decodeOidcClientKey(input: unknown): OidcClientKey {
  const row = requireObject(input);
  return {
    keyId: numberField(row, "keyId"),
    label: optionalString(row.label),
    description: optionalString(row.description),
    providedOn: optionalString(row.providedOn),
    revokedOn: optionalString(row.revokedOn),
    type: optionalString(row.type),
    value: optionalString(row.value),
    publicKey: optionalString(row.publicKey)
  };
}

/** Decodes an OIDC client authentication log entry. */
export function decodeOidcClientAuthLog(input: unknown): OidcClientAuthLog {
  const row = requireObject(input);
  return {
    logId: numberField(row, "id"),
    issuedOn: optionalString(row.issuedOn),
    expiresOn: optionalString(row.expiresOn),
    jti: optionalString(row.jti)
  };
}

/** Decodes an OIDC client change log entry. */
export function decodeOidcClientChangeLog(input: unknown): OidcClientChangeLog {
  const row = requireObject(input);
  return {
    keyId: numberField(row, "keyId"),
    recordedOn: optionalString(row.recordedOn),
    type: optionalString(row.type)
  };
}

/** Decodes an OIDC allow-list entry, which arrives as either a bare package id or an object carrying one. */
function decodeOidcClientMember(input: unknown): { mbpkgid: number; raw: unknown } {
  if (isObject(input)) {
    return { mbpkgid: toIntFlexible(input.mbpkgid), raw: input };
  }
  if (typeof input === "number") {
    return { mbpkgid: input, raw: input };
  }
  throw new Error("OIDC client allow-list entry has an unrecognized shape");
}

/** Decodes a VM allowed to authenticate against an OIDC client. */
export function decodeOidcClientVm(input: unknown): OidcClientVm {
  return decodeOidcClientMember(input);
}

/** Decodes a bare metal server allowed to authenticate against an OIDC client. */
export function decodeOidcClientBareMetalServer(input: unknown): OidcClientBareMetalServer {
  return decodeOidcClientMember(input);
}

/**
 * Decodes an OIDC client list row.
 *
 * The list endpoint returns the JWKS URI under `jwksHttpsUrl` rather than the `jwksUri` used
 * by the create and single-client endpoints, so both keys are checked.
 */
export function decodeOidcClient(input: unknown): OidcClient {
  const row = requireObject(input);
  return {
    clientId: numberField(row, "clientId"),
    createdOn: optionalString(row.createdOn),
    lastUsedOn: optionalString(row.lastUsedOn),
    label: stringField(row, "label"),
    description: optionalString(row.description),
    jwksUri: optionalString(row.jwksUri) ?? optionalString(row.jwksHttpsUrl),
    accountDefault: toBoolFlexible(row.accountDefault),
    defaultAudience: optionalString(row.defaultAudience),
    ttl: optionalNumber(row.ttl),
    enforceAllowList: toBoolFlexible(row.enforceAllowList)
  };
}

/** Reads a sub-list carried as `{data: [...]}`, treating an absent or empty list as no rows rather than an error. */
function decodeOidcSubList<T>(value: unknown, decode: (row: unknown) => T): T[] {
  if (!isObject(value) || !Array.isArray(value.data) || value.data.length === 0) {
    return [];
  }
  return value.data.map(decode);
}

/** Decodes the single-OIDC-client detail response, including its embedded keys and logs. */
export function decodeOidcClientDetail(input: unknown): OidcClientDetail {
  const row = requireObject(input);
  const metadata = isObject(row.metadata) ? row.metadata : {};
  const logs = isObject(row.logs) ? row.logs : {};
  return {
    createdOn: optionalString(metadata.createdOn),
    lastUsedOn: optionalString(metadata.lastUsedOn),
    label: optionalString(metadata.label),
    description: optionalString(metadata.description),
    jwksUri: optionalString(metadata.jwksUri),
    keys: decodeOidcSubList(row.keys, decodeOidcClientKey),
    authLogs: decodeOidcSubList(logs.auth, decodeOidcClientAuthLog),
    changeLogs: decodeOidcSubList(logs.changes, decodeOidcClientChangeLog)
  };
}

/** A location where a customer VLAN is provisioned. */
export interface VlanProvisionedLocation {
  /** Whether the VLAN is provisioned at this location. */
  provisioned: boolean;
  /** Location display name. */
  name?: string;
  /** Location id. */
  locationId: number;
  /** Flag code. */
  flag?: string;
  /** IATA airport code. */
  iataCode?: string;
}

/** A customer VLAN returned by vAPI2. */
export interface Vlan {
  /** VLAN id. */
  id: number;
  /** Owning account id. */
  mbid: number;
  /** Whether the VLAN is private. */
  private: number;
  /** Whether SR-IOV is allowed on the VLAN. */
  allowSriov: number;
  /** Display name. */
  displayName?: string;
  /** Description. */
  description?: string;
  /** Last update timestamp. */
  lastUpdated?: string;
  /** Creation timestamp. */
  created?: string;
  /** Locations the VLAN is provisioned at. */
  provisionedLocations: VlanProvisionedLocation[];
}

/** Decodes a location where a customer VLAN is provisioned. */
export function decodeVlanProvisionedLocation(input: unknown): VlanProvisionedLocation {
  const row = requireObject(input);
  return {
    provisioned: toBoolFlexible(row.provisioned),
    name: optionalString(row.name),
    locationId: toIntFlexible(row.location_id),
    flag: optionalString(row.flag),
    iataCode: optionalString(row.iata_code)
  };
}

/** Decodes a customer VLAN. */
export function decodeVlan(input: unknown): Vlan {
  const row = requireObject(input);
  return {
    id: toIntFlexible(row.id),
    mbid: toIntFlexible(row.mbid),
    private: toIntFlexible(row.private),
    allowSriov: toIntFlexible(row.allow_sriov),
    displayName: optionalString(row.display_name),
    description: optionalString(row.description),
    lastUpdated: optionalString(row.last_updated),
    created: optionalString(row.created),
    provisionedLocations: Array.isArray(row.provisioned_locations) ? row.provisioned_locations.map(decodeVlanProvisionedLocation) : []
  };
}

/** A server network interface returned by vAPI2. */
export interface ServerNic {
  /** Network interface id. */
  nicId: number;
  /** Server package id the interface belongs to. */
  mbpkgid: number;
  /** Customer VLAN the interface is attached to. */
  customerVlanId: number;
  /** Attach order among the server's interfaces. */
  attachOrder: number;
}

/**
 * Decodes a server network interface.
 *
 * The interface id arrives under either `nic_id` or `id` depending on the endpoint. `nic_id`
 * is preferred and `id` is used only when `nic_id` is absent or zero.
 */
export function decodeServerNic(input: unknown): ServerNic {
  const row = requireObject(input);
  return {
    nicId: toIntFlexible(row.nic_id) || toIntFlexible(row.id),
    mbpkgid: toIntFlexible(row.mbpkgid),
    customerVlanId: toIntFlexible(row.customer_vlan_id),
    attachOrder: toIntFlexible(row.attach_order)
  };
}

/**
 * Decodes a server network interface from an attach or update response, which arrives as
 * either a bare object or a single-element array wrapping one.
 */
export function decodeServerNicFromResponse(input: unknown): ServerNic {
  if (input === undefined || input === null) {
    return { nicId: 0, mbpkgid: 0, customerVlanId: 0, attachOrder: 0 };
  }
  if (Array.isArray(input)) {
    return input.length === 1 ? decodeServerNic(input[0]) : { nicId: 0, mbpkgid: 0, customerVlanId: 0, attachOrder: 0 };
  }
  return decodeServerNic(input);
}

/** A firewall set bound to a BGP group interface. */
export interface BgpGroupFirewallSetBinding {
  /** Binding id. */
  id: number;
  /** BGP group id the binding belongs to. */
  bgpGroupId: number;
  /** Firewall set id bound to the interface. */
  firewallSetId: number;
  /** Interface number the firewall set is bound to. */
  interfaceNumber: number;
  /** Evaluation priority among the sets bound to this interface. */
  setPriority: number;
}

/** Decodes a BGP group firewall set binding. */
export function decodeBgpGroupFirewallSetBinding(input: unknown): BgpGroupFirewallSetBinding {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    bgpGroupId: numberField(row, "bgp2_group_id"),
    firewallSetId: numberField(row, "firewall_set_id"),
    interfaceNumber: numberField(row, "interface_number"),
    setPriority: numberField(row, "set_priority")
  };
}

/** An account BGP group returned by vAPI2. */
export interface BgpGroup {
  /** Group id. */
  id: number;
  /** Group name. */
  name: string;
  /** Group description. */
  description?: string;
  /** Group type. */
  groupType?: string;
}

/** Decodes an account BGP group. */
export function decodeBgpGroup(input: unknown): BgpGroup {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    groupType: optionalString(row.group_type)
  };
}

/** An account BGP prefix returned by vAPI2. */
export interface BgpPrefix {
  /** Prefix id. */
  id: number;
  /** Prefix name. */
  name: string;
  /** The prefix in CIDR notation. */
  prefix: string;
  /** BGP group id the prefix is announced from. */
  groupId?: number;
  /** ASN id the prefix is announced under. */
  asnId?: number;
  /** Anycast profile id. */
  anycastProfile?: number;
  /** Legal agreement id accepted for the purchase. */
  agreementId?: number;
}

/** Decodes an account BGP prefix. */
export function decodeBgpPrefix(input: unknown): BgpPrefix {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    prefix: stringField(row, "prefix"),
    groupId: optionalNumber(row.group_id),
    asnId: optionalNumber(row.asn_id),
    anycastProfile: optionalNumber(row.anycast_profile),
    agreementId: optionalNumber(row.agreement_id)
  };
}

/** An account ASN returned by vAPI2. */
export interface BgpAsn {
  /** ASN record id. */
  id: number;
  /** The autonomous system number. */
  asn: number;
  /** ASN name. */
  name?: string;
  /** Group type. */
  groupType?: string;
}

/** Decodes an account ASN. */
export function decodeBgpAsn(input: unknown): BgpAsn {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    asn: numberField(row, "asn"),
    name: optionalString(row.name),
    groupType: optionalString(row.group_type)
  };
}

/** A legal agreement available to the account. */
export interface AccountAgreement {
  /** Agreement id. */
  id: number;
  /** Agreement name. */
  name: string;
  /** Agreement title. */
  title?: string;
  /** Agreement description. */
  description?: string;
  /** Agreement version. */
  version?: string;
}

/** Decodes a legal agreement. */
export function decodeAccountAgreement(input: unknown): AccountAgreement {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    title: optionalString(row.title),
    description: optionalString(row.description),
    version: optionalString(row.version)
  };
}

/** BGP account summary payload. The platform shapes this per account rather than to a fixed schema. */
export type BgpSummary = JsonObject;

/** BGP dashboard payload. The platform shapes this per account rather than to a fixed schema. */
export type BgpDashboard = JsonObject;

/** Location a floating IPv4 address is assigned in. */
export interface FloatingIpLocation {
  /** Location id. */
  id: number;
  /** Location display name. */
  name: string;
  /** Flag code. */
  flag?: string;
  /** Latitude. */
  latitude?: string;
  /** Longitude. */
  longitude?: string;
}

/** A floating IPv4 address returned by vAPI3. */
export interface CloudFloatingIpv4 {
  /** Floating IPv4 address id. */
  floatingIpv4Id: number;
  /** Timestamp the address was assigned. */
  assignedOn?: string;
  /** The floating IPv4 address. */
  address: string;
  /** VLAN the address is bound to. */
  vlanId: number;
  /** Reverse DNS pointer record. */
  ptrDomain?: string;
  /** Location the address is assigned in. */
  location?: FloatingIpLocation;
}

/** A VM allowed to access a floating IPv4 address. */
export interface CloudFloatingIpv4Vm {
  /** Server package id. */
  mbpkgid: number;
  /** Server FQDN. */
  fqdn?: string;
  /** VM's address on the VLAN, when assigned. */
  ip?: string;
}

/** A cloud location mapped to the datacenter serving it. */
export interface CloudNetworkingLocation {
  /** Location id. */
  locationId: number;
  /** Datacenter id. */
  datacenterId: number;
}

/** Decodes a floating IPv4 address's assigned location. */
export function decodeFloatingIpLocation(input: unknown): FloatingIpLocation {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    flag: optionalString(row.flag),
    latitude: optionalString(row.latitude),
    longitude: optionalString(row.longitude)
  };
}

/** Decodes a floating IPv4 address. */
export function decodeCloudFloatingIpv4(input: unknown): CloudFloatingIpv4 {
  const row = requireObject(input);
  return {
    floatingIpv4Id: numberField(row, "floatingIpv4Id"),
    assignedOn: optionalString(row.AssignedOn) ?? optionalString(row.assignedOn),
    address: stringField(row, "address"),
    vlanId: numberField(row, "vlanId"),
    ptrDomain: optionalString(row.ptrDomain),
    location: isObject(row.location) ? decodeFloatingIpLocation(row.location) : undefined
  };
}

/** Decodes a VM allowed to access a floating IPv4 address. */
export function decodeCloudFloatingIpv4Vm(input: unknown): CloudFloatingIpv4Vm {
  const row = requireObject(input);
  return {
    mbpkgid: numberField(row, "mbpkgid"),
    fqdn: optionalString(row.fqdn),
    ip: optionalString(row.ip)
  };
}

/** Decodes a cloud networking location to datacenter mapping. */
export function decodeCloudNetworkingLocation(input: unknown): CloudNetworkingLocation {
  const row = requireObject(input);
  return { locationId: numberField(row, "locationId"), datacenterId: numberField(row, "datacenterId") };
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

/** A magic mesh returned by vAPI3. */
export interface MagicMesh {
  /** Mesh id. */
  meshId: number;
  /** Mesh name. */
  name: string;
  /** Mesh description. */
  description?: string;
}

/** Decodes a magic mesh. */
export function decodeMagicMesh(input: unknown): MagicMesh {
  const row = requireObject(input);
  return {
    meshId: numberField(row, "meshId"),
    name: stringField(row, "name"),
    description: optionalString(row.description)
  };
}

/** A router attached to a magic mesh. */
export interface MeshRouter {
  /** Router id. */
  routerId: number;
  /** Router name. */
  name: string;
  /** Router description. */
  description?: string;
  /** Router's IPv4 address on the mesh. */
  ipv4Address?: string;
}

/** Decodes a mesh router. */
export function decodeMeshRouter(input: unknown): MeshRouter {
  const row = requireObject(input);
  return {
    routerId: numberField(row, "routerId"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    ipv4Address: optionalString(row.ipv4Address)
  };
}

/** One completed or pending step in a cloud router's build timeline. */
export interface RouterBuildEvent {
  /** Human readable step description. */
  text: string;
  /** Timestamp the step completed. Absent while the step is still pending. */
  date?: string;
}

/** A cloud router. */
export interface Router {
  /** Router name. */
  name: string;
  /** Router description. */
  description?: string;
  /** Timestamp the router finished building and became ready. */
  readyOn?: string;
  /** Whether the router has a default VRF. */
  hasDefaultVrf: boolean;
  /** Whether the router can join a magic mesh. */
  canJoinMagicMesh: boolean;
  /** Magic mesh id the router is attached to, when it is attached to one. */
  meshId?: number;
  /** Build timeline steps, in order. */
  build?: RouterBuildEvent[];
}

/** A cloud router's provisioning location. */
export interface RouterLocation {
  /** Location id. */
  id: number;
  /** Location display name. */
  name: string;
  /** Optional flag code. */
  flag?: string;
}

/** Metadata describing a cloud router's configuration state. */
export interface RouterConfigMetadata {
  /** Configuration status. */
  status: string;
  /** Router name. */
  name: string;
  /** Timestamp the configuration was last updated. */
  updatedOn?: string;
  /** Configuration version. */
  version: number;
  /** Router's IPv4 address. The platform encodes this as either a string or a big endian integer; both are normalized to dotted quad form. */
  ipv4Address?: string;
  /** Router's location. */
  location?: RouterLocation;
  /** Whether the router has a default VRF. */
  hasDefaultVrf: boolean;
  /** Magic mesh id the router is attached to, when it is attached to one. */
  meshId?: number;
  /** Whether the router can join a magic mesh. */
  canJoinMagicMesh: boolean;
}

/** IPSec configuration attached to a VRF, as embedded in the VRF's full configuration. */
export interface RouterVrfIpSecConfig {
  /** IPSec peers configured on the VRF. Use {@link V3Client.listRouterVrfIpSecPeers} for the typed, id-bearing view of these. */
  peers: unknown[];
}

/** Static routing configuration attached to a VRF. */
export interface RouterVrfRoutesConfig {
  /** Statically configured routes. Use {@link V3Client.listRouterStaticRoutes} for the typed, id-bearing view of these. */
  static: unknown[];
}

/** Services running on a VRF. */
export interface RouterVrfServices {
  /** DHCP service configuration. Use {@link V3Client.getRouterVrfDhcp} for the typed view of this. */
  dhcp: unknown;
}

/** A network a VRF originates into BGP. */
export interface RouterVrfBgpNetwork {
  /** Subnet in CIDR notation. */
  subnet: string;
}

/** Address a BGP neighbor session is sourced from. */
export interface RouterVrfBgpNeighborSource {
  /** Source address. */
  address?: string;
}

/** IP versions enabled for a BGP neighbor session. */
export interface RouterVrfBgpNeighborEnabledIpVersion {
  /** Whether IPv4 is enabled. */
  ipv4: boolean;
  /** Whether IPv6 is enabled. */
  ipv6: boolean;
}

/** ASN settings for a BGP neighbor. */
export interface RouterVrfBgpNeighborAsn {
  /** Remote ASN. */
  remote: number;
}

/** One rule in a BGP neighbor's import or export route map. */
export interface RouterVrfBgpRouteMapRule {
  /** Prefix list id the rule matches against. */
  prefixListId: number;
  /** Action taken on a match: "permit", "deny", or "next". */
  action: string;
  /** Local preference to set on matched routes. */
  setLocalPreference?: number;
  /** Number of times to prepend the router's own ASN on matched routes. */
  prependLastAsn?: number;
}

/** A BGP neighbor's import or export route map. */
export interface RouterVrfBgpRouteMap {
  /** Whether routes not matched by any rule are dropped by default. */
  doDefaultDrop: boolean;
  /** Rules evaluated in order. */
  rules?: RouterVrfBgpRouteMapRule[];
}

/** A BGP neighbor configured on a VRF. */
export interface RouterVrfBgpNeighbor {
  /** Neighbor id, once the platform has assigned one. */
  neighborId?: number;
  /** Neighbor's peering address. */
  address: string;
  /** Whether the neighbor session is administratively shut down. */
  isShutdown: boolean;
  /** Whether to override the AS path when peering with a neighbor in the router's own ASN. */
  doAsOverride: boolean;
  /** Whether to advertise this router as the next hop. This is the platform's exact field name. */
  doNextHelpSelf: boolean;
  /** Address the session is sourced from, when not the router's default. */
  source?: RouterVrfBgpNeighborSource;
  /** IP versions enabled for this neighbor. */
  enabledIpVersion: RouterVrfBgpNeighborEnabledIpVersion;
  /** Maximum hop count allowed for an eBGP multihop session. */
  ebgpMultihop?: number;
  /** Neighbor ASN settings. */
  asn: RouterVrfBgpNeighborAsn;
  /** MD5 authentication secret. */
  md5Secret?: string;
  /** Inbound route map applied to routes learned from this neighbor. */
  import?: RouterVrfBgpRouteMap;
  /** Outbound route map applied to routes advertised to this neighbor. */
  export?: RouterVrfBgpRouteMap;
  /** Neighbor name. */
  name?: string;
  /** Neighbor description. */
  description?: string;
}

/** A VRF's BGP configuration. */
export interface RouterVrfBgpConfig {
  /** Local ASN, when configured. */
  localAsn?: string;
  /** BGP router id. */
  routerId: string;
  /** Networks originated into BGP. */
  networks: RouterVrfBgpNetwork[];
  /** Configured neighbors. */
  neighbors: RouterVrfBgpNeighbor[];
}

/** Result of updating a VRF's BGP configuration. */
export interface UpdateRouterVrfBgpResult {
  /** Local ASN, when configured. */
  localAsn?: string;
  /** Router id the configuration applies to. */
  routerId: number;
  /** Networks originated into BGP. */
  networks: RouterVrfBgpNetwork[];
  /** Configured neighbors. */
  neighbors: RouterVrfBgpNeighbor[];
}

/** A VRF's full configuration. */
export interface RouterVrfConfig {
  /** VRF id. */
  vrfId: number;
  /** VRF name. */
  name: string;
  /** VRF description. */
  description: string;
  /** Destination NAT rules. Use {@link V3Client.listRouterVrfDnatRules} for the typed, id-bearing view of these. */
  dnatRules: unknown[];
  /** Source NAT rules. Use {@link V3Client.listRouterVrfSnatRules} for the typed, id-bearing view of these. */
  snatRules: unknown[];
  /** Services running on the VRF. */
  services: RouterVrfServices;
  /** Tunnels attached to the VRF. Use {@link V3Client.listRouterVrfTunnels} for the typed, id-bearing view of these. */
  tunnels: unknown[];
  /** BGP configuration. */
  bgp: RouterVrfBgpConfig;
  /** Static routing configuration. */
  routes: RouterVrfRoutesConfig;
  /** Interfaces attached to the VRF. Use {@link V3Client.listRouterVrfInterfaces} for the typed, id-bearing view of these. */
  interfaces: unknown[];
  /** IPSec configuration. */
  ipSec: RouterVrfIpSecConfig;
}

/** A cloud router's full configuration, including every VRF. */
export interface RouterConfig {
  /** Id of the router's default VRF. */
  defaultVrfId: number;
  /** Router-wide services. */
  service: { ntp: RouterNtpConfig };
  /** Router-wide prefix lists. Kept opaque; use {@link V3Client.listRouterPrefixLists} for the typed, id-bearing view of these. */
  prefixLists: unknown[];
  /** VRFs on the router, keyed by VRF id. */
  vrf: Record<string, RouterVrfConfig>;
  /** Router-wide IPSec configuration. Use {@link V3Client.getRouterIpSecConfig} for the typed view of this. */
  ipSec: unknown;
  /** Configuration metadata. */
  metadata: RouterConfigMetadata;
}

/** A rule in a router prefix list. */
export interface RouterPrefixListRule {
  /** Action taken on a match: "permit" or "deny". */
  action: string;
  /** Prefix in CIDR notation. */
  prefix: string;
}

/** A prefix list attached to a cloud router. */
export interface RouterPrefixList {
  /** Prefix list id. */
  prefixListId: number;
  /** Prefix list name. */
  name: string;
  /** IP version the prefix list matches, 4 or 6. */
  ipVersion: number;
  /** Prefix list description. */
  description?: string;
  /** Rules evaluated in order. */
  rules: RouterPrefixListRule[];
}

/** Where a static route sends matching traffic. */
export interface RouterStaticRouteVia {
  /** Next hop address. */
  nextHop?: string;
  /** Interface id to send matching traffic out of. */
  interfaceId?: number;
  /** Tunnel id to send matching traffic through. */
  tunnelId?: number;
  /** IPSec peer id to send matching traffic through. */
  ipSecPeerId?: number;
}

/** A static route configured on a router VRF. */
export interface RouterStaticRoute {
  /** Static route id. */
  staticRouteId: number;
  /** Destination network in CIDR notation. */
  network: string;
  /** Next hop for the route. */
  via: RouterStaticRouteVia;
  /** Route description. */
  description?: string;
  /** Administrative distance. */
  distance?: number;
}

/** An upstream NTP server. */
export interface RouterNtpUpstream {
  /** Upstream domain or address. */
  domain: string;
}

/** A cloud router's NTP configuration. */
export interface RouterNtpConfig {
  /** Whether NTP is enabled. */
  enabled: boolean;
  /** Interface id NTP listens on. */
  interfaceId?: number;
  /** Configured upstream servers. */
  upstreams: RouterNtpUpstream[];
}

/** Decodes a router build timeline step. */
function decodeRouterBuildEvent(input: unknown): RouterBuildEvent {
  const row = requireObject(input);
  return { text: stringField(row, "text"), date: optionalString(row.date) };
}

/** Decodes a cloud router. */
export function decodeRouter(input: unknown): Router {
  const row = requireObject(input);
  return {
    name: stringField(row, "name"),
    description: optionalString(row.description),
    readyOn: optionalString(row.readyOn),
    hasDefaultVrf: optionalBoolean(row.hasDefaultVrf) ?? false,
    canJoinMagicMesh: optionalBoolean(row.canJoinMagicMesh) ?? false,
    meshId: optionalNumber(row.meshId),
    build: Array.isArray(row.build) ? row.build.map(decodeRouterBuildEvent) : undefined
  };
}

/** Decodes a router location. */
function decodeRouterLocation(input: unknown): RouterLocation {
  const row = requireObject(input);
  return { id: numberField(row, "id"), name: stringField(row, "name"), flag: optionalString(row.flag) };
}

/**
 * Decodes a router's IPv4 address, which the platform sends as either a dotted quad string or a
 * big endian 32 bit integer.
 */
function decodeRouterFlexibleIpv4(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const bits = value >>> 0;
    return [24, 16, 8, 0].map((shift) => (bits >>> shift) & 0xff).join(".");
  }
  return undefined;
}

/** Decodes router configuration metadata. */
function decodeRouterConfigMetadata(input: unknown): RouterConfigMetadata {
  const row = requireObject(input);
  return {
    status: stringField(row, "status"),
    name: stringField(row, "name"),
    updatedOn: optionalString(row.updatedOn),
    version: numberField(row, "version"),
    ipv4Address: decodeRouterFlexibleIpv4(row.ipv4Address),
    location: isObject(row.location) ? decodeRouterLocation(row.location) : undefined,
    hasDefaultVrf: optionalBoolean(row.hasDefaultVrf) ?? false,
    meshId: optionalNumber(row.meshId),
    canJoinMagicMesh: optionalBoolean(row.canJoinMagicMesh) ?? false
  };
}

/** Decodes a VRF BGP network. */
function decodeRouterVrfBgpNetwork(input: unknown): RouterVrfBgpNetwork {
  const row = requireObject(input);
  return { subnet: stringField(row, "subnet") };
}

/** Decodes a BGP neighbor's source address. */
function decodeRouterVrfBgpNeighborSource(input: unknown): RouterVrfBgpNeighborSource {
  const row = requireObject(input);
  return { address: optionalString(row.address) };
}

/** Decodes a BGP neighbor's enabled IP versions. */
function decodeRouterVrfBgpNeighborEnabledIpVersion(input: unknown): RouterVrfBgpNeighborEnabledIpVersion {
  const row = requireObject(input);
  return { ipv4: optionalBoolean(row.ipv4) ?? false, ipv6: optionalBoolean(row.ipv6) ?? false };
}

/** Decodes a BGP neighbor's ASN settings. */
function decodeRouterVrfBgpNeighborAsn(input: unknown): RouterVrfBgpNeighborAsn {
  const row = requireObject(input);
  return { remote: numberField(row, "remote") };
}

/** Decodes one route map rule. */
function decodeRouterVrfBgpRouteMapRule(input: unknown): RouterVrfBgpRouteMapRule {
  const row = requireObject(input);
  return {
    prefixListId: numberField(row, "prefixListId"),
    action: stringField(row, "action"),
    setLocalPreference: optionalNumber(row.setLocalPreference),
    prependLastAsn: optionalNumber(row.prependLastAsn)
  };
}

/** Decodes a BGP neighbor route map. */
function decodeRouterVrfBgpRouteMap(input: unknown): RouterVrfBgpRouteMap {
  const row = requireObject(input);
  return {
    doDefaultDrop: optionalBoolean(row.doDefaultDrop) ?? false,
    rules: Array.isArray(row.rules) ? row.rules.map(decodeRouterVrfBgpRouteMapRule) : undefined
  };
}

/** Decodes a VRF BGP neighbor. */
export function decodeRouterVrfBgpNeighbor(input: unknown): RouterVrfBgpNeighbor {
  const row = requireObject(input);
  return {
    neighborId: optionalNumber(row.neighborId),
    address: stringField(row, "address"),
    isShutdown: optionalBoolean(row.isShutdown) ?? false,
    doAsOverride: optionalBoolean(row.doAsOverride) ?? false,
    doNextHelpSelf: optionalBoolean(row.doNextHelpSelf) ?? false,
    source: isObject(row.source) ? decodeRouterVrfBgpNeighborSource(row.source) : undefined,
    enabledIpVersion: isObject(row.enabledIpVersion)
      ? decodeRouterVrfBgpNeighborEnabledIpVersion(row.enabledIpVersion)
      : { ipv4: false, ipv6: false },
    ebgpMultihop: optionalNumber(row.ebgpMultihop),
    asn: isObject(row.asn) ? decodeRouterVrfBgpNeighborAsn(row.asn) : { remote: 0 },
    md5Secret: optionalString(row.md5Secret),
    import: isObject(row.import) ? decodeRouterVrfBgpRouteMap(row.import) : undefined,
    export: isObject(row.export) ? decodeRouterVrfBgpRouteMap(row.export) : undefined,
    name: optionalString(row.name),
    description: optionalString(row.description)
  };
}

/** Decodes a VRF's BGP configuration. */
export function decodeRouterVrfBgpConfig(input: unknown): RouterVrfBgpConfig {
  const row = requireObject(input);
  return {
    localAsn: optionalString(row.localAsn),
    routerId: stringField(row, "routerId"),
    networks: arrayOf(row.networks).map(decodeRouterVrfBgpNetwork),
    neighbors: arrayOf(row.neighbors).map(decodeRouterVrfBgpNeighbor)
  };
}

/** Decodes the result of updating a VRF's BGP configuration. */
export function decodeUpdateRouterVrfBgpResult(input: unknown): UpdateRouterVrfBgpResult {
  const row = requireObject(input);
  return {
    localAsn: optionalString(row.localAsn),
    routerId: numberField(row, "routerId"),
    networks: arrayOf(row.networks).map(decodeRouterVrfBgpNetwork),
    neighbors: arrayOf(row.neighbors).map(decodeRouterVrfBgpNeighbor)
  };
}

/** Decodes a VRF's full configuration. */
export function decodeRouterVrfConfig(input: unknown): RouterVrfConfig {
  const row = requireObject(input);
  const services = isObject(row.services) ? row.services : {};
  const routes = isObject(row.routes) ? row.routes : {};
  const ipSec = isObject(row.ipSec) ? row.ipSec : {};
  return {
    vrfId: numberField(row, "vrfId"),
    name: stringField(row, "name"),
    description: optionalString(row.description) ?? "",
    dnatRules: arrayOf(row.dnatRules),
    snatRules: arrayOf(row.snatRules),
    services: { dhcp: services.dhcp },
    tunnels: arrayOf(row.tunnels),
    bgp: isObject(row.bgp) ? decodeRouterVrfBgpConfig(row.bgp) : { routerId: "", networks: [], neighbors: [] },
    routes: { static: arrayOf(routes.static) },
    interfaces: arrayOf(row.interfaces),
    ipSec: { peers: arrayOf(ipSec.peers) }
  };
}

/** Decodes a router's VRF map, keyed by VRF id. */
export function decodeRouterVrfMap(input: unknown): Record<string, RouterVrfConfig> {
  const row = requireObject(input);
  const result: Record<string, RouterVrfConfig> = {};
  for (const [key, value] of Object.entries(row)) {
    result[key] = decodeRouterVrfConfig(value);
  }
  return result;
}

/** Decodes an NTP upstream server entry. */
function decodeRouterNtpUpstream(input: unknown): RouterNtpUpstream {
  const row = requireObject(input);
  return { domain: stringField(row, "domain") };
}

/** Decodes a cloud router's NTP configuration. */
export function decodeRouterNtpConfig(input: unknown): RouterNtpConfig {
  const row = requireObject(input);
  return {
    enabled: optionalBoolean(row.enabled) ?? false,
    interfaceId: optionalNumber(row.interfaceId),
    upstreams: arrayOf(row.upstreams).map(decodeRouterNtpUpstream)
  };
}

/** Decodes a cloud router's full configuration. */
export function decodeRouterConfig(input: unknown): RouterConfig {
  const row = requireObject(input);
  const service = isObject(row.service) ? row.service : {};
  return {
    defaultVrfId: numberField(row, "defaultVrfId"),
    service: { ntp: isObject(service.ntp) ? decodeRouterNtpConfig(service.ntp) : { enabled: false, upstreams: [] } },
    prefixLists: arrayOf(row.prefixLists),
    vrf: isObject(row.vrf) ? decodeRouterVrfMap(row.vrf) : {},
    ipSec: row.ipSec,
    metadata: decodeRouterConfigMetadata(row.metadata)
  };
}

/** Decodes a router prefix list rule. */
function decodeRouterPrefixListRule(input: unknown): RouterPrefixListRule {
  const row = requireObject(input);
  return { action: stringField(row, "action"), prefix: stringField(row, "prefix") };
}

/** Decodes a router prefix list. */
export function decodeRouterPrefixList(input: unknown): RouterPrefixList {
  const row = requireObject(input);
  return {
    prefixListId: numberField(row, "prefixListId"),
    name: stringField(row, "name"),
    ipVersion: numberField(row, "ipVersion"),
    description: optionalString(row.description),
    rules: arrayOf(row.rules).map(decodeRouterPrefixListRule)
  };
}

/** Decodes a router static route's next hop. */
function decodeRouterStaticRouteVia(input: unknown): RouterStaticRouteVia {
  const row = requireObject(input);
  return {
    nextHop: optionalString(row.nextHop),
    interfaceId: optionalNumber(row.interfaceId),
    tunnelId: optionalNumber(row.tunnelId),
    ipSecPeerId: optionalNumber(row.ipSecPeerId)
  };
}

/** Decodes a router static route. */
export function decodeRouterStaticRoute(input: unknown): RouterStaticRoute {
  const row = requireObject(input);
  return {
    staticRouteId: numberField(row, "staticRouteId"),
    network: stringField(row, "network"),
    via: isObject(row.via) ? decodeRouterStaticRouteVia(row.via) : {},
    description: optionalString(row.description),
    distance: optionalNumber(row.distance)
  };
}

/** IKE phase 1 settings in a router's IPSec configuration. */
export interface RouterIpSecIkeGroup {
  /** Whether the router automatically renegotiates the IKE session before it expires. */
  doAutoRenegotiation: boolean;
  /** IKE protocol version. */
  keyExchangeVersion: number;
  /** IKE security association lifetime, in seconds. */
  lifetimeSeconds: number;
  /** Diffie-Hellman group number. */
  dhGroupNumber: number;
  /** Encryption algorithm. */
  encryption: string;
  /** Hash algorithm. */
  hash: string;
  /** Pseudo-random function. */
  prf: string;
}

/** ESP phase 2 settings in a router's IPSec configuration. */
export interface RouterIpSecEspGroup {
  /** ESP security association lifetime, in seconds. */
  lifetimeSeconds: number;
  /** Encryption algorithm. */
  encryption: string;
  /** Hash algorithm. */
  hash: string;
}

/** A cloud router's IPSec crypto configuration, shared by every VRF's IPSec peers. */
export interface RouterIpSecConfig {
  /** IKE phase 1 settings. */
  ikeGroup: RouterIpSecIkeGroup;
  /** ESP phase 2 settings. */
  espGroup: RouterIpSecEspGroup;
}

/** The overlay addresses assigned to a router VRF IPSec peer. */
export interface RouterVrfIpSecOverlayNetwork {
  /** Overlay IPv4 address or CIDR. */
  ipv4?: string;
  /** Overlay IPv6 address or CIDR. */
  ipv6?: string;
}

/** An IPSec peer configured on a router VRF. */
export interface RouterVrfIpSecPeer {
  /** IPSec peer id. */
  ipSecPeerId: number;
  /** Peer name. */
  name: string;
  /** Peer description. */
  description?: string;
  /** Remote IKE identifier. */
  remoteId: string;
  /** Pre-shared key. */
  pskSecret: string;
  /** Whether this router initiates the connection rather than waiting for the peer. */
  doInitiateConnection: boolean;
  /** Remote peer address. */
  peerAddress: string;
  /** Local IKE identifier. */
  localId: string;
  /** Overlay network addresses carried over the tunnel. */
  overlayNetwork: RouterVrfIpSecOverlayNetwork;
}

/** Decodes a router's IKE phase 1 settings. */
function decodeRouterIpSecIkeGroup(input: unknown): RouterIpSecIkeGroup {
  const row = requireObject(input);
  return {
    doAutoRenegotiation: optionalBoolean(row.doAutoRenegotiation) ?? false,
    keyExchangeVersion: numberField(row, "keyExchangeVersion"),
    lifetimeSeconds: numberField(row, "lifetimeSeconds"),
    dhGroupNumber: numberField(row, "dhGroupNumber"),
    encryption: stringField(row, "encryption"),
    hash: stringField(row, "hash"),
    prf: stringField(row, "prf")
  };
}

/** Decodes a router's ESP phase 2 settings. */
function decodeRouterIpSecEspGroup(input: unknown): RouterIpSecEspGroup {
  const row = requireObject(input);
  return { lifetimeSeconds: numberField(row, "lifetimeSeconds"), encryption: stringField(row, "encryption"), hash: stringField(row, "hash") };
}

/** Decodes a cloud router's IPSec crypto configuration. */
export function decodeRouterIpSecConfig(input: unknown): RouterIpSecConfig {
  const row = requireObject(input);
  return {
    ikeGroup: decodeRouterIpSecIkeGroup(requireObject(row.ikeGroup)),
    espGroup: decodeRouterIpSecEspGroup(requireObject(row.espGroup))
  };
}

/** Decodes a router VRF IPSec peer's overlay network addresses. */
function decodeRouterVrfIpSecOverlayNetwork(input: unknown): RouterVrfIpSecOverlayNetwork {
  const row = requireObject(input);
  return { ipv4: optionalString(row.ipv4), ipv6: optionalString(row.ipv6) };
}

/** Decodes an IPSec peer configured on a router VRF. */
export function decodeRouterVrfIpSecPeer(input: unknown): RouterVrfIpSecPeer {
  const row = requireObject(input);
  return {
    ipSecPeerId: numberField(row, "ipSecPeerId"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    remoteId: stringField(row, "remoteId"),
    pskSecret: stringField(row, "pskSecret"),
    doInitiateConnection: optionalBoolean(row.doInitiateConnection) ?? false,
    peerAddress: stringField(row, "peerAddress"),
    localId: stringField(row, "localId"),
    overlayNetwork: isObject(row.overlayNetwork) ? decodeRouterVrfIpSecOverlayNetwork(row.overlayNetwork) : {}
  };
}

/** An allowed network for a router VRF interface's wireguard peer. */
export interface WireguardPeerAllowedIp {
  /** Allowed network in CIDR notation. */
  network: string;
}

/** A wireguard peer attached to a router VRF interface. */
export interface RouterVrfInterfaceWireguardPeer {
  /** Wireguard peer id. */
  wireguardPeerId: number;
  /** Networks routed through the peer. */
  allowedIps: WireguardPeerAllowedIp[];
  /** Peer's public key. */
  publicKey: string;
  /** Locally generated private key for this peer. */
  privateKey: string;
  /** Pre-shared key, when configured. */
  preSharedKey?: string;
  /** Remote endpoint address. */
  remote?: string;
  /** Peer name. */
  name?: string;
  /** Peer description. */
  description?: string;
}

/** An interface configured on a router VRF. */
export interface RouterVrfInterface {
  /** Interface id. */
  interfaceId: number;
  /** Id of the VRF the interface belongs to. */
  vrfId: number;
  /** Interface type, for example "ethernet" or "wireguard". */
  type: string;
  /** Interface name. */
  name: string;
  /** Interface description. */
  description?: string;
  /** IPv4 CIDR assigned to the interface. */
  ipv4Cidr?: string;
  /** IPv6 CIDR assigned to the interface. */
  ipv6Cidr?: string;
  /** Underlying hardware id, for an ethernet interface. */
  ethernetHardwareId?: string;
  /** Listening port, for a wireguard interface. */
  wireguardPort?: number;
  /** Wireguard public key, for a wireguard interface. */
  publicKey?: string;
  /** Static routes attached to the interface. Kept opaque; the platform's shape is not yet modeled. */
  staticRoutes: unknown[];
  /** Wireguard peers attached to the interface, when the platform includes them inline. */
  peers?: RouterVrfInterfaceWireguardPeer[];
}

/** Decodes a router VRF interface's allowed IP entry. */
function decodeWireguardPeerAllowedIp(input: unknown): WireguardPeerAllowedIp {
  const row = requireObject(input);
  return { network: stringField(row, "network") };
}

/** Decodes a wireguard peer attached to a router VRF interface. */
export function decodeRouterVrfInterfaceWireguardPeer(input: unknown): RouterVrfInterfaceWireguardPeer {
  const row = requireObject(input);
  return {
    wireguardPeerId: numberField(row, "wireguardPeerId"),
    allowedIps: arrayOf(row.allowedIps).map(decodeWireguardPeerAllowedIp),
    publicKey: stringField(row, "publicKey"),
    privateKey: stringField(row, "privateKey"),
    preSharedKey: optionalString(row.preSharedKey),
    remote: optionalString(row.remote),
    name: optionalString(row.name),
    description: optionalString(row.description)
  };
}

/** Decodes an interface configured on a router VRF. */
export function decodeRouterVrfInterface(input: unknown): RouterVrfInterface {
  const row = requireObject(input);
  return {
    interfaceId: numberField(row, "interfaceId"),
    vrfId: numberField(row, "vrfId"),
    type: stringField(row, "type"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    ipv4Cidr: optionalString(row.ipv4Cidr),
    ipv6Cidr: optionalString(row.ipv6Cidr),
    ethernetHardwareId: optionalString(row.ethernetHardwareId),
    wireguardPort: optionalNumber(row.wireguardPort),
    publicKey: optionalString(row.publicKey),
    staticRoutes: arrayOf(row.staticRoutes),
    peers: Array.isArray(row.peers) ? row.peers.map(decodeRouterVrfInterfaceWireguardPeer) : undefined
  };
}

/** Decodes a router VRF's interfaces, keyed by interface id. */
export function decodeRouterVrfInterfaceMap(input: unknown): Record<string, RouterVrfInterface> {
  const row = requireObject(input);
  const result: Record<string, RouterVrfInterface> = {};
  for (const [key, value] of Object.entries(row)) {
    result[key] = decodeRouterVrfInterface(value);
  }
  return result;
}

/** Traffic matched by a router VRF NAT rule. */
export interface RouterVrfNatMatch {
  /** Interface id the rule matches inbound traffic on. */
  interfaceId: number;
  /** Network matched, in CIDR notation. */
  network: string;
  /** Port range matched. */
  port?: VpcPortRange;
}

/** The translation applied by a router VRF NAT rule. */
export interface RouterVrfNatTranslation {
  /** Network traffic is translated to, in CIDR notation. */
  network: string;
  /** Port range traffic is translated to. */
  port?: VpcPortRange;
}

/** Where to place a router VRF SNAT rule relative to existing rules. */
export interface RouterVrfSnatRulePriority {
  /** Placement location, for example "first", "last" or "after". */
  location?: string;
  /** SNAT rule id to place this rule after, when location is "after". */
  afterSnatRuleId?: number;
}

/** A SNAT rule configured on a router VRF. */
export interface RouterVrfSnatRule {
  /** SNAT rule id. */
  snatRuleId: number;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol matched by the rule. */
  protocol: string;
  /** Rule name. */
  name: string;
  /** Rule description. */
  description: string;
  /** Traffic matched by the rule. */
  match?: RouterVrfNatMatch;
  /** Translation applied to matched traffic. */
  translation?: RouterVrfNatTranslation;
  /** Placement relative to other SNAT rules on the VRF. */
  priority?: RouterVrfSnatRulePriority;
}

/** Where to place a router VRF DNAT rule relative to existing rules. */
export interface RouterVrfDnatRulePriority {
  /** Placement location, for example "first", "last" or "after". */
  location?: string;
  /** DNAT rule id to place this rule after, when location is "after". */
  afterDnatRuleId?: number;
}

/** A DNAT rule configured on a router VRF. */
export interface RouterVrfDnatRule {
  /** DNAT rule id. */
  dnatRuleId: number;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol matched by the rule. */
  protocol: string;
  /** Rule name. */
  name: string;
  /** Rule description. */
  description: string;
  /** Traffic matched by the rule. */
  match?: RouterVrfNatMatch;
  /** Translation applied to matched traffic. */
  translation?: RouterVrfNatTranslation;
  /** Placement relative to other DNAT rules on the VRF. */
  priority?: RouterVrfDnatRulePriority;
}

/** Decodes traffic matched by a router VRF NAT rule. */
function decodeRouterVrfNatMatch(input: unknown): RouterVrfNatMatch {
  const row = requireObject(input);
  return {
    interfaceId: numberField(row, "interfaceId"),
    network: stringField(row, "network"),
    port: isObject(row.port) ? decodeVpcPortRange(row.port) : undefined
  };
}

/** Decodes the translation applied by a router VRF NAT rule. */
function decodeRouterVrfNatTranslation(input: unknown): RouterVrfNatTranslation {
  const row = requireObject(input);
  return { network: stringField(row, "network"), port: isObject(row.port) ? decodeVpcPortRange(row.port) : undefined };
}

/** Decodes a router VRF SNAT rule's placement. */
function decodeRouterVrfSnatRulePriority(input: unknown): RouterVrfSnatRulePriority {
  const row = requireObject(input);
  return { location: optionalString(row.location), afterSnatRuleId: optionalNumber(row.afterSnatRuleId) };
}

/** Decodes a SNAT rule configured on a router VRF. */
export function decodeRouterVrfSnatRule(input: unknown): RouterVrfSnatRule {
  const row = requireObject(input);
  return {
    snatRuleId: numberField(row, "snatRuleId"),
    ipVersion: numberField(row, "ipVersion"),
    protocol: stringField(row, "protocol"),
    name: stringField(row, "name"),
    description: optionalString(row.description) ?? "",
    match: isObject(row.match) ? decodeRouterVrfNatMatch(row.match) : undefined,
    translation: isObject(row.translation) ? decodeRouterVrfNatTranslation(row.translation) : undefined,
    priority: isObject(row.priority) ? decodeRouterVrfSnatRulePriority(row.priority) : undefined
  };
}

/** Decodes a router VRF DNAT rule's placement. */
function decodeRouterVrfDnatRulePriority(input: unknown): RouterVrfDnatRulePriority {
  const row = requireObject(input);
  return { location: optionalString(row.location), afterDnatRuleId: optionalNumber(row.afterDnatRuleId) };
}

/** Decodes a DNAT rule configured on a router VRF. */
export function decodeRouterVrfDnatRule(input: unknown): RouterVrfDnatRule {
  const row = requireObject(input);
  return {
    dnatRuleId: numberField(row, "dnatRuleId"),
    ipVersion: numberField(row, "ipVersion"),
    protocol: stringField(row, "protocol"),
    name: stringField(row, "name"),
    description: optionalString(row.description) ?? "",
    match: isObject(row.match) ? decodeRouterVrfNatMatch(row.match) : undefined,
    translation: isObject(row.translation) ? decodeRouterVrfNatTranslation(row.translation) : undefined,
    priority: isObject(row.priority) ? decodeRouterVrfDnatRulePriority(row.priority) : undefined
  };
}

/** One endpoint pair of a router VRF tunnel. */
export interface RouterVrfTunnelEndpoint {
  /** Local source address. */
  source: string;
  /** Remote address. */
  remote: string;
}

/** A GRE tunnel configured on a router VRF. */
export interface RouterVrfTunnel {
  /** Tunnel id. */
  tunnelId: number;
  /** Tunnel name. */
  name: string;
  /** Tunnel description. */
  description?: string;
  /** GRE key. */
  ipKey: number;
  /** Maximum transmission unit. The platform returns this as a string though it accepts a number on create and update. */
  mtu: string;
  /** IPv4 CIDR assigned to the tunnel. */
  ipv4Cidr?: string;
  /** IPv6 CIDR assigned to the tunnel. */
  ipv6Cidr?: string;
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Tunnel endpoints. */
  endpointAddress: RouterVrfTunnelEndpoint;
}

/** Decodes a router VRF tunnel's endpoint pair. */
function decodeRouterVrfTunnelEndpoint(input: unknown): RouterVrfTunnelEndpoint {
  const row = requireObject(input);
  return { source: stringField(row, "source"), remote: stringField(row, "remote") };
}

/** Decodes a GRE tunnel configured on a router VRF. */
export function decodeRouterVrfTunnel(input: unknown): RouterVrfTunnel {
  const row = requireObject(input);
  return {
    tunnelId: numberField(row, "tunnelId"),
    name: stringField(row, "name"),
    description: optionalString(row.description),
    ipKey: numberField(row, "ipKey"),
    mtu: stringField(row, "mtu"),
    ipv4Cidr: optionalString(row.ipv4Cidr),
    ipv6Cidr: optionalString(row.ipv6Cidr),
    ipVersion: numberField(row, "ipVersion"),
    endpointAddress: isObject(row.endpointAddress) ? decodeRouterVrfTunnelEndpoint(row.endpointAddress) : { source: "", remote: "" }
  };
}

/** A DHCP address range leased to clients. */
export interface RouterDhcpRange {
  /** First address in the range. */
  firstAddress: string;
  /** Last address in the range. */
  lastAddress: string;
}

/** A server address handed out by DHCP, such as a DNS or NTP server. */
export interface RouterDhcpServer {
  /** Server address. */
  address: string;
}

/** A static route handed out by DHCP. */
export interface RouterDhcpStaticRoute {
  /** Destination network in CIDR notation. */
  network: string;
  /** Next hop address. */
  nextHop: string;
}

/** A router VRF's DHCP service configuration. */
export interface RouterVrfDhcpConfig {
  /** Whether the DHCP service is enabled. */
  enabled: boolean;
  /** Interface the DHCP service listens on. */
  interfaceId: number;
  /** Subnet served, in CIDR notation. */
  subnet: string;
  /** Default gateway handed out to clients. */
  defaultRouterAddress: string;
  /** Domain name handed out to clients. */
  clientDomainName: string;
  /** Lease timeout, in seconds. */
  leaseTimeout: number;
  /** Whether the server pings an address before leasing it. */
  doPingCheck: boolean;
  /** Address range leased to clients. */
  range?: RouterDhcpRange;
  /** DNS servers handed out to clients. */
  domainNameServers: RouterDhcpServer[];
  /** NTP servers handed out to clients. */
  ntpServers: RouterDhcpServer[];
  /** Static routes handed out to clients. */
  staticRoutes: RouterDhcpStaticRoute[];
}

/** Decodes a router VRF DHCP address range. */
function decodeRouterDhcpRange(input: unknown): RouterDhcpRange {
  const row = requireObject(input);
  return { firstAddress: stringField(row, "firstAddress"), lastAddress: stringField(row, "lastAddress") };
}

/** Decodes a router VRF DHCP server address entry. */
function decodeRouterDhcpServer(input: unknown): RouterDhcpServer {
  const row = requireObject(input);
  return { address: stringField(row, "address") };
}

/** Decodes a router VRF DHCP static route. */
function decodeRouterDhcpStaticRoute(input: unknown): RouterDhcpStaticRoute {
  const row = requireObject(input);
  return { network: stringField(row, "network"), nextHop: stringField(row, "nextHop") };
}

/** Decodes a router VRF's DHCP service configuration. */
export function decodeRouterVrfDhcpConfig(input: unknown): RouterVrfDhcpConfig {
  const row = requireObject(input);
  return {
    enabled: optionalBoolean(row.enabled) ?? false,
    interfaceId: numberField(row, "interfaceId"),
    subnet: stringField(row, "subnet"),
    defaultRouterAddress: optionalString(row.defaultRouterAddress) ?? "",
    clientDomainName: optionalString(row.clientDomainName) ?? "",
    leaseTimeout: numberField(row, "leaseTimeout"),
    doPingCheck: optionalBoolean(row.doPingCheck) ?? false,
    range: isObject(row.range) ? decodeRouterDhcpRange(row.range) : undefined,
    domainNameServers: arrayOf(row.domainNameServers).map(decodeRouterDhcpServer),
    ntpServers: arrayOf(row.ntpServers).map(decodeRouterDhcpServer),
    staticRoutes: arrayOf(row.staticRoutes).map(decodeRouterDhcpStaticRoute)
  };
}

/** A top level account service record returned by vAPI2. */
export interface Service {
  /** Service id. */
  id: number;
  /** Service description. */
  description?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** A colocation service record. */
export interface ColocationService {
  /** Colocation service id. */
  id: number;
  /** Owning service id. */
  serviceId: number;
  /** Datacenter id. */
  datacenterId: number;
  /** Rack identifier. */
  rackIdentifier?: string;
  /** Power details. */
  powerDetails?: string;
  /** Service description. */
  description?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** An IP transit service record. */
export interface IpTransitService {
  /** IP transit service id. */
  id: number;
  /** Owning service id. */
  serviceId: number;
  /** Datacenter id. */
  datacenterId: number;
  /** BGP group id. */
  bgpGroupId?: number;
  /** Service description. */
  description?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** An IP address assigned to an IP transit service. */
export interface IpTransitIpAddress {
  /** Address id. */
  id: number;
  /** Owning IP transit service id. */
  serviceIptransitId: number;
  /** The IP address. */
  ip?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** A port assigned to an IP transit service. */
export interface IpTransitPort {
  /** Port id. */
  id: number;
  /** Owning IP transit service id. */
  serviceIptransitId: number;
  /** Port name. */
  name?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** A transport service record. */
export interface TransportService {
  /** Transport service id. */
  id: number;
  /** Owning service id. */
  serviceId: number;
  /** Datacenter id. */
  datacenterId: number;
  /** Service description. */
  description?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** A port assigned to a transport service. */
export interface TransportPort {
  /** Port id. */
  id: number;
  /** Owning transport service id. */
  serviceTransportId: number;
  /** Port name. */
  name?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** A platform datacenter. */
export interface Datacenter {
  /** Datacenter id. */
  id: number;
  /** Datacenter name. */
  name: string;
  /** IATA airport code for the datacenter's location. */
  iata: string;
}

/** Status of a queued NQueue job. */
export interface JobStatus {
  /** Job id. */
  id: number;
  /** Timestamp the job was inserted. */
  tsInsert: string;
  /** Command the job runs. */
  command: string;
  /** Job status code. */
  status: number;
}

/** Status of one platform component at one location. */
export interface PlatformStatusLocation {
  /** Location name. */
  location: string;
  /** Container id serving this component at this location. */
  containerId: string;
  /** Status string. */
  status: string;
  /** Timestamp the status was last updated. */
  lastUpdated: string;
}

/** Status of one platform service, across every location it runs in. */
export interface PlatformStatusService {
  /** Service name. */
  service: string;
  /** Component id. */
  componentId: string;
  /** Status per location, sorted by location name. */
  locations: PlatformStatusLocation[];
}

/** One entry in the platform change log. */
export interface PlatformChangeLogEntry {
  /** Change log entry id. */
  changeLogId?: string;
  /** Entry title. */
  title?: string;
  /** Short description. */
  shortDescription?: string;
  /** Entry status. */
  status?: string;
  /** Complete payload, for fields not yet modeled. */
  raw: JsonObject;
}

/** Options used to initialize a looking glass call. */
export interface PlatformLookingGlassInit {
  /** Complete payload, not yet modeled. */
  raw: JsonObject;
}

/** Output returned by a looking glass action. */
export interface PlatformLookingGlassResult {
  /** Complete payload, not yet modeled. */
  raw: JsonObject;
}

/** Detail for one platform maintenance event. */
export interface PlatformMaintenanceInfo {
  /** Complete payload, not yet modeled. */
  raw: JsonObject;
}

/** One platform incident or maintenance event. */
export interface PlatformEvent {
  /** Event id. */
  eventId?: string;
  /** Event type. */
  type?: string;
  /** Event name. */
  name?: string;
  /** Event status. */
  status?: string;
  /** Start timestamp. */
  startTime?: string;
  /** End timestamp. */
  endTime?: string;
  /** Platform components affected. */
  components: string[];
  /** Containers affected. */
  containers: string[];
}

/** Platform incidents or maintenance events, grouped by timing. */
export interface PlatformEvents {
  /** Events currently in progress. */
  active: PlatformEvent[];
  /** Events scheduled for the future. */
  upcoming: PlatformEvent[];
  /** Events that have already concluded. */
  historic: PlatformEvent[];
}

/** Optional filters for support ticket list endpoints. */
export interface TicketListOptions {
  /** Excludes closed tickets when set to "1" or "true". */
  open?: string;
  /** Includes ticket statistics in the response meta when set to "1" or "true". */
  includeStats?: string;
}

/** Support ticket. */
export interface Ticket {
  /** Ticket id. */
  id: string;
  /** Ticket subject. */
  subject?: string;
  /** Ticket status. */
  status?: string;
  /** Department name. */
  department?: string;
  /** Ticket urgency: "Low", "Medium" or "High". */
  urgency?: string;
  /** Creation timestamp. */
  createdAt?: string;
  /** Last update timestamp. */
  updatedAt?: string;
  /** Complete ticket payload, including fields not modeled above. */
  raw: JsonObject;
}

/** Reply to a support ticket. */
export interface TicketReply {
  /** Reply id. */
  id?: string;
  /** Reply message. */
  message?: string;
  /** Creation timestamp. */
  createdAt?: string;
  /** Complete reply payload, including fields not modeled above. */
  raw: JsonObject;
}

/** Support ticket department available when creating a ticket. */
export interface TicketDepartment {
  /** Department id. */
  id?: number;
  /** Department name. */
  name?: string;
  /** Complete department payload, including fields not modeled above. */
  raw: JsonObject;
}

/** Metadata, and optionally base64 content, for a support ticket or reply attachment. */
export interface TicketAttachment {
  /** File name. */
  name?: string;
  /** MIME content type. */
  contentType?: string;
  /** File size in bytes. */
  size?: number;
  /** Base64 attachment data, omitted when the caller requests the response without it. */
  data?: string;
  /** Complete attachment payload, including fields not modeled above. */
  raw: JsonObject;
}

/** Named list used to group secret key/value pairs. */
export interface SecretList {
  /** Secret list id. */
  id: number;
  /** Secret list name. */
  name: string;
}

/** A key/value entry stored in a secret list. */
export interface SecretListValue {
  /** Secret list value id. */
  id: number;
  /** Id of the owning secret list. */
  secretListId: number;
  /** Secret key. */
  secretKey: string;
  /** Secret value. */
  secretValue: string;
}

/** Certificate validity and lifecycle timestamps for an SSL certificate. */
export interface SslCertificateDates {
  /** Creation timestamp. */
  created?: string;
  /** Last update timestamp. */
  updated?: string;
  /** Certificate validity start. */
  notBefore?: string;
  /** Certificate expiration timestamp. */
  expiration?: string;
}

/** SSL certificate stored on the account. */
export interface SslCertificate {
  /** Certificate id. */
  sslCertificateId: number;
  /** Certificate name. */
  name: string;
  /** Certificate description. */
  description: string;
  /** Certificate fingerprint. */
  fingerprint: string;
  /** Domains the certificate covers. */
  domains: string[];
  /** Whether the certificate is active. */
  isActive: boolean;
  /** Certificate status. */
  status: string;
  /** Validity and lifecycle timestamps, when reported. */
  dates?: SslCertificateDates;
}

/** Result of creating an SSL certificate. */
export interface CreateSslCertificateResponse {
  /** Id assigned to the new certificate. */
  sslCertificateId: number;
}

/** Address matched by a network load balancer group. */
export interface NlbGroupMatch {
  /** Matched address. */
  address: string;
}

/** Health check configuration for a network load balancer group. */
export interface NlbGroupHealthCheck {
  /** Whether the health check is enabled. */
  enabled: boolean;
  /** Health check method. */
  method: string;
  /** Interval between checks, in seconds. */
  interval: number;
  /** Retries before marking a backend unhealthy. */
  retries: number;
  /** Delay before the first check, in seconds. */
  delay: number;
  /** Per-check timeout, in seconds. */
  timeout: number;
}

/** Port pair matched and forwarded by a network load balancer group rule. */
export interface NlbGroupRulePorts {
  /** Port matched on the group's address. */
  match: number;
  /** Internal port forwarded to backends. */
  internal: number;
}

/** Traffic rule configured on a network load balancer group. */
export interface NlbGroupRule {
  /** Rule protocol. */
  protocol: string;
  /** Network rule id, once created. */
  networkRuleId?: number;
  /** Matched and forwarded ports. */
  ports: NlbGroupRulePorts;
}

/** Backend attached to a network load balancer group. */
export interface NlbGroupBackend {
  /** Backend name. */
  name: string;
  /** Backend internal address. */
  internalAddress: string;
  /** Whether the backend is currently online. */
  isOnline?: boolean;
  /** Network backend id, once created. */
  networkBackendId?: number;
}

/** Network load balancer group. */
export interface NlbGroup {
  /** Group id. */
  networkGroupId: number;
  /** Group name. */
  name: string;
  /** Group description. */
  description: string;
  /** IP version the group balances. */
  ipVersion: number;
  /** Load balancing algorithm. */
  algorithm: string;
  /** Whether the group is online. */
  isOnline: boolean;
  /** Matched address. */
  match: NlbGroupMatch;
  /** Health check configuration. */
  healthCheck: NlbGroupHealthCheck;
  /** Traffic rules. */
  rules: NlbGroupRule[];
  /** Attached backends. */
  backends: NlbGroupBackend[];
}

/** One sample point returned by a statistics query. */
export interface StatisticSample {
  /** Sampled resource count. */
  count: number;
  /** Number of resources contributing to the sample. */
  resources: number;
  /** Sample average. */
  avg: number;
  /** Sample sum. */
  sum: number;
}

/** Result of a statistics query for one metric. */
export interface StatisticResult {
  /** Metric name, read from the response's metric map. */
  metric: string;
  /** Service the metric belongs to. */
  service: string;
  /** Sample points for the metric. */
  data: StatisticSample[];
}

/** Rollup summary values for a metric. */
export interface MetricSummary {
  /** Sum across the window. */
  sum: number;
  /** Average across the window. */
  avg: number;
  /** Minimum across the window. */
  min: number;
  /** Maximum across the window. */
  max: number;
}

/** Time window a set of metric names was reported for. */
export interface MetricTimeWindow {
  /** Window start timestamp. */
  start: string;
  /** Window end timestamp. */
  end: string;
  /** Window length, in seconds. */
  seconds: number;
}

/** One metric available for statistics queries, with its current rollups. */
export interface MetricName {
  /** Metric name. */
  metric: string;
  /** Service the metric belongs to. */
  service: string;
  /** Number of resources reporting the metric. */
  resources: number;
  /** Average rollup. */
  avg: MetricSummary;
  /** Latest rollup. */
  last: MetricSummary;
  /** Sum rollup. */
  sum: MetricSummary;
}

/** Every metric name available for statistics queries. */
export interface MetricNames {
  /** Time window the metric names were reported for. */
  timeWindow: MetricTimeWindow;
  /** Available metrics. */
  metrics: MetricName[];
}

/** Decodes a top level account service record. */
export function decodeService(input: unknown): Service {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    description: optionalString(row.description),
    raw: row
  };
}

/** Decodes a colocation service record. */
export function decodeColocationService(input: unknown): ColocationService {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    serviceId: numberField(row, "service_id"),
    datacenterId: numberField(row, "datacenter_id"),
    rackIdentifier: optionalString(row.rack_identifier),
    powerDetails: optionalString(row.power_details),
    description: optionalString(row.description),
    raw: row
  };
}

/** Decodes an IP transit service record. */
export function decodeIpTransitService(input: unknown): IpTransitService {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    serviceId: numberField(row, "service_id"),
    datacenterId: numberField(row, "datacenter_id"),
    bgpGroupId: optionalNumber(row.bgp_group_id),
    description: optionalString(row.description),
    raw: row
  };
}

/** Decodes an IP address assigned to an IP transit service. */
export function decodeIpTransitIpAddress(input: unknown): IpTransitIpAddress {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    serviceIptransitId: numberField(row, "service_iptransit_id"),
    ip: optionalString(row.ip),
    raw: row
  };
}

/** Decodes a port assigned to an IP transit service. */
export function decodeIpTransitPort(input: unknown): IpTransitPort {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    serviceIptransitId: numberField(row, "service_iptransit_id"),
    name: optionalString(row.name),
    raw: row
  };
}

/** Decodes a transport service record. */
export function decodeTransportService(input: unknown): TransportService {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    serviceId: numberField(row, "service_id"),
    datacenterId: numberField(row, "datacenter_id"),
    description: optionalString(row.description),
    raw: row
  };
}

/** Decodes a port assigned to a transport service. */
export function decodeTransportPort(input: unknown): TransportPort {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    serviceTransportId: numberField(row, "service_transport_id"),
    name: optionalString(row.name),
    raw: row
  };
}

/** Decodes a platform datacenter. */
export function decodeDatacenter(input: unknown): Datacenter {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    iata: stringField(row, "iata")
  };
}

/** Decodes the status of a queued NQueue job. */
export function decodeJobStatus(input: unknown): JobStatus {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    tsInsert: stringField(row, "ts_insert"),
    command: stringField(row, "command"),
    status: numberField(row, "status")
  };
}

/** Decodes a dedicated server location. */
export function decodeDedicatedLocation(input: unknown): DedicatedLocation {
  const row = requireObject(input);
  return {
    shortName: stringField(row, "short_name"),
    pubDescription: optionalString(row.pub_description),
    locationId: numberField(row, "location_id")
  };
}

/** Decodes an OS profile compatible with a dedicated device. */
export function decodeDedicatedOsProfile(input: unknown): DedicatedOsProfile {
  const row = requireObject(input);
  return {
    osId: numberField(row, "id"),
    name: stringField(row, "name"),
    groupName: stringField(row, "group_name"),
    tags: stringArray(row.tags),
    diskLayouts: parseDedicatedIdNames(row.disklayouts),
    scripts: parseDedicatedIdNames(row.scripts),
    defaultDiskLayout: optionalNumber(row.default_disklayout) ?? 0,
    defaultScripts: Array.isArray(row.default_scripts) ? row.default_scripts.filter((entry): entry is number => typeof entry === "number") : [],
    allowSshKeys: optionalFlag(row.allow_ssh_keys),
    setRootPassword: optionalFlag(row.set_root_password),
    rescueImage: optionalFlag(row.rescue_image),
    public: optionalFlag(row.public),
    enabled: optionalFlag(row.enabled),
    created: stringField(row, "created"),
    lastUpdated: stringField(row, "last_updated"),
    profileId: numberField(row, "profile_id"),
    arch: stringField(row, "arch"),
    flavor: stringField(row, "flavor"),
    locationId: optionalNumber(row.location_id)
  };
}

/** Decodes a rescue OS profile. Shares its wire shape with a dedicated OS profile. */
export function decodeDedicatedRescueOsProfile(input: unknown): DedicatedRescueOsProfile {
  return decodeDedicatedOsProfile(input);
}

/** Decodes a disk layout offered for a dedicated OS profile. */
export function decodeDedicatedDiskLayout(input: unknown): DedicatedDiskLayout {
  const row = requireObject(input);
  return {
    layoutId: numberField(row, "id"),
    name: stringField(row, "name"),
    profile: stringField(row, "profile"),
    minDisks: numberField(row, "min_disks")
  };
}

/** Decodes a boot profile available for booting a cloud server. */
export function decodeBootProfile(input: unknown): BootProfile {
  const row = requireObject(input);
  return {
    bootProfileId: numberField(row, "id"),
    name: stringField(row, "name"),
    type: stringField(row, "type"),
    description: stringField(row, "description"),
    builder: stringField(row, "builder"),
    kernel: stringField(row, "kernel"),
    boot: stringField(row, "boot"),
    serial: stringField(row, "serial"),
    diskRepresent: stringField(row, "disk_represent"),
    imageTemplate: numberField(row, "image_template"),
    lastUpdated: stringField(row, "last_updated"),
    extra: optionalString(row.extra),
    vncDisplay: optionalString(row.vncdisplay),
    diskRoot: optionalString(row.disk_root),
    bootloader: optionalString(row.bootloader),
    ramdisk: optionalString(row.ramdisk),
    initrd: optionalString(row.initrd),
    created: optionalString(row.created),
    pae: numberField(row, "pae"),
    acpi: numberField(row, "acpi"),
    apic: numberField(row, "apic"),
    xLocaltime: numberField(row, "xlocaltime"),
    sdl: numberField(row, "sdl"),
    vnc: numberField(row, "vnc"),
    vncConsole: numberField(row, "vncconsole"),
    vncUnused: numberField(row, "vncunused"),
    hide: numberField(row, "hide"),
    kvm: numberField(row, "kvm")
  };
}

/**
 * Parses a dedicated OS profile's disk layouts or scripts.
 *
 * The platform sends these as either a JSON object keyed by id (sorted numerically here to
 * give callers a stable order) or as an array of objects, strings or bare numbers.
 */
function parseDedicatedIdNames(raw: unknown): DedicatedIdName[] {
  if (raw === null || raw === undefined) {
    return [];
  }
  if (isObject(raw)) {
    const entries = Object.entries(raw);
    if (entries.every(([, value]) => typeof value === "string")) {
      return entries
        .slice()
        .sort(([left], [right]) => (isIntegerKey(left) && isIntegerKey(right) ? Number.parseInt(left, 10) - Number.parseInt(right, 10) : left.localeCompare(right)))
        .map(([key, value]) => {
          if (!isIntegerKey(key)) {
            throw new Error(`invalid dedicated id/name key "${key}"`);
          }
          return { id: Number.parseInt(key, 10), name: value as string };
        });
    }
  }
  if (Array.isArray(raw)) {
    return raw.map(parseDedicatedIdName);
  }
  throw new Error("unsupported dedicated id/name shape");
}

function parseDedicatedIdName(raw: unknown): DedicatedIdName {
  if (isObject(raw)) {
    const id = optionalNumber(raw.id) ?? optionalNumber(raw.layout_id) ?? optionalNumber(raw.script_id);
    if (id !== undefined || raw.name !== undefined) {
      return { id: id ?? 0, name: optionalString(raw.name) ?? "" };
    }
  }
  if (typeof raw === "string") {
    return { id: 0, name: raw.trim() };
  }
  if (typeof raw === "number") {
    return { id: raw, name: "" };
  }
  throw new Error("unsupported dedicated id/name entry shape");
}

function isIntegerKey(key: string): boolean {
  return /^-?\d+$/.test(key);
}

/** Decodes a dedicated server build job. */
export function decodeMetalBuild(input: unknown): MetalBuild {
  const row = requireObject(input);
  return {
    mbPkgId: numberField(row, "mbpkgid"),
    status: optionalString(row.status),
    build: optionalNumber(row.build)
  };
}

/** Decodes a dedicated server (metal package). */
export function decodeMetal(input: unknown): Metal {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    datacenterId: numberField(row, "datacenter_id"),
    canceling: optionalFlag(row.canceling),
    mbPkgId: numberField(row, "mbpkgid"),
    price: stringField(row, "price"),
    hostname: stringField(row, "hostname"),
    eth0Mac: stringField(row, "eth0_mac"),
    eth1Mac: optionalString(row.eth1_mac),
    ipmiMac: stringField(row, "ipmi_mac"),
    primaryIp: stringField(row, "primary_ip"),
    primaryIpv6: optionalString(row.primary_ipv6),
    npsInstalled: optionalFlag(row.nps_installed),
    npsOs: stringField(row, "nps_os"),
    mbModel: optionalString(row.mb_model),
    cpu0Model: stringField(row, "cpu0_model"),
    cpu1Model: optionalString(row.cpu1_model),
    totalRam: numberField(row, "total_ram"),
    ipmiPubIp: stringField(row, "ipmi_pubip"),
    ipmiCxUser: optionalString(row.ipmi_cxuser),
    ipmiCxPass: optionalString(row.ipmi_cxpass),
    ipmiStatus: numberField(row, "ipmi_status"),
    locked: optionalFlag(row.locked),
    lockedMsg: optionalString(row.locked_msg),
    ipmiStatusTime: stringField(row, "ipmi_status_time"),
    obId: optionalFlexibleString(row.ob_id) ?? "",
    info: stringField(row, "info"),
    title: stringField(row, "title"),
    ipmiRefreshEnabled: optionalFlag(row.ipmi_refresh_enabled),
    location: stringField(row, "location"),
    ipSubnetId: numberField(row, "ip_subnet_id"),
    ipSubnetName: stringField(row, "ip_subnet_name"),
    packageStatus: stringField(row, "package_status"),
    building: isObject(row.building) ? row.building : undefined
  };
}

/** Decodes a cloud deployment location. */
export function decodeCloudLocation(input: unknown): CloudLocation {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    location: stringField(row, "location"),
    city: stringField(row, "city"),
    country: stringField(row, "country"),
    iataCode: stringField(row, "iata_code"),
    flag: stringField(row, "flag"),
    latitude: optionalString(row.latitude),
    longitude: optionalString(row.longitude)
  };
}

/** Decodes a cloud pool. */
export function decodeCloudPool(input: unknown): CloudPool {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    description: stringField(row, "description"),
    requiredVcpu: optionalString(row.required_vcpu),
    hardCapabilities: stringArray(row.hard_capabilities),
    softCapabilities: stringArray(row.soft_capabilities),
    isPrivate: optionalFlag(row.private),
    backupCloudPoolId: optionalNumber(row.backup_cloud_pool_id),
    defaultRamPrice: stringField(row, "default_ram_price"),
    defaultCpuPrice: stringField(row, "default_cpu_price"),
    defaultDiskPrice: stringField(row, "default_disk_price"),
    lastUpdated: stringField(row, "last_updated"),
    created: stringField(row, "created"),
    contractId: optionalNumber(row.contract_id)
  };
}

/** Decodes a boot kernel option. */
export function decodeKernel(input: unknown): Kernel {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    description: optionalString(row.description)
  };
}

/** Decodes the status of an asynchronous cloud server build. */
export function decodeServerBuildStatus(input: unknown): ServerBuildStatus {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    status: stringField(row, "status"),
    percent: numberField(row, "percent"),
    response: stringField(row, "response"),
    raw: row
  };
}

/** Decodes an IPv4 or IPv6 address attached to a cloud server. */
export function decodeServerIPAddress(input: unknown): ServerIPAddress {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    ip: stringField(row, "ip"),
    reverse: optionalString(row.reverse),
    netmask: optionalString(row.netmask),
    gateway: optionalString(row.gateway),
    type: optionalString(row.type),
    primary: optionalNumber(row.primary),
    raw: row
  };
}

/** Decodes the power and provisioning status of a cloud server. */
export function decodeServerStatus(input: unknown): ServerStatus {
  const row = requireObject(input);
  return {
    status: stringField(row, "status"),
    state: stringField(row, "state"),
    raw: row
  };
}

/** Decodes a usage contract. */
export function decodeContractUsage(input: unknown): ContractUsage {
  const row = requireObject(input);
  return {
    id: optionalNumber(row.id),
    contractMbPkgId: optionalNumber(row.contract_mbpkgid),
    parentContractId: optionalNumber(row.parent_contract_id),
    brand: optionalString(row.brand),
    mbId: optionalNumber(row.mb_id),
    contractType: optionalString(row.contract_type),
    isFree: optionalNumber(row.is_free),
    includeBandwidth: optionalNumber(row.include_bandwidth),
    customerPo: optionalString(row.customer_po),
    customerDescription: optionalString(row.customer_description),
    poMonthlyLimit: optionalNumber(row.po_monthly_limit),
    monthlyDiscount: optionalNumber(row.monthly_discount),
    hourlyDiscount: optionalNumber(row.hourly_discount),
    maxCpus: optionalNumber(row.max_cpus),
    maxRam: optionalNumber(row.max_ram),
    maxDisk: optionalNumber(row.max_disk),
    allowOverage: optionalNumber(row.allow_overage)
  };
}

/** Decodes a deploy size (plan) available at a location. */
export function decodeSize(input: unknown): Size {
  const row = requireObject(input);
  return {
    planId: numberField(row, "plan_id"),
    plan: stringField(row, "plan"),
    ram: stringField(row, "ram"),
    disk: stringField(row, "disk"),
    transfer: stringField(row, "transfer"),
    price: stringField(row, "price"),
    cpu: numberField(row, "cpu"),
    port: stringField(row, "port"),
    available: numberField(row, "available")
  };
}

/** Decodes the response returned when deleting a cloud server. */
export function decodeDeleteServerResponse(input: unknown): DeleteServerResponse {
  const row = requireObject(input);
  return { id: numberField(row, "id") };
}

/** Decodes a custom image, including its active build detail when present. */
export function decodeImage(input: unknown): Image {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "os"),
    description: optionalString(row.description),
    type: stringField(row, "type"),
    subtype: stringField(row, "subtype"),
    bits: stringField(row, "bits"),
    tech: stringField(row, "tech"),
    size: stringField(row, "size"),
    category: stringField(row, "category"),
    enabled: row.os_enabled === undefined || row.os_enabled === null ? undefined : toBoolFlexible(row.os_enabled),
    scriptBash: numberField(row, "script_bash"),
    scriptCloudinit: numberField(row, "script_cloudinit"),
    created: stringField(row, "created"),
    updated: stringField(row, "updated"),
    activeBuild: isObject(row.active_build) ? decodeImageBuild(row.active_build) : undefined
  };
}

function decodeImageBuild(input: JsonObject): ImageBuild {
  return {
    id: numberField(input, "id"),
    status: numberField(input, "status"),
    command: stringField(input, "command"),
    tsInsert: stringField(input, "ts_insert"),
    mbId: numberField(input, "mb_id"),
    mbPkgId: numberField(input, "mb_pkgid"),
    params: stringField(input, "params"),
    buildPacket: stringField(input, "build_packet"),
    response: stringField(input, "response"),
    created: stringField(input, "created"),
    lastUpdated: stringField(input, "last_updated")
  };
}

/** Decodes the response from queuing an image capture job. */
export function decodeCreateImageResponse(input: unknown): CreateImageResponse {
  const row = requireObject(input);
  return { queueId: numberField(row, "queue_id") };
}

/** Decodes the response from queuing an image deletion job. */
export function decodeDeleteImageResponse(input: unknown): DeleteImageResponse {
  const row = requireObject(input);
  return { queueId: numberField(row, "queue_id") };
}

/** Decodes the progress of a queued image job. */
export function decodeImageQueueStatus(input: unknown): ImageQueueStatus {
  const row = requireObject(input);
  return {
    status: stringField(row, "status"),
    percent: numberField(row, "percent"),
    response: stringField(row, "response"),
    imageId: numberField(row, "image_id"),
    imageName: stringField(row, "image_name"),
    imageHelp: stringField(row, "image_help"),
    location: stringField(row, "location"),
    mbPkgId: numberField(row, "mb_pkgid"),
    fqdn: stringField(row, "fqdn"),
    os: stringField(row, "os")
  };
}

/**
 * Decodes the platform status envelope.
 *
 * The API returns services and their locations as JSON objects keyed by name rather than
 * arrays, so this flattens both into arrays sorted by name to give callers a stable order.
 */
export function decodePlatformStatus(input: unknown): PlatformStatusService[] {
  const raw = requireObject(input);
  return Object.keys(raw)
    .sort()
    .map((serviceName) => {
      const wire = requireObject(raw[serviceName]);
      const locationsRaw = isObject(wire.locations) ? wire.locations : {};
      const locations = Object.keys(locationsRaw)
        .sort()
        .map((locationName) => {
          const loc = requireObject(locationsRaw[locationName]);
          return {
            location: locationName,
            containerId: stringField(loc, "container_id"),
            status: stringField(loc, "status"),
            lastUpdated: stringField(loc, "last_updated")
          };
        });
      return {
        service: serviceName,
        componentId: stringField(wire, "component_id"),
        locations
      };
    });
}

/** Decodes a platform change log entry, preserving the full payload alongside the common fields. */
export function decodePlatformChangeLogEntry(input: unknown): PlatformChangeLogEntry {
  const row = requireObject(input);
  return {
    changeLogId: optionalFlexibleString(row.id),
    title: optionalFlexibleString(row.title),
    shortDescription: optionalFlexibleString(row.short_description),
    status: optionalFlexibleString(row.status),
    raw: row
  };
}

/** Decodes a looking glass initialization payload, kept as a raw passthrough. */
export function decodePlatformLookingGlassInit(input: unknown): PlatformLookingGlassInit {
  return { raw: requireObject(input) };
}

/** Decodes a looking glass execution result, kept as a raw passthrough. */
export function decodePlatformLookingGlassResult(input: unknown): PlatformLookingGlassResult {
  return { raw: requireObject(input) };
}

/** Decodes a platform maintenance detail payload, kept as a raw passthrough. */
export function decodePlatformMaintenanceInfo(input: unknown): PlatformMaintenanceInfo {
  return { raw: requireObject(input) };
}

/** Decodes one platform incident or maintenance event. */
function decodePlatformEvent(input: unknown): PlatformEvent {
  const row = requireObject(input);
  return {
    eventId: optionalString(row.event_id),
    type: optionalString(row.type),
    name: optionalString(row.name),
    status: optionalString(row.status),
    startTime: optionalString(row.start_time),
    endTime: optionalString(row.end_time),
    components: stringArray(row.components),
    containers: stringArray(row.containers)
  };
}

/** Decodes a platform incidents or maintenance events envelope. */
export function decodePlatformEvents(input: unknown): PlatformEvents {
  const row = requireObject(input);
  return {
    active: arrayOf(row.active).map(decodePlatformEvent),
    upcoming: arrayOf(row.upcoming).map(decodePlatformEvent),
    historic: arrayOf(row.historic).map(decodePlatformEvent)
  };
}

/** Decodes a support ticket, preserving the full payload alongside the common fields. */
export function decodeTicket(input: unknown): Ticket {
  const row = requireObject(input);
  return {
    id: optionalString(row.id) ?? "",
    subject: optionalString(row.subject),
    status: optionalString(row.status),
    department: optionalString(row.department),
    urgency: optionalString(row.urgency),
    createdAt: optionalString(row.created_at),
    updatedAt: optionalString(row.updated_at),
    raw: row
  };
}

/** Decodes a support ticket reply, preserving the full payload alongside the common fields. */
export function decodeTicketReply(input: unknown): TicketReply {
  const row = requireObject(input);
  return {
    id: optionalString(row.id),
    message: optionalString(row.message),
    createdAt: optionalString(row.created_at),
    raw: row
  };
}

/** Decodes a support ticket department, preserving the full payload alongside the common fields. */
export function decodeTicketDepartment(input: unknown): TicketDepartment {
  const row = requireObject(input);
  return {
    id: optionalNumber(row.id),
    name: optionalString(row.name),
    raw: row
  };
}

/** Decodes support ticket or reply attachment metadata, preserving the full payload alongside the common fields. */
export function decodeTicketAttachment(input: unknown): TicketAttachment {
  const row = requireObject(input);
  return {
    name: optionalString(row.name),
    contentType: optionalString(row.content_type),
    size: optionalNumber(row.size),
    data: optionalString(row.data),
    raw: row
  };
}

/** Decodes a secret list. */
export function decodeSecretList(input: unknown): SecretList {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name")
  };
}

/** Decodes a secret list value, tolerating a secret_list_id sent as either a number or a numeric string. */
export function decodeSecretListValue(input: unknown): SecretListValue {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    secretListId: toIntFlexible(row.secret_list_id),
    secretKey: stringField(row, "secret_key"),
    secretValue: stringField(row, "secret_value")
  };
}

/** Decodes an SSL certificate's validity and lifecycle timestamps. */
function decodeSslCertificateDates(input: unknown): SslCertificateDates {
  const row = requireObject(input);
  return {
    created: optionalString(row.created),
    updated: optionalString(row.updated),
    notBefore: optionalString(row.notBefore),
    expiration: optionalString(row.expiration)
  };
}

/** Decodes an SSL certificate. */
export function decodeSslCertificate(input: unknown): SslCertificate {
  const row = requireObject(input);
  return {
    sslCertificateId: numberField(row, "sslCertificateId"),
    name: stringField(row, "name"),
    description: stringField(row, "description"),
    fingerprint: stringField(row, "fingerprint"),
    domains: stringArray(row.domains),
    isActive: optionalFlag(row.isActive),
    status: stringField(row, "status"),
    dates: isObject(row.dates) ? decodeSslCertificateDates(row.dates) : undefined
  };
}

/** Decodes the response returned when creating an SSL certificate. */
export function decodeCreateSslCertificateResponse(input: unknown): CreateSslCertificateResponse {
  const row = requireObject(input);
  return { sslCertificateId: numberField(row, "sslCertificateId") };
}

function decodeNlbGroupMatch(input: unknown): NlbGroupMatch {
  const row = requireObject(input);
  return { address: stringField(row, "address") };
}

function decodeNlbGroupHealthCheck(input: unknown): NlbGroupHealthCheck {
  const row = requireObject(input);
  return {
    enabled: optionalFlag(row.enabled),
    method: stringField(row, "method"),
    interval: numberField(row, "interval"),
    retries: numberField(row, "retries"),
    delay: numberField(row, "delay"),
    timeout: numberField(row, "timeout")
  };
}

function decodeNlbGroupRule(input: unknown): NlbGroupRule {
  const row = requireObject(input);
  const ports = requireObject(row.ports);
  return {
    protocol: stringField(row, "protocol"),
    networkRuleId: optionalNumber(row.networkRuleId),
    ports: { match: numberField(ports, "match"), internal: numberField(ports, "internal") }
  };
}

function decodeNlbGroupBackend(input: unknown): NlbGroupBackend {
  const row = requireObject(input);
  return {
    name: stringField(row, "name"),
    internalAddress: stringField(row, "internalAddress"),
    isOnline: optionalBoolean(row.isOnline),
    networkBackendId: optionalNumber(row.networkBackendId)
  };
}

/** Decodes a network load balancer group. */
export function decodeNlbGroup(input: unknown): NlbGroup {
  const row = requireObject(input);
  return {
    networkGroupId: numberField(row, "networkGroupId"),
    name: stringField(row, "name"),
    description: stringField(row, "description"),
    ipVersion: numberField(row, "ipVersion"),
    algorithm: stringField(row, "algorithm"),
    isOnline: optionalFlag(row.isOnline),
    match: decodeNlbGroupMatch(row.match),
    healthCheck: decodeNlbGroupHealthCheck(row.healthCheck),
    rules: arrayOf(row.rules).map(decodeNlbGroupRule),
    backends: arrayOf(row.backends).map(decodeNlbGroupBackend)
  };
}

function decodeStatisticSample(input: unknown): StatisticSample {
  const row = requireObject(input);
  return {
    count: numberField(row, "count"),
    resources: numberField(row, "resources"),
    avg: numberField(row, "avg"),
    sum: numberField(row, "sum")
  };
}

/** Decodes one metric's result from a statistics query, taking its metric name from the response's metric map. */
export function decodeStatisticResult(input: unknown): StatisticResult {
  const row = requireObject(input);
  const metricNames = Object.keys(requireObject(row.metric)).sort();
  return {
    metric: metricNames[0] ?? "",
    service: stringField(row, "service"),
    data: arrayOf(row.data).map(decodeStatisticSample)
  };
}

function decodeMetricSummary(input: unknown): MetricSummary {
  const row = requireObject(input);
  return {
    sum: numberField(row, "sum"),
    avg: numberField(row, "avg"),
    min: numberField(row, "min"),
    max: numberField(row, "max")
  };
}

function decodeMetricTimeWindow(input: unknown): MetricTimeWindow {
  const row = requireObject(input);
  return {
    start: stringField(row, "start"),
    end: stringField(row, "end"),
    seconds: numberField(row, "seconds")
  };
}

/** Decodes the metric names payload, pulling the shared time window out of its `__timeWindow` key. */
export function decodeMetricNames(input: unknown): MetricNames {
  const row = requireObject(input);
  const timeWindow = isObject(row.__timeWindow) ? decodeMetricTimeWindow(row.__timeWindow) : { start: "", end: "", seconds: 0 };
  const names = Object.keys(row)
    .filter((name) => !name.startsWith("__"))
    .sort();
  return {
    timeWindow,
    metrics: names.map((name) => {
      const metricRow = requireObject(row[name]);
      return {
        metric: name,
        service: stringField(metricRow, "service"),
        resources: numberField(metricRow, "resources"),
        avg: decodeMetricSummary(metricRow.avg),
        last: decodeMetricSummary(metricRow.last),
        sum: decodeMetricSummary(metricRow.sum)
      };
    })
  };
}

/** DDoS attack recorded against the account, active or historic. */
export interface DdosAttack {
  /** Attack id. */
  attackId: number;
  /** Attack start timestamp. */
  dateStart: string;
  /** Attack end timestamp, empty while still active. */
  dateEnd: string;
  /** Attack status code. */
  status: number;
  /** Targeted IP address. */
  ip: string;
  /** Targeted prefix. */
  prefix: string;
  /** Traffic direction. */
  direction: string;
  /** Peak packets per second observed. */
  pps: number;
  /** Mitigation rule id that matched. */
  ruleId: number;
  /** Mitigation rule type. */
  ruleType: string;
  /** Ban duration applied, in seconds. */
  banDuration: number;
  /** Mitigation rule name. */
  ruleName: string;
}

/** Decodes a DDoS attack record. */
export function decodeDdosAttack(input: unknown): DdosAttack {
  const row = requireObject(input);
  return {
    attackId: numberField(row, "id"),
    dateStart: stringField(row, "date_start"),
    dateEnd: stringField(row, "date_end"),
    status: numberField(row, "status"),
    ip: stringField(row, "ip"),
    prefix: stringField(row, "prefix"),
    direction: stringField(row, "direction"),
    pps: numberField(row, "pps"),
    ruleId: numberField(row, "rule_id"),
    ruleType: stringField(row, "rule_type"),
    banDuration: numberField(row, "ban_duration"),
    ruleName: stringField(row, "rule_name")
  };
}

/** DDoS mitigation dashboard summary for a time period. */
export interface DdosDashboard {
  /** Total attacks counted in the period. */
  totalAttacks: number;
  /** Active mitigation rules. */
  activeRules: number;
  /** Longest attack observed, in seconds. */
  longestAttackSeconds: number;
  /** Top attacks for the period. Shape is not modeled upstream. */
  topAttacks: unknown[];
  /** Period covered, in seconds. */
  period: number;
}

/** Decodes a DDoS dashboard summary. */
export function decodeDdosDashboard(input: unknown): DdosDashboard {
  const row = requireObject(input);
  return {
    totalAttacks: numberField(row, "total_attacks"),
    activeRules: numberField(row, "active_rules"),
    longestAttackSeconds: numberField(row, "longest_attack_seconds"),
    topAttacks: arrayOf(row.top_attacks),
    period: numberField(row, "period")
  };
}

/** Prefix protected under a DDoS mitigation rule. */
export interface DdosRulePrefix {
  /** Prefix id. */
  prefixId: number;
  /** Protected prefix. */
  prefix: string;
  /** Prefix type. */
  prefixType: string;
  /** Prefix description. */
  description: string;
  /** Packets per second allowed before mitigation triggers. */
  allowedPps: number;
}

function decodeDdosRulePrefix(input: unknown): DdosRulePrefix {
  const row = requireObject(input);
  return {
    prefixId: numberField(row, "id"),
    prefix: stringField(row, "prefix"),
    prefixType: stringField(row, "prefix_type"),
    description: stringField(row, "description"),
    allowedPps: numberField(row, "allowed_pps")
  };
}

/** Mitigation action taken by a DDoS rule. */
export interface DdosRuleAction {
  /** Action name. */
  name: string;
  /** Action type. */
  actionType: string;
  /** Evaluation order among the rule's actions. */
  runOrder: number;
  /** Display name for the action. */
  actionName: string;
  /** Action description. */
  actionDescription: string;
}

function decodeDdosRuleAction(input: unknown): DdosRuleAction {
  const row = requireObject(input);
  return {
    name: stringField(row, "name"),
    actionType: stringField(row, "action_type"),
    runOrder: numberField(row, "run_order"),
    actionName: stringField(row, "action_name"),
    actionDescription: stringField(row, "action_description")
  };
}

/** DDoS mitigation rule, with its protected prefixes and configured actions. */
export interface DdosRule {
  /** Rule id. */
  ruleId: number;
  /** Rule name. */
  ruleName: string;
  /** Rule description. */
  description: string;
  /** Prefixes protected by this rule. */
  prefixes: DdosRulePrefix[];
  /** Actions taken by this rule. */
  rules: DdosRuleAction[];
}

/** Decodes a DDoS mitigation rule. */
export function decodeDdosRule(input: unknown): DdosRule {
  const row = requireObject(input);
  return {
    ruleId: numberField(row, "id"),
    ruleName: stringField(row, "rule_name"),
    description: stringField(row, "description"),
    prefixes: arrayOf(row.prefixes).map(decodeDdosRulePrefix),
    rules: arrayOf(row.rules).map(decodeDdosRuleAction)
  };
}

/** User access control subnet allowed to reach the account. */
export interface AccessControlSubnet {
  /** Row id. Accepted from the platform as a number or a string and normalized to a string. */
  id: string;
  /** Display label. */
  label: string;
  /** Allowed subnet, in CIDR notation. */
  subnet: string;
}

/** Decodes a user access control subnet. */
export function decodeAccessControlSubnet(input: unknown): AccessControlSubnet {
  const row = requireObject(input);
  const id = optionalFlexibleString(row.id);
  if (id === undefined) {
    throw new Error("access control subnet payload is missing id");
  }
  return { id, label: stringField(row, "label"), subnet: stringField(row, "subnet") };
}

/** Address and ports matched by an HTTP load balancer group. */
export interface HttpLbGroupMatch {
  /** Matched address. */
  address: string;
  /** Matched ports. */
  ports: string;
}

function decodeHttpLbGroupMatch(input: unknown): HttpLbGroupMatch {
  const row = requireObject(input);
  return { address: stringField(row, "address"), ports: stringField(row, "ports") };
}

/** Active health check configuration for an HTTP load balancer group. */
export interface HttpLbGroupHealthCheckActive {
  /** Whether active health checking is enabled. */
  enabled: boolean;
  /** Interval between checks, in seconds. */
  interval?: number;
  /** Retries before marking a backend unhealthy. */
  retries?: number;
  /** Delay before the first check, in seconds. */
  delay?: number;
  /** Per-check timeout, in seconds. Explicitly nullable upstream. */
  timeout: number | null;
  /** HTTP path requested by the check. */
  path?: string;
}

function decodeHttpLbGroupHealthCheckActive(input: unknown): HttpLbGroupHealthCheckActive {
  const row = requireObject(input);
  return {
    enabled: optionalFlag(row.enabled),
    interval: optionalNumber(row.interval),
    retries: optionalNumber(row.retries),
    delay: optionalNumber(row.delay),
    timeout: optionalNumber(row.timeout) ?? null,
    path: optionalString(row.path)
  };
}

/** Passive health check configuration for an HTTP load balancer group. */
export interface HttpLbGroupHealthCheckPassive {
  /** Whether passive health checking is enabled. */
  enabled: boolean;
}

function decodeHttpLbGroupHealthCheckPassive(input: unknown): HttpLbGroupHealthCheckPassive {
  return { enabled: optionalFlag(requireObject(input).enabled) };
}

/** Health check configuration for an HTTP load balancer group. */
export interface HttpLbGroupHealthCheck {
  /** Active health check settings. */
  active: HttpLbGroupHealthCheckActive;
  /** Passive health check settings. */
  passive: HttpLbGroupHealthCheckPassive;
}

function decodeHttpLbGroupHealthCheck(input: unknown): HttpLbGroupHealthCheck {
  const row = requireObject(input);
  return {
    active: decodeHttpLbGroupHealthCheckActive(row.active),
    passive: decodeHttpLbGroupHealthCheckPassive(row.passive)
  };
}

/** Domain and path matched by an HTTP load balancer rule. */
export interface HttpLbGroupRuleMatch {
  /** Matched domain. */
  domain: string;
  /** Matched path. */
  path: string;
}

function decodeHttpLbGroupRuleMatch(input: unknown): HttpLbGroupRuleMatch {
  const row = requireObject(input);
  return { domain: stringField(row, "domain"), path: stringField(row, "path") };
}

/** TLS termination settings for an HTTP load balancer rule. */
export interface HttpLbGroupRuleSsl {
  /** Whether TLS termination is enabled for the rule. */
  enabled: boolean;
  /** SSL certificate id used for termination, when enabled. */
  sslCertificateId: number | null;
}

function decodeHttpLbGroupRuleSsl(input: unknown): HttpLbGroupRuleSsl {
  const row = requireObject(input);
  return { enabled: optionalFlag(row.enabled), sslCertificateId: optionalNumber(row.sslCertificateId) ?? null };
}

/** Traffic rule configured on an HTTP load balancer group. */
export interface HttpLbGroupRule {
  /** Rule id, once created. */
  httpRuleId?: number;
  /** Whether plain HTTP requests matching this rule are redirected to HTTPS. */
  httpsRedirectEnabled: boolean;
  /** Domain and path matched by the rule. */
  match: HttpLbGroupRuleMatch;
  /** TLS termination settings for the rule. */
  ssl: HttpLbGroupRuleSsl;
}

function decodeHttpLbGroupRule(input: unknown): HttpLbGroupRule {
  const row = requireObject(input);
  return {
    httpRuleId: optionalNumber(row.httpRuleId),
    httpsRedirectEnabled: optionalFlag(row.httpsRedirectEnabled),
    match: decodeHttpLbGroupRuleMatch(row.match),
    ssl: decodeHttpLbGroupRuleSsl(row.ssl)
  };
}

/** Backend attached to an HTTP load balancer group. */
export interface HttpLbGroupBackend {
  /** Backend name. */
  name: string;
  /** Address reachable from inside the network. */
  internalAddress: string;
  /** Whether the backend is currently online. */
  isOnline?: boolean;
  /** Backend id, once created. */
  httpBackendId?: number;
}

function decodeHttpLbGroupBackend(input: unknown): HttpLbGroupBackend {
  const row = requireObject(input);
  return {
    name: stringField(row, "name"),
    internalAddress: stringField(row, "internalAddress"),
    isOnline: optionalBoolean(row.isOnline),
    httpBackendId: optionalNumber(row.httpBackendId)
  };
}

/** HTTP load balancer group, with its rules and attached backends. */
export interface HttpLbGroup {
  /** Group id. */
  httpGroupId: number;
  /** Group name. */
  name: string;
  /** Group description. */
  description: string;
  /** Load balancing algorithm. */
  algorithm: string;
  /** Whether sticky sessions are enabled. */
  stickySessionsEnabled: boolean;
  /** Whether TLS is used from the load balancer to backends. */
  sslToBackendEnabled: boolean;
  /** Internal port backends are reached on. */
  internalPort: number;
  /** Whether the group is currently online. */
  isOnline: boolean;
  /** Matched address and ports. */
  match: HttpLbGroupMatch;
  /** Health check configuration. */
  healthCheck: HttpLbGroupHealthCheck;
  /** Traffic rules. */
  rules: HttpLbGroupRule[];
  /** Attached backends. */
  backends: HttpLbGroupBackend[];
}

/** Decodes an HTTP load balancer group. */
export function decodeHttpLbGroup(input: unknown): HttpLbGroup {
  const row = requireObject(input);
  return {
    httpGroupId: numberField(row, "httpGroupId"),
    name: stringField(row, "name"),
    description: stringField(row, "description"),
    algorithm: stringField(row, "algorithm"),
    stickySessionsEnabled: optionalFlag(row.stickySessionsEnabled),
    sslToBackendEnabled: optionalFlag(row.sslToBackendEnabled),
    internalPort: numberField(row, "internalPort"),
    isOnline: optionalFlag(row.isOnline),
    match: decodeHttpLbGroupMatch(row.match),
    healthCheck: decodeHttpLbGroupHealthCheck(row.healthCheck),
    rules: arrayOf(row.rules).map(decodeHttpLbGroupRule),
    backends: arrayOf(row.backends).map(decodeHttpLbGroupBackend)
  };
}

/** Billing package summary. */
export interface BillingPackage {
  /** Row id. */
  id: number;
  /** Package name. */
  name: string;
  /** DomU label, when set. */
  domuLabel?: string;
  /** Package id. */
  packageId: number;
  /** Billed domain. */
  domain: string;
  /** Billed amount. */
  amount: string;
  /** Billing cycle. */
  billingCycle: string;
  /** Domain billing status. */
  domainStatus: string;
  /** Next due date. */
  nextDueDate: string;
  /** Dedicated IP associated with billing, when any. */
  dedicatedIp: string;
}

/** Decodes a billing package. */
export function decodeBillingPackage(input: unknown): BillingPackage {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    domuLabel: optionalString(row.domu_label),
    packageId: numberField(row, "packageid"),
    domain: stringField(row, "domain"),
    amount: stringField(row, "amount"),
    billingCycle: stringField(row, "billingcycle"),
    domainStatus: stringField(row, "domainstatus"),
    nextDueDate: stringField(row, "nextduedate"),
    dedicatedIp: stringField(row, "dedicatedip")
  };
}

/** Available cloud capacity for a package at a location. */
export interface CloudCapacity {
  /** Package id. */
  packageId: number;
  /** Package name. */
  packageName: string;
  /** vCPU count. */
  packageCpu: number;
  /** RAM in MB. */
  packageRam: number;
  /** Disk in GB. */
  packageDisk: number;
  /** Network allocation. */
  packageNet: number;
  /** Port allocation. */
  packagePort: number;
  /** Monthly price. */
  monthlyPrice: number;
  /** Units available. */
  available: number;
}

/** Decodes a cloud capacity row. */
export function decodeCloudCapacity(input: unknown): CloudCapacity {
  const row = requireObject(input);
  return {
    packageId: numberField(row, "pkg_id"),
    packageName: stringField(row, "pkg_name"),
    packageCpu: numberField(row, "pkg_cpu"),
    packageRam: numberField(row, "pkg_ram"),
    packageDisk: numberField(row, "pkg_disk"),
    packageNet: numberField(row, "pkg_net"),
    packagePort: numberField(row, "pkg_port"),
    monthlyPrice: numberField(row, "monthly_price"),
    available: numberField(row, "available")
  };
}

/** Dedicated server device capacity available at a location. */
export interface DedicatedCapacity {
  /** Device id. */
  deviceId: number;
  /** Location id. */
  locationId: number;
  /** Looking glass hostname. */
  lookingGlass: string;
  /** Server package id, once purchased. */
  mbPkgId: number;
  /** Device name. */
  name: string;
  /** Whether NPS is enabled for this device. */
  npsEnabled: boolean;
  /** Public-facing description. */
  pubDescription: string;
}

/** Decodes a dedicated capacity row. */
export function decodeDedicatedCapacity(input: unknown): DedicatedCapacity {
  const row = requireObject(input);
  return {
    deviceId: numberField(row, "device_id"),
    locationId: numberField(row, "location_id"),
    lookingGlass: stringField(row, "looking_glass"),
    mbPkgId: numberField(row, "mbpkgid"),
    name: stringField(row, "name"),
    npsEnabled: optionalFlag(row.nps_enabled),
    pubDescription: stringField(row, "pub_description")
  };
}

/** Datacenter and bandwidth commitment details shared by colocation and transit packages. */
export interface NonCloudPackageDetails {
  /** Datacenter name. */
  dcName: string;
  /** IATA airport code. */
  iataCode: string;
  /** Committed bandwidth. */
  bwCommit: string;
  /** Overage billing type. */
  overageType: string;
  /** Overage rate. */
  overageRate: string;
  /** Server package id the aggregate bandwidth commitment is billed under. */
  aggBwMbPkgId: string;
}

function decodeNonCloudPackageDetails(input: unknown): NonCloudPackageDetails {
  const row = requireObject(input);
  return {
    dcName: stringField(row, "dc_name"),
    iataCode: stringField(row, "iata_code"),
    bwCommit: stringField(row, "bw_commit"),
    overageType: stringField(row, "overage_type"),
    overageRate: stringField(row, "overage_rate"),
    aggBwMbPkgId: stringField(row, "agg_bw_mbpkgid")
  };
}

/** Colocation package on the account. */
export interface ColocationPackage {
  /** Server package id. */
  mbPkgId: number;
  /** Package billing status. */
  packageStatus: string;
  /** Fully qualified domain name. */
  fqdn: string;
  /** Billing cycle. */
  billingCycle: string;
  /** Next due date. */
  nextDueDate: string;
  /** Billed amount. */
  amount: string;
  /** Datacenter and bandwidth commitment details. */
  details: NonCloudPackageDetails;
  /** Package status. */
  status: string;
}

/** Decodes a colocation package. */
export function decodeColocationPackage(input: unknown): ColocationPackage {
  const row = requireObject(input);
  return {
    mbPkgId: numberField(row, "mbpkgid"),
    packageStatus: stringField(row, "package_status"),
    fqdn: stringField(row, "fqdn"),
    billingCycle: stringField(row, "billingcycle"),
    nextDueDate: stringField(row, "nextduedate"),
    amount: stringField(row, "amount"),
    details: decodeNonCloudPackageDetails(row.details),
    status: stringField(row, "status")
  };
}

/** IP transit package on the account. */
export interface TransitPackage {
  /** Server package id. */
  mbPkgId: number;
  /** Package billing status. */
  packageStatus: string;
  /** Fully qualified domain name. */
  fqdn: string;
  /** Billing cycle. */
  billingCycle: string;
  /** Next due date. */
  nextDueDate: string;
  /** Billed amount. */
  amount: string;
  /** Datacenter and bandwidth commitment details. */
  details: NonCloudPackageDetails;
  /** Package status. */
  status: string;
}

/** Decodes an IP transit package. */
export function decodeTransitPackage(input: unknown): TransitPackage {
  const row = requireObject(input);
  return {
    mbPkgId: numberField(row, "mbpkgid"),
    packageStatus: stringField(row, "package_status"),
    fqdn: stringField(row, "fqdn"),
    billingCycle: stringField(row, "billingcycle"),
    nextDueDate: stringField(row, "nextduedate"),
    amount: stringField(row, "amount"),
    details: decodeNonCloudPackageDetails(row.details),
    status: stringField(row, "status")
  };
}

/** Purchased cloud package, from the legacy account package listing. */
export interface CloudPackage {
  /** Server package id. Accepted from the platform as a number or a numeric string. */
  id: number;
  /** Package billing status. */
  status: string;
  /** Whether the package is locked against changes. */
  locked: boolean;
  /** Plan name. */
  planName: string;
  /** Whether the package is installed. */
  installed: boolean;
}

/** Decodes a purchased cloud package. */
export function decodeCloudPackage(input: unknown): CloudPackage {
  const row = requireObject(input);
  const id = flexibleNumber(row.mbpkgid);
  if (id === undefined) {
    throw new Error("cloud package payload is missing mbpkgid");
  }
  return {
    id,
    status: stringField(row, "package_status"),
    locked: flexibleFlag(row.locked),
    planName: stringField(row, "name"),
    installed: flexibleFlag(row.installed)
  };
}

/** One nameserver announced by a VPC's DHCP service. */
export interface VpcNameserver {
  /** Nameserver IP address. */
  server: string;
}

function decodeVpcNameserverEntry(value: unknown): VpcNameserver {
  if (typeof value === "string") {
    return { server: value };
  }
  const row = requireObject(value);
  return { server: stringField(row, "server") };
}

/** Decodes a flat list of VPC nameservers, as sent to and returned from the replace endpoint. */
export function decodeVpcNameserverList(input: unknown): VpcNameserver[] {
  return arrayOf(input).map(decodeVpcNameserverEntry);
}

/** Nameservers a VPC's DHCP service announces, split by IP version. */
export interface VpcNameservers {
  /** IPv4 nameservers. */
  ipv4: VpcNameserver[];
  /** IPv6 nameservers. */
  ipv6: VpcNameserver[];
}

/** Decodes a VPC's DHCP nameservers, tolerating both the plain-string read shape and the object write shape. */
export function decodeVpcNameservers(input: unknown): VpcNameservers {
  const row = isObject(input) ? input : {};
  return {
    ipv4: arrayOf(row.ipv4).map(decodeVpcNameserverEntry),
    ipv6: arrayOf(row.ipv6).map(decodeVpcNameserverEntry)
  };
}

/** Platform location detected from an IP address, alongside the complete raw payload. */
export interface LocationByCurrentIp {
  /** Detected IP address. */
  ip?: string;
  /** Detected location code. */
  location?: string;
  /** Complete raw response, for fields not yet modeled. */
  raw: JsonObject;
}

/** Decodes the location detected for the caller's current IP address. */
export function decodeLocationByCurrentIp(input: unknown): LocationByCurrentIp {
  const row = requireObject(input);
  return { ip: optionalString(row.ip), location: optionalString(row.location), raw: row };
}

/** Opaque switch port graph payload. */
export interface Graph {
  /** Complete raw response. */
  raw: JsonObject;
}

/** Decodes a switch port graph payload, which is not modeled beyond its raw form. */
export function decodeGraph(input: unknown): Graph {
  return { raw: requireObject(input) };
}

/** Usage limit for one resource type on the account. */
export interface AccountLimit {
  /** Units currently used. */
  used: number;
  /** Maximum units allowed. */
  max: number;
  /** Plans allowed to consume this limit. */
  allowedPlans: string[];
}

/** Decodes an account limit entry. */
export function decodeAccountLimit(input: unknown): AccountLimit {
  const row = requireObject(input);
  return { used: numberField(row, "used"), max: numberField(row, "max"), allowedPlans: stringArray(row.allowedPlans) };
}

/** Deployment location summary returned by the cloud locations list. */
export interface LocationSummary {
  /** Location id. */
  id: number;
  /** Location name. */
  name: string;
  /** IATA airport code. */
  iataCode: string;
  /** Continent name. */
  continent: string;
  /** Flag icon code. */
  flag: string;
  /** Whether the location is disabled for new deployments. */
  disabled: boolean;
}

/** Decodes a deployment location summary. */
export function decodeLocationSummary(input: unknown): LocationSummary {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    name: stringField(row, "name"),
    iataCode: stringField(row, "iata_code"),
    continent: stringField(row, "continent"),
    flag: stringField(row, "flag"),
    disabled: optionalFlag(row.disabled)
  };
}

/** Base OS catalog entry available for server deployment. */
export interface Os {
  /** Row id. */
  id: number;
  /** OS name. */
  os: string;
  /** OS family type. */
  type: string;
  /** OS subtype. */
  subtype: string;
  /** Disk size class. */
  size: string;
  /** Architecture bit width. */
  bits: string;
  /** Provisioning technology. */
  tech: string;
}

/** Decodes an OS catalog entry. */
export function decodeOs(input: unknown): Os {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    os: stringField(row, "os"),
    type: stringField(row, "type"),
    subtype: stringField(row, "subtype"),
    size: stringField(row, "size"),
    bits: stringField(row, "bits"),
    tech: stringField(row, "tech")
  };
}

/** One IP address assigned to a server package. */
export interface NetworkIp {
  /** Row id. */
  id: number;
  /** Whether this is the package's primary address. */
  primary: boolean;
  /** Reverse DNS hostname. */
  reverse: string;
  /** IP address. */
  ip: string;
  /** Gateway address. */
  gateway: string;
  /** Netmask. */
  netmask: string;
  /** Broadcast address. */
  broadcast: string;
}

function decodeNetworkIp(input: unknown): NetworkIp {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    primary: optionalFlag(row.primary),
    reverse: stringField(row, "reverse"),
    ip: stringField(row, "ip"),
    gateway: stringField(row, "gateway"),
    netmask: stringField(row, "netmask"),
    broadcast: stringField(row, "broadcast")
  };
}

/** IPv4 and IPv6 addresses assigned to a server package. */
export interface NetworkIps {
  /** IPv4 addresses. */
  ipv4: NetworkIp[];
  /** IPv6 addresses. */
  ipv6: NetworkIp[];
}

/** Decodes the IP addresses assigned to a server package. */
export function decodeNetworkIps(input: unknown): NetworkIps {
  const row = requireObject(input);
  return {
    ipv4: arrayOf(row["IPv4"]).map(decodeNetworkIp),
    ipv6: arrayOf(row["IPv6"]).map(decodeNetworkIp)
  };
}

/** Prefix carried on a BGP session. */
export interface BgpSessionPrefix {
  /** Prefix id. */
  id: number;
  /** Owning server row id. */
  mbId: number;
  /** Prefix in CIDR notation. */
  prefix: string;
  /** Prepend or other append directive, when set. Shape is not modeled upstream. */
  append?: unknown;
  /** Rule type. */
  ruleType: string;
  /** Prefix type. */
  prefixType: string;
  /** Prefix description. */
  description: string;
  /** Date the prefix was added. */
  date: string;
  /** Packets per second allowed before mitigation triggers. */
  allowedPps: number;
  /** Owning BGP group id. */
  bgpGroupId: number;
  /** Prefix id referenced elsewhere in the account. */
  prefixId: number;
}

function decodeBgpSessionPrefix(input: unknown): BgpSessionPrefix {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    mbId: numberField(row, "mb_id"),
    prefix: stringField(row, "prefix"),
    append: row.append,
    ruleType: stringField(row, "rule_type"),
    prefixType: stringField(row, "prefix_type"),
    description: stringField(row, "description"),
    date: stringField(row, "date"),
    allowedPps: numberField(row, "allowed_pps"),
    bgpGroupId: numberField(row, "bgp_group_id"),
    prefixId: numberField(row, "prefix_id")
  };
}

/** BGP session peering with a customer router. */
export interface BgpSession {
  /** Session id. */
  id: number;
  /** Customer-side peering address. */
  customerIp: string;
  /** Owning BGP group id. */
  groupId: number;
  /** Whether the session is locked against changes. */
  locked: boolean;
  /** Session description. */
  description: string;
  /** Session state. Shape is not modeled upstream. */
  state?: unknown;
  /** Routes received. Shape is not modeled upstream. */
  routesReceived?: unknown;
  /** Last update timestamp. Shape is not modeled upstream. */
  lastUpdate?: unknown;
  /** Configuration push status. */
  configStatus: number;
  /** Session password, when set. Shape is not modeled upstream. */
  password?: unknown;
  /** Prefixes carried on this session. */
  prefixes: BgpSessionPrefix[];
  /** Configured export list. */
  exportList: string;
  /** BGP community, when set. Shape is not modeled upstream. */
  community?: unknown;
  /** Provider-side peering address. */
  providerPeerIp: string;
  /** Session location. */
  location: string;
  /** Location latitude. */
  latitude: string;
  /** Location longitude. */
  longitude: string;
  /** Owning BGP group name. */
  groupName: string;
  /** Provider IP address type, "ipv4" or "ipv6". */
  providerIpType: string;
  /** Provider ASN. Sent on the wire as a quoted number. */
  providerAsn: number;
  /** Customer ASN. Sent on the wire as a quoted number. */
  customerAsn: number;
}

/** Decodes a BGP session. */
export function decodeBgpSession(input: unknown): BgpSession {
  const row = requireObject(input);
  return {
    id: numberField(row, "id"),
    customerIp: stringField(row, "customer_peer_ip"),
    groupId: numberField(row, "group_id"),
    locked: optionalFlag(row.locked),
    description: stringField(row, "description"),
    state: row.state,
    routesReceived: row.routes_received,
    lastUpdate: row.last_update,
    configStatus: numberField(row, "config_status"),
    password: row.password,
    prefixes: arrayOf(row.prefixes).map(decodeBgpSessionPrefix),
    exportList: stringField(row, "export_list"),
    community: row.community,
    providerPeerIp: stringField(row, "provider_peer_ip"),
    location: stringField(row, "location"),
    latitude: stringField(row, "latitude"),
    longitude: stringField(row, "longitude"),
    groupName: stringField(row, "group_name"),
    providerIpType: stringField(row, "provider_ip_type"),
    providerAsn: Number(stringField(row, "provider_asn")),
    customerAsn: Number(stringField(row, "customer_asn"))
  };
}

/** Build status for a dedicated server deployment, from the legacy dedicated build endpoints. */
export interface DedicatedServerBuildStatus {
  /** Server package id. */
  mbPkgId: number;
  /** Raw platform response text. */
  response: string;
  /** Build status. */
  status: string;
  /** Build completion percentage. */
  percent: number;
  /** Image being deployed. */
  imageName: string;
}

/** Decodes a dedicated server build status. */
export function decodeDedicatedServerBuildStatus(input: unknown): DedicatedServerBuildStatus {
  const row = requireObject(input);
  return {
    mbPkgId: numberField(row, "mbpkgid"),
    response: stringField(row, "response"),
    status: stringField(row, "status"),
    percent: numberField(row, "percent"),
    imageName: stringField(row, "image_name")
  };
}

function arrayOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
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

/** Reads a 0/1 or boolean flag field, defaulting to false when absent. */
function optionalFlag(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return false;
}

/** Reads a number sent as either a JSON number or a numeric string. */
function flexibleNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

/** Reads a 0/1 or boolean flag sent as either a JSON number, a numeric string, or a boolean. */
function flexibleFlag(value: unknown): boolean {
  const numeric = flexibleNumber(value);
  return numeric !== undefined ? numeric !== 0 : optionalFlag(value);
}
