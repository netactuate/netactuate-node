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
  decodeAccessControlSubnet,
  decodeAccountAgreement,
  decodeBgpAsn,
  decodeBgpGroup,
  decodeBgpGroupFirewallSetBinding,
  decodeBgpPrefix,
  decodeBgpSession,
  decodeBillingPackage,
  decodeBootProfile,
  decodeCloudCapacity,
  decodeCloudLocation,
  decodeCloudPackage,
  decodeCloudPool,
  decodeColocationPackage,
  decodeColocationService,
  decodeContractUsage,
  decodeCreateImageResponse,
  decodeDatacenter,
  decodeDdosAttack,
  decodeDdosDashboard,
  decodeDdosRule,
  decodeDedicatedCapacity,
  decodeDedicatedDiskLayout,
  decodeDedicatedLocation,
  decodeDedicatedOsProfile,
  decodeDedicatedRescueOsProfile,
  decodeDedicatedServerBuildStatus,
  decodeDeleteImageResponse,
  decodeDeleteServerResponse,
  decodeDnsRecord,
  decodeDnsZone,
  decodeFirewallExternalIpSet,
  decodeFirewallManageEnabled,
  decodeFirewallRule,
  decodeFirewallSet,
  decodeFirewallSetVm,
  decodeGraph,
  decodeImage,
  decodeImageQueueStatus,
  decodeIpTransitIpAddress,
  decodeIpTransitPort,
  decodeIpTransitService,
  decodeJobStatus,
  decodeKernel,
  decodeLocationByCurrentIp,
  decodeLocationSummary,
  decodeMetal,
  decodeMetalBuild,
  decodeNetworkIps,
  decodeOs,
  decodePlatformChangeLogEntry,
  decodePlatformEvents,
  decodePlatformLookingGlassInit,
  decodePlatformLookingGlassResult,
  decodePlatformMaintenanceInfo,
  decodePlatformStatus,
  decodeSecretList,
  decodeSecretListValue,
  decodeServer,
  decodeServerBuildStatus,
  decodeServerIPAddress,
  decodeServerNic,
  decodeServerNicFromResponse,
  decodeServerStatus,
  decodeService,
  decodeSize,
  decodeSshKey,
  decodeTag,
  decodeTagLog,
  decodeTagResource,
  decodeTicket,
  decodeTicketAttachment,
  decodeTicketDepartment,
  decodeTicketReply,
  decodeTransitPackage,
  decodeTransportPort,
  decodeTransportService,
  decodeVlan,
  AccessControlSubnet,
  AccountAgreement,
  BgpAsn,
  BgpDashboard,
  BgpGroup,
  BgpGroupFirewallSetBinding,
  BgpPrefix,
  BgpSession,
  BgpSummary,
  BillingPackage,
  BootProfile,
  CloudCapacity,
  CloudLocation,
  CloudPackage,
  CloudPool,
  ColocationPackage,
  ColocationService,
  ContractUsage,
  CreateImageResponse,
  Datacenter,
  DdosAttack,
  DdosDashboard,
  DdosRule,
  DedicatedCapacity,
  DedicatedDevice,
  DedicatedDiskLayout,
  DedicatedLocation,
  DedicatedOsProfile,
  DedicatedPlan,
  DedicatedPowerStatus,
  DedicatedRescueOsProfile,
  DedicatedServerBuildStatus,
  DeleteImageResponse,
  DeleteServerResponse,
  DnsRecord,
  DnsZone,
  FirewallExternalIpSet,
  FirewallManageEnabled,
  FirewallMatchCriteria,
  FirewallRule,
  FirewallSet,
  FirewallSetVm,
  Graph,
  Image,
  ImageQueueStatus,
  IpTransitIpAddress,
  IpTransitPort,
  IpTransitService,
  JobStatus,
  Kernel,
  LocationByCurrentIp,
  LocationSummary,
  Metal,
  MetalBuild,
  NetworkIps,
  Os,
  PlatformChangeLogEntry,
  PlatformEvents,
  PlatformLookingGlassInit,
  PlatformLookingGlassResult,
  PlatformMaintenanceInfo,
  PlatformStatusService,
  SecretList,
  SecretListValue,
  Server,
  ServerBuildStatus,
  ServerIPAddress,
  ServerNic,
  ServerStatus,
  Service,
  Size,
  SshKey,
  Tag,
  TagLog,
  TagResource,
  Ticket,
  TicketAttachment,
  TicketDepartment,
  TicketListOptions,
  TicketReply,
  TransitPackage,
  TransportPort,
  TransportService,
  Vlan
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

/** Request body for rebuilding an existing cloud server. Same fields as {@link CreateServerRequest}. */
export type BuildServerRequest = CreateServerRequest;

/** Filters for the dedicated device availability listing. */
export interface DedicatedDeviceFilterOptions {
  /** Rows to return per page. */
  perPage?: number;
  /** Network interface type. */
  nic?: string;
  /** CPU type. */
  cpuType?: string;
  /** GPU type. */
  gpuType?: string;
  /** Disk type. */
  diskType?: string;
  /** Core count filter. */
  cores?: string;
  /** RAM size in MB. */
  ramMb?: string;
  /** Disk size in MiB. */
  diskMib?: string;
  /** Datacenter name. */
  dcName?: string;
  /** Region name. */
  regionName?: string;
}

/** Request body for deploying, buying and deploying, or rebuilding a dedicated server. */
export interface DedicatedServerBuildRequest {
  /** Fully qualified domain name. */
  fqdn: string;
  /** OS profile id. */
  profile: number;
  /** Disk layout id. */
  diskLayout?: number;
  /** Root password. */
  rootPassword?: string;
  /** SSH key text. */
  sshKey?: string;
  /** SSH key id. */
  sshKeyId?: number;
  /** Build script content. */
  buildScript?: string;
}

/** Optional fields for a dedicated server power or delete action. */
export interface DedicatedServerActionRequest {
  /** Forces the action even if the server does not respond to a graceful request. */
  force?: boolean;
  /** IPMI or root password required by some actions. */
  password?: string;
}

/** Request body for updating a dedicated server's IPv4 reverse DNS. */
export interface DedicatedIpv4ReverseRequest {
  /** Server package id. */
  mbPkgId: number;
  /** IP address id. */
  id: number;
  /** Reverse DNS hostname. */
  reverse: string;
}

/** Options controlling {@link Client.waitForImageQueue}. */
export interface WaitForImageQueueOptions {
  /** Milliseconds between polls. Defaults to 3000, matching the platform's own image build cadence. */
  intervalMs?: number;
  /** Maximum milliseconds to wait before giving up. Defaults to 1800000 (30 minutes). */
  timeoutMs?: number;
  /** Delay function used between polls. Defaults to a real timer; tests can inject a fake one. */
  sleep?: (ms: number) => Promise<void>;
}

/** Request body for capturing a custom image from a server. */
export interface CreateImageRequest {
  /** Server package id to capture. */
  mbPkgId: number;
  /** Name for the new image. */
  imageName: string;
  /** Image description. */
  imageDescription?: string;
  /** Keeps per-user SSH directories in the captured image. */
  keepSshUserdirs?: boolean;
}

/** Options for a cloud server power action. */
export interface ServerActionOptions {
  /** Forces the action even if the server does not respond to a graceful request. */
  force?: boolean;
}

/** Request body for scaling a cloud server to a different package. */
export interface ScaleServerRequest {
  /** Target package name. Required when pkgId is not provided. */
  pkgName?: string;
  /** Target package id. Required when pkgName is not provided. */
  pkgId?: number;
  /** Reboots the server automatically when the scale requires it. */
  allowReboot: boolean;
}

/** Options for executing a platform looking glass action. */
export interface PlatformLookingGlassExecuteOptions {
  /** Looking glass action to run, such as "ping" or "traceroute". */
  action?: string;
  /** Target host or address for the action. */
  target?: string;
  /** Location to run the action from. */
  location?: string;
  /** Requests full output when set to 1. */
  full?: number;
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

/** Request body for creating a tag. */
export interface CreateTagRequest {
  /** Tag name. */
  name: string;
  /** Tag description. */
  description?: string;
  /** Icon identifier. */
  icon?: string;
  /** Display color. */
  color?: string;
}

/** Request body for updating a tag's fields and display flags. */
export interface UpdateTagRequest {
  /** Tag name. */
  name: string;
  /** Tag description. */
  description?: string;
  /** Icon identifier. */
  icon?: string;
  /** Display color. */
  color?: string;
  /** Whether this is the account's default tag. Defaults to false when omitted. */
  isDefault?: boolean;
  /** Whether this tag is marked as a favorite. Defaults to false when omitted. */
  isFavorite?: boolean;
  /** Whether this tag is locked against deletion or reassignment. Defaults to false when omitted. */
  isLocked?: boolean;
  /** Whether this tag is shown on the dashboard. Defaults to false when omitted. */
  showDashboard?: boolean;
}

/** Request body for creating an SSH key. */
export interface CreateSshKeyRequest {
  /** SSH key name. */
  name: string;
  /** Public key text. */
  key: string;
}

/** Request body for updating an SSH key. */
export interface UpdateSshKeyRequest {
  /** SSH key name. */
  name: string;
  /** Public key text. */
  key: string;
}

/** Request body for creating or updating a cloud firewall rule. */
export interface CreateFirewallRuleRequest {
  /** IP version the rule matches. */
  ipVersion: string;
  /** Traffic direction, "in" or "out". */
  direction?: string;
  /** Action taken on matching traffic, such as "accept" or "drop". */
  action: string;
  /** Whether the rule is enabled. */
  enabled: boolean;
  /** Priority used to order rule evaluation. */
  rulePriority?: number;
  /** Operator-supplied comment. */
  adminComment?: string;
  /** Match criteria for the rule. */
  matchCriteria?: FirewallMatchCriteria;
}

/** Request body for moving a rule within a draft firewall set. */
export interface ReorderFirewallRulesRequest {
  /** Id of the rule being moved. */
  moveId: number;
  /** Moves the rule to just after this rule id. */
  afterId?: number;
  /** Moves the rule to just before this rule id. */
  beforeId?: number;
}

/** Options for listing the firewall sets related to a VM. */
export interface FirewallRelatedSetOptions {
  /** Disables filtering related sets by interface id. */
  disableInterfaceIdFilter?: boolean;
}

/** Options for listing VMs available to attach to a firewall set. */
export interface FirewallAvailableVmOptions {
  /** Restricts to VMs owned by this sub-account id. */
  extrefAccountId?: number;
  /** Restricts to VMs in this VPC. */
  vpcId?: number;
  /** Includes bandwidth-only VMs. */
  includeBandwidth?: boolean;
  /** Includes uplink-only VMs. */
  includeUl?: boolean;
  /** Checks VPC membership before including a VM. */
  checkVpc?: boolean;
  /** Disables filtering available VMs by interface id. */
  disableInterfaceIdFilter?: boolean;
}

/** Request body for attaching a network interface to a server on a customer VLAN. */
export interface ServerNicAttachRequest {
  /** Customer VLAN id to attach. */
  customerVlanId: number;
}

/** Request body for updating a server network interface. */
export interface ServerNicUpdateRequest {
  /** Server package id the interface belongs to. */
  mbpkgid: number;
  /** Customer VLAN id the interface is attached to. */
  customerVlanId: number;
  /** Attach order among the server's interfaces. */
  attachOrder: number;
}

/** Request body for creating a support ticket. */
export interface CreateTicketRequest {
  /** Ticket subject. */
  subject: string;
  /** Ticket message. */
  message: string;
  /** Department id. */
  department: number;
  /** Ticket urgency: "Low", "Medium" or "High". */
  urgency?: string;
  /** References to files already uploaded as attachments. */
  files?: string[];
}

/** Request body for replying to a support ticket. */
export interface ReplyTicketRequest {
  /** Reply message. */
  message: string;
  /** References to files already uploaded as attachments. */
  files?: string[];
}

/** Options for reading support ticket or reply attachment metadata. */
export interface GetTicketAttachmentOptions {
  /** Omits the attachment's base64 data from the response when true. */
  withoutData?: boolean;
}

/** Request body for binding a firewall set to a BGP group interface. */
export interface BindBgpGroupFirewallSetRequest {
  /** Identifier carried by the platform's bind request alongside the firewall set. */
  id: number;
  /** Firewall set id to bind. */
  firewallSetId: number;
  /** Interface number on the BGP group to bind the set to. */
  interfaceNumber: number;
  /** Evaluation priority among the sets bound to this interface. */
  setPriority: number;
}

/** Request body for creating an account BGP group. */
export interface CreateBgpGroupRequest {
  /** Group name. */
  name: string;
  /** Group description. */
  description: string;
  /** Group type. */
  groupType?: string;
}

/** Request body for purchasing anycast BGP prefixes. */
export interface BuyBgpPrefixesRequest {
  /** Prefix name. */
  name: string;
  /** BGP group id to announce the prefix from. */
  groupId?: number;
  /** ASN id to announce the prefix under. */
  asnId?: number;
  /** Anycast profile id. */
  anycastProfile?: number;
  /** Legal agreement id accepted for the purchase. */
  agreementId: number;
}

/** Options for filtering the BGP dashboard. */
export interface BgpDashboardOptions {
  /** Restricts the dashboard to one group type. */
  groupType?: string;
  /** Flap detection window, in seconds. */
  flapWindow?: number;
}

/** Filters for the scaling options offered for a server. */
export interface ScalingOptionsQuery {
  /** Includes the server's current plan among the results. */
  includeCurrentPlan?: boolean;
  /** Minimum RAM, in MB. */
  minRam?: number;
  /** Maximum RAM, in MB. */
  maxRam?: number;
  /** Minimum vCPU count. */
  minCpus?: number;
  /** Maximum vCPU count. */
  maxCpus?: number;
}

/** Filters for the deploy sizes offered at a location. */
export interface DeploySizesQuery {
  /** Minimum CPU count. */
  minCpu?: number;
  /** Minimum RAM, in MB. */
  minRam?: number;
}

/** Request body for updating mutable options on a cloud server. */
export interface UpdateServerOptionsRequest {
  /** Fully qualified domain name. */
  fqdn?: string;
  /** Autorescue setting. */
  autorescue?: number;
  /** Server description. */
  description?: string;
  /** vCPU count. */
  vcpus?: number;
  /** Boot mode. */
  boot?: string;
  /** Boot kernel id. */
  kernelId?: number;
}

/** Optional fields for deleting a cloud server through the options-aware delete path. */
export interface DeleteServerOptions {
  /** Cancels billing for the server at deletion. */
  cancelBilling?: boolean;
  /** Forces deletion using this password when the server does not respond normally. */
  forcePassword?: string;
  /** Password required by some delete flows. */
  password?: string;
}

/** Credentials used to start rescue mode on a cloud server. */
export interface StartServerRescueRequest {
  /** Password to use for the rescue environment. */
  rescuePass: string;
  /** Existing server password, when required. */
  password?: string;
}

/** A new root password for a cloud server. */
export interface ResetServerRootPasswordRequest {
  /** New root password. */
  rootPass: string;
  /** Existing password, when required for confirmation. */
  password?: string;
}

/** Credentials used to test SSH access to a server. */
export interface AttemptSSHRequest {
  /** Server package id. */
  mbPkgId: number;
  /** SSH username. */
  username: string;
  /** SSH password. */
  password: string;
}

/** Request body for binding a firewall set to a cloud server interface. */
export interface BindCloudFirewallSetRequest {
  /** Firewall set id to bind. */
  firewallSetId: number;
  /** Interface id on the server to bind the set to. */
  interfaceId: number;
  /** Evaluation priority among the sets bound to this interface. */
  setPriority: number;
}

/** Filters for the DDoS mitigation dashboard. */
export interface DdosDashboardOptions {
  /** Period covered, in seconds. */
  period?: number;
  /** Includes attacks that have already ended. */
  includeEnded?: boolean;
  /** Maximum rows to return. */
  limit?: number;
}

/** Request body for creating a user access control subnet. */
export interface CreateAccessControlSubnetRequest {
  /** Display label. */
  label: string;
  /** Allowed subnet, in CIDR notation. */
  subnet: string;
}

/** Request body for updating a user access control subnet. */
export interface UpdateAccessControlSubnetRequest {
  /** Display label. */
  label?: string;
  /** Allowed subnet, in CIDR notation. */
  subnet?: string;
}

/** Request body for the legacy dedicated server buy-and-build endpoint. */
export interface CreateMetalRequest {
  /** Location id. */
  location?: number;
  /** Dedicated device id. */
  deviceId?: number;
  /** SSH key text. */
  sshKey?: string;
  /** SSH key id. */
  sshKeyId?: number;
  /** Root password. */
  password?: string;
  /** Build script content. */
  buildScript?: string;
  /** Disk layout id. */
  diskLayout?: number;
  /** OS profile id. */
  profile?: number;
  /** Fully qualified domain name. */
  hostname?: string;
}

/** Request body for the legacy dedicated server rebuild endpoint. */
export interface BuildMetalRequest {
  /** Server package id being rebuilt. */
  mbPkgId: number;
  /** SSH key text. */
  sshKey?: string;
  /** SSH key id. */
  sshKeyId?: number;
  /** Root password. */
  password?: string;
  /** Build script content. */
  buildScript?: string;
  /** Disk layout id. */
  diskLayout?: number;
  /** OS profile id. */
  profile?: number;
  /** Fully qualified domain name. */
  hostname?: string;
}

/** Request body for creating BGP sessions for a server package. */
export interface CreateBgpSessionsRequest {
  /** Server package id the sessions are created for. */
  mbPkgId: number;
  /** BGP group id to create sessions under. */
  groupId: number;
  /** Requests an IPv6 session. */
  isIpv6?: boolean;
  /** Forces session redundancy. */
  redundant?: boolean;
}

/** Request body for cancelling a purchased cloud package. */
export interface CancelCloudPackageRequest {
  /** Server package id to cancel. */
  mbPkgId: number;
  /** DomU package name, when required. */
  domUPackage?: string;
  /** Cancellation comments. */
  comments?: string;
  /** Cancellation type. */
  cancelType: string;
  /** Confirms agreement to cancel. */
  agree: number;
  /** Account password, when required. */
  password?: string;
}

/** Identifies the switch port graph and time range to fetch. */
export interface GraphQuery {
  /** Switch port number. */
  port: number;
  /** Time range: "daily", "weekly", "monthly" or "yearly". */
  time: string;
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

  /** Rebuilds an existing cloud server with a new image and configuration. */
  public async buildServer(id: number, input: BuildServerRequest): Promise<ServerBuild> {
    return decodeServerBuild(
      await this.request("POST", `cloud/server/build/${id}`, formBody(serverForm(input)), "application/x-www-form-urlencoded")
    );
  }

  /** Unlinks a cloud server's billing package from its location without deleting the server. */
  public async unlinkServer(id: number): Promise<void> {
    await this.request("POST", `cloud/server/${id}/unlink`);
  }

  /** Boots up a stopped cloud server. */
  public async startServer(id: number, options: ServerActionOptions = {}): Promise<void> {
    const body = serverActionBody(options);
    await this.request("POST", `cloud/server/${id}/start`, body, body === undefined ? undefined : "application/json");
  }

  /** Shuts down a running cloud server. */
  public async stopServer(id: number, options: ServerActionOptions = {}): Promise<void> {
    const body = serverActionBody(options);
    await this.request("POST", `cloud/server/${id}/shutdown`, body, body === undefined ? undefined : "application/json");
  }

  /** Queues a scale job to move a server to a different package, returning the job id for polling with {@link Client.getJobStatus}. */
  public async scaleServer(id: number, input: ScaleServerRequest): Promise<number> {
    const body = JSON.stringify({
      pkg_name: input.pkgName,
      pkg_id: input.pkgId,
      allow_reboot: input.allowReboot
    });
    const data = await this.request("POST", `cloud/scale/${id}`, body, "application/json");
    return requireNumber(data, "scale server job id");
  }

  /** Gets the status of a queued job by its command name and job id. */
  public async getJobStatus(command: string, jobId: number): Promise<JobStatus> {
    return decodeJobStatus(await this.request("GET", `cloud/jobs/${encodeURIComponent(command)}/${jobId}`));
  }

  /**
   * Gets bandwidth statistics for a server package, optionally for a single date.
   *
   * The response shape is not modeled: the platform's own client treats this payload as
   * opaque JSON, and this SDK matches that rather than guessing a schema.
   */
  public async getBandwidthStats(mbpkgId: number, date?: string): Promise<unknown> {
    const params = new URLSearchParams();
    appendOptionalString(params, "date", date);
    const query = params.toString();
    return this.request("GET", `cloud/bw_stats/${mbpkgId}${query === "" ? "" : `?${query}`}`);
  }

  /** Gets bandwidth statistics for a server package over the platform's default range. Response shape is opaque. */
  public async getBandwidthStatsRange(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/bw_stats_range/${mbpkgId}`);
  }

  /** Gets the count of in-progress image provisioning jobs on the account. Response shape is opaque. */
  public async getImagesProvisioningJobsCount(): Promise<unknown> {
    return this.request("GET", "cloud/images-provisioning-jobs-count");
  }

  /** Lists base images available for server deployment. */
  public async getBaseImages(): Promise<Image[]> {
    const rows = await this.request("GET", "cloud/images/base");
    return requireArray(rows).map(decodeImage);
  }

  /** Lists private images available to the account for server deployment. */
  public async getPrivateImages(): Promise<Image[]> {
    const rows = await this.request("GET", "cloud/images/private");
    return requireArray(rows).map(decodeImage);
  }

  /** Replaces a base image with another image. Response shape is opaque. */
  public async replaceImage(id: number, replaceId: number): Promise<unknown> {
    return this.request("POST", `cloud/images/${id}/replace_image`, JSON.stringify({ replace_id: replaceId }), "application/json");
  }

  /** Gets IP limits for a server package. Response shape is opaque. */
  public async getIpLimits(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/iplimits/${mbpkgId}`);
  }

  /** Gets optional extras available for a server package. Response shape is opaque. */
  public async getCloudExtras(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/extras/${mbpkgId}`);
  }

  /** Updates reverse DNS for a cloud IPv4 address. */
  public async updateCloudIpv4ReverseDns(id: number, reverse: string): Promise<void> {
    await this.request("PUT", `cloud/ipv4/${id}`, JSON.stringify({ reverse }), "application/json");
  }

  /** Updates reverse DNS for a cloud IPv6 address. */
  public async updateCloudIpv6ReverseDns(id: number, reverse: string): Promise<void> {
    await this.request("PUT", `cloud/ipv6/${id}`, JSON.stringify({ reverse }), "application/json");
  }

  /** Lists boot kernels available for cloud servers. */
  public async getKernels(): Promise<Kernel[]> {
    const rows = await this.request("GET", "cloud/kernels");
    return requireArray(rows).map(decodeKernel);
  }

  /**
   * Gets one cloud deployment location by id.
   *
   * vAPI2 answers a missing location with HTTP 200 and a null data payload rather than a
   * 404, matching the same quirk documented on {@link Client.getSshKey}. This throws
   * {@link NetActuateNotFoundError} instead of returning a zero-valued location.
   */
  public async getCloudLocation(id: number): Promise<CloudLocation> {
    const path = `cloud/locations/${id}`;
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, `cloud location ${id} returned a null body, so it does not exist`);
    }
    return decodeCloudLocation(data);
  }

  /** Gets one cloud pool by id. Throws {@link NetActuateNotFoundError} on a null-body response. */
  public async getCloudPool(cloudPoolId: number): Promise<CloudPool> {
    const path = `cloud/pools/${cloudPoolId}`;
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, `cloud pool ${cloudPoolId} returned a null body, so it does not exist`);
    }
    return decodeCloudPool(data);
  }

  /** Gets scaling options available for a server package. Response shape is opaque. */
  public async getScalingOptions(mbpkgId: number, options: ScalingOptionsQuery = {}): Promise<unknown> {
    const query = scalingOptionsQuery(options);
    const path = `cloud/scaling/${mbpkgId}${query === "" ? "" : `?${query}`}`;
    return this.request("GET", path);
  }

  /** Gets the status of an asynchronous server build. Throws {@link NetActuateNotFoundError} on a null-body response. */
  public async getServerBuildStatus(buildId: number): Promise<ServerBuildStatus> {
    const path = `cloud/server/build_status/${buildId}`;
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, `server build ${buildId} returned a null body, so it does not exist`);
    }
    return decodeServerBuildStatus(data);
  }

  /** Gets server deployment metadata, optionally for one contract type. Response shape is opaque. */
  public async getServerDeploymentInfo(contractType?: string): Promise<unknown> {
    const params = new URLSearchParams();
    appendOptionalString(params, "contract_type", contractType);
    const query = params.toString();
    return this.request("GET", `cloud/server/deploy/info${query === "" ? "" : `?${query}`}`);
  }

  /** Gets VNC status for a server. Response shape is opaque. */
  public async getServerVncStatus(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/server/vnc-status/${mbpkgId}`);
  }

  /** Updates mutable options for a server. Response shape is opaque. */
  public async updateServerOptions(mbpkgId: number, options: UpdateServerOptionsRequest): Promise<unknown> {
    const body = JSON.stringify({
      fqdn: options.fqdn,
      autorescue: options.autorescue,
      description: options.description,
      vcpus: options.vcpus,
      boot: options.boot,
      kernel_id: options.kernelId
    });
    return this.request("PUT", `cloud/options/${mbpkgId}`, body, "application/json");
  }

  /**
   * Deletes a server through the options-aware delete path, returning the deleted server's id.
   *
   * Unlike {@link Client.deleteServer}, this does not treat an already-absent server as
   * success; it reports whatever the platform returns.
   */
  public async deleteServerWithOptions(mbpkgId: number, options: DeleteServerOptions = {}): Promise<DeleteServerResponse> {
    const body = JSON.stringify({
      cancel_billing: options.cancelBilling,
      force_password: options.forcePassword,
      password: options.password
    });
    return decodeDeleteServerResponse(await this.request("POST", `cloud/server/${mbpkgId}/delete`, body, "application/json"));
  }

  /** Starts a filesystem check for a server. */
  public async runServerFsck(mbpkgId: number): Promise<void> {
    await this.request("POST", `cloud/server/${mbpkgId}/fsck`);
  }

  /** Lists IPv4 addresses attached to a server. */
  public async getServerIpv4(mbpkgId: number): Promise<ServerIPAddress[]> {
    const rows = await this.request("GET", `cloud/server/${mbpkgId}/ipv4`);
    return requireArray(rows).map(decodeServerIPAddress);
  }

  /** Lists IPv6 addresses attached to a server. */
  public async getServerIpv6(mbpkgId: number): Promise<ServerIPAddress[]> {
    const rows = await this.request("GET", `cloud/server/${mbpkgId}/ipv6`);
    return requireArray(rows).map(decodeServerIPAddress);
  }

  /** Lists queued jobs for a server. */
  public async listServerJobs(mbpkgId: number): Promise<JobStatus[]> {
    const rows = await this.request("GET", `cloud/server/${mbpkgId}/jobs`);
    return requireArray(rows).map(decodeJobStatus);
  }

  /** Gets one queued job for a server. Throws {@link NetActuateNotFoundError} on a null-body response. */
  public async getServerJob(mbpkgId: number, jobId: number): Promise<JobStatus> {
    const path = `cloud/server/${mbpkgId}/jobs/${jobId}`;
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, `job ${jobId} for server ${mbpkgId} returned a null body, so it does not exist`);
    }
    return decodeJobStatus(data);
  }

  /** Starts network reconfiguration for a server. */
  public async reconfigureServerNetwork(mbpkgId: number): Promise<void> {
    await this.request("POST", `cloud/server/${mbpkgId}/netconfig`);
  }

  /** Gets network IPs attached to a server. Response shape is opaque. */
  public async getServerNetworkIps(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/server/${mbpkgId}/networkips`);
  }

  /** Resets the root password for a server. Response shape is opaque. */
  public async resetServerRootPassword(mbpkgId: number, input: ResetServerRootPasswordRequest): Promise<unknown> {
    const body = JSON.stringify({ rootpass: input.rootPass, password: input.password });
    return this.request("POST", `cloud/server/${mbpkgId}/password`, body, "application/json");
  }

  /** Reboots a server, optionally forcing the action. */
  public async rebootServer(mbpkgId: number, options: ServerActionOptions = {}): Promise<void> {
    const body = serverActionBody(options);
    await this.request("POST", `cloud/server/${mbpkgId}/reboot`, body, body === undefined ? undefined : "application/json");
  }

  /** Starts rescue mode for a server. Response shape is opaque. */
  public async startServerRescue(mbpkgId: number, input: StartServerRescueRequest): Promise<unknown> {
    const body = JSON.stringify({ rescue_pass: input.rescuePass, password: input.password });
    return this.request("POST", `cloud/server/${mbpkgId}/rescue_start`, body, "application/json");
  }

  /** Stops rescue mode for a server. */
  public async stopServerRescue(mbpkgId: number): Promise<void> {
    await this.request("POST", `cloud/server/${mbpkgId}/rescue_stop`);
  }

  /** Gets BGP sessions for a server, optionally filtered by group type. Response shape is opaque. */
  public async getServerBgpSessions(mbpkgId: number, groupType?: string): Promise<unknown> {
    const params = new URLSearchParams();
    appendOptionalString(params, "group_type", groupType);
    const query = params.toString();
    return this.request("GET", `cloud/server/${mbpkgId}/sessions${query === "" ? "" : `?${query}`}`);
  }

  /** Gets status for a server. Throws {@link NetActuateNotFoundError} on a null-body response. */
  public async getServerStatus(mbpkgId: number): Promise<ServerStatus> {
    const path = `cloud/server/${mbpkgId}/status`;
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, `server ${mbpkgId} status returned a null body, so it does not exist`);
    }
    return decodeServerStatus(data);
  }

  /** Starts a VNC session for a server. Response shape is opaque. */
  public async startServerVnc(mbpkgId: number): Promise<unknown> {
    return this.request("POST", `cloud/server/${mbpkgId}/vnc`);
  }

  /** Gets monthly bandwidth data for a server. Response shape is opaque. */
  public async getServerMonthlyBandwidth(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/servermonthlybw/${mbpkgId}`);
  }

  /** Attempts an SSH login to a server using the given credentials. Response shape is opaque. */
  public async attemptSshConnection(input: AttemptSSHRequest): Promise<unknown> {
    const body = JSON.stringify({ mbpkgid: input.mbPkgId, username: input.username, password: input.password });
    return this.request("POST", "cloud/servers/attempt-ssh", body, "application/json");
  }

  /**
   * Gets the server associated with the caller's IP address.
   *
   * Throws {@link NetActuateNotFoundError} when no server matches, mirroring the null-body
   * quirk handled elsewhere for single-object vAPI2 lookups.
   */
  public async getCurrentServer(): Promise<Server> {
    const path = "cloud/servers/current";
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, "no server matched the caller's IP address");
    }
    return decodeServer(data);
  }

  /** Lists unprovisioned packages available to build. Response shape is opaque. */
  public async getUnprovisionedPackages(): Promise<unknown> {
    return this.request("GET", "cloud/servers/unprovisioned");
  }

  /** Gets usage statistics for cloud servers on the account. Response shape is opaque. */
  public async getCloudServersUsageInfo(): Promise<unknown> {
    return this.request("GET", "cloud/servers/usage/info");
  }

  /** Gets contract data for a server package. Throws {@link NetActuateNotFoundError} on a null-body response. */
  public async getVirtualServerContract(mbpkgId: number): Promise<ContractUsage> {
    const path = `cloud/servers/${mbpkgId}/contract`;
    const data = await this.request("GET", path);
    if (data === null) {
      throw this.notFoundError("GET", path, `server ${mbpkgId} contract returned a null body, so it does not exist`);
    }
    return decodeContractUsage(data);
  }

  /** Gets summary data for a server. Response shape is opaque. */
  public async getServerSummary(mbpkgId: number): Promise<unknown> {
    return this.request("GET", `cloud/serversummary/${mbpkgId}`);
  }

  /** Gets a plan id by plan name. Response shape is opaque. */
  public async getPlanId(planName: string): Promise<unknown> {
    return this.request("GET", `cloud/sizes/plan-id/${encodeURIComponent(planName)}`);
  }

  /** Lists deploy sizes available at a location. */
  public async getDeploySizes(location: string, options: DeploySizesQuery = {}): Promise<Size[]> {
    const query = deploySizesQuery(options);
    const path = `cloud/sizes/${encodeURIComponent(location)}${query === "" ? "" : `?${query}`}`;
    const rows = await this.request("GET", path);
    return requireArray(rows).map(decodeSize);
  }

  /** Lists storage locations, optionally filtered by cloud pool id. Response shape is opaque. */
  public async getStorageLocations(cloudPoolId?: number): Promise<unknown> {
    const params = new URLSearchParams();
    appendOptionalInt(params, "cloud_pool_id", cloudPoolId);
    const query = params.toString();
    return this.request("GET", `cloud/storage-locations${query === "" ? "" : `?${query}`}`);
  }

  /** Binds a firewall set to a cloud server interface. Response shape is opaque. */
  public async bindCloudFirewallSet(mbpkgId: number, input: BindCloudFirewallSetRequest): Promise<unknown> {
    const body = JSON.stringify({
      firewall_set_id: input.firewallSetId,
      interface_id: input.interfaceId,
      set_priority: input.setPriority
    });
    return this.request("POST", `cloud/${mbpkgId}/firewall-sets`, body, "application/json");
  }

  /** Unbinds a firewall set from a cloud server. */
  public async unbindCloudFirewallSet(mbpkgId: number, firewallSet: string): Promise<void> {
    await this.request("DELETE", `cloud/${mbpkgId}/firewall-sets/${encodeURIComponent(firewallSet)}`);
  }

  /** Creates a usage contract for an account resource. */
  public async createUsageContract(mbId: number): Promise<ContractUsage> {
    const body = JSON.stringify({ mb_id: mbId });
    return decodeContractUsage(await this.request("POST", "cloud/contract/usage", body, "application/json"));
  }

  /** Uploads and parses a cloud-init script, returning the platform's parsed representation. Response shape is opaque. */
  public async parseCloudInit(filename: string, content: string): Promise<unknown> {
    const boundary = `NatsFormBoundary${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
    const body =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      "Content-Type: application/octet-stream\r\n\r\n" +
      `${content}\r\n--${boundary}--\r\n`;
    return this.request("POST", "cloud/parse-cloud-init", body, `multipart/form-data; boundary=${boundary}`);
  }

  /** Lists every account service. */
  public async getServices(): Promise<Service[]> {
    const rows = await this.request("GET", "services");
    return requireArray(rows).map(decodeService);
  }

  /** Lists colocation services, optionally filtered by service id. */
  public async getColocationServices(serviceId?: number): Promise<ColocationService[]> {
    const rows = await this.request("GET", serviceListPath("services/colocation", "service_id", serviceId));
    return requireArray(rows).map(decodeColocationService);
  }

  /** Gets one colocation service by id. */
  public async getColocationService(id: number): Promise<ColocationService> {
    return decodeColocationService(await this.request("GET", `services/colocation/${id}`));
  }

  /** Lists IP transit services, optionally filtered by service id. */
  public async getIpTransitServices(serviceId?: number): Promise<IpTransitService[]> {
    const rows = await this.request("GET", serviceListPath("services/iptransit", "service_id", serviceId));
    return requireArray(rows).map(decodeIpTransitService);
  }

  /** Gets one IP transit service by id. */
  public async getIpTransitService(id: number): Promise<IpTransitService> {
    return decodeIpTransitService(await this.request("GET", `services/iptransit/${id}`));
  }

  /** Lists IP addresses assigned to IP transit services, optionally filtered by IP transit service id. */
  public async getIpTransitIpAddresses(serviceIptransitId?: number): Promise<IpTransitIpAddress[]> {
    const rows = await this.request("GET", serviceListPath("services/iptransit/ips", "service_iptransit_id", serviceIptransitId));
    return requireArray(rows).map(decodeIpTransitIpAddress);
  }

  /** Lists ports assigned to IP transit services, optionally filtered by IP transit service id. */
  public async getIpTransitPorts(serviceIptransitId?: number): Promise<IpTransitPort[]> {
    const rows = await this.request("GET", serviceListPath("services/iptransit/ports", "service_iptransit_id", serviceIptransitId));
    return requireArray(rows).map(decodeIpTransitPort);
  }

  /** Lists transport services, optionally filtered by service id. */
  public async getTransportServices(serviceId?: number): Promise<TransportService[]> {
    const rows = await this.request("GET", serviceListPath("services/transport", "service_id", serviceId));
    return requireArray(rows).map(decodeTransportService);
  }

  /** Gets one transport service by id. */
  public async getTransportService(id: number): Promise<TransportService> {
    return decodeTransportService(await this.request("GET", `services/transport/${id}`));
  }

  /** Lists ports assigned to transport services, optionally filtered by transport service id. */
  public async getTransportPorts(serviceTransportId?: number): Promise<TransportPort[]> {
    const rows = await this.request("GET", serviceListPath("services/transport/ports", "service_transport_id", serviceTransportId));
    return requireArray(rows).map(decodeTransportPort);
  }

  /** Gets the current status of every platform component, grouped by service and location. */
  public async getPlatformStatus(): Promise<PlatformStatusService[]> {
    return decodePlatformStatus(await this.request("GET", "platform/status"));
  }

  /** Lists platform change log entries. */
  public async getPlatformChangeLog(): Promise<PlatformChangeLogEntry[]> {
    const rows = await this.request("GET", "platform/change-log");
    return requireArray(rows).map(decodePlatformChangeLogEntry);
  }

  /** Gets one platform change log entry by id. */
  public async getPlatformChangeLogEntry(id: number): Promise<PlatformChangeLogEntry> {
    return decodePlatformChangeLogEntry(await this.request("GET", `platform/change-log/${id}`));
  }

  /** Lists the datacenters serving a location. */
  public async getPlatformDatacenters(location: string): Promise<Datacenter[]> {
    const rows = await this.request("GET", `platform/datacenters/${encodeURIComponent(location)}`);
    return requireArray(rows).map(decodeDatacenter);
  }

  /** Gets the options used to initialize looking glass calls. */
  public async getPlatformLookingGlassInit(): Promise<PlatformLookingGlassInit> {
    return decodePlatformLookingGlassInit(await this.request("GET", "platform/looking-glass/init"));
  }

  /** Executes a looking glass action with optional query parameters. */
  public async executePlatformLookingGlass(options: PlatformLookingGlassExecuteOptions = {}): Promise<PlatformLookingGlassResult> {
    const query = platformLookingGlassQuery(options);
    const path = `platform/looking-glass/execute${query === "" ? "" : `?${query}`}`;
    return decodePlatformLookingGlassResult(await this.request("GET", path));
  }

  /** Gets platform maintenance detail by id. */
  public async getPlatformMaintenanceInfo(id: number): Promise<PlatformMaintenanceInfo> {
    return decodePlatformMaintenanceInfo(await this.request("GET", `platform/maintenance-info/${id}`));
  }

  /** Gets active and upcoming platform incidents at a location. */
  public async getPlatformIncidents(location: string): Promise<PlatformEvents> {
    return decodePlatformEvents(await this.request("GET", `platform/incidents/${encodeURIComponent(location)}`));
  }

  /** Gets historic platform incidents at a location. */
  public async getPlatformIncidentHistory(location: string): Promise<PlatformEvents> {
    return decodePlatformEvents(await this.request("GET", `platform/incidents/history/${encodeURIComponent(location)}`));
  }

  /** Gets active and upcoming platform maintenance at a location. */
  public async getPlatformMaintenance(location: string): Promise<PlatformEvents> {
    return decodePlatformEvents(await this.request("GET", `platform/maintenance/${encodeURIComponent(location)}`));
  }

  /** Gets historic platform maintenance at a location. */
  public async getPlatformMaintenanceHistory(location: string): Promise<PlatformEvents> {
    return decodePlatformEvents(await this.request("GET", `platform/maintenance/history/${encodeURIComponent(location)}`));
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

  /** Lists every tag on the account, each with its resource assignments embedded. */
  public async getTags(): Promise<Tag[]> {
    const rows = await this.request("GET", "tags");
    return requireArray(rows).map(decodeTag);
  }

  /**
   * Gets one tag by id.
   *
   * There is no single-tag endpoint, so this lists every tag and filters for a match. When
   * no tag has that id, it throws {@link NetActuateNotFoundError} rather than returning
   * undefined, so a caller can distinguish "gone" from a request that failed outright.
   */
  public async getTag(id: number): Promise<Tag> {
    const tags = await this.getTags();
    const tag = tags.find((candidate) => candidate.id === id);
    if (tag === undefined) {
      throw this.notFoundError("GET", `tags/${id}`, `tag ${id} not found`);
    }
    return tag;
  }

  /** Creates a tag. */
  public async createTag(input: CreateTagRequest): Promise<Tag> {
    return decodeTag(await this.request("POST", "tags", createTagBody(input), "application/json"));
  }

  /** Updates a tag's name, description, icon, color and display flags. */
  public async updateTag(id: number, input: UpdateTagRequest): Promise<Tag> {
    return decodeTag(await this.request("PUT", `tags/${id}`, updateTagBody(input), "application/json"));
  }

  /** Deletes a tag. Deleting an already absent tag is treated as success. */
  public async deleteTag(id: number): Promise<void> {
    try {
      await this.request("DELETE", `tags/${id}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Attaches a tag to a resource. Assigning an already-attached tag is idempotent server-side. */
  public async assignTagResource(tagId: number, resourceName: string, identifier: number): Promise<void> {
    await this.request("POST", `tags/${tagId}/assign-resource`, tagResourceBody(resourceName, identifier), "application/json");
  }

  /** Detaches a tag from a resource. This removes only the association; the tag itself is not deleted. */
  public async removeTagResource(tagId: number, resourceName: string, identifier: number): Promise<void> {
    await this.request("POST", `tags/${tagId}/remove-resource`, tagResourceBody(resourceName, identifier), "application/json");
  }

  /** Lists the tags currently assigned to a resource. */
  public async getResourceTags(resourceName: string, resourceId: number): Promise<Tag[]> {
    const path = `tags/resource/${encodeURIComponent(resourceName)}/id/${resourceId}`;
    const rows = await this.request("GET", path);
    return requireArray(rows).map(decodeTag);
  }

  /** Lists the resources currently assigned to a tag. */
  public async getTagResources(tagId: number): Promise<TagResource[]> {
    const rows = await this.request("GET", `tags/${tagId}/resources`);
    return requireArray(rows).map(decodeTagResource);
  }

  /** Lists log entries recorded against a tag. */
  public async getTagLogs(tagId: number): Promise<TagLog[]> {
    const rows = await this.request("GET", `tags/${tagId}/logs`);
    return requireArray(rows).map(decodeTagLog);
  }

  /** Lists SSH keys registered on the account. */
  public async getSshKeys(): Promise<SshKey[]> {
    const rows = await this.request("GET", "account/ssh_keys");
    return requireArray(rows).map(decodeSshKey);
  }

  /**
   * Gets one SSH key by id.
   *
   * vAPI2 answers a missing key with HTTP 200 and a null data payload rather than a 404 or
   * a 422. Without translating that into an error, a caller would get back an empty,
   * zero-valued key that looks like a real record. This throws
   * {@link NetActuateNotFoundError} instead.
   */
  public async getSshKey(id: number): Promise<SshKey> {
    const key = decodeSshKey(await this.request("GET", `account/ssh_key/${id}`));
    if (key.id === 0) {
      throw this.notFoundError("GET", `account/ssh_key/${id}`, `ssh key ${id} returned a null body, so it does not exist`);
    }
    return key;
  }

  /** Creates an SSH key from its name and public key text. */
  public async createSshKey(input: CreateSshKeyRequest): Promise<SshKey> {
    return decodeSshKey(
      await this.request("POST", "account/ssh_key", formBody({ ssh_key: input.key, name: input.name }), "application/x-www-form-urlencoded")
    );
  }

  /** Updates an SSH key's name and public key text. */
  public async updateSshKey(id: number, input: UpdateSshKeyRequest): Promise<SshKey> {
    return decodeSshKey(await this.request("PATCH", `account/ssh_key/${id}`, JSON.stringify({ name: input.name, ssh_key: input.key }), "application/json"));
  }

  /** Deletes an SSH key. Deleting an already absent key is treated as success. */
  public async deleteSshKey(id: number): Promise<void> {
    try {
      await this.request("DELETE", `account/ssh_key/${id}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Lists external IP sets available for use in firewall match criteria. */
  public async getFirewallExternalIpSets(): Promise<FirewallExternalIpSet[]> {
    const rows = await this.request("GET", "firewall/external-ipsets");
    return requireArray(rows).map(decodeFirewallExternalIpSet);
  }

  /** Gets one external IP set by id. */
  public async getFirewallExternalIpSet(id: number): Promise<FirewallExternalIpSet> {
    return decodeFirewallExternalIpSet(await this.request("GET", `firewall/external-ipsets/${id}`));
  }

  /** Reports whether cloud firewall management is available for the account. */
  public async getFirewallManageEnabled(): Promise<FirewallManageEnabled> {
    return decodeFirewallManageEnabled(await this.request("GET", "firewall/manage/enabled"));
  }

  /** Lists cloud firewall sets on the account. */
  public async getFirewallSets(): Promise<FirewallSet[]> {
    const rows = await this.request("GET", "firewall/sets");
    return requireArray(rows).map(decodeFirewallSet);
  }

  /** Gets one cloud firewall set by id. */
  public async getFirewallSet(id: number): Promise<FirewallSet> {
    return decodeFirewallSet(await this.request("GET", `firewall/sets/${id}`));
  }

  /** Creates a cloud firewall set. */
  public async createFirewallSet(name: string, description: string, enabled: boolean): Promise<FirewallSet> {
    return decodeFirewallSet(await this.request("POST", "firewall/sets", formBody(firewallSetForm(name, description, enabled)), "application/x-www-form-urlencoded"));
  }

  /** Updates a cloud firewall set's name, description and enabled flag. */
  public async updateFirewallSet(id: number, name: string, description: string, enabled: boolean): Promise<FirewallSet> {
    return decodeFirewallSet(
      await this.request("PUT", `firewall/sets/${id}`, formBody(firewallSetForm(name, description, enabled)), "application/x-www-form-urlencoded")
    );
  }

  /** Deletes a cloud firewall set. Deleting an already absent set is treated as success. */
  public async deleteFirewallSet(id: number): Promise<void> {
    try {
      await this.request("DELETE", `firewall/sets/${id}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Enables a cloud firewall set. */
  public async enableFirewallSet(id: number): Promise<void> {
    await this.request("PUT", `firewall/sets/${id}/enable`);
  }

  /** Disables a cloud firewall set. */
  public async disableFirewallSet(id: number): Promise<void> {
    await this.request("PUT", `firewall/sets/${id}/disable`);
  }

  /** Creates a draft copy of a firewall set that can be edited and published or discarded. */
  public async createDraftFirewallSet(id: number): Promise<FirewallSet> {
    return decodeFirewallSet(await this.request("POST", `firewall/sets/${id}/create-draft`));
  }

  /** Publishes a draft firewall set, replacing the set it was drafted from. */
  public async publishDraftFirewallSet(draftId: number): Promise<FirewallSet> {
    return decodeFirewallSet(await this.request("POST", `firewall/sets/publish-draft/${draftId}`));
  }

  /** Discards a draft firewall set without publishing it. Discarding an already absent draft is treated as success. */
  public async deleteDraftFirewallSet(draftId: number): Promise<void> {
    try {
      await this.request("DELETE", `firewall/sets/delete-draft/${draftId}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Re-syncs a firewall set's rules to every VM it is attached to. */
  public async syncFirewallSetRules(setId: number): Promise<void> {
    await this.request("POST", `firewall/sets/${setId}/vm/sync-all`);
  }

  /** Lists the rules in a firewall set. */
  public async getFirewallRules(setId: number): Promise<FirewallRule[]> {
    const rows = await this.request("GET", `firewall/sets/${setId}/rules`);
    return requireArray(rows).map(decodeFirewallRule);
  }

  /** Moves a rule within a draft firewall set relative to another rule. */
  public async reorderFirewallRules(setId: number, input: ReorderFirewallRulesRequest): Promise<void> {
    await this.request("POST", `firewall/sets/${setId}/rules/re-order`, JSON.stringify(reorderFirewallRulesBody(input)), "application/json");
  }

  /** Gets one rule from a firewall set by id. */
  public async getFirewallRule(setId: number, ruleId: number): Promise<FirewallRule> {
    return decodeFirewallRule(await this.request("GET", `firewall/sets/${setId}/rules/${ruleId}`));
  }

  /** Creates a rule in a firewall set. */
  public async createFirewallRule(setId: number, input: CreateFirewallRuleRequest): Promise<FirewallRule> {
    return decodeFirewallRule(await this.request("POST", `firewall/sets/${setId}/rules`, firewallRuleRequestBody(input), "application/json"));
  }

  /** Updates a rule in a firewall set. */
  public async updateFirewallRule(setId: number, ruleId: number, input: CreateFirewallRuleRequest): Promise<FirewallRule> {
    return decodeFirewallRule(await this.request("PUT", `firewall/${setId}/${ruleId}`, firewallRuleRequestBody(input), "application/json"));
  }

  /** Deletes a rule from a firewall set. Deleting an already absent rule is treated as success. */
  public async deleteFirewallRule(setId: number, ruleId: number): Promise<void> {
    try {
      await this.request("DELETE", `firewall/${setId}/rules/${ruleId}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Lists the VMs attached to a firewall set. */
  public async getFirewallSetVms(setId: number): Promise<FirewallSetVm[]> {
    const rows = await this.request("GET", `firewall/sets/${setId}/vm-list`);
    return requireArray(rows).map(decodeFirewallSetVm);
  }

  /** Lists the VMs available to attach to a firewall set. */
  public async getFirewallSetAvailableVms(setId: number, options: FirewallAvailableVmOptions = {}): Promise<FirewallSetVm[]> {
    const query = firewallAvailableVmQuery(options);
    const path = `firewall/sets/${setId}/available-vm-list${query === "" ? "" : `?${query}`}`;
    const rows = await this.request("GET", path);
    return requireArray(rows).map(decodeFirewallSetVm);
  }

  /** Lists the firewall set attachments related to a VM. */
  public async getFirewallSetRelatedVms(mbpkgid: number, options: FirewallRelatedSetOptions = {}): Promise<FirewallSetVm[]> {
    const query = firewallRelatedSetQuery(options);
    const path = `firewall/sets/vm/${mbpkgid}/related${query === "" ? "" : `?${query}`}`;
    const rows = await this.request("GET", path);
    return requireArray(rows).map(decodeFirewallSetVm);
  }

  /** Attaches a VM's network interface to a firewall set. */
  public async attachFirewallSetVm(setId: number, mbpkgid: number, interfaceId: number, setPriority: number): Promise<FirewallSetVm[]> {
    const body = JSON.stringify({ vm_list: [{ mbpkgid, interface_id: interfaceId, set_priority: setPriority }] });
    const rows = await this.request("POST", `firewall/sets/${setId}/vm/attach`, body, "application/json");
    return requireArray(rows).map(decodeFirewallSetVm);
  }

  /** Detaches a VM from a firewall set. */
  public async detachFirewallSetVm(setId: number, mbpkgid: number): Promise<void> {
    await this.request("POST", `firewall/sets/${setId}/vm/detach/${mbpkgid}`);
  }

  /** Detaches a VM from a firewall set by attachment relation id. */
  public async detachFirewallSetVmRelation(relationId: number): Promise<void> {
    await this.request("POST", `firewall/sets/vm/detach/${relationId}`);
  }

  /** Detaches every VM from a firewall set. */
  public async detachAllFirewallSetVms(setId: number): Promise<void> {
    await this.request("POST", `firewall/sets/${setId}/vm/detach-all`);
  }

  /** Lists the customer VLANs on the account. */
  public async getVlans(): Promise<Vlan[]> {
    const rows = await this.request("GET", "cloud/networking/vlans");
    return requireArray(rows).map(decodeVlan);
  }

  /** Gets one customer VLAN by id. */
  public async getCustomerVlan(customerVlanId: number): Promise<Vlan> {
    return decodeVlan(await this.request("GET", `cloud/networking/vlans/${customerVlanId}`));
  }

  /** Lists the customer VLANs provisioned at a location. */
  public async listCustomerVlansAtLocation(locationId: number): Promise<Vlan[]> {
    const rows = await this.request("GET", `cloud/networking/locations/${locationId}/vlans`);
    return requireArray(rows).map(decodeVlan);
  }

  /** Lists the network interfaces attached to a server. */
  public async getServerNics(mbpkgid: number): Promise<ServerNic[]> {
    const rows = await this.request("GET", `cloud/networking/nics/${mbpkgid}`);
    return requireArray(rows).map(decodeServerNic);
  }

  /** Attaches a new network interface to a server on a customer VLAN. */
  public async attachServerNic(mbpkgid: number, input: ServerNicAttachRequest): Promise<ServerNic> {
    const body = JSON.stringify({ customer_vlan_id: input.customerVlanId });
    return decodeServerNicFromResponse(await this.request("POST", `cloud/networking/nics/${mbpkgid}`, body, "application/json"));
  }

  /** Updates a server network interface's VLAN attachment and order. */
  public async updateServerNic(nicId: number, input: ServerNicUpdateRequest): Promise<ServerNic> {
    const body = JSON.stringify({ mbpkgid: input.mbpkgid, customer_vlan_id: input.customerVlanId, attach_order: input.attachOrder });
    return decodeServerNicFromResponse(await this.request("PUT", `cloud/networking/nics/${nicId}`, body, "application/json"));
  }

  /** Detaches a network interface from a server. Detaching an already absent interface is treated as success. */
  public async detachServerNic(mbpkgid: number, nicId: number): Promise<void> {
    const params = new URLSearchParams({ mbpkgid: String(mbpkgid) });
    try {
      await this.request("DELETE", `cloud/networking/nics/${nicId}?${params.toString()}`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Returns tickets archived in the legacy support ticket databases. */
  public async getLegacyTickets(): Promise<Ticket[]> {
    const rows = await this.request("GET", "support/legacy-tickets");
    return requireArray(rows).map(decodeTicket);
  }

  /** Lists support tickets, optionally filtered to open tickets or including ticket statistics. */
  public async getTickets(options: TicketListOptions = {}): Promise<Ticket[]> {
    const rows = await this.request("GET", ticketListPath("support/tickets", options));
    return requireArray(rows).map(decodeTicket);
  }

  /** Creates a support ticket. */
  public async createTicket(input: CreateTicketRequest): Promise<Ticket> {
    return decodeTicket(await this.request("POST", "support/tickets", createTicketBody(input), "application/json"));
  }

  /** Lists support tickets from the legacy ticket system, optionally filtered to open tickets. */
  public async getOldTickets(options: TicketListOptions = {}): Promise<Ticket[]> {
    const rows = await this.request("GET", ticketListPath("support/tickets-old", options));
    return requireArray(rows).map(decodeTicket);
  }

  /** Gets one legacy support ticket by id. */
  public async getOldTicket(id: string): Promise<Ticket> {
    return decodeTicket(await this.request("GET", `support/tickets-old/${encodeURIComponent(id)}`));
  }

  /** Lists the departments available when creating a support ticket. */
  public async getTicketDepartments(): Promise<TicketDepartment[]> {
    const rows = await this.request("GET", "support/tickets/departments");
    return requireArray(rows).map(decodeTicketDepartment);
  }

  /** Gets one support ticket by id. */
  public async getTicket(id: string): Promise<Ticket> {
    return decodeTicket(await this.request("GET", `support/tickets/${encodeURIComponent(id)}`));
  }

  /** Lists the replies posted to a support ticket. */
  public async getTicketReplies(id: string): Promise<TicketReply[]> {
    const rows = await this.request("GET", `support/tickets/${encodeURIComponent(id)}/replies`);
    return requireArray(rows).map(decodeTicketReply);
  }

  /** Gets metadata, and optionally base64 content, for a ticket or reply attachment. */
  public async getTicketAttachment(
    id: string,
    attachmentType: string,
    relId: string,
    index: number,
    options: GetTicketAttachmentOptions = {}
  ): Promise<TicketAttachment> {
    const query = ticketAttachmentQuery(options);
    const path = `${ticketAttachmentPath(id, attachmentType, relId, index)}${query === "" ? "" : `?${query}`}`;
    return decodeTicketAttachment(await this.request("GET", path));
  }

  /** Downloads the binary content of a ticket or reply attachment. */
  public async downloadTicketAttachment(id: string, attachmentType: string, relId: string, index: number): Promise<Uint8Array> {
    return this.requestRaw("GET", `${ticketAttachmentPath(id, attachmentType, relId, index)}/download`);
  }

  /** Gets the inline preview content of a ticket or reply attachment. */
  public async previewTicketAttachment(id: string, attachmentType: string, relId: string, index: number): Promise<Uint8Array> {
    return this.requestRaw("GET", `${ticketAttachmentPath(id, attachmentType, relId, index)}/preview`);
  }

  /** Closes a support ticket. */
  public async closeTicket(id: string): Promise<void> {
    await this.request("POST", `support/tickets/${encodeURIComponent(id)}/close`);
  }

  /** Closes a support ticket through the alternate close path. */
  public async closeTicketAlias(id: string): Promise<void> {
    await this.request("POST", `support/tickets/close/${encodeURIComponent(id)}`);
  }

  /** Replies to a support ticket. */
  public async replyToTicket(id: string, input: ReplyTicketRequest): Promise<TicketReply> {
    return decodeTicketReply(await this.request("POST", `support/tickets/${encodeURIComponent(id)}/reply`, replyTicketBody(input), "application/json"));
  }

  /** Replies to a support ticket through the alternate reply path. */
  public async replyToTicketAlias(id: string, input: ReplyTicketRequest): Promise<TicketReply> {
    return decodeTicketReply(
      await this.request("POST", `support/tickets/reply/${encodeURIComponent(id)}`, replyTicketBody(input), "application/json")
    );
  }

  /** Lists the secret lists on the account. */
  public async getSecretLists(): Promise<SecretList[]> {
    const rows = await this.request("GET", "secrets/lists");
    return requireArray(rows).map(decodeSecretList);
  }

  /** Gets one secret list by id. */
  public async getSecretList(id: number): Promise<SecretList> {
    return decodeSecretList(await this.request("GET", `secrets/lists/${id}`));
  }

  /** Creates a secret list. */
  public async createSecretList(name: string): Promise<SecretList> {
    return decodeSecretList(await this.request("POST", "secrets/lists", formBody({ name }), "application/x-www-form-urlencoded"));
  }

  /** Updates a secret list's name. */
  public async updateSecretList(id: number, name: string): Promise<SecretList> {
    return decodeSecretList(await this.request("POST", `secrets/lists/${id}`, formBody({ name }), "application/x-www-form-urlencoded"));
  }

  /** Deletes a secret list. */
  public async deleteSecretList(id: number): Promise<void> {
    await this.request("DELETE", `secrets/lists/${id}`);
  }

  /** Lists the values stored in a secret list. */
  public async getSecretListValues(listId: number): Promise<SecretListValue[]> {
    const rows = await this.request("GET", `secrets/lists/${listId}/values`);
    return requireArray(rows).map(decodeSecretListValue);
  }

  /** Lists every secret value visible to the account, across every secret list. */
  public async getAllSecretValues(): Promise<SecretListValue[]> {
    const rows = await this.request("GET", "secrets/all-values");
    return requireArray(rows).map(decodeSecretListValue);
  }

  /** Gets one value from a secret list. */
  public async getSecretListValue(listId: number, valueId: number): Promise<SecretListValue> {
    return decodeSecretListValue(await this.request("GET", `secrets/lists/${listId}/values/${valueId}`));
  }

  /** Creates a key/value entry in a secret list. */
  public async createSecretListValue(listId: number, key: string, value: string): Promise<SecretListValue> {
    const body = formBody({ secret_key: key, secret_value: value });
    return decodeSecretListValue(await this.request("POST", `secrets/lists/${listId}/values`, body, "application/x-www-form-urlencoded"));
  }

  /** Updates a key/value entry in a secret list. */
  public async updateSecretListValue(listId: number, valueId: number, key: string, value: string): Promise<SecretListValue> {
    const body = formBody({ secret_key: key, secret_value: value });
    return decodeSecretListValue(
      await this.request("POST", `secrets/lists/${listId}/values/${valueId}`, body, "application/x-www-form-urlencoded")
    );
  }

  /** Deletes a value from a secret list. */
  public async deleteSecretListValue(listId: number, valueId: number): Promise<void> {
    await this.request("DELETE", `secrets/lists/${listId}/values/${valueId}`);
  }

  /** Lists dedicated devices available for purchase, filtered by any of the given criteria. */
  public async filterDedicatedDevices(options: DedicatedDeviceFilterOptions = {}): Promise<DedicatedDevice[]> {
    const query = dedicatedDeviceFilterQuery(options);
    const path = `dedicated/filter-dedicated-devices${query === "" ? "" : `?${query}`}`;
    return unwrapDedicatedDeviceList(await this.request("GET", path));
  }

  /** Lists locations that support dedicated servers. */
  public async listDedicatedLocations(): Promise<DedicatedLocation[]> {
    const rows = await this.request("GET", "dedicated/locations");
    return requireArray(rows).map(decodeDedicatedLocation);
  }

  /** Lists OS profiles compatible with a dedicated device, optionally filtered to buyable profiles. */
  public async listDedicatedDeviceOsProfiles(deviceId: number, isBuyable?: boolean): Promise<DedicatedOsProfile[]> {
    const params = new URLSearchParams();
    if (isBuyable !== undefined) {
      params.set("is_buyable", isBuyable ? "1" : "0");
    }
    const query = params.toString();
    const path = `dedicated/os/device/${deviceId}${query === "" ? "" : `?${query}`}`;
    const rows = await this.request("GET", path);
    return requireArray(rows).map(decodeDedicatedOsProfile);
  }

  /** Lists dedicated server plans available at a location. */
  public async listDedicatedPlans(locationId: number): Promise<DedicatedPlan[]> {
    const rows = await this.request("GET", `dedicated/plans/${locationId}`);
    return requireArray(rows).map((row) => requireObject(row));
  }

  /** Deploys an already purchased dedicated server package. */
  public async deployDedicatedServer(mbPkgId: number, input: DedicatedServerBuildRequest): Promise<MetalBuild> {
    const body = JSON.stringify(dedicatedServerBuildBody(input));
    return decodeMetalBuild(await this.request("POST", `dedicated/server/build/${mbPkgId}`, body, "application/json"));
  }

  /** Purchases a dedicated device without deploying it. */
  public async buyDedicatedServer(deviceId: number): Promise<MetalBuild> {
    return decodeMetalBuild(await this.request("POST", `dedicated/server/buy/${deviceId}`));
  }

  /** Purchases a dedicated device and deploys it in one call. */
  public async buyAndDeployDedicatedServer(deviceId: number, input: DedicatedServerBuildRequest): Promise<MetalBuild> {
    const body = JSON.stringify(dedicatedServerBuildBody(input));
    return decodeMetalBuild(await this.request("POST", `dedicated/server/buy_build/${deviceId}`, body, "application/json"));
  }

  /** Updates reverse DNS for a dedicated server's IPv4 address. */
  public async updateDedicatedServerIpv4Reverse(input: DedicatedIpv4ReverseRequest): Promise<void> {
    const body = JSON.stringify({ mbpkgid: input.mbPkgId, id: input.id, reverse: input.reverse });
    await this.request("PUT", "dedicated/server/ipv4_reverse", body, "application/json");
  }

  /** Asks the platform to soft reset a dedicated server. */
  public async softResetDedicatedServer(mbPkgId: number): Promise<void> {
    await this.request("POST", `dedicated/server/soft-reset/${mbPkgId}`);
  }

  /** Deletes a dedicated server package. Deleting an already absent server is treated as success. */
  public async deleteDedicatedServer(mbPkgId: number, options: DedicatedServerActionRequest = {}): Promise<void> {
    const body = dedicatedActionBody(options);
    try {
      await this.request("POST", `dedicated/server/${mbPkgId}/delete`, body, body === undefined ? undefined : "application/json");
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Asks the platform to reboot a dedicated server. */
  public async rebootDedicatedServer(mbPkgId: number, options: DedicatedServerActionRequest = {}): Promise<void> {
    const body = dedicatedActionBody(options);
    await this.request("POST", `dedicated/server/${mbPkgId}/reboot`, body, body === undefined ? undefined : "application/json");
  }

  /** Asks the platform to shut down a dedicated server. */
  public async shutdownDedicatedServer(mbPkgId: number, options: DedicatedServerActionRequest = {}): Promise<void> {
    const body = dedicatedActionBody(options);
    await this.request("POST", `dedicated/server/${mbPkgId}/shutdown`, body, body === undefined ? undefined : "application/json");
  }

  /** Asks the platform to start a dedicated server. */
  public async startDedicatedServer(mbPkgId: number, options: DedicatedServerActionRequest = {}): Promise<void> {
    const body = dedicatedActionBody(options);
    await this.request("POST", `dedicated/server/${mbPkgId}/start`, body, body === undefined ? undefined : "application/json");
  }

  /** Gets the power status for a dedicated server. */
  public async getDedicatedServerPowerStatus(mbPkgId: number, options: DedicatedServerActionRequest = {}): Promise<DedicatedPowerStatus> {
    const body = dedicatedActionBody(options);
    return requireObject(
      await this.request("POST", `dedicated/server/${mbPkgId}/status`, body, body === undefined ? undefined : "application/json")
    );
  }

  /** Lists dedicated servers on the account. */
  public async listDedicatedServers(): Promise<Metal[]> {
    const rows = await this.request("GET", "dedicated/servers");
    return requireArray(rows).map(decodeMetal);
  }

  /** Gets one dedicated server by id, from the legacy dedicated servers endpoint. */
  public async getMetal(id: number): Promise<Metal> {
    return decodeMetal(await this.request("GET", `dedicated/servers/${id}`));
  }

  /** Gets the build status for a dedicated server deployment, from the legacy dedicated build endpoint. */
  public async getMetalBuildStatus(buildId: number): Promise<DedicatedServerBuildStatus> {
    return decodeDedicatedServerBuildStatus(await this.request("GET", `dedicated/server/build_status/${buildId}`));
  }

  /**
   * Purchases and builds a dedicated device in one call, through the legacy buy-and-build
   * endpoint. Distinct from {@link Client.buyAndDeployDedicatedServer}, which purchases a
   * specific device by id through the newer dedicated server API.
   */
  public async createMetal(input: CreateMetalRequest): Promise<MetalBuild> {
    const body = formBody(createMetalForm(input));
    return decodeMetalBuild(await this.request("POST", "dedicated/server/buy_build", body, "application/x-www-form-urlencoded"));
  }

  /**
   * Rebuilds a dedicated server through the legacy rebuild endpoint. Distinct from
   * {@link Client.deployDedicatedServer}, which builds through the newer dedicated server API.
   */
  public async buildMetal(id: number, input: BuildMetalRequest): Promise<MetalBuild> {
    const body = formBody(buildMetalForm(input));
    return decodeMetalBuild(await this.request("POST", `dedicated/server/re_build/${id}`, body, "application/x-www-form-urlencoded"));
  }

  /** Lists custom images captured on the account. */
  public async getMyImages(): Promise<Image[]> {
    const rows = await this.request("GET", "cloud/images/my");
    return requireArray(rows).map(decodeImage);
  }

  /** Gets one custom image by id. */
  public async getImage(id: number): Promise<Image> {
    return decodeImage(await this.request("GET", `cloud/images/${id}`));
  }

  /** Queues a job that captures a custom image from a server, returning the queue id for polling with {@link Client.getImageQueueStatus}. */
  public async createImage(input: CreateImageRequest): Promise<CreateImageResponse> {
    const body = formBody(createImageForm(input));
    return decodeCreateImageResponse(await this.request("POST", "cloud/images/create", body, "application/x-www-form-urlencoded"));
  }

  /** Updates a custom image's name and description. */
  public async editImage(id: number, name: string, description: string): Promise<void> {
    const body = JSON.stringify({ os: name, description });
    await this.request("PATCH", `cloud/images/${id}/edit`, body, "application/json");
  }

  /** Queues a job that deletes a custom image, returning the queue id for polling with {@link Client.getImageQueueStatus}. */
  public async deleteImage(id: number): Promise<DeleteImageResponse> {
    return decodeDeleteImageResponse(await this.request("DELETE", `cloud/images/${id}/delete`));
  }

  /** Gets the progress of a queued image job. */
  public async getImageQueueStatus(queueId: number): Promise<ImageQueueStatus> {
    return decodeImageQueueStatus(await this.request("GET", `cloud/images/queue_status/${queueId}`));
  }

  /**
   * Polls a queued image job until it completes, fails, or the timeout elapses.
   *
   * Throws when the job reports "Failed" or when the timeout is reached before the job
   * reports "Complete".
   */
  public async waitForImageQueue(queueId: number, options: WaitForImageQueueOptions = {}): Promise<ImageQueueStatus> {
    const intervalMs = options.intervalMs ?? 3_000;
    const timeoutMs = options.timeoutMs ?? 1_800_000;
    const sleep = options.sleep ?? delay;
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const status = await this.getImageQueueStatus(queueId);
      if (status.status === "Complete") {
        return status;
      }
      if (status.status === "Failed") {
        throw new Error(`image job ${queueId} failed: ${status.response}`);
      }
      if (Date.now() >= deadline) {
        throw new Error(`timeout waiting for image job ${queueId} to complete`);
      }
      await sleep(intervalMs);
    }
  }

  /** Binds a firewall set to a BGP group interface. */
  public async bindBgpGroupFirewallSet(groupId: number, input: BindBgpGroupFirewallSetRequest): Promise<BgpGroupFirewallSetBinding> {
    const body = JSON.stringify({
      id: input.id,
      firewall_set_id: input.firewallSetId,
      interface_number: input.interfaceNumber,
      set_priority: input.setPriority
    });
    return decodeBgpGroupFirewallSetBinding(
      await this.request("POST", `bgp/bgp-groups/${groupId}/firewall-sets`, body, "application/json")
    );
  }

  /** Removes a firewall set binding from a BGP group. */
  public async unbindBgpGroupFirewallSet(groupId: number, firewallSetId: number): Promise<void> {
    await this.request("DELETE", `bgp/bgp-groups/${groupId}/firewall-sets/${firewallSetId}`);
  }

  /** Asks the platform to refresh every session in a BGP group. */
  public async refreshBgpGroupSessions(groupId: number): Promise<void> {
    await this.request("POST", `bgp/bgpgroup/${groupId}/refresh`);
  }

  /** Asks the platform to start every session in a BGP group. */
  public async startBgpGroupSessions(groupId: number): Promise<void> {
    await this.request("POST", `bgp/bgpgroup/${groupId}/start`);
  }

  /** Asks the platform to stop every session in a BGP group. */
  public async stopBgpGroupSessions(groupId: number): Promise<void> {
    await this.request("POST", `bgp/bgpgroup/${groupId}/stop`);
  }

  /** Gets one BGP session by id. */
  public async getBgpSession(id: number): Promise<BgpSession> {
    return decodeBgpSession(await this.request("GET", `bgp/bgpsession/${id}`));
  }

  /**
   * Lists the BGP sessions belonging to a server package, matched by comparing every account
   * session's customer peering address against the package's own IP addresses.
   */
  public async getBgpSessions(mbPkgId: number): Promise<BgpSession[]> {
    const rows = requireArray(await this.request("GET", "bgp/bgpsessions")).map(decodeBgpSession);
    if (rows.length === 0) {
      return [];
    }

    const ips = await this.getNetworkIps(mbPkgId);
    const knownIps = new Set<string>();
    for (const entry of ips.ipv4) {
      knownIps.add(entry.ip);
    }
    for (const entry of ips.ipv6) {
      knownIps.add(entry.ip);
      const expanded = expandIpv6(entry.ip);
      if (expanded !== undefined) {
        knownIps.add(expanded);
      }
    }
    if (knownIps.size === 0) {
      return [];
    }

    const sessions: BgpSession[] = [];
    for (const session of rows) {
      if (knownIps.has(session.customerIp)) {
        sessions.push(await this.getBgpSession(session.id));
      }
    }
    return sessions;
  }

  /** Creates BGP sessions for a server package under a BGP group. */
  public async createBgpSessions(input: CreateBgpSessionsRequest): Promise<BgpSession> {
    const body = formBody({
      mbpkgid: input.mbPkgId,
      group_id: input.groupId,
      ipv6: input.isIpv6 === true ? 1 : undefined,
      redundant: input.redundant === true ? 1 : undefined
    });
    return decodeBgpSession(await this.request("POST", "bgp/bgpcreatesessions", body, "application/x-www-form-urlencoded"));
  }

  /** Deletes a BGP session by id. Deleting an already absent session is treated as success. */
  public async deleteBgpSession(sessionId: number): Promise<void> {
    try {
      await this.request("POST", `bgp/bgpsession/${sessionId}/delete`);
    } catch (error) {
      if (error instanceof NetActuateNotFoundError) {
        return;
      }
      throw error;
    }
  }

  /** Asks the platform to refresh a BGP session. */
  public async refreshBgpSession(sessionId: number): Promise<void> {
    await this.request("POST", `bgp/bgpsession/${sessionId}/refresh`);
  }

  /** Asks the platform to start a BGP session. */
  public async startBgpSession(sessionId: number): Promise<void> {
    await this.request("POST", `bgp/bgpsession/${sessionId}/start`);
  }

  /** Asks the platform to stop a BGP session. */
  public async stopBgpSession(sessionId: number): Promise<void> {
    await this.request("POST", `bgp/bgpsession/${sessionId}/stop`);
  }

  /** Gets the account's BGP summary payload. */
  public async getBgpSummary(): Promise<BgpSummary> {
    return requireObject(await this.request("GET", "bgp/bgpsummary"));
  }

  /** Gets BGP dashboard data, optionally filtered by group type and flap window. */
  public async getBgpDashboard(options: BgpDashboardOptions = {}): Promise<BgpDashboard> {
    const query = bgpDashboardQuery(options);
    const path = `bgp/dashboard${query === "" ? "" : `?${query}`}`;
    return requireObject(await this.request("GET", path));
  }

  /** Creates an account BGP group. */
  public async createBgpGroup(input: CreateBgpGroupRequest): Promise<BgpGroup> {
    const body = JSON.stringify({ name: input.name, description: input.description, group_type: emptyToUndefined(input.groupType) });
    return decodeBgpGroup(await this.request("POST", "bgp/bgpgroup", body, "application/json"));
  }

  /** Gets one account BGP group by id. */
  public async getBgpGroup(id: number): Promise<BgpGroup> {
    return decodeBgpGroup(await this.request("GET", `bgp/bgpgroup/${id}`));
  }

  /** Lists account BGP groups, optionally filtered by group type. */
  public async listBgpGroups(groupType?: string): Promise<BgpGroup[]> {
    const rows = await this.request("GET", groupTypeListPath("bgp/bgpgroups", groupType));
    return requireArray(rows).map(decodeBgpGroup);
  }

  /** Purchases anycast BGP prefixes for the account. */
  public async buyBgpPrefixes(input: BuyBgpPrefixesRequest): Promise<BgpPrefix> {
    const body = JSON.stringify({
      name: input.name,
      group_id: input.groupId,
      asn_id: input.asnId,
      anycast_profile: input.anycastProfile,
      agreement_id: input.agreementId
    });
    return decodeBgpPrefix(await this.request("POST", "bgp/bgpbuyprefixes", body, "application/json"));
  }

  /** Gets one account BGP prefix by id. */
  public async getBgpPrefix(id: number): Promise<BgpPrefix> {
    return decodeBgpPrefix(await this.request("GET", `bgp/bgpprefix/${id}`));
  }

  /** Lists account BGP prefixes, optionally filtered by group type. */
  public async listBgpPrefixes(groupType?: string): Promise<BgpPrefix[]> {
    const rows = await this.request("GET", groupTypeListPath("bgp/bgpprefixes", groupType));
    return requireArray(rows).map(decodeBgpPrefix);
  }

  /** Lists account ASNs, optionally filtered by group type. */
  public async listBgpAsns(groupType?: string): Promise<BgpAsn[]> {
    const rows = await this.request("GET", groupTypeListPath("bgp/bgpasns", groupType));
    return requireArray(rows).map(decodeBgpAsn);
  }

  /** Gets one account ASN by id. */
  public async getBgpAsn(id: number): Promise<BgpAsn> {
    const params = new URLSearchParams({ id: String(id) });
    return decodeBgpAsn(await this.request("GET", `bgp/bgpasn?${params.toString()}`));
  }

  /** Lists legal agreements available to the account. */
  public async listAccountAgreements(): Promise<AccountAgreement[]> {
    const rows = await this.request("GET", "account/agreements");
    return requireArray(rows).map(decodeAccountAgreement);
  }

  /** Gets the account's aggregate usage contract, independent of any single server package. */
  public async getContractUsage(): Promise<ContractUsage> {
    return decodeContractUsage(await this.request("GET", "cloud/contract/usage"));
  }

  /** Gets a datacenter's id from its IATA airport code. */
  public async getDatacenterByIata(iata: string): Promise<number> {
    return decodeDatacenter(await this.request("GET", `platform/datacenters-by-iata/${encodeURIComponent(iata)}`)).id;
  }

  /** Lists deploy sizes across every location. */
  public async getSizes(): Promise<Size[]> {
    const rows = await this.request("GET", "cloud/sizes");
    return requireArray(rows).map(decodeSize);
  }

  /** Lists purchasable plans. Uses the same endpoint and response shape as {@link Client.getSizes}. */
  public async getPlans(): Promise<Size[]> {
    const rows = await this.request("GET", "cloud/sizes");
    return requireArray(rows).map(decodeSize);
  }

  /** Lists boot profiles available for booting a cloud server. */
  public async getBootProfiles(): Promise<BootProfile[]> {
    const rows = await this.request("GET", "cloud/boot-profiles");
    return requireArray(rows).map(decodeBootProfile);
  }

  /**
   * Lists the disks attached to a server package.
   *
   * Disk rows are not modeled upstream, matching gona's placeholder `ServerDisk` type: each
   * element is returned opaquely rather than decoded into typed fields.
   */
  public async getServerDisks(mbpkgid: number): Promise<unknown[]> {
    const rows = await this.request("GET", `cloud/disks/${mbpkgid}`);
    return requireArray(rows);
  }

  /** Lists OS profiles available for dedicated devices. */
  public async getDedicatedOsProfiles(): Promise<DedicatedOsProfile[]> {
    const rows = await this.request("GET", "dedicated/os");
    return requireArray(rows).map(decodeDedicatedOsProfile);
  }

  /** Lists rescue OS profiles available for dedicated devices. */
  public async getDedicatedRescueOsProfiles(): Promise<DedicatedRescueOsProfile[]> {
    const rows = await this.request("GET", "dedicated/os/rescue-system-list");
    return requireArray(rows).map(decodeDedicatedRescueOsProfile);
  }

  /** Lists disk layouts compatible with a dedicated OS profile. */
  public async getDedicatedDiskLayouts(osId: number): Promise<DedicatedDiskLayout[]> {
    const rows = await this.request("GET", `dedicated/disklayouts/${osId}`);
    return requireArray(rows).map(decodeDedicatedDiskLayout);
  }

  /** Lists recorded DDoS attacks on the account, active or historic. */
  public async getDdosAttacks(): Promise<DdosAttack[]> {
    const rows = await this.request("GET", "ddos/attacks");
    return requireArray(rows).map(decodeDdosAttack);
  }

  /** Lists currently active DDoS attacks on the account. */
  public async getDdosActiveAttacks(): Promise<DdosAttack[]> {
    const rows = await this.request("GET", "ddos/attacks/active");
    return requireArray(rows).map(decodeDdosAttack);
  }

  /** Gets the DDoS mitigation dashboard summary. */
  public async getDdosDashboard(options: DdosDashboardOptions = {}): Promise<DdosDashboard> {
    const params = new URLSearchParams();
    appendOptionalInt(params, "period", options.period);
    if (options.includeEnded !== undefined) {
      params.set("include_ended", options.includeEnded ? "true" : "false");
    }
    appendOptionalInt(params, "limit", options.limit);
    const query = params.toString();
    return decodeDdosDashboard(await this.request("GET", `ddos/dashboard${query === "" ? "" : `?${query}`}`));
  }

  /** Lists DDoS mitigation rules configured on the account. */
  public async getDdosRules(): Promise<DdosRule[]> {
    const rows = await this.request("GET", "ddos/rules");
    return requireArray(rows).map(decodeDdosRule);
  }

  /** Gets one DDoS mitigation rule by id. */
  public async getDdosRule(id: number): Promise<DdosRule> {
    return decodeDdosRule(await this.request("GET", `ddos/rule/${id}`));
  }

  /** Lists user access control subnets allowed to reach the account. */
  public async getAccessControlSubnets(): Promise<AccessControlSubnet[]> {
    const rows = await this.request("GET", "account/user-access-control-subnet-list");
    return requireArray(rows).map(decodeAccessControlSubnet);
  }

  /** Gets one user access control subnet by id. */
  public async getAccessControlSubnet(id: string): Promise<AccessControlSubnet> {
    return decodeAccessControlSubnet(await this.request("GET", `account/user-access-control-subnet/${id}`));
  }

  /** Creates a user access control subnet. */
  public async createAccessControlSubnet(input: CreateAccessControlSubnetRequest): Promise<AccessControlSubnet> {
    return decodeAccessControlSubnet(
      await this.request("POST", "account/user-access-control-subnet", JSON.stringify(input), "application/json")
    );
  }

  /** Updates a user access control subnet's label and subnet. */
  public async updateAccessControlSubnet(id: string, input: UpdateAccessControlSubnetRequest): Promise<AccessControlSubnet> {
    return decodeAccessControlSubnet(
      await this.request("PATCH", `account/user-access-control-subnet/${id}`, JSON.stringify(input), "application/json")
    );
  }

  /** Deletes a user access control subnet. */
  public async deleteAccessControlSubnet(id: string): Promise<void> {
    await this.request("DELETE", `account/user-access-control-subnet/${id}`);
  }

  /** Lists billing packages on the account. */
  public async getBillingPackages(): Promise<BillingPackage[]> {
    const rows = await this.request("GET", "cloud/billing-packages");
    return requireArray(rows).map(decodeBillingPackage);
  }

  /** Lists cloud pools available for deployment. */
  public async getCloudPools(): Promise<CloudPool[]> {
    const rows = await this.request("GET", "cloud/pools");
    return requireArray(rows).map(decodeCloudPool);
  }

  /** Gets cloud package capacity available in a cloud pool at a location. */
  public async getCloudCapacity(cloudPoolId: number, locationId: number): Promise<CloudCapacity[]> {
    const path = `cloud/capacity?cloud_pool_id=${cloudPoolId}&location_id=${locationId}`;
    const rows = await this.request("GET", path);
    return requireArray(rows).map(decodeCloudCapacity);
  }

  /** Lists dedicated device capacity available for purchase. */
  public async getDedicatedCapacity(): Promise<DedicatedCapacity[]> {
    const rows = await this.request("GET", "dedicated/capacity");
    return requireArray(rows).map(decodeDedicatedCapacity);
  }

  /** Lists colocation packages on the account, ordered by server package id. */
  public async getColocationPackages(): Promise<ColocationPackage[]> {
    const byId = requireObject(await this.request("GET", "colo/packages"));
    return Object.values(byId)
      .map(decodeColocationPackage)
      .sort((a, b) => a.mbPkgId - b.mbPkgId);
  }

  /** Gets one colocation package by server package id. */
  public async getColocationPackage(mbPkgId: number): Promise<ColocationPackage> {
    return decodeColocationPackage(await this.request("GET", `colo/package/${mbPkgId}`));
  }

  /** Lists IP transit packages on the account, ordered by server package id. */
  public async getTransitPackages(): Promise<TransitPackage[]> {
    const byId = requireObject(await this.request("GET", "transit/packages"));
    return Object.values(byId)
      .map(decodeTransitPackage)
      .sort((a, b) => a.mbPkgId - b.mbPkgId);
  }

  /** Gets one IP transit package by server package id. */
  public async getTransitPackage(mbPkgId: number): Promise<TransitPackage> {
    return decodeTransitPackage(await this.request("GET", `transit/package/${mbPkgId}`));
  }

  /** Lists purchased cloud packages on the account, from the legacy account package listing. */
  public async getCloudPackages(): Promise<CloudPackage[]> {
    const rows = await this.request("GET", "cloud/packages");
    return requireArray(rows).map(decodeCloudPackage);
  }

  /** Gets one purchased cloud package by id. */
  public async getCloudPackage(id: number): Promise<CloudPackage> {
    return decodeCloudPackage(await this.request("GET", `cloud/package/${id}`));
  }

  /** Cancels a purchased cloud package. Response shape is opaque. */
  public async cancelCloudPackage(input: CancelCloudPackageRequest): Promise<unknown> {
    const body = JSON.stringify({
      mbpkgid: input.mbPkgId,
      domU_package: input.domUPackage,
      comments: input.comments,
      cancel_type: input.cancelType,
      agree: input.agree,
      password: input.password
    });
    return this.request("POST", "cloud/package/cancel/", body, "application/json");
  }

  /** Gets the platform location detected from the caller's current IP address. */
  public async getLocationByCurrentIp(): Promise<LocationByCurrentIp> {
    return decodeLocationByCurrentIp(await this.request("GET", "location"));
  }

  /** Gets graph data for a switch port and time range. Time must be one of daily, weekly, monthly or yearly. */
  public async getGraph(query: GraphQuery): Promise<Graph> {
    const params = new URLSearchParams();
    params.set("port", String(query.port));
    params.set("time", query.time);
    return decodeGraph(await this.request("GET", `graphs/graph?${params.toString()}`));
  }

  /** Lists deployment locations available on the platform. */
  public async getLocations(): Promise<LocationSummary[]> {
    const rows = await this.request("GET", "cloud/locations");
    return requireArray(rows).map(decodeLocationSummary);
  }

  /** Lists OS catalog entries available for server deployment. */
  public async getOss(): Promise<Os[]> {
    const rows = await this.request("GET", "cloud/images");
    return requireArray(rows).map(decodeOs);
  }

  /** Gets the IP addresses assigned to a server package. */
  public async getNetworkIps(mbPkgId: number): Promise<NetworkIps> {
    return decodeNetworkIps(await this.request("GET", `cloud/networkips/${mbPkgId}`));
  }

  /** Builds a not found error for a lookup that is resolved client-side rather than by the transport. */
  private notFoundError(method: HttpMethod, path: string, message: string): NetActuateNotFoundError {
    const url = resolveUrl(this.baseUrl, appendApiKey(path, this.apiKey));
    return new NetActuateNotFoundError({ ...redactedRequest(method, url), statusCode: 404, apiMessage: message });
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

  /** Sends a request whose response body is binary content rather than a JSON envelope. */
  private async requestRaw(method: HttpMethod, path: string): Promise<Uint8Array> {
    const url = resolveUrl(this.baseUrl, appendApiKey(path, this.apiKey));
    const response = await this.transport(url, { method, headers: { Accept: "application/octet-stream" } });
    if (response.status < 200 || response.status >= 300) {
      const body = await response.text();
      const context: ApiErrorContext = { ...redactedRequest(method, url), statusCode: response.status, body };
      if (response.status === 404) {
        throw new NetActuateNotFoundError(context);
      }
      throw new NetActuateError(formatApiError("got an error response", context), context);
    }
    if (response.arrayBuffer === undefined) {
      throw new NetActuateError("transport does not support binary responses", { ...redactedRequest(method, url), statusCode: response.status });
    }
    return new Uint8Array(await response.arrayBuffer());
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

function createTagBody(input: CreateTagRequest): string {
  return JSON.stringify({
    name: input.name,
    description: emptyToUndefined(input.description),
    icon: emptyToUndefined(input.icon),
    color: emptyToUndefined(input.color)
  });
}

function updateTagBody(input: UpdateTagRequest): string {
  return JSON.stringify({
    name: input.name,
    description: emptyToUndefined(input.description),
    icon: emptyToUndefined(input.icon),
    color: emptyToUndefined(input.color),
    is_default: boolToFlag(input.isDefault),
    is_favorite: boolToFlag(input.isFavorite),
    is_locked: boolToFlag(input.isLocked),
    show_dashboard: boolToFlag(input.showDashboard)
  });
}

function tagResourceBody(resourceName: string, identifier: number): string {
  // The identifier is typed as a number everywhere it is returned, but the assign/remove
  // request schema wants it sent back as a string.
  return JSON.stringify({ resource_name: resourceName, identifier: String(identifier) });
}

function firewallSetForm(name: string, description: string, enabled: boolean): Record<string, string | number | undefined> {
  return { name, description, enabled: enabled ? "1" : "0" };
}

function firewallMatchCriteriaJson(input?: FirewallMatchCriteria): Record<string, unknown> | null {
  if (input === undefined) {
    return null;
  }
  const json: Record<string, unknown> = {
    source_port_start: input.sourcePortStart ?? null,
    source_port_end: input.sourcePortEnd ?? null,
    destination_port_start: input.destinationPortStart ?? null,
    destination_port_end: input.destinationPortEnd ?? null
  };
  if (input.protocol !== undefined && input.protocol !== "") {
    json.protocol = input.protocol;
  }
  if (input.sourceNet !== undefined && input.sourceNet.length > 0) {
    json.source_net = input.sourceNet;
  }
  if (input.destinationNet !== undefined && input.destinationNet.length > 0) {
    json.destination_net = input.destinationNet;
  }
  if (input.ipVersionNumber !== undefined) {
    json.ip_version_number = input.ipVersionNumber;
  }
  if (input.options !== undefined && input.options.icmpType !== undefined && input.options.icmpType !== "") {
    json.options = { icmp_type: input.options.icmpType };
  }
  return json;
}

function firewallRuleRequestBody(input: CreateFirewallRuleRequest): string {
  const body: Record<string, unknown> = {
    ip_version: input.ipVersion,
    action: input.action,
    enabled: input.enabled,
    match_criteria: firewallMatchCriteriaJson(input.matchCriteria)
  };
  if (input.direction !== undefined && input.direction !== "") {
    body.direction = input.direction;
  }
  if (input.rulePriority !== undefined) {
    body.rule_priority = input.rulePriority;
  }
  if (input.adminComment !== undefined && input.adminComment !== "") {
    body.admin_comment = input.adminComment;
  }
  return JSON.stringify(body);
}

function reorderFirewallRulesBody(input: ReorderFirewallRulesRequest): Record<string, unknown> {
  const body: Record<string, unknown> = { move_id: input.moveId };
  if (input.afterId !== undefined) {
    body.after_id = input.afterId;
  }
  if (input.beforeId !== undefined) {
    body.before_id = input.beforeId;
  }
  return body;
}

function appendOptionalInt(params: URLSearchParams, name: string, value?: number): void {
  if (value !== undefined) {
    params.set(name, String(value));
  }
}

function appendOptionalBoolFlag(params: URLSearchParams, name: string, value?: boolean): void {
  if (value !== undefined) {
    params.set(name, value ? "1" : "0");
  }
}

function appendOptionalString(params: URLSearchParams, name: string, value?: string): void {
  if (value !== undefined && value !== "") {
    params.set(name, value);
  }
}

function scalingOptionsQuery(options: ScalingOptionsQuery): string {
  const params = new URLSearchParams();
  if (options.includeCurrentPlan !== undefined) {
    params.set("include_current_plan", options.includeCurrentPlan ? "true" : "false");
  }
  appendOptionalInt(params, "min_ram", options.minRam);
  appendOptionalInt(params, "max_ram", options.maxRam);
  appendOptionalInt(params, "min_cpus", options.minCpus);
  appendOptionalInt(params, "max_cpus", options.maxCpus);
  return params.toString();
}

function deploySizesQuery(options: DeploySizesQuery): string {
  const params = new URLSearchParams();
  appendOptionalInt(params, "min_cpu", options.minCpu);
  appendOptionalInt(params, "min_ram", options.minRam);
  return params.toString();
}

function dedicatedDeviceFilterQuery(options: DedicatedDeviceFilterOptions): string {
  const params = new URLSearchParams();
  appendOptionalInt(params, "per_page", options.perPage);
  appendOptionalString(params, "nic", options.nic);
  appendOptionalString(params, "cpu_type", options.cpuType);
  appendOptionalString(params, "gpu_type", options.gpuType);
  appendOptionalString(params, "disk_type", options.diskType);
  appendOptionalString(params, "cores", options.cores);
  appendOptionalString(params, "ram_mb", options.ramMb);
  appendOptionalString(params, "disk_mib", options.diskMib);
  appendOptionalString(params, "dc_name", options.dcName);
  appendOptionalString(params, "region_name", options.regionName);
  return params.toString();
}

/**
 * Unwraps a dedicated device filter response.
 *
 * The rows sit either at the top level as a bare array, or nested at `devices.paginator.data`
 * alongside the column lists the portal uses. Both shapes are accepted.
 */
function unwrapDedicatedDeviceList(data: unknown): DedicatedDevice[] {
  if (Array.isArray(data)) {
    return data.map((row) => requireObject(row));
  }
  if (isObject(data) && isObject(data.devices) && isObject(data.devices.paginator) && Array.isArray(data.devices.paginator.data)) {
    return data.devices.paginator.data.map((row) => requireObject(row));
  }
  throw new Error("filter dedicated devices: unexpected response shape");
}

function dedicatedServerBuildBody(input: DedicatedServerBuildRequest): Record<string, unknown> {
  return {
    fqdn: input.fqdn,
    profile: input.profile,
    disklayout: input.diskLayout,
    root_password: input.rootPassword,
    ssh_key: input.sshKey,
    ssh_key_id: input.sshKeyId,
    build_script: input.buildScript
  };
}

function createMetalForm(input: CreateMetalRequest): Record<string, string | number | undefined> {
  return {
    location: input.location,
    device_id: input.deviceId,
    ssh_key: input.sshKey,
    ssh_key_id: input.sshKeyId,
    root_password: input.password,
    build_script: input.buildScript,
    disklayout: input.diskLayout,
    profile: input.profile,
    fqdn: input.hostname
  };
}

function buildMetalForm(input: BuildMetalRequest): Record<string, string | number | undefined> {
  return {
    mbpkgid: input.mbPkgId,
    ssh_key: input.sshKey,
    ssh_key_id: input.sshKeyId,
    root_password: input.password,
    build_script: input.buildScript,
    disklayout: input.diskLayout,
    profile: input.profile,
    fqdn: input.hostname
  };
}

function dedicatedActionBody(options: DedicatedServerActionRequest): string | undefined {
  if (options.force === undefined && options.password === undefined) {
    return undefined;
  }
  return JSON.stringify({ force: options.force, password: options.password });
}

function createImageForm(input: CreateImageRequest): Record<string, string | number | undefined> {
  return {
    mbpkgid: input.mbPkgId,
    image_name: input.imageName,
    image_description: input.imageDescription === undefined || input.imageDescription === "" ? undefined : input.imageDescription,
    keep_ssh_userdirs: input.keepSshUserdirs === true ? 1 : undefined
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Expands a compressed IPv6 address to its canonical 8-group hextet form, so a BGP session's
 * customer peering address can be matched against an account IP regardless of which form each
 * side uses. Returns undefined for anything that is not a plain IPv6 address.
 */
function expandIpv6(address: string): string | undefined {
  if (!address.includes(":")) {
    return undefined;
  }
  const halves = address.split("::");
  if (halves.length > 2) {
    return undefined;
  }
  const [headPart, tailPart] = halves;
  const head = headPart === undefined || headPart === "" ? [] : headPart.split(":");
  const tail = halves.length === 2 && tailPart !== undefined && tailPart !== "" ? tailPart.split(":") : [];
  let groups: string[];
  if (halves.length === 1) {
    groups = head;
  } else {
    const missing = 8 - head.length - tail.length;
    if (missing < 0) {
      return undefined;
    }
    groups = [...head, ...Array(missing).fill("0"), ...tail];
  }
  if (groups.length !== 8 || groups.some((group) => !/^[0-9a-fA-F]{1,4}$/.test(group))) {
    return undefined;
  }
  return groups.map((group) => group.padStart(4, "0").toLowerCase()).join(":");
}

function firewallAvailableVmQuery(options: FirewallAvailableVmOptions): string {
  const params = new URLSearchParams();
  appendOptionalInt(params, "extref_acct_id", options.extrefAccountId);
  appendOptionalInt(params, "vpc_id", options.vpcId);
  appendOptionalBoolFlag(params, "bw", options.includeBandwidth);
  appendOptionalBoolFlag(params, "ul", options.includeUl);
  appendOptionalBoolFlag(params, "check_vpc", options.checkVpc);
  appendOptionalBoolFlag(params, "disable_interface_id_filter", options.disableInterfaceIdFilter);
  return params.toString();
}

function firewallRelatedSetQuery(options: FirewallRelatedSetOptions): string {
  const params = new URLSearchParams();
  appendOptionalBoolFlag(params, "disable_interface_id_filter", options.disableInterfaceIdFilter);
  return params.toString();
}

function serverActionBody(options: ServerActionOptions): string | undefined {
  return options.force === undefined ? undefined : JSON.stringify({ force: options.force });
}

function ticketListPath(path: string, options: TicketListOptions): string {
  const params = new URLSearchParams();
  if (options.open !== undefined) {
    params.set("open", options.open);
  }
  if (options.includeStats !== undefined) {
    params.set("include_stats", options.includeStats);
  }
  const query = params.toString();
  return query === "" ? path : `${path}?${query}`;
}

function ticketAttachmentPath(id: string, attachmentType: string, relId: string, index: number): string {
  return `support/tickets/${encodeURIComponent(id)}/attachment/${encodeURIComponent(attachmentType)}/${encodeURIComponent(relId)}/${index}`;
}

function ticketAttachmentQuery(options: GetTicketAttachmentOptions): string {
  const params = new URLSearchParams();
  appendOptionalBoolFlag(params, "without_data", options.withoutData);
  return params.toString();
}

function createTicketBody(input: CreateTicketRequest): string {
  return JSON.stringify({
    subject: input.subject,
    message: input.message,
    department: input.department,
    urgency: emptyToUndefined(input.urgency),
    files: input.files
  });
}

function replyTicketBody(input: ReplyTicketRequest): string {
  return JSON.stringify({ message: input.message, files: input.files });
}

function serviceListPath(path: string, paramName: string, value?: number): string {
  if (value === undefined) {
    return path;
  }
  const params = new URLSearchParams();
  params.set(paramName, String(value));
  return `${path}?${params.toString()}`;
}

function platformLookingGlassQuery(options: PlatformLookingGlassExecuteOptions): string {
  const params = new URLSearchParams();
  if (options.action !== undefined) {
    params.set("action", options.action);
  }
  if (options.target !== undefined) {
    params.set("target", options.target);
  }
  if (options.location !== undefined) {
    params.set("location", options.location);
  }
  if (options.full !== undefined) {
    params.set("full", String(options.full));
  }
  return params.toString();
}

function groupTypeListPath(path: string, groupType?: string): string {
  if (groupType === undefined || groupType === "") {
    return path;
  }
  const params = new URLSearchParams({ group_type: groupType });
  return `${path}?${params.toString()}`;
}

function bgpDashboardQuery(options: BgpDashboardOptions): string {
  const params = new URLSearchParams();
  appendOptionalString(params, "group_type", options.groupType);
  appendOptionalInt(params, "flap_window", options.flapWindow);
  return params.toString();
}

function emptyToUndefined(value?: string): string | undefined {
  return value === undefined || value === "" ? undefined : value;
}

function boolToFlag(value?: boolean): number {
  return value === true ? 1 : 0;
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

function requireNumber(input: unknown, context: string): number {
  if (typeof input !== "number") {
    throw new Error(`expected a numeric payload for ${context}`);
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
