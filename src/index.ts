export {
  Client,
  VAPI2_BASE_URL,
  type CreateDnsRecordRequest,
  type CreateDnsZoneRequest,
  type CreateServerRequest,
  type ServerBuild,
  type UpdateDnsRecordRequest
} from "./client.js";
export {
  V3Client,
  VAPI3_BASE_URL,
  type CreateNkeClusterRequest,
  type CreateStorageBucketRequest,
  type CreateVpcRequest,
  type NkeBilling,
  type UpdateNkeClusterRequest,
  type UpdateStorageBucketRequest,
  type UpdateVpcRequest
} from "./v3-client.js";
export {
  decodeDnsRecord,
  decodeDnsZone,
  decodeLocation,
  decodeNkeCluster,
  decodePackage,
  decodeServer,
  decodeStorageBucket,
  decodeVpc,
  type DnsRecord,
  type DnsZone,
  type JsonObject,
  type NkeCluster,
  type Server,
  type StorageBucket,
  type StorageBucketMetadata,
  type StorageCapacity,
  type V3Location,
  type V3Package,
  type Vpc,
  type VpcMetadata
} from "./decoders.js";
export {
  NetActuateContractError,
  NetActuateError,
  NetActuateNotFoundError,
  formatApiError,
  isContractError,
  isNotFoundError,
  redactUrl,
  type ApiErrorContext,
  type HttpMethod
} from "./errors.js";
export { type ClientOptions, type Transport, type TransportResponse } from "./transport.js";
export { parseV3ListPage, type V3ListMeta, type V3ListPage } from "./vapi3-list.js";
