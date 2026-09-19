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
  decodeAccountLimit,
  decodeCloudFloatingIpv4,
  decodeCloudFloatingIpv4Vm,
  decodeCloudNetworkingLocation,
  decodeCreateSslCertificateResponse,
  decodeHttpLbGroup,
  decodeLocation,
  decodeMagicMesh,
  decodeMeshRouter,
  decodeMetricNames,
  decodeNkeAccessUrls,
  decodeNkeAddon,
  decodeNkeAddonCatalogEntry,
  decodeNkeCluster,
  decodeNkeClusterDnsZone,
  decodeNkeLogEntry,
  decodeNkeWorkerNode,
  decodeNlbGroup,
  decodeOidcClient,
  decodeOidcClientAuthLog,
  decodeOidcClientBareMetalServer,
  decodeOidcClientChangeLog,
  decodeOidcClientDetail,
  decodeOidcClientKey,
  decodeOidcClientVm,
  decodeRouter,
  decodeRouterConfig,
  decodeRouterIpSecConfig,
  decodeRouterNtpConfig,
  decodeRouterPrefixList,
  decodeRouterStaticRoute,
  decodeRouterVrfBgpConfig,
  decodeRouterVrfBgpNeighbor,
  decodeRouterVrfConfig,
  decodeRouterVrfDhcpConfig,
  decodeRouterVrfDnatRule,
  decodeRouterVrfInterface,
  decodeRouterVrfInterfaceMap,
  decodeRouterVrfInterfaceWireguardPeer,
  decodeRouterVrfIpSecPeer,
  decodeRouterVrfMap,
  decodeRouterVrfSnatRule,
  decodeRouterVrfTunnel,
  decodeSslCertificate,
  decodeStatisticResult,
  decodeStorageBlockNamespace,
  decodeStorageBlockVolume,
  decodeStorageBucket,
  decodeStorageLocation,
  decodeStorageObjectStore,
  decodeStorageTypes,
  decodeUpdateRouterVrfBgpResult,
  decodeVpc,
  decodeVpcBackend,
  decodeVpcBackendTemplate,
  decodeVpcDnatRule,
  decodeVpcFirewallRule,
  decodeVpcFloatingIp,
  decodeVpcIpReservations,
  decodeVpcNameservers,
  decodeVpcNameserverList,
  decodeVpcSnatRule,
  decodeVpcSshKey,
  decodeVpcSshSettings,
  AccountLimit,
  CloudFloatingIpv4,
  CloudFloatingIpv4Vm,
  CloudNetworkingLocation,
  CreateSslCertificateResponse,
  HttpLbGroup,
  HttpLbGroupBackend,
  HttpLbGroupHealthCheck,
  HttpLbGroupMatch,
  HttpLbGroupRule,
  MagicMesh,
  MeshRouter,
  MetricNames,
  NkeAccessUrls,
  NkeAddon,
  NkeAddonCatalogEntry,
  NkeCluster,
  NkeClusterDnsZone,
  NkeLogEntry,
  NkeWorkerNode,
  NlbGroup,
  NlbGroupBackend,
  NlbGroupHealthCheck,
  NlbGroupMatch,
  NlbGroupRule,
  OidcClient,
  OidcClientAuthLog,
  OidcClientBareMetalServer,
  OidcClientChangeLog,
  OidcClientKey,
  OidcClientVm,
  Router,
  RouterConfig,
  RouterDhcpRange,
  RouterDhcpServer,
  RouterDhcpStaticRoute,
  RouterIpSecConfig,
  RouterIpSecEspGroup,
  RouterIpSecIkeGroup,
  RouterNtpConfig,
  RouterNtpUpstream,
  RouterPrefixList,
  RouterPrefixListRule,
  RouterStaticRoute,
  RouterStaticRouteVia,
  RouterVrfBgpConfig,
  RouterVrfBgpNeighbor,
  RouterVrfBgpNeighborAsn,
  RouterVrfBgpNeighborEnabledIpVersion,
  RouterVrfBgpNeighborSource,
  RouterVrfBgpNetwork,
  RouterVrfBgpRouteMap,
  RouterVrfConfig,
  RouterVrfDhcpConfig,
  RouterVrfDnatRule,
  RouterVrfDnatRulePriority,
  RouterVrfInterface,
  RouterVrfInterfaceWireguardPeer,
  RouterVrfIpSecOverlayNetwork,
  RouterVrfIpSecPeer,
  RouterVrfNatMatch,
  RouterVrfNatTranslation,
  RouterVrfSnatRule,
  RouterVrfSnatRulePriority,
  RouterVrfTunnel,
  RouterVrfTunnelEndpoint,
  SslCertificate,
  StatisticResult,
  StorageBlockNamespace,
  StorageBlockVolume,
  StorageBucket,
  StorageLocation,
  StorageObjectStore,
  StorageType,
  UpdateRouterVrfBgpResult,
  V3Location,
  Vpc,
  VpcBackend,
  VpcBackendTemplate,
  VpcDnatMatch,
  VpcDnatRule,
  VpcDnatTranslation,
  VpcFirewallRule,
  VpcFloatingIp,
  VpcIpReservations,
  VpcNameserver,
  VpcNameservers,
  VpcPortRange,
  VpcSnatMatch,
  VpcSnatRule,
  VpcSnatTranslation,
  VpcSshKey,
  VpcSshSettings,
  WireguardPeerAllowedIp
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

/** Request body for updating a VPC's bastion SSH settings. */
export interface UpdateVpcSshSettingsRequest {
  /** Bastion SSH port. Pass null to clear an explicit port. */
  port: number | null;
}

/** Request body for creating a VPC floating IP. */
export interface CreateVpcFloatingIpRequest {
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Reverse DNS pointer record. */
  ptr?: string;
}

/** Request body for updating a VPC floating IP. */
export interface UpdateVpcFloatingIpRequest {
  /** Reverse DNS pointer record. */
  ptr: string;
}

/** Options controlling the retry behavior of {@link V3Client.createVpcFloatingIp}. */
export interface CreateVpcFloatingIpOptions {
  /** Milliseconds between retries after a transient or not-yet-ready error. Defaults to 10000, matching the platform's own gateway boot time. */
  retryDelayMs?: number;
  /** Delay function used between retries. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
}

/** Options controlling the retry behavior of a VPC gateway apply-changes call. */
export interface ApplyVpcChangesOptions {
  /** Milliseconds between retries after a transient server error. Defaults to 10000, matching the platform's own gateway boot time. */
  retryDelayMs?: number;
  /** Delay function used between retries. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
}

/** Request body for creating a VPC gateway firewall rule. */
export interface CreateVpcFirewallRuleRequest {
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Traffic direction, "inbound" or "outbound". */
  direction: string;
  /** Protocol to match. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** CIDR network to match. */
  network?: string;
  /** Port range to match. */
  port?: VpcPortRange;
}

/** Request body for updating a VPC gateway firewall rule. */
export interface UpdateVpcFirewallRuleRequest {
  /** Traffic direction, "inbound" or "outbound". */
  direction?: string;
  /** IP version, 4 or 6. */
  ipVersion?: number;
  /** Protocol to match. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** CIDR network to match. */
  network?: string;
  /** Port range to match. */
  port?: VpcPortRange;
}

/** Where to place a VPC SNAT rule relative to existing rules. */
export interface VpcSnatRulePriority {
  /** Placement location, such as "first", "last" or "after". */
  location?: string;
  /** SNAT rule id to place this rule after, when location is "after". */
  afterSnatRuleId?: number;
}

/** Request body for creating a VPC gateway SNAT rule. */
export interface CreateVpcSnatRuleRequest {
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol to match. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** Traffic to match. */
  match?: VpcSnatMatch;
  /** Translation to apply to matched traffic. */
  translation?: VpcSnatTranslation;
  /** Placement of the new rule relative to existing rules. */
  priority?: VpcSnatRulePriority;
}

/** Request body for updating a VPC gateway SNAT rule. */
export interface UpdateVpcSnatRuleRequest {
  /** Protocol to match. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** Traffic to match. */
  match?: VpcSnatMatch;
  /** Translation to apply to matched traffic. */
  translation?: VpcSnatTranslation;
  /** Placement of the rule relative to other rules. */
  priority?: VpcSnatRulePriority;
}

/** Where to place a VPC DNAT rule relative to existing rules. */
export interface VpcDnatRulePriority {
  /** Placement location, such as "first", "last" or "after". */
  location?: string;
  /** DNAT rule id to place this rule after, when location is "after". */
  afterDnatRuleId?: number;
}

/** Request body for creating a VPC gateway DNAT rule. */
export interface CreateVpcDnatRuleRequest {
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol to match. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** Traffic to match. */
  match?: VpcDnatMatch;
  /** Translation to apply to matched traffic. */
  translation: VpcDnatTranslation;
  /** Placement of the new rule relative to existing rules. */
  priority?: VpcDnatRulePriority;
}

/** Request body for updating a VPC gateway DNAT rule. */
export interface UpdateVpcDnatRuleRequest {
  /** Protocol to match. */
  protocol?: string;
  /** Description. */
  description?: string;
  /** Traffic to match. */
  match?: VpcDnatMatch;
  /** Translation to apply to matched traffic. */
  translation?: VpcDnatTranslation;
  /** Placement of the rule relative to other rules. */
  priority?: VpcDnatRulePriority;
}

/** One backend host, as sent in a VPC backend template create or replace request. */
export interface VpcBackendInput {
  /** Backend name. */
  name?: string;
  /** Public address. */
  address?: string;
  /** Address reachable from inside the VPC. */
  internalAddress?: string;
}

/** Request body for creating a VPC backend template. */
export interface CreateVpcBackendTemplateRequest {
  /** Template name. */
  name?: string;
  /** Template description. */
  description?: string;
  /** Initial backend hosts. */
  backendHosts?: VpcBackendInput[];
}

/** Request body for updating a VPC backend template's name and description. */
export interface UpdateVpcBackendTemplateRequest {
  /** Template name. */
  name?: string;
  /** Template description. */
  description?: string;
}

/** Request body for replacing a VPC backend template's name, description and backend hosts. */
export interface ReplaceVpcBackendTemplateRequest {
  /** Template name. */
  name?: string;
  /** Template description. */
  description?: string;
  /** Backend hosts the template is replaced with. */
  backendHosts: VpcBackendInput[];
}

/** Request body for creating a VPC backend host. */
export interface CreateVpcBackendRequest {
  /** Backend name. */
  name?: string;
  /** Public address. */
  address: string;
}

/** Request body for updating a VPC backend host. */
export interface UpdateVpcBackendRequest {
  /** Backend name. */
  name?: string;
  /** Public address. */
  address?: string;
}

/** Request body for replacing every backend host in a VPC backend template. */
export interface ReplaceVpcBackendsRequest {
  /** Backend hosts the template is replaced with. */
  backendHosts: VpcBackendInput[];
}

/** Options controlling {@link V3Client.waitForVpcReady}. */
export interface WaitForVpcReadyOptions {
  /** Milliseconds between polls. Defaults to 60000, matching the platform's own build times. */
  intervalMs?: number;
  /** Maximum milliseconds to wait before giving up. Defaults to 600000. */
  timeoutMs?: number;
  /** Delay function used between polls. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
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

/** Request body for creating a storage object store. */
export interface CreateStorageObjectStoreRequest {
  /** Location id. */
  locationId: number;
  /** Object store label. */
  label: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
}

/** Request body for updating a storage object store. */
export interface UpdateStorageObjectStoreRequest {
  /** Object store label. */
  label?: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
}

/** Request body for creating a storage block namespace. */
export interface CreateStorageBlockNamespaceRequest {
  /** Location id. */
  locationId: number;
  /** Block namespace label. */
  label: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
}

/** Request body for updating a storage block namespace. */
export interface UpdateStorageBlockNamespaceRequest {
  /** Block namespace label. */
  label?: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
}

/** Request body for creating a storage block volume. */
export interface CreateStorageBlockVolumeRequest {
  /** Location id. */
  locationId: number;
  /** Block volume label. */
  label: string;
  /** Capacity in GB. */
  capacity?: number;
}

/** Request body for updating a storage block volume. */
export interface UpdateStorageBlockVolumeRequest {
  /** Block volume label. */
  label?: string;
  /** Capacity in GB. */
  capacity?: number;
}

/** Options controlling the polling behavior of the storage `waitFor*Ready` methods. */
export interface WaitForStorageReadyOptions {
  /** Milliseconds between polls. Defaults to 10000, matching the platform's own storage provisioning time. */
  intervalMs?: number;
  /** Maximum milliseconds to wait before giving up. Defaults to 120000. */
  timeoutMs?: number;
  /** Delay function used between polls. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
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

/** Request body for updating an NKE worker node's metadata. */
export interface UpdateNkeWorkerNodeRequest {
  /** Node label. */
  label?: string;
  /** Tags to apply. */
  tags?: Array<{ tagId: number }>;
}

/** Options controlling the polling behavior of {@link V3Client.waitForNkeClusterHealthy} and {@link V3Client.waitForNkeWorkerNodes}. */
export interface WaitForNkeReadyOptions {
  /** Milliseconds between polls. Defaults to 60000, matching the platform's own NKE provisioning time. */
  intervalMs?: number;
  /** Maximum milliseconds to wait before giving up. Defaults to 900000 (15 minutes). */
  timeoutMs?: number;
  /** Delay function used between polls. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
}

/** Config written to the netactuate-dns NKE addon. */
export interface NkeDnsAddonWriteConfig {
  /** Zone name to sync. */
  zone: string;
  /** Sync mode. */
  mode?: string;
}

/** Config written to the storage NKE addon. */
export interface NkeStorageAddonWriteConfig {
  /** Block namespace id backing the StorageClass. */
  blockNamespaceId?: number;
  /** Ceph pool label. */
  poolLabel?: string;
  /** Capacity in GB. */
  capacity?: number;
  /** Whether autoscaling is enabled. */
  enableAutoScaling?: boolean;
  /** StorageClass name to create in the cluster. */
  storageClassName?: string;
  /** Whether this becomes the cluster's default StorageClass. */
  makeDefault?: boolean;
  /** Reclaim policy applied to volumes. */
  reclaimPolicy?: string;
}

/**
 * Request body for installing an addon on an NKE cluster. {@link NkeDnsAddonWriteConfig} and
 * {@link NkeStorageAddonWriteConfig} satisfy the config field for the two known addon types.
 */
export interface CreateNkeClusterAddonRequest {
  /** Addon type, such as "netactuate-dns" or "storage". */
  addonType: string;
  /** Addon version. Defaults to the catalog default when omitted. */
  version?: string;
  /** Release channel. */
  channel?: string;
  /** Addon-specific config. */
  config?: Record<string, unknown>;
}

/**
 * Request body for updating an addon installed on an NKE cluster. {@link NkeDnsAddonWriteConfig}
 * and {@link NkeStorageAddonWriteConfig} satisfy the config field for the two known addon types.
 */
export interface UpdateNkeClusterAddonRequest {
  /** Addon version. */
  version?: string;
  /** Release channel. */
  channel?: string;
  /** Addon-specific config. */
  config?: Record<string, unknown>;
}

/** Request body for creating an OIDC client. */
export interface CreateOidcClientRequest {
  /** Client label. */
  label?: string;
  /** Client description. */
  description?: string;
  /** JWKS URI used to verify tokens presented to this client. */
  jwksUri?: string | null;
  /** Whether this becomes the account's default OIDC client. */
  accountDefault: boolean;
  /** Whether token issuance is restricted to the VM and bare metal allow lists. */
  enforceAllowList: boolean;
  /** Token time-to-live in seconds. */
  ttl?: number;
  /** Default audience claim issued for tokens from this client. */
  defaultAudience?: string;
}

/** Request body for updating an OIDC client. */
export interface UpdateOidcClientRequest {
  /** Client label. */
  label?: string;
  /** Client description. */
  description?: string;
  /** JWKS URI used to verify tokens presented to this client. */
  jwksUri?: string | null;
  /** Whether this becomes the account's default OIDC client. */
  accountDefault?: boolean;
  /** Whether token issuance is restricted to the VM and bare metal allow lists. */
  enforceAllowList?: boolean;
  /** Token time-to-live in seconds. */
  ttl?: number;
  /** Default audience claim issued for tokens from this client. */
  defaultAudience?: string;
}

/** Request body for adding a key to an OIDC client. */
export interface CreateOidcClientKeyRequest {
  /** Key label. */
  label?: string;
  /** Key description. */
  description?: string;
  /** Public key text. */
  publicKey: string;
}

/** Request body for updating an OIDC client key's label and description. */
export interface UpdateOidcClientKeyRequest {
  /** Key label. */
  label?: string;
  /** Key description. */
  description?: string;
}

/** Request body for creating a cloud floating IPv4 address. */
export interface CreateCloudFloatingIpv4Request {
  /** Reverse DNS pointer record. */
  ptrDomain?: string;
  /** VLAN id to bind the address to. */
  vlanId?: number;
}

/** Identifies a virtual machine for floating IPv4 grant or revoke requests. */
export interface CloudFloatingIpv4VmRef {
  /** Server package id. */
  mbpkgid: number;
}

/** Request body for granting VMs access to a cloud floating IPv4 address. */
export interface GrantCloudFloatingIpv4VmsRequest {
  /** Revokes every existing grant before applying this one. */
  revokeExisting?: boolean;
  /** VMs to grant access to. */
  vms?: CloudFloatingIpv4VmRef[];
}

/** Request body for revoking VM access to a cloud floating IPv4 address. */
export interface RevokeCloudFloatingIpv4VmsRequest {
  /** VMs to revoke access from. */
  vms?: CloudFloatingIpv4VmRef[];
}

/** A router entry supplied when creating a magic mesh. */
export interface MagicMeshRouterInput {
  /** Router id to attach at creation. */
  routerId: number;
}

/** Request body for creating a magic mesh. */
export interface CreateMagicMeshRequest {
  /** Mesh name. */
  name: string;
  /** Mesh description. */
  description?: string;
  /** Routers to attach to the mesh at creation. */
  routers?: MagicMeshRouterInput[];
}

/** Request body for updating a magic mesh. */
export interface UpdateMagicMeshRequest {
  /** Mesh name. */
  name?: string;
  /** Mesh description. */
  description?: string;
}

/** Request body for creating a cloud router. */
export interface CreateRouterRequest {
  /** Billing package id. */
  packageId: number;
  /** Location id. */
  locationId: number;
  /** Router name. */
  name?: string;
  /** Router description. */
  description?: string;
}

/** Request body for updating a cloud router's name and description. */
export interface UpdateRouterRequest {
  /** Router name. */
  name?: string;
  /** Router description. */
  description?: string;
}

/** Options controlling {@link V3Client.waitForRouterReady}. */
export interface WaitForRouterReadyOptions {
  /** Milliseconds between polls. Defaults to 10000, matching the platform's own build cadence. */
  intervalMs?: number;
  /** Maximum milliseconds to wait before giving up. Defaults to 600000 (10 minutes). */
  timeoutMs?: number;
  /**
   * Milliseconds a build may run without completing a new step before it is treated as stalled
   * rather than slow. Defaults to 300000 (5 minutes).
   */
  stallAfterMs?: number;
  /** Delay function used between polls. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
}

/** Request body for creating a VRF on a cloud router. */
export interface CreateRouterVrfRequest {
  /** VRF name. */
  name?: string;
  /** VRF description. */
  description?: string;
}

/** Request body for updating a VRF's name and description. */
export interface UpdateRouterVrfRequest {
  /** VRF name. */
  name?: string;
  /** VRF description. */
  description?: string;
}

/** Request body for updating a VRF's BGP settings. */
export interface UpdateRouterVrfBgpRequest {
  /** Networks to originate into BGP. */
  networks?: RouterVrfBgpNetwork[];
  /** Local ASN settings. */
  asn?: { local?: string };
}

/** Request body shared by creating and updating a VRF BGP neighbor. */
export interface RouterVrfBgpNeighborInput {
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

/** Request body shared by creating and updating a router static route. */
export interface RouterStaticRouteInput {
  /** Destination network in CIDR notation. */
  network: string;
  /** Next hop for the route. */
  via: RouterStaticRouteVia;
  /** Route description. */
  description?: string;
  /** Administrative distance. */
  distance?: number;
}

/** Request body shared by creating and updating a router prefix list. */
export interface RouterPrefixListInput {
  /** Prefix list name. */
  name: string;
  /** IP version the prefix list matches, 4 or 6. */
  ipVersion: number;
  /** Prefix list description. */
  description?: string;
  /** Rules evaluated in order. */
  rules: RouterPrefixListRule[];
}

/** Request body for updating a router's NTP configuration. */
export interface UpdateRouterNtpConfigRequest {
  /** Whether NTP is enabled. */
  enabled?: boolean;
  /** Interface id NTP listens on. */
  interfaceId?: number;
  /** Upstream NTP servers. */
  upstreams: RouterNtpUpstream[];
}

/** One live routing view to request for a VRF. */
export interface RouterRoutingViewSelector {
  /** View id, when refining an existing view. */
  id?: string;
  /** IP version the view covers, 4 or 6. */
  ipVersion: number;
  /** View name. */
  name: string;
  /** Filter expression restricting the view. */
  filter?: string;
}

/** Request body for fetching live routing views for a VRF. */
export interface GetRouterRoutingViewsRequest {
  /** Views to fetch. */
  views: RouterRoutingViewSelector[];
}

/** Request body for updating a cloud router's IPSec crypto configuration. */
export interface UpdateRouterIpSecConfigRequest {
  /** IKE phase 1 settings. */
  ikeGroup: RouterIpSecIkeGroup;
  /** ESP phase 2 settings. */
  espGroup: RouterIpSecEspGroup;
}

/** Request body shared by creating and updating a router VRF IPSec peer. */
export interface RouterVrfIpSecPeerInput {
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
  peerAddress?: string;
  /** Overlay network addresses carried over the tunnel. */
  overlayNetwork: RouterVrfIpSecOverlayNetwork;
}

/** Request body shared by creating and updating a router VRF interface. */
export interface RouterVrfInterfaceInput {
  /** Interface type, for example "ethernet" or "wireguard". */
  type: string;
  /** Interface name. */
  name: string;
  /** Interface description. */
  description?: string;
  /** IPv4 CIDR to assign to the interface. */
  ipv4Cidr?: string;
  /** IPv6 CIDR to assign to the interface. */
  ipv6Cidr?: string;
  /** Underlying hardware id, for an ethernet interface. */
  ethernetHardwareId?: string;
  /** Listening port, for a wireguard interface. */
  wireguardPort?: number;
}

/** Request body for creating a wireguard peer on a router VRF interface. */
export interface CreateRouterVrfInterfaceWireguardPeerRequest {
  /** Networks to route through the peer. */
  allowedIps: WireguardPeerAllowedIp[];
  /** Peer's public key. */
  publicKey?: string;
  /** Pre-shared key. */
  preSharedKey?: string;
  /** Peer name. */
  name?: string;
  /** Peer description. */
  description?: string;
  /** Remote endpoint address. */
  remote?: string;
}

/** Request body shared by creating and updating a router VRF SNAT rule. */
export interface RouterVrfSnatRuleInput {
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol to match. */
  protocol: string;
  /** Rule description. */
  description?: string;
  /** Traffic to match. */
  match?: RouterVrfNatMatch;
  /** Translation to apply to matched traffic. */
  translation?: RouterVrfNatTranslation;
  /** Placement relative to other SNAT rules on the VRF. */
  priority?: RouterVrfSnatRulePriority;
}

/** Request body shared by creating and updating a router VRF DNAT rule. */
export interface RouterVrfDnatRuleInput {
  /** IP version, 4 or 6. */
  ipVersion: number;
  /** Protocol to match. */
  protocol: string;
  /** Rule description. */
  description?: string;
  /** Traffic to match. */
  match?: RouterVrfNatMatch;
  /** Translation to apply to matched traffic. */
  translation?: RouterVrfNatTranslation;
  /** Placement relative to other DNAT rules on the VRF. */
  priority?: RouterVrfDnatRulePriority;
}

/** Request body shared by creating and updating a router VRF tunnel. */
export interface RouterVrfTunnelInput {
  /** GRE key. */
  ipKey: number;
  /** Tunnel name. */
  name: string;
  /** Tunnel description. */
  description?: string;
  /** Maximum transmission unit. */
  mtu: number;
  /** IPv4 CIDR to assign to the tunnel. */
  ipv4Cidr?: string;
  /** IPv6 CIDR to assign to the tunnel. */
  ipv6Cidr?: string;
  /** Remote endpoint of the tunnel. */
  endpointAddress: Pick<RouterVrfTunnelEndpoint, "remote">;
}

/** Request body for updating a router VRF's DHCP service configuration. */
export interface UpdateRouterVrfDhcpRequest {
  /** Whether the DHCP service is enabled. */
  enabled: boolean;
  /** Interface the DHCP service listens on. */
  interfaceId: number;
  /** Subnet served, in CIDR notation. */
  subnet: string;
  /** Default gateway to hand out to clients. */
  defaultRouterAddress?: string;
  /** Domain name to hand out to clients. */
  clientDomainName?: string;
  /** Lease timeout, in seconds. */
  leaseTimeout: number;
  /** Whether the server pings an address before leasing it. */
  doPingCheck: boolean;
  /** Address range to lease to clients. */
  range?: RouterDhcpRange;
  /** DNS servers to hand out to clients. */
  domainNameServers: RouterDhcpServer[];
  /** NTP servers to hand out to clients. */
  ntpServers: RouterDhcpServer[];
  /** Static routes to hand out to clients. */
  staticRoutes: RouterDhcpStaticRoute[];
}

/** Request body for creating an SSL certificate. */
export interface CreateSslCertificateRequest {
  /** Certificate name. */
  name: string;
  /** Certificate description. */
  description?: string;
  /** PEM-encoded certificate. */
  certificate: string;
  /** PEM-encoded private key. */
  privateKey: string;
}

/** Request body for updating an SSL certificate. */
export interface UpdateSslCertificateRequest {
  /** Certificate name. */
  name?: string;
  /** Certificate description. */
  description?: string;
  /** PEM-encoded certificate. */
  certificate?: string;
  /** PEM-encoded private key. */
  privateKey?: string;
}

/** Request body for creating or replacing a network load balancer group. */
export interface NlbGroupInput {
  /** Group name. */
  name: string;
  /** Group description. */
  description?: string;
  /** IP version the group balances. */
  ipVersion: number;
  /** Load balancing algorithm. */
  algorithm: string;
  /** Matched address. */
  match: NlbGroupMatch;
  /** Health check configuration. */
  healthCheck: NlbGroupHealthCheck;
  /** Traffic rules. */
  rules: NlbGroupRule[];
  /** Backends to attach. */
  backends: NlbGroupBackend[];
}

/** Request body for creating a network load balancer group. */
export type CreateNlbGroupRequest = NlbGroupInput;

/** Request body for replacing a network load balancer group. */
export type ReplaceNlbGroupRequest = NlbGroupInput;

/** Request body shared by creating and replacing an HTTP load balancer group. */
export interface HttpLbGroupInput {
  /** Group name. */
  name: string;
  /** Group description. */
  description?: string;
  /** Load balancing algorithm. */
  algorithm: string;
  /** Whether sticky sessions are enabled. */
  stickySessionsEnabled: boolean;
  /** Whether TLS is used from the load balancer to backends. */
  sslToBackendEnabled: boolean;
  /** Internal port backends are reached on. */
  internalPort: number;
  /** Matched address and ports. */
  match: HttpLbGroupMatch;
  /** Health check configuration. */
  healthCheck: HttpLbGroupHealthCheck;
  /** Traffic rules. */
  rules: HttpLbGroupRule[];
  /** Backends to attach. */
  backends: HttpLbGroupBackend[];
}

/** Request body for creating an HTTP load balancer group. */
export type CreateHttpLbGroupRequest = HttpLbGroupInput;

/** Request body for replacing an HTTP load balancer group. */
export type ReplaceHttpLbGroupRequest = HttpLbGroupInput;

/** Request body for replacing a VPC's DHCP nameservers with a flat list. */
export interface ReplaceVpcNameserversRequest {
  /** Nameservers to announce. */
  nameservers: VpcNameserver[];
}

/** Response from replacing a VPC's DHCP nameservers. */
export interface ReplaceVpcNameserversResponse {
  /** Nameservers now announced. */
  nameservers: VpcNameserver[];
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

  /** Lists the locations where VPCs can be created. */
  public async listVpcLocations(): Promise<V3Location[]> {
    return requireArray(await this.request("GET", "/vpcs/locations")).map(decodeLocation);
  }

  /** Adds a redundant standby gateway to a VPC. */
  public async addVpcStandbyGateway(vpcId: number): Promise<void> {
    await this.request("POST", `/vpcs/${vpcId}/gateway/standby`);
  }

  /** Removes the redundant standby gateway from a VPC. Removing an already absent one is treated as success. */
  public async deleteVpcStandbyGateway(vpcId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/gateway/standby`);
  }

  /** Gets the gateway, interface and VM IP reservations for a VPC. */
  public async getVpcIpReservations(vpcId: number): Promise<VpcIpReservations> {
    return decodeVpcIpReservations(await this.request("GET", `/vpcs/${vpcId}/ip-reservations`));
  }

  /**
   * Gets the DHCP nameservers a VPC announces.
   *
   * There is no dedicated read endpoint: `/vpcs/{id}/dhcp/nameservers` is write only and
   * answers a GET with HTTP 405, so this reads the nameservers embedded in the VPC object
   * instead.
   */
  public async getVpcNameservers(vpcId: number): Promise<VpcNameservers> {
    const vpc = await this.getVpc(vpcId);
    const dhcp = isPlainObject(vpc.raw.dhcp) ? vpc.raw.dhcp : undefined;
    return decodeVpcNameservers(dhcp?.nameservers);
  }

  /** Replaces the DHCP nameservers a VPC announces. */
  public async replaceVpcNameservers(vpcId: number, input: ReplaceVpcNameserversRequest): Promise<ReplaceVpcNameserversResponse> {
    const data = await this.request("PUT", `/vpcs/${vpcId}/dhcp/nameservers`, input);
    const row = isPlainObject(data) ? data : undefined;
    return { nameservers: decodeVpcNameserverList(row?.nameservers) };
  }

  /** Updates the DHCP nameservers a VPC announces, split by IP version. */
  public async updateVpcNameservers(vpcId: number, input: VpcNameservers): Promise<VpcNameservers> {
    const data = await this.request("PATCH", `/vpcs/${vpcId}/dhcp/nameservers`, input);
    return decodeVpcNameservers(data);
  }

  /** Gets the bastion SSH settings for a VPC. */
  public async getVpcSshSettings(vpcId: number): Promise<VpcSshSettings> {
    return decodeVpcSshSettings(await this.request("GET", `/vpcs/${vpcId}/ssh`));
  }

  /** Updates a VPC's bastion SSH settings. */
  public async updateVpcSshSettings(vpcId: number, input: UpdateVpcSshSettingsRequest): Promise<VpcSshSettings> {
    return decodeVpcSshSettings(await this.request("PATCH", `/vpcs/${vpcId}/ssh`, input));
  }

  /** Lists the SSH keys authorized for bastion access into a VPC. */
  public async listVpcSshKeys(vpcId: number): Promise<VpcSshKey[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/ssh/keys`);
    return rows.map(decodeVpcSshKey);
  }

  /**
   * Gets one VPC bastion SSH key by id.
   *
   * There is no single-key endpoint, so this lists every key authorized for the VPC and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError}
   * rather than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getVpcSshKey(vpcId: number, sshKeyId: number): Promise<VpcSshKey> {
    const keys = await this.listVpcSshKeys(vpcId);
    const key = keys.find((candidate) => candidate.id === sshKeyId || candidate.sshKeyId === sshKeyId);
    if (key === undefined) {
      throw this.notFoundError("GET", `/vpcs/${vpcId}/ssh/keys/${sshKeyId}`, `SSH key ${sshKeyId} not found in VPC ${vpcId}`);
    }
    return key;
  }

  /** Enables or disables a VPC bastion SSH key. */
  public async enableVpcSshKey(vpcId: number, sshKeyId: number, enabled: boolean): Promise<void> {
    await this.request("PATCH", `/vpcs/${vpcId}/ssh/keys/${sshKeyId}`, { enabled });
  }

  /** Removes a VPC bastion SSH key by disabling it. */
  public async deleteVpcSshKey(vpcId: number, sshKeyId: number): Promise<void> {
    await this.enableVpcSshKey(vpcId, sshKeyId, false);
  }

  /**
   * Creates a VPC floating IP and returns its id.
   *
   * Retries when the platform reports a transient server error or that the VPC's gateway is
   * not yet ready, both of which can happen briefly right after a VPC is created.
   */
  public async createVpcFloatingIp(vpcId: number, input: CreateVpcFloatingIpRequest, options: CreateVpcFloatingIpOptions = {}): Promise<number> {
    const maxAttempts = 7;
    const retryDelayMs = options.retryDelayMs ?? 10_000;
    const sleep = options.sleep ?? delay;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const row = requireObject(await this.request("POST", `/vpcs/${vpcId}/floating-ips`, input));
        return numberField(row, "floatingIpId");
      } catch (error) {
        lastError = error;
        if (!isTransientServerError(error) && !isVpcNotReadyError(error)) {
          throw error;
        }
        if (attempt < maxAttempts - 1) {
          await sleep(retryDelayMs);
        }
      }
    }
    throw lastError;
  }

  /**
   * Gets one VPC floating IP by id.
   *
   * There is no single-floating-IP endpoint, so this lists every floating IP on the VPC and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError}
   * rather than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getVpcFloatingIp(vpcId: number, floatingIpId: number): Promise<VpcFloatingIp> {
    const floatingIps = await this.listVpcFloatingIps(vpcId);
    const floatingIp = floatingIps.find((candidate) => candidate.floatingIpId === floatingIpId);
    if (floatingIp === undefined) {
      throw this.notFoundError("GET", `/vpcs/${vpcId}/floating-ips/${floatingIpId}`, `floating IP ${floatingIpId} not found in VPC ${vpcId}`);
    }
    return floatingIp;
  }

  /** Updates a VPC floating IP's reverse DNS pointer record. */
  public async updateVpcFloatingIp(vpcId: number, floatingIpId: number, input: UpdateVpcFloatingIpRequest): Promise<void> {
    await this.request("PATCH", `/vpcs/${vpcId}/floating-ips/${floatingIpId}`, input);
  }

  /** Deletes a VPC floating IP. Deleting an already absent floating IP is treated as success. */
  public async deleteVpcFloatingIp(vpcId: number, floatingIpId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/floating-ips/${floatingIpId}`);
  }

  /** Lists a VPC's floating IPs and follows vAPI3 pagination to the end. */
  public async listVpcFloatingIps(vpcId: number): Promise<VpcFloatingIp[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/floating-ips`);
    return rows.map(decodeVpcFloatingIp);
  }

  /** Creates a VPC gateway firewall rule and returns its id. */
  public async createVpcFirewallRule(vpcId: number, input: CreateVpcFirewallRuleRequest): Promise<number> {
    const row = requireObject(await this.request("POST", `/vpcs/${vpcId}/gateway/rules/firewall`, input));
    return numberField(row, "firewallRuleId");
  }

  /** Lists every firewall rule on a VPC gateway, across both IP versions, following vAPI3 pagination to the end. */
  public async listVpcFirewallRulesAll(vpcId: number): Promise<VpcFirewallRule[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/gateway/rules/firewall`);
    return rows.map(decodeVpcFirewallRule);
  }

  /** Lists a VPC gateway's firewall rules for one IP version and follows vAPI3 pagination to the end. */
  public async listVpcFirewallRules(vpcId: number, ipVersion: number): Promise<VpcFirewallRule[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/gateway/rules/firewall/ipv${ipVersion}`);
    return rows.map(decodeVpcFirewallRule);
  }

  /**
   * Gets one VPC gateway firewall rule by id.
   *
   * There is no single-rule endpoint, so this lists the rules for the given IP version and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError}
   * rather than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getVpcFirewallRule(vpcId: number, ruleId: number, ipVersion: number): Promise<VpcFirewallRule> {
    const rules = await this.listVpcFirewallRules(vpcId, ipVersion);
    const rule = rules.find((candidate) => candidate.firewallRuleId === ruleId);
    if (rule === undefined) {
      throw this.notFoundError(
        "GET",
        `/vpcs/${vpcId}/gateway/rules/firewall/ipv${ipVersion}/${ruleId}`,
        `firewall rule ${ruleId} not found in VPC ${vpcId}`
      );
    }
    return rule;
  }

  /** Updates a VPC gateway firewall rule. */
  public async updateVpcFirewallRule(vpcId: number, ruleId: number, input: UpdateVpcFirewallRuleRequest): Promise<VpcFirewallRule> {
    return decodeVpcFirewallRule(await this.request("PATCH", `/vpcs/${vpcId}/gateway/rules/firewall/${ruleId}`, input));
  }

  /** Deletes a VPC gateway firewall rule. Deleting an already absent rule is treated as success. */
  public async deleteVpcFirewallRule(vpcId: number, ruleId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/gateway/rules/firewall/${ruleId}`);
  }

  /**
   * Applies pending firewall rule changes to a VPC's gateway.
   *
   * Retries when the platform reports a transient server error, which can happen briefly
   * while the gateway VM is still initializing right after VPC creation.
   */
  public async applyVpcFirewallChanges(vpcId: number, options: ApplyVpcChangesOptions = {}): Promise<void> {
    await this.postWithRetry(`/vpcs/${vpcId}/gateway/rules/firewall/apply-changes`, 6, options);
  }

  /** Creates a VPC gateway SNAT rule. */
  public async createVpcSnatRule(vpcId: number, input: CreateVpcSnatRuleRequest): Promise<VpcSnatRule> {
    return decodeVpcSnatRule(await this.request("POST", `/vpcs/${vpcId}/gateway/rules/snat`, input));
  }

  /** Lists every SNAT rule on a VPC gateway, across both IP versions, following vAPI3 pagination to the end. */
  public async listVpcSnatRulesAll(vpcId: number): Promise<VpcSnatRule[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/gateway/rules/snat`);
    return rows.map(decodeVpcSnatRule);
  }

  /** Lists a VPC gateway's SNAT rules for one IP version and follows vAPI3 pagination to the end. */
  public async listVpcSnatRules(vpcId: number, ipVersion: number): Promise<VpcSnatRule[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/gateway/rules/snat/ipv${ipVersion}`);
    return rows.map(decodeVpcSnatRule);
  }

  /**
   * Gets one VPC gateway SNAT rule by id.
   *
   * There is no single-rule endpoint, so this lists the rules for the given IP version and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError}
   * rather than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getVpcSnatRule(vpcId: number, ruleId: number, ipVersion: number): Promise<VpcSnatRule> {
    const rules = await this.listVpcSnatRules(vpcId, ipVersion);
    const rule = rules.find((candidate) => candidate.snatRuleId === ruleId);
    if (rule === undefined) {
      throw this.notFoundError(
        "GET",
        `/vpcs/${vpcId}/gateway/rules/snat/ipv${ipVersion}/${ruleId}`,
        `SNAT rule ${ruleId} not found in VPC ${vpcId}`
      );
    }
    return rule;
  }

  /** Updates a VPC gateway SNAT rule. */
  public async updateVpcSnatRule(vpcId: number, ruleId: number, input: UpdateVpcSnatRuleRequest): Promise<VpcSnatRule> {
    return decodeVpcSnatRule(await this.request("PATCH", `/vpcs/${vpcId}/gateway/rules/snat/${ruleId}`, input));
  }

  /** Deletes a VPC gateway SNAT rule. Deleting an already absent rule is treated as success. */
  public async deleteVpcSnatRule(vpcId: number, ruleId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/gateway/rules/snat/${ruleId}`);
  }

  /**
   * Applies pending SNAT rule changes to a VPC's gateway.
   *
   * Retries when the platform reports a transient server error, which can happen briefly
   * while the gateway VM is still initializing right after VPC creation.
   */
  public async applyVpcSnatChanges(vpcId: number, options: ApplyVpcChangesOptions = {}): Promise<void> {
    await this.postWithRetry(`/vpcs/${vpcId}/gateway/rules/snat/apply-changes`, 6, options);
  }

  /** Creates a VPC gateway DNAT rule. */
  public async createVpcDnatRule(vpcId: number, input: CreateVpcDnatRuleRequest): Promise<VpcDnatRule> {
    return decodeVpcDnatRule(await this.request("POST", `/vpcs/${vpcId}/gateway/rules/dnat`, input));
  }

  /** Lists every DNAT rule on a VPC gateway, across both IP versions, following vAPI3 pagination to the end. */
  public async listVpcDnatRulesAll(vpcId: number): Promise<VpcDnatRule[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/gateway/rules/dnat`);
    return rows.map(decodeVpcDnatRule);
  }

  /** Lists a VPC gateway's DNAT rules for one IP version and follows vAPI3 pagination to the end. */
  public async listVpcDnatRules(vpcId: number, ipVersion: number): Promise<VpcDnatRule[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/gateway/rules/dnat/ipv${ipVersion}`);
    return rows.map(decodeVpcDnatRule);
  }

  /**
   * Gets one VPC gateway DNAT rule by id.
   *
   * There is no single-rule endpoint, so this lists the rules for the given IP version and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError}
   * rather than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getVpcDnatRule(vpcId: number, ruleId: number, ipVersion: number): Promise<VpcDnatRule> {
    const rules = await this.listVpcDnatRules(vpcId, ipVersion);
    const rule = rules.find((candidate) => candidate.dnatRuleId === ruleId);
    if (rule === undefined) {
      throw this.notFoundError(
        "GET",
        `/vpcs/${vpcId}/gateway/rules/dnat/ipv${ipVersion}/${ruleId}`,
        `DNAT rule ${ruleId} not found in VPC ${vpcId}`
      );
    }
    return rule;
  }

  /** Updates a VPC gateway DNAT rule. */
  public async updateVpcDnatRule(vpcId: number, ruleId: number, input: UpdateVpcDnatRuleRequest): Promise<VpcDnatRule> {
    return decodeVpcDnatRule(await this.request("PATCH", `/vpcs/${vpcId}/gateway/rules/dnat/${ruleId}`, input));
  }

  /** Deletes a VPC gateway DNAT rule. Deleting an already absent rule is treated as success. */
  public async deleteVpcDnatRule(vpcId: number, ruleId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/gateway/rules/dnat/${ruleId}`);
  }

  /**
   * Applies pending DNAT rule changes to a VPC's gateway.
   *
   * Retries when the platform reports a transient server error, which can happen briefly
   * while the gateway VM is still initializing right after VPC creation.
   */
  public async applyVpcDnatChanges(vpcId: number, options: ApplyVpcChangesOptions = {}): Promise<void> {
    await this.postWithRetry(`/vpcs/${vpcId}/gateway/rules/dnat/apply-changes`, 6, options);
  }

  /**
   * Waits for a VPC to reach the "Running" status.
   *
   * Polls {@link V3Client.getVpc} at `intervalMs` (default 60 seconds) until the VPC is
   * running or `timeoutMs` (default 10 minutes) elapses, at which point it throws.
   */
  public async waitForVpcReady(vpcId: number, options: WaitForVpcReadyOptions = {}): Promise<void> {
    const intervalMs = options.intervalMs ?? 60_000;
    const timeoutMs = options.timeoutMs ?? 600_000;
    const sleep = options.sleep ?? delay;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const vpc = await this.getVpc(vpcId);
      if (vpc.metadata.status === "Running") {
        return;
      }
      if (Date.now() >= deadline) {
        throw new Error(`timeout waiting for VPC ${vpcId} to become ready after ${timeoutMs}ms`);
      }
      await sleep(intervalMs);
    }
  }

  /** Creates a VPC backend template. */
  public async createVpcBackendTemplate(vpcId: number, input: CreateVpcBackendTemplateRequest): Promise<VpcBackendTemplate> {
    return decodeVpcBackendTemplate(await this.request("POST", `/vpcs/${vpcId}/backend-templates`, input));
  }

  /** Gets one VPC backend template. */
  public async getVpcBackendTemplate(vpcId: number, templateId: number): Promise<VpcBackendTemplate> {
    return decodeVpcBackendTemplate(await this.request("GET", `/vpcs/${vpcId}/backend-templates/${templateId}`));
  }

  /** Lists a VPC's backend templates and follows vAPI3 pagination to the end. */
  public async listVpcBackendTemplates(vpcId: number): Promise<VpcBackendTemplate[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/backend-templates`);
    return rows.map(decodeVpcBackendTemplate);
  }

  /** Updates a VPC backend template's name and description. */
  public async updateVpcBackendTemplate(vpcId: number, templateId: number, input: UpdateVpcBackendTemplateRequest): Promise<VpcBackendTemplate> {
    return decodeVpcBackendTemplate(await this.request("PATCH", `/vpcs/${vpcId}/backend-templates/${templateId}`, input));
  }

  /** Replaces a VPC backend template's name, description and backend hosts. */
  public async replaceVpcBackendTemplate(vpcId: number, templateId: number, input: ReplaceVpcBackendTemplateRequest): Promise<VpcBackendTemplate> {
    return decodeVpcBackendTemplate(await this.request("PUT", `/vpcs/${vpcId}/backend-templates/${templateId}`, input));
  }

  /** Deletes a VPC backend template. Deleting an already absent template is treated as success. */
  public async deleteVpcBackendTemplate(vpcId: number, templateId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/backend-templates/${templateId}`);
  }

  /** Creates a backend host in a VPC backend template. */
  public async createVpcBackend(vpcId: number, templateId: number, input: CreateVpcBackendRequest): Promise<VpcBackend> {
    return decodeVpcBackend(await this.request("POST", `/vpcs/${vpcId}/backend-templates/${templateId}/backends`, input));
  }

  /**
   * Replaces every backend host in a VPC backend template.
   *
   * The endpoint returns an object carrying the backend hosts, not a bare array, so the
   * response is decoded into that wrapper and its list is returned.
   */
  public async replaceVpcBackends(vpcId: number, templateId: number, input: ReplaceVpcBackendsRequest): Promise<VpcBackend[]> {
    const data = requireObject(await this.request("PUT", `/vpcs/${vpcId}/backend-templates/${templateId}/backends`, input));
    if (!Array.isArray(data.backendHosts)) {
      throw new Error("replace VPC backends response is missing the backendHosts array");
    }
    return data.backendHosts.map(decodeVpcBackend);
  }

  /** Lists the backend hosts in a VPC backend template and follows vAPI3 pagination to the end. */
  public async listVpcBackends(vpcId: number, templateId: number): Promise<VpcBackend[]> {
    const rows = await this.getList(`/vpcs/${vpcId}/backend-templates/${templateId}/backends`);
    return rows.map(decodeVpcBackend);
  }

  /**
   * Gets one backend host by id.
   *
   * There is no single-backend endpoint, so this lists every backend in the template and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError}
   * rather than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getVpcBackend(vpcId: number, templateId: number, backendId: number): Promise<VpcBackend> {
    const backends = await this.listVpcBackends(vpcId, templateId);
    const backend = backends.find((candidate) => candidate.backendHostId === backendId);
    if (backend === undefined) {
      throw this.notFoundError(
        "GET",
        `/vpcs/${vpcId}/backend-templates/${templateId}/backends/${backendId}`,
        `backend ${backendId} not found in template ${templateId} VPC ${vpcId}`
      );
    }
    return backend;
  }

  /** Updates a VPC backend host's name and address. */
  public async updateVpcBackend(vpcId: number, templateId: number, backendId: number, input: UpdateVpcBackendRequest): Promise<VpcBackend> {
    return decodeVpcBackend(await this.request("PATCH", `/vpcs/${vpcId}/backend-templates/${templateId}/backends/${backendId}`, input));
  }

  /** Deletes a VPC backend host. Deleting an already absent host is treated as success. */
  public async deleteVpcBackend(vpcId: number, templateId: number, backendId: number): Promise<void> {
    await this.deleteIdempotent(`/vpcs/${vpcId}/backend-templates/${templateId}/backends/${backendId}`);
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

  /** Converts a storage bucket into an object store and returns the new object store's id. */
  public async convertStorageBucketToStore(bucketId: number): Promise<number> {
    const row = requireObject(await this.request("POST", `/storage/buckets/${bucketId}/convert-to-store`));
    return numberField(row, "objectStoreId");
  }

  /**
   * Waits for a storage bucket to report ready.
   *
   * Polls {@link V3Client.getStorageBucket} at `intervalMs` (default 10 seconds) until the
   * bucket is ready or `timeoutMs` (default 2 minutes) elapses, at which point it throws.
   */
  public async waitForStorageBucketReady(bucketId: number, options: WaitForStorageReadyOptions = {}): Promise<void> {
    await this.waitForStorageReady(
      () => this.getStorageBucket(bucketId),
      (bucket) => bucket.metadata.ready === true,
      `storage bucket ${bucketId}`,
      options
    );
  }

  /** Lists the storage types available to the account. */
  public async listStorageTypes(): Promise<StorageType[]> {
    return decodeStorageTypes(await this.request("GET", "/storage"));
  }

  /** Creates a storage object store and returns its id. */
  public async createStorageObjectStore(input: CreateStorageObjectStoreRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/storage/object-stores", input));
    return numberField(row, "objectStoreId");
  }

  /** Lists storage object stores and follows vAPI3 pagination to the end. */
  public async listStorageObjectStores(): Promise<StorageObjectStore[]> {
    const rows = await this.getList("/storage/object-stores?limit=1000");
    return rows.map(decodeStorageObjectStore);
  }

  /** Gets one storage object store. */
  public async getStorageObjectStore(objectStoreId: number): Promise<StorageObjectStore> {
    return decodeStorageObjectStore(await this.request("GET", `/storage/object-stores/${objectStoreId}`));
  }

  /** Updates a storage object store. */
  public async updateStorageObjectStore(objectStoreId: number, input: UpdateStorageObjectStoreRequest): Promise<void> {
    await this.request("PATCH", `/storage/object-stores/${objectStoreId}`, input);
  }

  /** Deletes a storage object store. Deleting an already absent object store is treated as success. */
  public async deleteStorageObjectStore(objectStoreId: number): Promise<void> {
    await this.deleteIdempotent(`/storage/object-stores/${objectStoreId}`);
  }

  /**
   * Waits for a storage object store to report ready.
   *
   * Polls {@link V3Client.getStorageObjectStore} at `intervalMs` (default 10 seconds) until
   * the object store is ready or `timeoutMs` (default 2 minutes) elapses, at which point it
   * throws.
   */
  public async waitForStorageObjectStoreReady(objectStoreId: number, options: WaitForStorageReadyOptions = {}): Promise<void> {
    await this.waitForStorageReady(
      () => this.getStorageObjectStore(objectStoreId),
      (store) => store.metadata.ready === true,
      `storage object store ${objectStoreId}`,
      options
    );
  }

  /** Creates a storage block namespace and returns its id. */
  public async createStorageBlockNamespace(input: CreateStorageBlockNamespaceRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/storage/block-namespaces", input));
    return numberField(row, "blockNamespaceId");
  }

  /** Lists storage block namespaces and follows vAPI3 pagination to the end. */
  public async listStorageBlockNamespaces(): Promise<StorageBlockNamespace[]> {
    const rows = await this.getList("/storage/block-namespaces?limit=1000");
    return rows.map(decodeStorageBlockNamespace);
  }

  /** Gets one storage block namespace. */
  public async getStorageBlockNamespace(blockNamespaceId: number): Promise<StorageBlockNamespace> {
    return decodeStorageBlockNamespace(await this.request("GET", `/storage/block-namespaces/${blockNamespaceId}`));
  }

  /** Updates a storage block namespace. */
  public async updateStorageBlockNamespace(blockNamespaceId: number, input: UpdateStorageBlockNamespaceRequest): Promise<void> {
    await this.request("PATCH", `/storage/block-namespaces/${blockNamespaceId}`, input);
  }

  /** Deletes a storage block namespace. Deleting an already absent block namespace is treated as success. */
  public async deleteStorageBlockNamespace(blockNamespaceId: number): Promise<void> {
    await this.deleteIdempotent(`/storage/block-namespaces/${blockNamespaceId}`);
  }

  /**
   * Waits for a storage block namespace to report ready.
   *
   * Polls {@link V3Client.getStorageBlockNamespace} at `intervalMs` (default 10 seconds)
   * until the block namespace is ready or `timeoutMs` (default 2 minutes) elapses, at which
   * point it throws.
   */
  public async waitForStorageBlockNamespaceReady(blockNamespaceId: number, options: WaitForStorageReadyOptions = {}): Promise<void> {
    await this.waitForStorageReady(
      () => this.getStorageBlockNamespace(blockNamespaceId),
      (namespace) => namespace.metadata.ready === true,
      `storage block namespace ${blockNamespaceId}`,
      options
    );
  }

  /** Creates a storage block volume and returns its id. */
  public async createStorageBlockVolume(input: CreateStorageBlockVolumeRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/storage/block-volumes", input));
    return numberField(row, "blockVolumeId");
  }

  /** Lists every storage block volume on the account, following vAPI3 pagination to the end. */
  public async listStorageBlockVolumes(): Promise<StorageBlockVolume[]> {
    const rows = await this.getList("/storage/block-volumes");
    return rows.map(decodeStorageBlockVolume);
  }

  /**
   * Gets one storage block volume.
   *
   * PLATFORM DEFECT, worked around here. The single-volume GET endpoint returns object-store
   * shaped metadata for a block volume: objectStoreId, private and versioning, and no
   * blockVolumeId at all, so {@link decodeStorageBlockVolume} decodes the id as 0. The list
   * endpoint reports blockVolumeId correctly, so a caller cannot match a volume decoded from
   * this GET back to the resource it asked for.
   *
   * The GET still succeeded for the id that was requested, and its label and location match
   * that volume, so the requested id is filled in rather than left at zero. When the platform
   * fixes the endpoint this branch simply stops firing.
   */
  public async getStorageBlockVolume(blockVolumeId: number): Promise<StorageBlockVolume> {
    const volume = decodeStorageBlockVolume(await this.request("GET", `/storage/block-volumes/${blockVolumeId}`));
    if (volume.metadata.blockVolumeId !== 0) {
      return volume;
    }
    return { ...volume, metadata: { ...volume.metadata, blockVolumeId } };
  }

  /** Updates a storage block volume. */
  public async updateStorageBlockVolume(blockVolumeId: number, input: UpdateStorageBlockVolumeRequest): Promise<void> {
    await this.request("PATCH", `/storage/block-volumes/${blockVolumeId}`, input);
  }

  /** Deletes a storage block volume. Deleting an already absent block volume is treated as success. */
  public async deleteStorageBlockVolume(blockVolumeId: number): Promise<void> {
    await this.deleteIdempotent(`/storage/block-volumes/${blockVolumeId}`);
  }

  /**
   * Waits for a storage block volume to report ready.
   *
   * Polls {@link V3Client.getStorageBlockVolume} at `intervalMs` (default 10 seconds) until
   * the block volume is ready or `timeoutMs` (default 2 minutes) elapses, at which point it
   * throws.
   */
  public async waitForStorageBlockVolumeReady(blockVolumeId: number, options: WaitForStorageReadyOptions = {}): Promise<void> {
    await this.waitForStorageReady(
      () => this.getStorageBlockVolume(blockVolumeId),
      (volume) => volume.metadata.ready === true,
      `storage block volume ${blockVolumeId}`,
      options
    );
  }

  /** Lists the locations where storage can be provisioned, paired with the hardware class serving each one. */
  public async listStorageLocations(): Promise<StorageLocation[]> {
    return requireArray(await this.request("GET", "/storage/locations")).map(decodeStorageLocation);
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

  /** Creates secure access URLs for an NKE cluster's API, Prometheus and dashboard endpoints. */
  public async createNkeAccessUrls(clusterId: number): Promise<NkeAccessUrls> {
    return decodeNkeAccessUrls(await this.request("POST", `/nke/clusters/${clusterId}/create-access-urls`));
  }

  /** Lists an NKE cluster's activity log and follows vAPI3 pagination to the end. */
  public async listNkeClusterLogs(clusterId: number): Promise<NkeLogEntry[]> {
    const rows = await this.getList(`/nke/clusters/${clusterId}/logs`);
    return rows.map(decodeNkeLogEntry);
  }

  /** Lists an NKE cluster's worker nodes and follows vAPI3 pagination to the end. */
  public async listNkeWorkerNodes(clusterId: number): Promise<NkeWorkerNode[]> {
    const rows = await this.getList(`/nke/clusters/${clusterId}/worker-nodes`);
    return rows.map(decodeNkeWorkerNode);
  }

  /** Gets one NKE worker node. */
  public async getNkeWorkerNode(clusterId: number, workerNodeId: number): Promise<NkeWorkerNode> {
    return decodeNkeWorkerNode(await this.request("GET", `/nke/clusters/${clusterId}/worker-nodes/${workerNodeId}`));
  }

  /** Updates an NKE worker node's label and tags. */
  public async updateNkeWorkerNode(clusterId: number, workerNodeId: number, input: UpdateNkeWorkerNodeRequest): Promise<NkeWorkerNode> {
    return decodeNkeWorkerNode(await this.request("PATCH", `/nke/clusters/${clusterId}/worker-nodes/${workerNodeId}`, input));
  }

  /** Deletes an NKE worker node. Deleting an already absent node is treated as success. */
  public async deleteNkeWorkerNode(clusterId: number, workerNodeId: number): Promise<void> {
    await this.deleteIdempotent(`/nke/clusters/${clusterId}/worker-nodes/${workerNodeId}`);
  }

  /**
   * Waits for an NKE cluster to report at least `minimum` worker nodes.
   *
   * A cluster reports Healthy before its worker nodes appear in the worker node listing, so a
   * caller that reads the nodes as soon as creation returns can see an empty list for a cluster
   * that is about to have several. Waiting on the nodes themselves closes that window.
   */
  public async waitForNkeWorkerNodes(clusterId: number, minimum: number, options: WaitForNkeReadyOptions = {}): Promise<void> {
    if (minimum <= 0) {
      return;
    }
    const intervalMs = options.intervalMs ?? 60_000;
    const timeoutMs = options.timeoutMs ?? 900_000;
    const sleep = options.sleep ?? delay;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const nodes = await this.listNkeWorkerNodes(clusterId);
      if (nodes.length >= minimum) {
        return;
      }
      if (Date.now() >= deadline) {
        throw new Error(`timeout waiting for NKE cluster ${clusterId} to report ${minimum} worker nodes after ${timeoutMs}ms`);
      }
      await sleep(intervalMs);
    }
  }

  /**
   * Waits for an NKE cluster to reach the "Healthy" status.
   *
   * Throws immediately when the cluster reports "Failed" or "Error" rather than waiting out
   * the full timeout on a cluster that is not going to recover.
   */
  public async waitForNkeClusterHealthy(clusterId: number, options: WaitForNkeReadyOptions = {}): Promise<void> {
    const intervalMs = options.intervalMs ?? 60_000;
    const timeoutMs = options.timeoutMs ?? 900_000;
    const sleep = options.sleep ?? delay;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const cluster = await this.getNkeCluster(clusterId);
      const status = typeof cluster.status?.cluster === "string" ? cluster.status.cluster : undefined;
      if (status === "Failed" || status === "Error") {
        throw new Error(`NKE cluster ${clusterId} entered failed state: ${status}`);
      }
      if (status === "Healthy") {
        return;
      }
      if (Date.now() >= deadline) {
        throw new Error(`timeout waiting for NKE cluster ${clusterId} to become healthy after ${timeoutMs}ms`);
      }
      await sleep(intervalMs);
    }
  }

  /** Lists the addons available to install on NKE clusters. */
  public async listNkeAddonCatalog(): Promise<NkeAddonCatalogEntry[]> {
    const rows = await this.getList("/nke/addons");
    return rows.map(decodeNkeAddonCatalogEntry);
  }

  /** Lists the addons installed on an NKE cluster and follows vAPI3 pagination to the end. */
  public async listNkeClusterAddons(clusterId: number): Promise<NkeAddon[]> {
    const rows = await this.getList(`/nke/clusters/${clusterId}/addons`);
    return rows.map(decodeNkeAddon);
  }

  /** Gets one addon installed on an NKE cluster. */
  public async getNkeClusterAddon(clusterId: number, addonType: string): Promise<NkeAddon> {
    return decodeNkeAddon(await this.request("GET", `/nke/clusters/${clusterId}/addons/${addonType}`));
  }

  /** Installs an addon on an NKE cluster. */
  public async createNkeClusterAddon(clusterId: number, input: CreateNkeClusterAddonRequest): Promise<NkeAddon> {
    return decodeNkeAddon(await this.request("POST", `/nke/clusters/${clusterId}/addons`, input));
  }

  /** Updates an addon installed on an NKE cluster. */
  public async updateNkeClusterAddon(clusterId: number, addonType: string, input: UpdateNkeClusterAddonRequest): Promise<NkeAddon> {
    return decodeNkeAddon(await this.request("PATCH", `/nke/clusters/${clusterId}/addons/${addonType}`, input));
  }

  /** Removes an addon from an NKE cluster. Removing an already absent addon is treated as success. */
  public async deleteNkeClusterAddon(clusterId: number, addonType: string): Promise<void> {
    await this.deleteIdempotent(`/nke/clusters/${clusterId}/addons/${addonType}`);
  }

  /** Lists the DNS zones attached to an NKE cluster through the netactuate-dns addon. */
  public async listNkeClusterDnsZones(clusterId: number): Promise<NkeClusterDnsZone[]> {
    const rows = await this.getList(`/nke/clusters/${clusterId}/dns-zones`);
    return rows.map(decodeNkeClusterDnsZone);
  }

  /** Creates an OIDC client and returns its id. */
  public async createOidcClient(input: CreateOidcClientRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/oidc/clients", input));
    return numberField(row, "clientId");
  }

  /** Lists OIDC clients and follows vAPI3 pagination to the end. */
  public async listOidcClients(): Promise<OidcClient[]> {
    return this.listOidcClientsPage("/oidc/clients?limit=1000");
  }

  /**
   * Gets one OIDC client by id.
   *
   * The single-client endpoint returns creation metadata plus the client's keys and logs, but
   * not the account-default, audience, TTL or allow-list-enforcement fields, which only the
   * list endpoint carries. Both are fetched and merged, with the detail endpoint's fields
   * taking precedence where both provide one. When no client in the list has this id, throws
   * {@link NetActuateNotFoundError} rather than returning a zero-valued client.
   */
  public async getOidcClient(clientId: number): Promise<OidcClient> {
    const detail = decodeOidcClientDetail(await this.request("GET", `/oidc/clients/${clientId}`));
    const clients = await this.listOidcClients();
    const client = clients.find((candidate) => candidate.clientId === clientId);
    if (client === undefined) {
      throw this.notFoundError("GET", `/oidc/clients/${clientId}`, `OIDC client ${clientId} not found in client list`);
    }
    return {
      ...client,
      createdOn: detail.createdOn,
      lastUsedOn: detail.lastUsedOn,
      label: detail.label ?? "",
      description: detail.description,
      jwksUri: detail.jwksUri,
      keys: detail.keys,
      authLogs: detail.authLogs,
      changeLogs: detail.changeLogs
    };
  }

  /** Updates an OIDC client. */
  public async updateOidcClient(clientId: number, input: UpdateOidcClientRequest): Promise<void> {
    await this.request("PATCH", `/oidc/clients/${clientId}`, input);
  }

  /** Deletes an OIDC client. Deleting an already absent client is treated as success. */
  public async deleteOidcClient(clientId: number): Promise<void> {
    await this.deleteIdempotent(`/oidc/clients/${clientId}`);
  }

  /** Adds keys to an OIDC client and returns the created keys. */
  public async createOidcClientKeys(clientId: number, keys: CreateOidcClientKeyRequest[]): Promise<OidcClientKey[]> {
    const row = requireObject(await this.request("POST", `/oidc/clients/${clientId}/keys`, { keys }));
    if (!Array.isArray(row.keys)) {
      throw new Error("create OIDC client keys response is missing the keys array");
    }
    return row.keys.map(decodeOidcClientKey);
  }

  /** Lists an OIDC client's keys and follows vAPI3 pagination to the end. */
  public async getOidcClientKeys(clientId: number): Promise<OidcClientKey[]> {
    const rows = await this.getList(`/oidc/clients/${clientId}/keys?limit=1000`);
    return rows.map(decodeOidcClientKey);
  }

  /** Updates an OIDC client key's label and description. */
  public async updateOidcClientKey(clientId: number, keyId: number, input: UpdateOidcClientKeyRequest): Promise<void> {
    await this.request("PATCH", `/oidc/clients/${clientId}/keys/${keyId}`, input);
  }

  /**
   * Revokes an OIDC client key.
   *
   * Revoking an already-revoked key is treated as success. The platform answers a repeat
   * revoke with HTTP 400 "the key is revoked" rather than 404, so that response is recognized
   * as idempotent alongside an outright not found.
   */
  public async deleteOidcClientKey(clientId: number, keyId: number): Promise<void> {
    try {
      await this.request("DELETE", `/oidc/clients/${clientId}/keys/${keyId}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError || isOidcKeyAlreadyRevokedError(error)) {
        return;
      }
      throw error;
    }
  }

  /** Allows virtual machines to authenticate against an OIDC client. */
  public async addOidcClientVms(clientId: number, mbpkgids: number[]): Promise<void> {
    await this.request("POST", `/oidc/clients/${clientId}/allow-list/vms`, { vms: mbpkgids.map((mbpkgid) => ({ mbpkgid })) });
  }

  /** Allows bare metal servers to authenticate against an OIDC client. */
  public async addOidcClientBareMetalServers(clientId: number, mbpkgids: number[]): Promise<void> {
    await this.request("POST", `/oidc/clients/${clientId}/allow-list/bare-metal`, { servers: mbpkgids.map((mbpkgid) => ({ mbpkgid })) });
  }

  /** Revokes a VM's access to an OIDC client. Revoking an already absent grant is treated as success. */
  public async removeOidcClientVm(clientId: number, mbpkgid: number): Promise<void> {
    await this.deleteIdempotent(`/oidc/clients/${clientId}/allow-list/vms/${mbpkgid}`);
  }

  /** Revokes a bare metal server's access to an OIDC client. Revoking an already absent grant is treated as success. */
  public async removeOidcClientBareMetalServer(clientId: number, mbpkgid: number): Promise<void> {
    await this.deleteIdempotent(`/oidc/clients/${clientId}/allow-list/bare-metal/${mbpkgid}`);
  }

  /** Lists the VMs allowed to authenticate against an OIDC client. */
  public async getOidcClientVms(clientId: number): Promise<OidcClientVm[]> {
    const row = requireObject(await this.request("GET", `/oidc/clients/${clientId}/allow-list/vms`));
    if (!Array.isArray(row.vms)) {
      throw new Error("get OIDC client VMs response is missing the vms array");
    }
    return row.vms.map(decodeOidcClientVm);
  }

  /** Lists the bare metal servers allowed to authenticate against an OIDC client. */
  public async getOidcClientBareMetalServers(clientId: number): Promise<OidcClientBareMetalServer[]> {
    const row = requireObject(await this.request("GET", `/oidc/clients/${clientId}/allow-list/bare-metal`));
    if (!Array.isArray(row.servers)) {
      throw new Error("get OIDC client bare metal servers response is missing the servers array");
    }
    return row.servers.map(decodeOidcClientBareMetalServer);
  }

  /** Lists an OIDC client's authentication logs and follows vAPI3 pagination to the end. */
  public async getOidcClientAuthLogs(clientId: number): Promise<OidcClientAuthLog[]> {
    const rows = await this.getList(`/oidc/clients/${clientId}/auth-logs?limit=1000`);
    return rows.map(decodeOidcClientAuthLog);
  }

  /** Lists an OIDC client's key change logs and follows vAPI3 pagination to the end. */
  public async getOidcClientChangeLogs(clientId: number): Promise<OidcClientChangeLog[]> {
    const rows = await this.getList(`/oidc/clients/${clientId}/change-logs?limit=1000`);
    return rows.map(decodeOidcClientChangeLog);
  }

  /** Lists cloud floating IPv4 addresses and follows vAPI3 pagination to the end. */
  public async listCloudFloatingIpv4(): Promise<CloudFloatingIpv4[]> {
    const rows = await this.getList("/cloud/networking/floating-ips/ipv4");
    return rows.map(decodeCloudFloatingIpv4);
  }

  /** Adds a floating IPv4 address to the account. */
  public async createCloudFloatingIpv4(input: CreateCloudFloatingIpv4Request): Promise<CloudFloatingIpv4> {
    return decodeCloudFloatingIpv4(await this.request("POST", "/cloud/networking/floating-ips/ipv4", input));
  }

  /** Deletes a cloud floating IPv4 address. Deleting an already absent address is treated as success. */
  public async deleteCloudFloatingIpv4(floatingIpv4Id: number): Promise<void> {
    await this.deleteIdempotent(`/cloud/networking/floating-ips/ipv4/${floatingIpv4Id}`);
  }

  /** Lists the VMs allowed to access a cloud floating IPv4 address. */
  public async listCloudFloatingIpv4Vms(floatingIpv4Id: number): Promise<CloudFloatingIpv4Vm[]> {
    const rows = await this.getList(`/cloud/networking/floating-ips/ipv4/${floatingIpv4Id}/vms`);
    return rows.map(decodeCloudFloatingIpv4Vm);
  }

  /** Grants VMs access to a cloud floating IPv4 address. */
  public async grantCloudFloatingIpv4Vms(floatingIpv4Id: number, input: GrantCloudFloatingIpv4VmsRequest): Promise<void> {
    await this.request("POST", `/cloud/networking/floating-ips/ipv4/${floatingIpv4Id}/vms/mass-grant`, input);
  }

  /** Revokes VM access to a cloud floating IPv4 address. */
  public async revokeCloudFloatingIpv4Vms(floatingIpv4Id: number, input: RevokeCloudFloatingIpv4VmsRequest): Promise<void> {
    await this.request("POST", `/cloud/networking/floating-ips/ipv4/${floatingIpv4Id}/vms/mass-revoke`, input);
  }

  /** Lists cloud location to datacenter mappings. */
  public async listCloudNetworkingLocations(): Promise<CloudNetworkingLocation[]> {
    return requireArray(await this.request("GET", "/cloud/networking/locations")).map(decodeCloudNetworkingLocation);
  }

  /** Lists magic meshes visible to the account and follows vAPI3 pagination to the end. */
  public async listMagicMeshes(): Promise<MagicMesh[]> {
    const rows = await this.getList("/cloud-routing/meshes?limit=1000");
    return rows.map(decodeMagicMesh);
  }

  /** Creates a magic mesh and returns its id. */
  public async createMagicMesh(input: CreateMagicMeshRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/cloud-routing/meshes", input));
    return numberField(row, "meshId");
  }

  /** Gets one magic mesh. */
  public async getMagicMesh(meshId: number): Promise<MagicMesh> {
    return decodeMagicMesh(await this.request("GET", `/cloud-routing/meshes/${meshId}`));
  }

  /** Updates a magic mesh's name and description. */
  public async updateMagicMesh(meshId: number, input: UpdateMagicMeshRequest): Promise<void> {
    await this.request("PATCH", `/cloud-routing/meshes/${meshId}`, input);
  }

  /** Deletes a magic mesh. Deleting an already absent mesh is treated as success. */
  public async deleteMagicMesh(meshId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/meshes/${meshId}`);
  }

  /** Lists the routers attached to a magic mesh and follows vAPI3 pagination to the end. */
  public async listMeshRouters(meshId: number): Promise<MeshRouter[]> {
    const rows = await this.getList(`/cloud-routing/meshes/${meshId}/routers`);
    return rows.map(decodeMeshRouter);
  }

  /** Adds a router to a magic mesh. */
  public async addRouterToMesh(meshId: number, routerId: number): Promise<void> {
    await this.request("POST", `/cloud-routing/meshes/${meshId}/routers`, { routerId });
  }

  /** Removes a router from a magic mesh. Removing an already absent router is treated as success. */
  public async removeRouterFromMesh(meshId: number, routerId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/meshes/${meshId}/routers/${routerId}`);
  }

  /** Lists cloud routers visible to the account and follows vAPI3 pagination to the end. */
  public async listRouters(): Promise<Router[]> {
    const rows = await this.getList("/cloud-routing/routers?limit=1000");
    return rows.map(decodeRouter);
  }

  /** Gets one cloud router. */
  public async getRouter(routerId: number): Promise<Router> {
    return decodeRouter(await this.request("GET", `/cloud-routing/routers/${routerId}`));
  }

  /** Gets a cloud router's full configuration, including every VRF. */
  public async getRouterConfig(routerId: number): Promise<RouterConfig> {
    return decodeRouterConfig(await this.request("GET", `/cloud-routing/routers/${routerId}/config`));
  }

  /** Gets the router-wide interface configuration. The platform's shape is not yet modeled, so the payload is returned as is. */
  public async listRouterConfigInterfaces(routerId: number): Promise<Record<string, unknown>> {
    return requireObject(await this.request("GET", `/cloud-routing/routers/${routerId}/config/interfaces`));
  }

  /** Marks the platform's cached configuration for a cloud router as stale. */
  public async invalidateRouterConfigCache(routerId: number): Promise<void> {
    await this.request("POST", `/cloud-routing/routers/${routerId}/config/invalidate-cache`);
  }

  /** Creates a cloud router and returns its id. */
  public async createRouter(input: CreateRouterRequest): Promise<number> {
    const row = requireObject(await this.request("POST", "/cloud-routing/routers", input));
    return numberField(row, "routerId");
  }

  /** Updates a cloud router's name and description. */
  public async updateRouter(routerId: number, input: UpdateRouterRequest): Promise<Router> {
    return decodeRouter(await this.request("PATCH", `/cloud-routing/routers/${routerId}`, input));
  }

  /** Deletes a cloud router. Deleting an already absent router is treated as success. */
  public async deleteRouter(routerId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}`);
  }

  /**
   * Waits for a cloud router to finish building and report ready.
   *
   * A cloud router build reports a fixed sequence of timestamped steps and normally finishes in
   * about five minutes. A stalled build never sets `readyOn` and never reports a failure state,
   * so watching elapsed time alone cannot tell a stalled build from a slow one. This instead
   * tracks how many build steps have completed: when none completes within `stallAfterMs`
   * (default 5 minutes), it throws naming the step the build is stuck on rather than waiting out
   * the full timeout.
   */
  public async waitForRouterReady(routerId: number, options: WaitForRouterReadyOptions = {}): Promise<void> {
    const intervalMs = options.intervalMs ?? 10_000;
    const timeoutMs = options.timeoutMs ?? 600_000;
    const stallAfterMs = options.stallAfterMs ?? 300_000;
    const sleep = options.sleep ?? delay;
    const deadline = Date.now() + timeoutMs;
    let completedSteps = 0;
    let lastProgress = Date.now();
    for (;;) {
      const router = await this.getRouter(routerId);
      if (router.readyOn !== undefined) {
        return;
      }
      const build = router.build ?? [];
      const completed = build.filter((step) => step.date !== undefined).length;
      const pending = build.find((step) => step.date === undefined)?.text;
      if (completed > completedSteps) {
        completedSteps = completed;
        lastProgress = Date.now();
      }
      const stalledForMs = Date.now() - lastProgress;
      if (stalledForMs > stallAfterMs) {
        throw new Error(
          `router ${routerId} build has made no progress for ${Math.round(stalledForMs / 1000)}s: ` +
            `${completed} of ${build.length} steps complete, stuck on ${JSON.stringify(pending)}. ` +
            "A healthy build finishes in about five minutes, so this is a stalled build rather than a slow one"
        );
      }
      if (Date.now() >= deadline) {
        throw new Error(`timeout waiting for router ${routerId} to become ready after ${timeoutMs}ms`);
      }
      await sleep(intervalMs);
    }
  }

  /** Lists the VRFs configured on a cloud router, keyed by VRF id. */
  public async listRouterVrfs(routerId: number): Promise<Record<string, RouterVrfConfig>> {
    return decodeRouterVrfMap(await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs`));
  }

  /** Creates a VRF on a cloud router and returns its id. */
  public async createRouterVrf(routerId: number, input: CreateRouterVrfRequest): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs`, input));
    return numberField(row, "vrfId");
  }

  /** Gets one VRF on a cloud router. */
  public async getRouterVrf(routerId: number, vrfId: number): Promise<RouterVrfConfig> {
    return decodeRouterVrfConfig(await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}`));
  }

  /** Updates a VRF's name and description. */
  public async updateRouterVrf(routerId: number, vrfId: number, input: UpdateRouterVrfRequest): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}`, input);
  }

  /** Deletes a VRF from a cloud router. Deleting an already absent VRF is treated as success. */
  public async deleteRouterVrf(routerId: number, vrfId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}`);
  }

  /** Gets a VRF's BGP configuration. */
  public async getRouterVrfBgp(routerId: number, vrfId: number): Promise<RouterVrfBgpConfig> {
    return decodeRouterVrfBgpConfig(await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp`));
  }

  /** Updates a VRF's BGP configuration. */
  public async updateRouterVrfBgp(routerId: number, vrfId: number, input: UpdateRouterVrfBgpRequest): Promise<UpdateRouterVrfBgpResult> {
    return decodeUpdateRouterVrfBgpResult(await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp`, input));
  }

  /** Lists the BGP neighbors configured on a VRF. */
  public async listRouterVrfBgpNeighbors(routerId: number, vrfId: number): Promise<RouterVrfBgpNeighbor[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp/neighbors`);
    return rows.map(decodeRouterVrfBgpNeighbor);
  }

  /** Creates a BGP neighbor on a VRF and returns its id. */
  public async createRouterVrfBgpNeighbor(routerId: number, vrfId: number, input: RouterVrfBgpNeighborInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp/neighbors`, input));
    return numberField(row, "neighborId");
  }

  /** Gets one BGP neighbor configured on a VRF. */
  public async getRouterVrfBgpNeighbor(routerId: number, vrfId: number, neighborId: number): Promise<RouterVrfBgpNeighbor> {
    return decodeRouterVrfBgpNeighbor(
      await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp/neighbors/${neighborId}`)
    );
  }

  /** Updates a BGP neighbor configured on a VRF. */
  public async updateRouterVrfBgpNeighbor(routerId: number, vrfId: number, neighborId: number, input: RouterVrfBgpNeighborInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp/neighbors/${neighborId}`, input);
  }

  /** Deletes a BGP neighbor from a VRF. Deleting an already absent neighbor is treated as success. */
  public async deleteRouterVrfBgpNeighbor(routerId: number, vrfId: number, neighborId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/bgp/neighbors/${neighborId}`);
  }

  /** Lists the static routes configured on a VRF. */
  public async listRouterStaticRoutes(routerId: number, vrfId: number): Promise<RouterStaticRoute[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/static-routes`);
    return rows.map(decodeRouterStaticRoute);
  }

  /**
   * Gets one static route by id.
   *
   * There is no single-route endpoint, so this lists every static route on the VRF and filters
   * for a match. When none has that id, it throws {@link NetActuateNotFoundError} rather than
   * returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getRouterStaticRoute(routerId: number, vrfId: number, routeId: number): Promise<RouterStaticRoute> {
    const routes = await this.listRouterStaticRoutes(routerId, vrfId);
    const route = routes.find((candidate) => candidate.staticRouteId === routeId);
    if (route === undefined) {
      throw this.notFoundError(
        "GET",
        `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/static-routes/${routeId}`,
        `static route ${routeId} not found for VRF ${vrfId} on router ${routerId}`
      );
    }
    return route;
  }

  /** Creates a static route on a VRF and returns its id. */
  public async createRouterStaticRoute(routerId: number, vrfId: number, input: RouterStaticRouteInput): Promise<number> {
    const row = requireObject(
      await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/static-routes`, input)
    );
    return numberField(row, "staticRouteId");
  }

  /** Updates a static route on a VRF. */
  public async updateRouterStaticRoute(routerId: number, vrfId: number, routeId: number, input: RouterStaticRouteInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/static-routes/${routeId}`, input);
  }

  /** Deletes a static route from a VRF. Deleting an already absent route is treated as success. */
  public async deleteRouterStaticRoute(routerId: number, vrfId: number, routeId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/static-routes/${routeId}`);
  }

  /** Creates a prefix list on a cloud router and returns its id. */
  public async createRouterPrefixList(routerId: number, input: RouterPrefixListInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/prefix-lists`, input));
    return numberField(row, "prefixListId");
  }

  /** Lists the prefix lists configured on a cloud router. */
  public async listRouterPrefixLists(routerId: number): Promise<RouterPrefixList[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/prefix-lists`);
    return rows.map(decodeRouterPrefixList);
  }

  /**
   * Gets one prefix list by id.
   *
   * There is no single-prefix-list endpoint, so this lists every prefix list on the router and
   * filters for a match. When none has that id, it throws {@link NetActuateNotFoundError} rather
   * than returning undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getRouterPrefixList(routerId: number, prefixListId: number): Promise<RouterPrefixList> {
    const lists = await this.listRouterPrefixLists(routerId);
    const list = lists.find((candidate) => candidate.prefixListId === prefixListId);
    if (list === undefined) {
      throw this.notFoundError(
        "GET",
        `/cloud-routing/routers/${routerId}/config/prefix-lists/${prefixListId}`,
        `prefix list ${prefixListId} not found on router ${routerId}`
      );
    }
    return list;
  }

  /** Updates a prefix list on a cloud router. */
  public async updateRouterPrefixList(routerId: number, prefixListId: number, input: RouterPrefixListInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/prefix-lists/${prefixListId}`, input);
  }

  /** Deletes a prefix list from a cloud router. Deleting an already absent prefix list is treated as success. */
  public async deleteRouterPrefixList(routerId: number, prefixListId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/prefix-lists/${prefixListId}`);
  }

  /** Gets a cloud router's NTP configuration. */
  public async getRouterNtpConfig(routerId: number): Promise<RouterNtpConfig> {
    return decodeRouterNtpConfig(await this.request("GET", `/cloud-routing/routers/${routerId}/config/services/ntp`));
  }

  /** Updates a cloud router's NTP configuration. */
  public async updateRouterNtpConfig(routerId: number, input: UpdateRouterNtpConfigRequest): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/services/ntp`, input);
  }

  /** Fetches the requested live routing views for a VRF. The platform's per-view shape is not yet modeled, so the payload is returned as is. */
  public async getRouterRoutingViews(routerId: number, vrfId: number, input: GetRouterRoutingViewsRequest): Promise<Record<string, unknown>> {
    return requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/view/routing/${vrfId}`, input));
  }

  /** Fetches the live routing overview for a VRF. The platform's shape is not yet modeled, so the payload is returned as is. */
  public async getRouterRoutingOverview(routerId: number, vrfId: number): Promise<Record<string, unknown>> {
    return requireObject(await this.request("GET", `/cloud-routing/routers/${routerId}/view/routing/${vrfId}/overview`));
  }

  /** Gets a cloud router's IPSec crypto configuration. */
  public async getRouterIpSecConfig(routerId: number): Promise<RouterIpSecConfig> {
    return decodeRouterIpSecConfig(await this.request("GET", `/cloud-routing/routers/${routerId}/config/ipSec`));
  }

  /** Updates a cloud router's IPSec crypto configuration. */
  public async updateRouterIpSecConfig(routerId: number, input: UpdateRouterIpSecConfigRequest): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/ipSec`, input);
  }

  /** Lists the IPSec peers configured on a router VRF. */
  public async listRouterVrfIpSecPeers(routerId: number, vrfId: number): Promise<RouterVrfIpSecPeer[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/ipSec/peers`);
    return rows.map(decodeRouterVrfIpSecPeer);
  }

  /**
   * Gets one IPSec peer by id.
   *
   * There is no single-peer endpoint, so this lists every IPSec peer on the VRF and filters for a
   * match. When none has that id, it throws {@link NetActuateNotFoundError} rather than returning
   * undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getRouterVrfIpSecPeer(routerId: number, vrfId: number, peerId: number): Promise<RouterVrfIpSecPeer> {
    const peers = await this.listRouterVrfIpSecPeers(routerId, vrfId);
    const peer = peers.find((candidate) => candidate.ipSecPeerId === peerId);
    if (peer === undefined) {
      throw this.notFoundError(
        "GET",
        `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/ipSec/peers/${peerId}`,
        `IPSec peer ${peerId} not found for VRF ${vrfId} on router ${routerId}`
      );
    }
    return peer;
  }

  /** Creates an IPSec peer on a router VRF and returns its id. */
  public async createRouterVrfIpSecPeer(routerId: number, vrfId: number, input: RouterVrfIpSecPeerInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/ipSec/peers`, input));
    return numberField(row, "ipSecPeerId");
  }

  /** Updates an IPSec peer configured on a router VRF. */
  public async updateRouterVrfIpSecPeer(routerId: number, vrfId: number, peerId: number, input: RouterVrfIpSecPeerInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/ipSec/peers/${peerId}`, input);
  }

  /** Deletes an IPSec peer from a router VRF. Deleting an already absent peer is treated as success. */
  public async deleteRouterVrfIpSecPeer(routerId: number, vrfId: number, peerId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/ipSec/peers/${peerId}`);
  }

  /** Lists the interfaces configured on a router VRF, keyed by interface id. */
  public async listRouterVrfInterfaces(routerId: number, vrfId: number): Promise<Record<string, RouterVrfInterface>> {
    return decodeRouterVrfInterfaceMap(await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces`));
  }

  /** Creates an interface on a router VRF and returns its id. */
  public async createRouterVrfInterface(routerId: number, vrfId: number, input: RouterVrfInterfaceInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces`, input));
    return numberField(row, "interfaceId");
  }

  /** Gets one interface configured on a router VRF. */
  public async getRouterVrfInterface(routerId: number, vrfId: number, interfaceId: number): Promise<RouterVrfInterface> {
    return decodeRouterVrfInterface(
      await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces/${interfaceId}`)
    );
  }

  /** Updates an interface configured on a router VRF. */
  public async updateRouterVrfInterface(routerId: number, vrfId: number, interfaceId: number, input: RouterVrfInterfaceInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces/${interfaceId}`, input);
  }

  /** Deletes an interface from a router VRF. Deleting an already absent interface is treated as success. */
  public async deleteRouterVrfInterface(routerId: number, vrfId: number, interfaceId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces/${interfaceId}`);
  }

  /** Creates a wireguard peer on a router VRF interface and returns its id. */
  public async createRouterVrfInterfaceWireguardPeer(
    routerId: number,
    vrfId: number,
    interfaceId: number,
    input: CreateRouterVrfInterfaceWireguardPeerRequest
  ): Promise<number> {
    const row = requireObject(
      await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces/${interfaceId}/wireguard-peers`, input)
    );
    return numberField(row, "wireguardPeerId");
  }

  /** Gets one wireguard peer configured on a router VRF interface. */
  public async getRouterVrfInterfaceWireguardPeer(
    routerId: number,
    vrfId: number,
    interfaceId: number,
    wireguardPeerId: number
  ): Promise<RouterVrfInterfaceWireguardPeer> {
    return decodeRouterVrfInterfaceWireguardPeer(
      await this.request(
        "GET",
        `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces/${interfaceId}/wireguard-peers/${wireguardPeerId}`
      )
    );
  }

  /** Deletes a wireguard peer from a router VRF interface. Deleting an already absent peer is treated as success. */
  public async deleteRouterVrfInterfaceWireguardPeer(
    routerId: number,
    vrfId: number,
    interfaceId: number,
    wireguardPeerId: number
  ): Promise<void> {
    await this.deleteIdempotent(
      `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/interfaces/${interfaceId}/wireguard-peers/${wireguardPeerId}`
    );
  }

  /** Creates a SNAT rule on a router VRF and returns its id. */
  public async createRouterVrfSnatRule(routerId: number, vrfId: number, input: RouterVrfSnatRuleInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/snat-rules`, input));
    return numberField(row, "snatRuleId");
  }

  /** Lists the SNAT rules configured on a router VRF. */
  public async listRouterVrfSnatRules(routerId: number, vrfId: number): Promise<RouterVrfSnatRule[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/snat-rules`);
    return rows.map(decodeRouterVrfSnatRule);
  }

  /**
   * Gets one SNAT rule by id.
   *
   * There is no single-rule endpoint, so this lists every SNAT rule on the VRF and filters for a
   * match. When none has that id, it throws {@link NetActuateNotFoundError} rather than returning
   * undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getRouterVrfSnatRule(routerId: number, vrfId: number, snatRuleId: number): Promise<RouterVrfSnatRule> {
    const rules = await this.listRouterVrfSnatRules(routerId, vrfId);
    const rule = rules.find((candidate) => candidate.snatRuleId === snatRuleId);
    if (rule === undefined) {
      throw this.notFoundError(
        "GET",
        `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/snat-rules/${snatRuleId}`,
        `SNAT rule ${snatRuleId} not found for VRF ${vrfId} on router ${routerId}`
      );
    }
    return rule;
  }

  /** Updates a SNAT rule configured on a router VRF. */
  public async updateRouterVrfSnatRule(routerId: number, vrfId: number, snatRuleId: number, input: RouterVrfSnatRuleInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/snat-rules/${snatRuleId}`, input);
  }

  /** Deletes a SNAT rule from a router VRF. Deleting an already absent rule is treated as success. */
  public async deleteRouterVrfSnatRule(routerId: number, vrfId: number, snatRuleId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/snat-rules/${snatRuleId}`);
  }

  /** Creates a DNAT rule on a router VRF and returns its id. */
  public async createRouterVrfDnatRule(routerId: number, vrfId: number, input: RouterVrfDnatRuleInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/dnat-rules`, input));
    return numberField(row, "dnatRuleId");
  }

  /** Lists the DNAT rules configured on a router VRF. */
  public async listRouterVrfDnatRules(routerId: number, vrfId: number): Promise<RouterVrfDnatRule[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/dnat-rules`);
    return rows.map(decodeRouterVrfDnatRule);
  }

  /**
   * Gets one DNAT rule by id.
   *
   * There is no single-rule endpoint, so this lists every DNAT rule on the VRF and filters for a
   * match. When none has that id, it throws {@link NetActuateNotFoundError} rather than returning
   * undefined, so a caller can distinguish "gone" from a failed request.
   */
  public async getRouterVrfDnatRule(routerId: number, vrfId: number, dnatRuleId: number): Promise<RouterVrfDnatRule> {
    const rules = await this.listRouterVrfDnatRules(routerId, vrfId);
    const rule = rules.find((candidate) => candidate.dnatRuleId === dnatRuleId);
    if (rule === undefined) {
      throw this.notFoundError(
        "GET",
        `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/dnat-rules/${dnatRuleId}`,
        `DNAT rule ${dnatRuleId} not found for VRF ${vrfId} on router ${routerId}`
      );
    }
    return rule;
  }

  /** Updates a DNAT rule configured on a router VRF. */
  public async updateRouterVrfDnatRule(routerId: number, vrfId: number, dnatRuleId: number, input: RouterVrfDnatRuleInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/dnat-rules/${dnatRuleId}`, input);
  }

  /** Deletes a DNAT rule from a router VRF. Deleting an already absent rule is treated as success. */
  public async deleteRouterVrfDnatRule(routerId: number, vrfId: number, dnatRuleId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/dnat-rules/${dnatRuleId}`);
  }

  /** Lists the tunnels configured on a router VRF. */
  public async listRouterVrfTunnels(routerId: number, vrfId: number): Promise<RouterVrfTunnel[]> {
    const rows = await this.getList(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/tunnels`);
    return rows.map(decodeRouterVrfTunnel);
  }

  /** Gets one tunnel configured on a router VRF. */
  public async getRouterVrfTunnel(routerId: number, vrfId: number, tunnelId: number): Promise<RouterVrfTunnel> {
    return decodeRouterVrfTunnel(await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/tunnels/${tunnelId}`));
  }

  /** Creates a tunnel on a router VRF and returns its id. */
  public async createRouterVrfTunnel(routerId: number, vrfId: number, input: RouterVrfTunnelInput): Promise<number> {
    const row = requireObject(await this.request("POST", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/tunnels`, input));
    return numberField(row, "tunnelId");
  }

  /** Updates a tunnel configured on a router VRF. */
  public async updateRouterVrfTunnel(routerId: number, vrfId: number, tunnelId: number, input: RouterVrfTunnelInput): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/tunnels/${tunnelId}`, input);
  }

  /** Deletes a tunnel from a router VRF. Deleting an already absent tunnel is treated as success. */
  public async deleteRouterVrfTunnel(routerId: number, vrfId: number, tunnelId: number): Promise<void> {
    await this.deleteIdempotent(`/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/tunnels/${tunnelId}`);
  }

  /** Gets a router VRF's DHCP service configuration. */
  public async getRouterVrfDhcp(routerId: number, vrfId: number): Promise<RouterVrfDhcpConfig> {
    return decodeRouterVrfDhcpConfig(await this.request("GET", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/services/dhcp`));
  }

  /** Updates a router VRF's DHCP service configuration. */
  public async updateRouterVrfDhcp(routerId: number, vrfId: number, input: UpdateRouterVrfDhcpRequest): Promise<void> {
    await this.request("PUT", `/cloud-routing/routers/${routerId}/config/vrfs/${vrfId}/services/dhcp`, input);
  }

  /** Creates an SSL certificate and returns its assigned id. */
  public async createSslCertificate(input: CreateSslCertificateRequest): Promise<CreateSslCertificateResponse> {
    return decodeCreateSslCertificateResponse(await this.request("POST", "/ssl-certificates", input));
  }

  /** Lists the SSL certificates stored on the account. */
  public async getSslCertificates(): Promise<SslCertificate[]> {
    const rows = await this.getList("/ssl-certificates");
    return rows.map(decodeSslCertificate);
  }

  /** Gets one SSL certificate by id. */
  public async getSslCertificate(sslCertificateId: number): Promise<SslCertificate> {
    return decodeSslCertificate(await this.request("GET", `/ssl-certificates/${sslCertificateId}`));
  }

  /** Updates an SSL certificate's name, description, certificate or private key. */
  public async updateSslCertificate(sslCertificateId: number, input: UpdateSslCertificateRequest): Promise<void> {
    await this.request("PATCH", `/ssl-certificates/${sslCertificateId}`, input);
  }

  /** Deletes an SSL certificate. Deleting an already absent certificate is treated as success. */
  public async deleteSslCertificate(sslCertificateId: number): Promise<void> {
    await this.deleteIdempotent(`/ssl-certificates/${sslCertificateId}`);
  }

  /** Creates a group on a network load balancer. */
  public async createNlbGroup(nlbId: number, input: CreateNlbGroupRequest): Promise<NlbGroup> {
    return decodeNlbGroup(await this.request("POST", `/network-loadbalancers/${nlbId}/groups`, input));
  }

  /** Gets one group on a network load balancer. */
  public async getNlbGroup(nlbId: number, groupId: number): Promise<NlbGroup> {
    return decodeNlbGroup(await this.request("GET", `/network-loadbalancers/${nlbId}/groups/${groupId}`));
  }

  /** Lists the groups configured on a network load balancer. */
  public async listNlbGroups(nlbId: number): Promise<NlbGroup[]> {
    const rows = await this.getList(`/network-loadbalancers/${nlbId}/groups`);
    return rows.map(decodeNlbGroup);
  }

  /** Replaces a group on a network load balancer. */
  public async replaceNlbGroup(nlbId: number, groupId: number, input: ReplaceNlbGroupRequest): Promise<NlbGroup> {
    return decodeNlbGroup(await this.request("PUT", `/network-loadbalancers/${nlbId}/groups/${groupId}`, input));
  }

  /** Deletes a group from a network load balancer. Deleting an already absent group is treated as success. */
  public async deleteNlbGroup(nlbId: number, groupId: number): Promise<void> {
    await this.deleteIdempotent(`/network-loadbalancers/${nlbId}/groups/${groupId}`);
  }

  /** Creates a group on an HTTP load balancer. */
  public async createHttpLbGroup(httpLbId: number, input: CreateHttpLbGroupRequest): Promise<HttpLbGroup> {
    return decodeHttpLbGroup(await this.request("POST", `/http-loadbalancers/${httpLbId}/groups`, input));
  }

  /** Lists the groups configured on an HTTP load balancer. */
  public async getHttpLbGroups(httpLbId: number): Promise<HttpLbGroup[]> {
    const rows = await this.getList(`/http-loadbalancers/${httpLbId}/groups`);
    return rows.map(decodeHttpLbGroup);
  }

  /** Gets one group on an HTTP load balancer. */
  public async getHttpLbGroup(httpLbId: number, groupId: number): Promise<HttpLbGroup> {
    return decodeHttpLbGroup(await this.request("GET", `/http-loadbalancers/${httpLbId}/groups/${groupId}`));
  }

  /** Replaces a group on an HTTP load balancer. */
  public async replaceHttpLbGroup(httpLbId: number, groupId: number, input: ReplaceHttpLbGroupRequest): Promise<HttpLbGroup> {
    return decodeHttpLbGroup(await this.request("PUT", `/http-loadbalancers/${httpLbId}/groups/${groupId}`, input));
  }

  /** Deletes a group from an HTTP load balancer. Deleting an already absent group is treated as success. */
  public async deleteHttpLbGroup(httpLbId: number, groupId: number): Promise<void> {
    await this.deleteIdempotent(`/http-loadbalancers/${httpLbId}/groups/${groupId}`);
  }

  /** Gets the account's usage limits, keyed by resource type. */
  public async getAccountLimits(): Promise<Record<string, AccountLimit>> {
    const row = requireObject(await this.request("GET", "/account-limits"));
    const limits: Record<string, AccountLimit> = {};
    for (const [key, value] of Object.entries(row)) {
      limits[key] = decodeAccountLimit(value);
    }
    return limits;
  }

  /** Queries account-wide usage statistics for the named metrics. */
  public async queryStatistics(metrics: string[]): Promise<StatisticResult[]> {
    return this.queryStatisticsAt("/cloud/statistics", metrics);
  }

  /** Queries networking usage statistics for the named metrics. */
  public async queryNetworkingStatistics(metrics: string[]): Promise<StatisticResult[]> {
    return this.queryStatisticsAt("/cloud/networking/statistics", metrics);
  }

  /** Queries anycast networking usage statistics for the named metrics. */
  public async queryAnycastStatistics(metrics: string[]): Promise<StatisticResult[]> {
    return this.queryStatisticsAt("/cloud/networking/anycast/statistics", metrics);
  }

  /** Gets every metric name available for statistics queries, with its current time window and rollups. */
  public async getMetricNames(): Promise<MetricNames> {
    return decodeMetricNames(await this.request("POST", "/cloud/statistics/views/all-metrics", {}));
  }

  /** Posts a statistics query for the named metrics to a statistics endpoint and decodes the per-metric results. */
  private async queryStatisticsAt(path: string, metrics: string[]): Promise<StatisticResult[]> {
    const body = { metrics: metrics.map((metric) => ({ metric: { [metric]: {} } })) };
    const rows = await this.request("POST", path, body);
    return requireArray(rows).map(decodeStatisticResult);
  }

  /**
   * Fetches one page of the OIDC client list and recurses through vAPI3 pagination, attaching
   * the wrapping response's tenant id to each row since the platform reports it once per page
   * rather than once per client.
   */
  private async listOidcClientsPage(path: string): Promise<OidcClient[]> {
    const wrapped = requireObject(await this.request("GET", path));
    const tenant = tenantId(wrapped.tenant);
    const page = parseV3ListPage(isPlainObject(wrapped.clients) ? wrapped.clients : wrapped);
    const clients = page.rows.map((row) => ({ ...decodeOidcClient(row), tenant }));
    const next = nextOffsetPath(path, page.meta) ?? nextPagePath(path, page.paginator);
    if (next === undefined) {
      return clients;
    }
    return [...clients, ...(await this.listOidcClientsPage(next))];
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

  /**
   * POSTs to path with no body, retrying up to maxRetries times when a transient server error
   * is returned. Use this for apply-changes endpoints that may return a 5xx briefly after VPC
   * creation while the gateway VM is still initializing.
   */
  private async postWithRetry(path: string, maxRetries: number, options: ApplyVpcChangesOptions): Promise<void> {
    const retryDelayMs = options.retryDelayMs ?? 10_000;
    const sleep = options.sleep ?? delay;
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.request("POST", path);
        return;
      } catch (error) {
        lastError = error;
        if (!isTransientServerError(error) || attempt === maxRetries) {
          throw error;
        }
        await sleep(retryDelayMs);
      }
    }
    throw lastError;
  }

  /**
   * Polls `fetch` at `options.intervalMs` until `isReady` accepts the fetched value or
   * `options.timeoutMs` elapses, at which point it throws. `label` identifies the resource in
   * the timeout message.
   */
  private async waitForStorageReady<T>(
    fetch: () => Promise<T>,
    isReady: (value: T) => boolean,
    label: string,
    options: WaitForStorageReadyOptions
  ): Promise<void> {
    const intervalMs = options.intervalMs ?? 10_000;
    const timeoutMs = options.timeoutMs ?? 120_000;
    const sleep = options.sleep ?? delay;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const value = await fetch();
      if (isReady(value)) {
        return;
      }
      if (Date.now() >= deadline) {
        throw new Error(`timeout waiting for ${label} to become ready after ${timeoutMs}ms`);
      }
      await sleep(intervalMs);
    }
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

  /** Builds a not found error for a lookup that is resolved client-side rather than by the transport. */
  private notFoundError(method: HttpMethod, path: string, message: string): NetActuateNotFoundError {
    const url = resolveUrl(this.baseUrl, appendApiKey(path, this.apiKey));
    return new NetActuateNotFoundError({ ...redactedRequest(method, url), statusCode: 404, apiMessage: message });
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

function requireArray(input: unknown): unknown[] {
  if (!Array.isArray(input)) {
    throw new Error("expected an array payload");
  }
  return input;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns true for 5xx errors that are likely transient, such as a gateway VM not yet ready. */
function isTransientServerError(error: unknown): boolean {
  return error instanceof NetActuateError && [500, 502, 503, 504].includes(error.statusCode);
}

/** Returns true when the platform reports a 400 because a VPC exists but its gateway is still initializing. */
function isVpcNotReadyError(error: unknown): boolean {
  if (!(error instanceof NetActuateError) || error.statusCode !== 400) {
    return false;
  }
  const text = `${error.apiMessage ?? ""} ${error.body ?? ""}`.toLowerCase();
  return text.includes("vpc") && text.includes("not ready");
}

/** Returns true when the platform reports a 400 because an OIDC client key was already revoked. */
function isOidcKeyAlreadyRevokedError(error: unknown): boolean {
  if (!(error instanceof NetActuateError) || error.statusCode !== 400) {
    return false;
  }
  const text = `${error.apiMessage ?? ""} ${error.body ?? ""}`.toLowerCase();
  return text.includes("the key is revoked");
}

function isPlainObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

/** Reads the OIDC tenant id, which the platform sends as a JSON number. */
function tenantId(value: unknown): string | undefined {
  if (typeof value === "number") {
    return String(value);
  }
  return typeof value === "string" ? value : undefined;
}
