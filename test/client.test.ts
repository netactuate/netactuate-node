import { describe, expect, it, vi } from "vitest";
import {
  Client,
  NetActuateContractError,
  NetActuateError,
  NetActuateNotFoundError,
  V3Client,
  decodeCloudFloatingIpv4,
  decodeDnsRecord,
  decodeDnsZone,
  decodeNkeAccessUrls,
  decodeNkeAddon,
  decodeNkeAddonCatalogEntry,
  decodeNkeCluster,
  decodeNkeClusterDnsZone,
  decodeNkeWorkerNode,
  decodeOidcClient,
  decodeRouterConfig,
  decodeServer,
  decodeServerNic,
  decodeSshKey,
  decodeStorageBlockNamespace,
  decodeStorageBlockVolume,
  decodeStorageBucket,
  decodeStorageLocation,
  decodeStorageObjectStore,
  decodeStorageTypes,
  decodeTag,
  decodeVlan,
  decodeVpc,
  decodeVpcBackend,
  decodeVpcBackendTemplate,
  decodeVpcIpReservations,
  decodeVpcSshSettings,
  isContractError,
  isNotFoundError,
  type Transport
} from "../src/index.js";

function jsonResponse(body: unknown, status = 200) {
  return {
    status,
    text: async () => JSON.stringify(body)
  };
}

function textResponse(body: string, status = 200) {
  return {
    status,
    text: async () => body
  };
}

function binaryResponse(bytes: number[], status = 200) {
  return {
    status,
    text: async () => Buffer.from(bytes).toString("binary"),
    arrayBuffer: async () => new Uint8Array(bytes).buffer
  };
}

describe("decoders", () => {
  it("decodes servers from flat and nested shapes", () => {
    expect(decodeServer({ mbpkgid: 7, fqdn: "vm.example.com" }).id).toBe(7);
    expect(decodeServer({ metadata: { mbpkgid: 8, fqdn: "vm2.example.com" } }).name).toBe("vm2.example.com");
  });

  it("decodes DNS zones from flat and nested shapes", () => {
    expect(decodeDnsZone({ id: 1, name: "example.com", type: "NATIVE", ttl: 3600 }).ttl).toBe("3600");
    expect(decodeDnsZone({ metadata: { id: 2, name: "example.net", type: "NATIVE" } }).id).toBe(2);
  });

  it("decodes DNS records from flat and nested shapes", () => {
    expect(decodeDnsRecord({ id: 1, domain_id: 2, name: "www", type: "A", content: "192.0.2.1", ttl: "300", prio: 0 }).zoneId).toBe(2);
    expect(decodeDnsRecord({ metadata: { id: 3, domain_id: 2, name: "api", type: "A", content: "192.0.2.2", ttl: 300 } }).ttl).toBe("300");
  });

  it("decodes VPCs from flat and nested shapes", () => {
    expect(decodeVpc({ id: 55, label: "flat", status: "Running" }).vpcId).toBe(55);
    expect(decodeVpc({ vpcId: 56, metadata: { label: "nested", status: "Running" } }).metadata.label).toBe("nested");
  });

  it("decodes storage buckets from flat and nested shapes", () => {
    expect(decodeStorageBucket({ bucketId: 10, label: "flat", ready: true }).metadata.bucketId).toBe(10);
    expect(decodeStorageBucket({ metadata: { bucketId: 11, label: "nested" }, credentials: { userKey: "u" } }).metadata.label).toBe("nested");
    expect(decodeStorageBucket({ bucketId: 12, label: "hw", hardwareClass: { id: 1, name: "fast" } }).metadata.hardwareClass?.name).toBe("fast");
  });

  it("decodes storage object stores from flat and nested shapes", () => {
    expect(decodeStorageObjectStore({ objectStoreId: 20, label: "flat" }).metadata.objectStoreId).toBe(20);
    expect(decodeStorageObjectStore({ metadata: { objectStoreId: 21, label: "nested" }, credentials: { userKey: "u" } }).metadata.label).toBe(
      "nested"
    );
  });

  it("decodes storage block namespaces from flat and nested shapes", () => {
    expect(decodeStorageBlockNamespace({ blockNamespaceId: 30, label: "flat" }).metadata.blockNamespaceId).toBe(30);
    expect(decodeStorageBlockNamespace({ metadata: { blockNamespaceId: 31, label: "nested" } }).metadata.label).toBe("nested");
  });

  it("decodes storage block volumes from flat and nested shapes", () => {
    expect(decodeStorageBlockVolume({ blockVolumeId: 40, label: "flat" }).metadata.blockVolumeId).toBe(40);
    expect(decodeStorageBlockVolume({ metadata: { blockVolumeId: 41, label: "nested" } }).metadata.label).toBe("nested");
  });

  it("decodes a storage block volume with no id field to a zero id, for the platform GET defect", () => {
    const volume = decodeStorageBlockVolume({ label: "orphaned", objectStoreId: 99, ready: true });
    expect(volume.metadata.blockVolumeId).toBe(0);
    expect(volume.metadata.label).toBe("orphaned");
  });

  it("decodes a storage location paired with its hardware class", () => {
    const location = decodeStorageLocation({ location: { id: 3, name: "New York" }, hardware: { id: 1, name: "fast", description: "NVMe" } });
    expect(location).toEqual({ location: { id: 3, name: "New York", flag: undefined }, hardware: { id: 1, name: "fast", description: "NVMe" } });
  });

  it("decodes storage types from a bare array, a vAPI3 list envelope, and a keyed object", () => {
    expect(decodeStorageTypes([{ type: "s3", name: "Object storage" }]).map((t) => t.type)).toEqual(["s3"]);
    expect(decodeStorageTypes({ data: [{ type: "block", name: "Block storage" }] }).map((t) => t.type)).toEqual(["block"]);
    const keyed = decodeStorageTypes({ meta: { total: 2 }, block: { name: "Block storage" }, s3: { name: "Object storage" } });
    expect(keyed.map((t) => t.type)).toEqual(["block", "s3"]);
    expect(keyed.map((t) => t.name)).toEqual(["Block storage", "Object storage"]);
  });

  it("decodes a router's IPv4 address from both a dotted quad string and a big endian integer", () => {
    const fromString = decodeRouterConfig({
      defaultVrfId: 1,
      metadata: { status: "Active", name: "r1", version: 1, ipv4Address: "203.0.113.10", hasDefaultVrf: true, canJoinMagicMesh: true }
    });
    expect(fromString.metadata.ipv4Address).toBe("203.0.113.10");

    const fromInteger = decodeRouterConfig({
      defaultVrfId: 1,
      metadata: { status: "Active", name: "r1", version: 1, ipv4Address: 3405803826, hasDefaultVrf: true, canJoinMagicMesh: true }
    });
    expect(fromInteger.metadata.ipv4Address).toBe("203.0.113.50");
  });

  it("decodes NKE clusters from flat and nested shapes", () => {
    expect(decodeNkeCluster({ clusterId: 20, name: "flat" }).clusterId).toBe(20);
    expect(decodeNkeCluster({ clusterId: 21, metadata: { name: "nested" } }).name).toBe("nested");
  });

  it("decodes NKE access URLs", () => {
    const urls = decodeNkeAccessUrls({ api: "https://api.example", prometheus: "https://prom.example", kubernetesDashboard: "https://dash.example" });
    expect(urls).toEqual({ api: "https://api.example", prometheus: "https://prom.example", kubernetesDashboard: "https://dash.example" });
  });

  it("decodes NKE worker nodes, reading readiness out of the nested status object", () => {
    const node = decodeNkeWorkerNode({ workerNodeId: 5, clusterId: 20, name: "worker-1", mbpkgid: 99, status: { ready: true } });
    expect(node).toMatchObject({ workerNodeId: 5, clusterId: 20, name: "worker-1", mbpkgid: 99, ready: true });
  });

  it("decodes NKE addon catalog entries", () => {
    const entry = decodeNkeAddonCatalogEntry({ addonId: 1, addonType: "storage", version: "1.0.0", isDefault: true });
    expect(entry).toMatchObject({ addonId: 1, addonType: "storage", version: "1.0.0", isDefault: true });
  });

  it("decodes an installed NKE addon, including its typed DNS and storage config shapes", () => {
    const dnsAddon = decodeNkeAddon({
      id: 1,
      addonType: "netactuate-dns",
      state: "Installed",
      config: { zones: [{ dnsZoneId: 3, zone: "example.com", mode: "sync" }] }
    });
    expect(dnsAddon.config?.zones).toEqual([{ dnsZoneId: 3, zone: "example.com", mode: "sync" }]);

    const storageAddon = decodeNkeAddon({
      id: 2,
      addonType: "storage",
      config: { integrations: [{ storageIntegrationId: 7, storageClassName: "ceph", isDefaultClass: true }] }
    });
    expect(storageAddon.config?.integrations).toEqual([{ storageIntegrationId: 7, storageClassName: "ceph", isDefaultClass: true }]);
  });

  it("decodes an NKE cluster DNS zone", () => {
    const zone = decodeNkeClusterDnsZone({ dnsZoneId: 3, clusterId: 20, zone: "example.com", mode: "sync", state: "Active" });
    expect(zone).toMatchObject({ dnsZoneId: 3, clusterId: 20, zone: "example.com", mode: "sync", state: "Active" });
  });

  it("decodes tags with their embedded resources and flag fields", () => {
    const tag = decodeTag({
      id: 5,
      name: "prod",
      is_default: 1,
      is_favorite: 0,
      is_locked: 1,
      show_dashboard: 0,
      resources: [{ id: 1, resource_tag_id: 5, resource_name: "server", identifier: 42 }]
    });
    expect(tag.isDefault).toBe(true);
    expect(tag.isFavorite).toBe(false);
    expect(tag.isLocked).toBe(true);
    expect(tag.resources).toHaveLength(1);
    expect(tag.resources?.[0]?.identifier).toBe(42);
  });

  it("decodes a null SSH key body to a zero-valued key", () => {
    expect(decodeSshKey(null).id).toBe(0);
    expect(decodeSshKey({ id: 9, name: "laptop", ssh_key: "ssh-ed25519 AAAA" }).key).toBe("ssh-ed25519 AAAA");
  });

  it("decodes a VPC backend host", () => {
    const backend = decodeVpcBackend({ backendHostId: 3, name: "web-1", address: "203.0.113.5", internalAddress: "10.0.0.5" });
    expect(backend).toEqual({ backendHostId: 3, name: "web-1", address: "203.0.113.5", internalAddress: "10.0.0.5" });
  });

  it("decodes a VPC backend template with its backend hosts", () => {
    const template = decodeVpcBackendTemplate({
      backendTemplateId: 7,
      name: "web",
      backendHosts: [{ backendHostId: 1, address: "203.0.113.1" }]
    });
    expect(template.backendTemplateId).toBe(7);
    expect(template.backendHosts).toHaveLength(1);
    expect(template.backendHosts?.[0]?.address).toBe("203.0.113.1");
  });

  it("decodes VPC SSH settings with a bare numeric port and mapped keys", () => {
    const settings = decodeVpcSshSettings({
      enabled: true,
      port: 2222,
      keys: { "123": { id: 123, sshKeyId: 123, name: "ops", dates: { created: "2026-01-01", enabled: "2026-01-01" } } },
      bastion: { ipv4: "192.0.2.10", ipv6: "2001:db8::10" }
    });
    expect(settings.port).toBe(2222);
    expect(settings.enabled).toBe(true);
    expect(settings.keys).toHaveLength(1);
    expect(settings.keys[0]).toMatchObject({ id: 123, enabled: true });
    expect(settings.bastion).toEqual({ ipv4: "192.0.2.10", ipv6: "2001:db8::10" });
  });

  it("decodes VPC SSH settings with an object-shaped port and a wrapped keys list", () => {
    const settings = decodeVpcSshSettings({
      enabled: true,
      port: { port: 2222 },
      keys: { data: [{ id: 5, name: "ci" }] }
    });
    expect(settings.port).toBe(2222);
    expect(settings.keys).toEqual([{ id: 5, sshKeyId: undefined, name: "ci", fingerprint: undefined, publicKey: undefined, enabled: false, createdAt: undefined }]);
  });

  it("decodes a disabled key with no dates as not enabled", () => {
    const settings = decodeVpcSshSettings({ enabled: false, port: null, keys: {} });
    expect(settings.port).toBeUndefined();
    expect(settings.keys).toEqual([]);
  });

  it("decodes VPC IP reservations, keeping each group as opaque JSON", () => {
    const reservations = decodeVpcIpReservations({ gateways: [{ id: 1 }], interfaces: [], vms: [{ id: 2 }] });
    expect(reservations).toEqual({ gateways: [{ id: 1 }], interfaces: [], vms: [{ id: 2 }] });
  });

  it("decodes a customer VLAN with its provisioned locations", () => {
    const vlan = decodeVlan({
      id: 5,
      mbid: 42,
      private: 1,
      allow_sriov: 0,
      display_name: "vlan-5",
      provisioned_locations: [{ provisioned: true, name: "New York", location_id: 3, iata_code: "NYC" }]
    });
    expect(vlan.id).toBe(5);
    expect(vlan.provisionedLocations).toEqual([{ provisioned: true, name: "New York", locationId: 3, flag: undefined, iataCode: "NYC" }]);
  });

  it("decodes a server NIC, preferring nic_id over id and falling back when nic_id is absent", () => {
    expect(decodeServerNic({ nic_id: 7, id: 99, mbpkgid: 42, customer_vlan_id: 5, attach_order: 1 }).nicId).toBe(7);
    expect(decodeServerNic({ id: 8, mbpkgid: 42, customer_vlan_id: 5 }).nicId).toBe(8);
  });

  it("decodes a cloud floating IPv4 address with its location", () => {
    const floatingIp = decodeCloudFloatingIpv4({ floatingIpv4Id: 9, address: "203.0.113.9", vlanId: 5, location: { id: 3, name: "New York" } });
    expect(floatingIp.location).toMatchObject({ id: 3, name: "New York" });
  });

  it("decodes an OIDC client list row, falling back to jwksHttpsUrl when jwksUri is absent", () => {
    const client = decodeOidcClient({
      clientId: 1,
      label: "svc",
      accountDefault: 1,
      enforceAllowList: "true",
      jwksHttpsUrl: "https://example.com/jwks.json"
    });
    expect(client.accountDefault).toBe(true);
    expect(client.enforceAllowList).toBe(true);
    expect(client.jwksUri).toBe("https://example.com/jwks.json");
  });
});

describe("vAPI3 list envelopes", () => {
  it("unwraps a bare array", async () => {
    const client = new V3Client({ apiKey: "test-key", baseUrl: "https://api.test", transport: async () => jsonResponse({ code: 200, data: [{ id: 1, label: "bare" }] }) });
    await expect(client.listVpcs()).resolves.toHaveLength(1);
  });

  it("unwraps a data array envelope", async () => {
    const client = new V3Client({ apiKey: "test-key", baseUrl: "https://api.test", transport: async () => jsonResponse({ code: 200, data: { data: [{ id: 1, label: "data" }] } }) });
    await expect(client.listVpcs()).resolves.toHaveLength(1);
  });

  it("unwraps a named subkey envelope", async () => {
    const client = new V3Client({ apiKey: "test-key", baseUrl: "https://api.test", transport: async () => jsonResponse({ code: 200, data: { vpcs: { data: [{ id: 1, label: "named" }] } } }) });
    await expect(client.listVpcs()).resolves.toHaveLength(1);
  });

  it("unwraps a Laravel paginator envelope", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { paginator: { current_page: 1, last_page: 1, data: [{ id: 1, label: "page" }] } } })
    });
    await expect(client.listVpcs()).resolves.toHaveLength(1);
  });

  it("follows offset pagination to the end", async () => {
    const seen: string[] = [];
    const transport: Transport = async (url) => {
      const parsed = new URL(url);
      seen.push(parsed.searchParams.get("offset") ?? "0");
      if (parsed.searchParams.get("offset") === "1") {
        return jsonResponse({ code: 200, data: { data: [{ id: 2, label: "second" }], meta: { limit: 1, offset: 1, total: 2 } } });
      }
      return jsonResponse({ code: 200, data: { data: [{ id: 1, label: "first" }], meta: { limit: 1, offset: 0, total: 2 } } });
    };
    const client = new V3Client({ apiKey: "test-key", baseUrl: "https://api.test", transport });
    await expect(client.listVpcs()).resolves.toHaveLength(2);
    expect(seen).toEqual(["0", "1"]);
  });
});

describe("clients", () => {
  it("uses NETACTUATE_API_KEY when no key is passed", async () => {
    process.env.NETACTUATE_API_KEY = "env-key";
    let sawKey = false;
    const client = new Client({
      baseUrl: "https://api.test/",
      transport: async (url) => {
        sawKey = new URL(url).searchParams.get("key") === "env-key";
        return jsonResponse({ result: "success", data: [] });
      }
    });
    await client.getServers();
    expect(sawKey).toBe(true);
    delete process.env.NETACTUATE_API_KEY;
  });

  it("redacts API keys from error text", async () => {
    const secret = "EXAMPLE-NOT-A-REAL-KEY-0000000000000000000000000000";
    const client = new V3Client({
      apiKey: secret,
      baseUrl: "https://api.test",
      transport: async () => textResponse("nope", 500)
    });
    await expect(client.listVpcs()).rejects.toThrow(/redacted/i);
    try {
      await client.listVpcs();
    } catch (error) {
      expect(String(error)).not.toContain(secret);
      expect(error).not.toHaveProperty("url", expect.stringContaining(secret));
    }
  });

  it("returns distinguishable not found errors", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404)
    });
    await expect(client.getServer(1)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    try {
      await client.getServer(1);
    } catch (error) {
      expect(isNotFoundError(error)).toBe(true);
    }
  });

  it("returns distinguishable contract errors", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 412, message: "agreement disabled", data: [] }, 412)
    });
    await expect(client.getServer(1)).rejects.toBeInstanceOf(NetActuateContractError);
    try {
      await client.getServer(1);
    } catch (error) {
      expect(isContractError(error)).toBe(true);
    }
  });
});

describe("tags", () => {
  it("lists tags", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, name: "prod" }] })
    });
    const tags = await client.getTags();
    expect(tags).toHaveLength(1);
    expect(tags[0]?.name).toBe("prod");
  });

  it("finds a tag by id from the list and throws not found when absent", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, name: "prod" }] })
    });
    await expect(client.getTag(1)).resolves.toMatchObject({ id: 1, name: "prod" });
    await expect(client.getTag(2)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    try {
      await client.getTag(2);
    } catch (error) {
      expect(isNotFoundError(error)).toBe(true);
    }
  });

  it("sends create and update tag bodies as JSON with flag fields normalized to 0/1", async () => {
    const seen: Array<{ body: string; contentType: string | undefined }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen.push({ body: init.body ?? "", contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { id: 1, name: "prod" } });
      }
    });
    await client.createTag({ name: "prod" });
    await client.updateTag(1, { name: "prod", isFavorite: true });
    expect(seen[0]?.contentType).toBe("application/json");
    expect(JSON.parse(seen[0]?.body ?? "{}")).toEqual({ name: "prod" });
    expect(JSON.parse(seen[1]?.body ?? "{}")).toMatchObject({ is_default: 0, is_favorite: 1, is_locked: 0, show_dashboard: 0 });
  });

  it("sends the resource identifier as a string when assigning and removing tag resources", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.assignTagResource(1, "server", 42);
    expect(JSON.parse(body)).toEqual({ resource_name: "server", identifier: "42" });
  });

  it("treats deleting an already absent tag as success", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404)
    });
    await expect(client.deleteTag(1)).resolves.toBeUndefined();
  });
});

describe("ssh keys", () => {
  it("lists ssh keys", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, name: "laptop", ssh_key: "ssh-ed25519 AAAA" }] })
    });
    const keys = await client.getSshKeys();
    expect(keys).toHaveLength(1);
    expect(keys[0]?.key).toBe("ssh-ed25519 AAAA");
  });

  it("throws not found for a null-body ssh key response", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: null })
    });
    await expect(client.getSshKey(99)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("treats deleting an already absent ssh key as success", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404)
    });
    await expect(client.deleteSshKey(1)).resolves.toBeUndefined();
  });
});

describe("cloud firewall", () => {
  it("lists and gets external IP sets", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (url.includes("firewall/external-ipsets/7")) {
          return jsonResponse({ result: "success", data: { id: 7, name: "office" } });
        }
        return jsonResponse({ result: "success", data: [{ id: 7, name: "office" }] });
      }
    });
    const sets = await client.getFirewallExternalIpSets();
    expect(sets).toEqual([{ id: 7, name: "office", description: undefined, raw: { id: 7, name: "office" } }]);
    const set = await client.getFirewallExternalIpSet(7);
    expect(set.name).toBe("office");
  });

  it("reports firewall manage enabled", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { enabled: true } })
    });
    await expect(client.getFirewallManageEnabled()).resolves.toMatchObject({ enabled: true });
  });

  it("lists and gets firewall sets, decoding flexible enabled and is_draft flags", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (url.includes("firewall/sets/9")) {
          return jsonResponse({ result: "success", data: { id: 9, name: "prod", description: "prod set", enabled: "1", is_draft: 0, draft_firewall_set_id: null } });
        }
        return jsonResponse({ result: "success", data: [{ id: 9, name: "prod", enabled: 1, is_draft: false }] });
      }
    });
    const sets = await client.getFirewallSets();
    expect(sets[0]).toMatchObject({ id: 9, enabled: true, isDraft: false });
    const set = await client.getFirewallSet(9);
    expect(set).toMatchObject({ id: 9, name: "prod", enabled: true, isDraft: false, draftFirewallSetId: undefined });
  });

  it("creates and updates a firewall set with a form-encoded body", async () => {
    const seen: { url: string; body?: string; contentType?: string }[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen.push({ url, body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { id: 9, name: "prod", enabled: true, is_draft: false } });
      }
    });
    await client.createFirewallSet("prod", "prod set", true);
    await client.updateFirewallSet(9, "prod", "prod set", false);
    expect(seen[0]?.contentType).toBe("application/x-www-form-urlencoded");
    expect(seen[0]?.body).toBe("name=prod&description=prod+set&enabled=1");
    expect(seen[1]?.url).toContain("firewall/sets/9");
    expect(seen[1]?.body).toBe("name=prod&description=prod+set&enabled=0");
  });

  it("treats deleting an already absent firewall set or draft as success", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404)
    });
    await expect(client.deleteFirewallSet(9)).resolves.toBeUndefined();
    await expect(client.deleteDraftFirewallSet(9)).resolves.toBeUndefined();
  });

  it("enables and disables a firewall set with no request body", async () => {
    const seen: { body?: string; contentType?: string }[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen.push({ body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.enableFirewallSet(9);
    await client.disableFirewallSet(9);
    expect(seen).toEqual([{ body: undefined, contentType: undefined }, { body: undefined, contentType: undefined }]);
  });

  it("creates a draft and publishes it", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        expect(url).toMatch(/create-draft|publish-draft/);
        return jsonResponse({ result: "success", data: { id: 10, name: "prod-draft", enabled: false, is_draft: true } });
      }
    });
    await expect(client.createDraftFirewallSet(9)).resolves.toMatchObject({ id: 10, isDraft: true });
    await expect(client.publishDraftFirewallSet(10)).resolves.toMatchObject({ id: 10 });
  });

  it("syncs firewall set rules to attached VMs", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        expect(url).toContain("firewall/sets/9/vm/sync-all");
        return jsonResponse({ result: "success", data: null });
      }
    });
    await expect(client.syncFirewallSetRules(9)).resolves.toBeUndefined();
  });

  it("lists and gets firewall rules", async () => {
    const rule = {
      id: 3,
      firewall_set_id: "9",
      ip_version: "4",
      direction: "in",
      action: "accept",
      enabled: 1,
      rule_priority: 100,
      match_criteria: { protocol: "tcp", source_port_start: null, source_port_end: null, destination_port_start: 22, destination_port_end: 22 }
    };
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (url.includes("rules/3")) {
          return jsonResponse({ result: "success", data: rule });
        }
        return jsonResponse({ result: "success", data: [rule] });
      }
    });
    const rules = await client.getFirewallRules(9);
    expect(rules[0]).toMatchObject({ id: 3, firewallSetId: 9, enabled: true });
    expect(rules[0]?.matchCriteria).toMatchObject({ protocol: "tcp", destinationPortStart: 22, destinationPortEnd: 22 });
    const single = await client.getFirewallRule(9, 3);
    expect(single.matchCriteria?.sourcePortStart).toBeUndefined();
  });

  it("creates a firewall rule, sending explicit nulls for unset port fields", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({
          result: "success",
          data: { id: 3, firewall_set_id: 9, ip_version: "4", direction: "in", action: "accept", enabled: true, rule_priority: 100 }
        });
      }
    });
    await client.createFirewallRule(9, {
      ipVersion: "4",
      action: "accept",
      enabled: true,
      matchCriteria: { protocol: "tcp", destinationPortStart: 22, destinationPortEnd: 22 }
    });
    expect(JSON.parse(body)).toEqual({
      ip_version: "4",
      action: "accept",
      enabled: true,
      match_criteria: {
        protocol: "tcp",
        source_port_start: null,
        source_port_end: null,
        destination_port_start: 22,
        destination_port_end: 22
      }
    });
  });

  it("updates a firewall rule at the mismatched firewall/{setId}/{ruleId} path used by the platform", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({
          result: "success",
          data: { id: 3, firewall_set_id: 9, ip_version: "4", direction: "out", action: "accept", enabled: true, rule_priority: 100 }
        });
      }
    });
    await client.updateFirewallRule(9, 3, { ipVersion: "4", direction: "out", action: "accept", enabled: true });
    expect(new URL(seenUrl).pathname).toBe("/firewall/9/3");
  });

  it("deletes a firewall rule, treating deleting an already absent rule as success", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404);
      }
    });
    await expect(client.deleteFirewallRule(9, 3)).resolves.toBeUndefined();
    expect(new URL(seenUrl).pathname).toBe("/firewall/9/rules/3");
  });

  it("reorders firewall rules", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.reorderFirewallRules(9, { moveId: 3, afterId: 5 });
    expect(JSON.parse(body)).toEqual({ move_id: 3, after_id: 5 });
  });

  it("lists VMs attached to a firewall set, decoding string-typed numeric fields", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: [{ id: "1", mbpkgid: "42", interface_id: "2", firewall_set_id: "9", set_priority: "0", hostname: "vm.example.com" }]
        })
    });
    const vms = await client.getFirewallSetVms(9);
    expect(vms).toEqual([
      {
        id: 1,
        mbpkgid: 42,
        interfaceId: 2,
        firewallSetId: 9,
        setPriority: 0,
        created: undefined,
        lastUpdated: undefined,
        iataCode: undefined,
        location: undefined,
        hostname: "vm.example.com"
      }
    ]);
  });

  it("lists available VMs with query flags", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [] });
      }
    });
    await client.getFirewallSetAvailableVms(9, { vpcId: 4, includeBandwidth: true, checkVpc: false });
    const params = new URL(seenUrl).searchParams;
    expect(params.get("vpc_id")).toBe("4");
    expect(params.get("bw")).toBe("1");
    expect(params.get("check_vpc")).toBe("0");
  });

  it("lists related firewall sets for a VM with the interface filter flag", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [] });
      }
    });
    await client.getFirewallSetRelatedVms(42, { disableInterfaceIdFilter: true });
    expect(new URL(seenUrl).searchParams.get("disable_interface_id_filter")).toBe("1");
  });

  it("attaches a VM to a firewall set", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: [{ id: 1, mbpkgid: 42, interface_id: 2, firewall_set_id: 9, set_priority: 0 }] });
      }
    });
    const vms = await client.attachFirewallSetVm(9, 42, 2, 0);
    expect(JSON.parse(body)).toEqual({ vm_list: [{ mbpkgid: 42, interface_id: 2, set_priority: 0 }] });
    expect(vms).toHaveLength(1);
  });

  it("detaches VMs from a firewall set by mbpkgid, relation id, or all at once", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(new URL(url).pathname);
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.detachFirewallSetVm(9, 42);
    await client.detachFirewallSetVmRelation(1);
    await client.detachAllFirewallSetVms(9);
    expect(seenUrls).toEqual(["/firewall/sets/9/vm/detach/42", "/firewall/sets/vm/detach/1", "/firewall/sets/9/vm/detach-all"]);
  });
});

describe("VPC", () => {
  it("lists VPC locations", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ id: 3, name: "New York" }] })
    });
    await expect(client.listVpcLocations()).resolves.toEqual([{ id: 3, name: "New York", flag: undefined }]);
  });

  it("adds a standby gateway with no request body", async () => {
    let sawBody: string | undefined;
    let sawContentType: string | undefined;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        sawBody = init.body;
        sawContentType = init.headers["Content-Type"];
        return jsonResponse({ code: 200, data: null });
      }
    });
    await client.addVpcStandbyGateway(55);
    expect(sawBody).toBeUndefined();
    expect(sawContentType).toBeUndefined();
  });

  it("treats removing an already absent standby gateway as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found" }, 404)
    });
    await expect(client.deleteVpcStandbyGateway(55)).resolves.toBeUndefined();
  });

  it("gets VPC IP reservations", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { gateways: [{ id: 1 }], interfaces: [], vms: [] } })
    });
    await expect(client.getVpcIpReservations(55)).resolves.toEqual({ gateways: [{ id: 1 }], interfaces: [], vms: [] });
  });

  it("gets VPC SSH settings", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { enabled: true, port: 2222, bastion: { ipv4: "192.0.2.10" } } })
    });
    const settings = await client.getVpcSshSettings(55);
    expect(settings).toMatchObject({ enabled: true, port: 2222, keys: [], bastion: { ipv4: "192.0.2.10" } });
  });

  it("polls until a VPC is running, without waiting in real time", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        const status = calls < 3 ? "Building" : "Running";
        return jsonResponse({ code: 200, data: { vpcId: 55, label: "test", status } });
      }
    });
    const sleeps: number[] = [];
    await client.waitForVpcReady(55, { sleep: async (ms) => { sleeps.push(ms); } });
    expect(calls).toBe(3);
    expect(sleeps).toEqual([60_000, 60_000]);
  });

  it("throws after the timeout elapses without the VPC becoming ready", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { vpcId: 55, label: "test", status: "Building" } })
    });
    let now = 0;
    const originalNow = Date.now;
    Date.now = () => now;
    try {
      await expect(
        client.waitForVpcReady(55, {
          timeoutMs: 1000,
          intervalMs: 400,
          sleep: async (ms) => {
            now += ms;
          }
        })
      ).rejects.toThrow(/timeout waiting for VPC 55/);
    } finally {
      Date.now = originalNow;
    }
  });

  it("creates, lists, updates, replaces and deletes VPC backend templates", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (path.endsWith("/backend-templates") && init.method === "GET") {
          return jsonResponse({ code: 200, data: [{ backendTemplateId: 7, name: "web" }] });
        }
        return jsonResponse({ code: 200, data: { backendTemplateId: 7, name: "web", description: init.method === "PUT" ? "replaced" : "created" } });
      }
    });

    const created = await client.createVpcBackendTemplate(55, { name: "web" });
    expect(created.backendTemplateId).toBe(7);

    const fetched = await client.getVpcBackendTemplate(55, 7);
    expect(fetched.name).toBe("web");

    const listed = await client.listVpcBackendTemplates(55);
    expect(listed).toHaveLength(1);

    const updated = await client.updateVpcBackendTemplate(55, 7, { name: "web-updated" });
    expect(updated.backendTemplateId).toBe(7);

    const replaced = await client.replaceVpcBackendTemplate(55, 7, { backendHosts: [{ address: "203.0.113.1" }] });
    expect(replaced.description).toBe("replaced");

    await client.deleteVpcBackendTemplate(55, 7);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "GET", "PATCH", "PUT", "DELETE"]);
  });

  it("replaces VPC backends by decoding the backendHosts wrapper object, not a bare array", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { backendHosts: [{ backendHostId: 1, address: "203.0.113.1" }] } })
    });
    const backends = await client.replaceVpcBackends(55, 7, { backendHosts: [{ address: "203.0.113.1" }] });
    expect(backends).toEqual([{ backendHostId: 1, name: undefined, address: "203.0.113.1", internalAddress: undefined }]);
  });

  it("creates, lists and updates VPC backend hosts", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: [{ backendHostId: 1, address: "203.0.113.1" }] });
        }
        return jsonResponse({ code: 200, data: { backendHostId: 1, address: "203.0.113.2" } });
      }
    });
    const created = await client.createVpcBackend(55, 7, { address: "203.0.113.1" });
    expect(created.backendHostId).toBe(1);

    const listed = await client.listVpcBackends(55, 7);
    expect(listed).toHaveLength(1);

    const updated = await client.updateVpcBackend(55, 7, 1, { address: "203.0.113.2" });
    expect(updated.address).toBe("203.0.113.2");
  });

  it("finds a VPC backend by id from the list and throws not found when absent", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ backendHostId: 1, address: "203.0.113.1" }] })
    });
    await expect(client.getVpcBackend(55, 7, 1)).resolves.toMatchObject({ backendHostId: 1 });
    await expect(client.getVpcBackend(55, 7, 2)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    try {
      await client.getVpcBackend(55, 7, 2);
    } catch (error) {
      expect(isNotFoundError(error)).toBe(true);
    }
  });

  it("treats deleting an already absent VPC backend as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found" }, 404)
    });
    await expect(client.deleteVpcBackend(55, 7, 1)).resolves.toBeUndefined();
  });
});

describe("VPC bastion SSH keys", () => {
  it("updates VPC SSH settings", async () => {
    let sawBody: string | undefined;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        sawBody = init.body;
        return jsonResponse({ code: 200, data: { enabled: true, port: 2200, keys: {} } });
      }
    });
    const settings = await client.updateVpcSshSettings(55, { port: 2200 });
    expect(settings.port).toBe(2200);
    expect(sawBody).toBe(JSON.stringify({ port: 2200 }));
  });

  it("lists VPC SSH keys", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ id: 1, name: "laptop" }, { id: 2, name: "bastion" }] })
    });
    const keys = await client.listVpcSshKeys(55);
    expect(keys.map((key) => key.id)).toEqual([1, 2]);
  });

  it("finds a VPC SSH key by id from the list and throws not found when absent", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ id: 1, name: "laptop" }] })
    });
    await expect(client.getVpcSshKey(55, 1)).resolves.toMatchObject({ id: 1 });
    await expect(client.getVpcSshKey(55, 9)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("enables and disables a VPC SSH key with a PATCH body", async () => {
    const calls: Array<{ method: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        calls.push({ method: init.method, body: init.body });
        return jsonResponse({ code: 200, data: null });
      }
    });
    await client.enableVpcSshKey(55, 1, true);
    await client.deleteVpcSshKey(55, 1);
    expect(calls).toEqual([
      { method: "PATCH", body: JSON.stringify({ enabled: true }) },
      { method: "PATCH", body: JSON.stringify({ enabled: false }) }
    ]);
  });
});

describe("VPC floating IPs", () => {
  it("creates a VPC floating IP", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { floatingIpId: 9 } })
    });
    await expect(client.createVpcFloatingIp(55, { ipVersion: 4 })).resolves.toBe(9);
  });

  it("retries floating IP creation on a transient server error and on a VPC-not-ready error", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        if (calls === 1) {
          return jsonResponse({ code: 500, message: "gateway timeout" }, 500);
        }
        if (calls === 2) {
          return jsonResponse({ code: 400, message: "VPC 55 is not ready yet" }, 400);
        }
        return jsonResponse({ code: 200, data: { floatingIpId: 9 } });
      }
    });
    const sleeps: number[] = [];
    const floatingIpId = await client.createVpcFloatingIp(
      55,
      { ipVersion: 4 },
      { sleep: async (ms) => { sleeps.push(ms); } }
    );
    expect(floatingIpId).toBe(9);
    expect(calls).toBe(3);
    expect(sleeps).toEqual([10_000, 10_000]);
  });

  it("does not retry floating IP creation on a non-transient error", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 412, message: "contract does not allow floating IPs" }, 412);
      }
    });
    await expect(
      client.createVpcFloatingIp(55, { ipVersion: 4 }, { sleep: async () => {} })
    ).rejects.toBeInstanceOf(NetActuateContractError);
    expect(calls).toBe(1);
  });

  it("finds a VPC floating IP by id from the list and throws not found when absent", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ floatingIpId: 9, address: "203.0.113.9", ipVersion: 4, isPrimary: true }] })
    });
    await expect(client.getVpcFloatingIp(55, 9)).resolves.toMatchObject({ address: "203.0.113.9" });
    await expect(client.getVpcFloatingIp(55, 1)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("updates and deletes a VPC floating IP, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        calls.push({ method: init.method, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        return jsonResponse({ code: 200, data: null });
      }
    });
    await client.updateVpcFloatingIp(55, 9, { ptr: "host.example.com" });
    await expect(client.deleteVpcFloatingIp(55, 9)).resolves.toBeUndefined();
    expect(calls.map((call) => call.method)).toEqual(["PATCH", "DELETE"]);
  });

  it("lists VPC floating IPs", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ floatingIpId: 9, address: "203.0.113.9", ipVersion: 4, isPrimary: true }] })
    });
    await expect(client.listVpcFloatingIps(55)).resolves.toHaveLength(1);
  });
});

describe("VPC gateway firewall rules", () => {
  it("creates a firewall rule and returns its id", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { firewallRuleId: 3 } })
    });
    await expect(client.createVpcFirewallRule(55, { ipVersion: 4, direction: "inbound" })).resolves.toBe(3);
  });

  it("lists all firewall rules and firewall rules for one IP version", async () => {
    const calls: string[] = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url) => {
        calls.push(new URL(url).pathname);
        return jsonResponse({ code: 200, data: [{ firewallRuleId: 3, ipVersion: 4, direction: "inbound", port: { start: 80, end: 80 } }] });
      }
    });
    const all = await client.listVpcFirewallRulesAll(55);
    expect(all[0]?.port).toEqual({ start: 80, end: 80 });
    await client.listVpcFirewallRules(55, 6);
    expect(calls).toEqual(["/vpcs/55/gateway/rules/firewall", "/vpcs/55/gateway/rules/firewall/ipv6"]);
  });

  it("finds a firewall rule by id for an IP version and throws not found when absent", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ firewallRuleId: 3, ipVersion: 4, direction: "inbound" }] })
    });
    await expect(client.getVpcFirewallRule(55, 3, 4)).resolves.toMatchObject({ firewallRuleId: 3 });
    await expect(client.getVpcFirewallRule(55, 9, 4)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("updates and deletes a firewall rule, treating deleting an absent one as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        return jsonResponse({ code: 200, data: { firewallRuleId: 3, ipVersion: 4, direction: "outbound" } });
      }
    });
    const updated = await client.updateVpcFirewallRule(55, 3, { direction: "outbound" });
    expect(updated.direction).toBe("outbound");
    await expect(client.deleteVpcFirewallRule(55, 3)).resolves.toBeUndefined();
  });

  it("retries applying firewall changes on a transient server error", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return calls < 3 ? jsonResponse({ code: 503, message: "not ready" }, 503) : jsonResponse({ code: 200, data: null });
      }
    });
    const sleeps: number[] = [];
    await client.applyVpcFirewallChanges(55, { sleep: async (ms) => { sleeps.push(ms); } });
    expect(calls).toBe(3);
    expect(sleeps).toEqual([10_000, 10_000]);
  });

  it("gives up applying firewall changes after exhausting retries", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 502, message: "bad gateway" }, 502);
      }
    });
    await expect(client.applyVpcFirewallChanges(55, { sleep: async () => {} })).rejects.toThrow(/bad gateway/);
    expect(calls).toBe(7);
  });
});

describe("VPC gateway SNAT rules", () => {
  it("creates, lists, gets, updates and deletes SNAT rules", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET") {
          return jsonResponse({
            code: 200,
            data: [{ snatRuleId: 4, ipVersion: 4, match: { internalCidr: "10.0.0.0/24" }, translation: { address: { start: "203.0.113.1" } } }]
          });
        }
        return jsonResponse({ code: 200, data: { snatRuleId: 4, ipVersion: 4, description: init.method === "PATCH" ? "updated" : "created" } });
      }
    });

    const created = await client.createVpcSnatRule(55, { ipVersion: 4 });
    expect(created.snatRuleId).toBe(4);

    const all = await client.listVpcSnatRulesAll(55);
    expect(all[0]?.match?.internalCidr).toBe("10.0.0.0/24");

    const scoped = await client.listVpcSnatRules(55, 4);
    expect(scoped[0]?.translation?.address).toEqual({ start: "203.0.113.1", end: undefined });

    const fetched = await client.getVpcSnatRule(55, 4, 4);
    expect(fetched.snatRuleId).toBe(4);
    await expect(client.getVpcSnatRule(55, 99, 4)).rejects.toBeInstanceOf(NetActuateNotFoundError);

    const updated = await client.updateVpcSnatRule(55, 4, { description: "updated" });
    expect(updated.description).toBe("updated");

    await client.deleteVpcSnatRule(55, 4);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "GET", "GET", "GET", "PATCH", "DELETE"]);
  });

  it("retries applying SNAT changes on a transient server error", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return calls < 2 ? jsonResponse({ code: 500, message: "boom" }, 500) : jsonResponse({ code: 200, data: null });
      }
    });
    await client.applyVpcSnatChanges(55, { sleep: async () => {} });
    expect(calls).toBe(2);
  });
});

describe("VPC gateway DNAT rules", () => {
  it("creates, lists, gets, updates and deletes DNAT rules", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET") {
          return jsonResponse({
            code: 200,
            data: [{ dnatRuleId: 5, ipVersion: 6, match: { address: "2001:db8::1" }, translation: { address: "10.0.0.5" } }]
          });
        }
        return jsonResponse({ code: 200, data: { dnatRuleId: 5, ipVersion: 6, description: init.method === "PATCH" ? "updated" : "created" } });
      }
    });

    const created = await client.createVpcDnatRule(55, { ipVersion: 6, translation: { address: "10.0.0.5" } });
    expect(created.dnatRuleId).toBe(5);

    const all = await client.listVpcDnatRulesAll(55);
    expect(all[0]?.translation).toEqual({ address: "10.0.0.5", port: undefined });

    const scoped = await client.listVpcDnatRules(55, 6);
    expect(scoped[0]?.match?.address).toBe("2001:db8::1");

    const fetched = await client.getVpcDnatRule(55, 5, 6);
    expect(fetched.dnatRuleId).toBe(5);
    await expect(client.getVpcDnatRule(55, 99, 6)).rejects.toBeInstanceOf(NetActuateNotFoundError);

    const updated = await client.updateVpcDnatRule(55, 5, { description: "updated" });
    expect(updated.description).toBe("updated");

    await client.deleteVpcDnatRule(55, 5);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "GET", "GET", "GET", "PATCH", "DELETE"]);
  });

  it("retries applying DNAT changes on a transient server error", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return calls < 2 ? jsonResponse({ code: 504, message: "timeout" }, 504) : jsonResponse({ code: 200, data: null });
      }
    });
    await client.applyVpcDnatChanges(55, { sleep: async () => {} });
    expect(calls).toBe(2);
  });
});

describe("storage types and locations", () => {
  it("lists storage types from a bare array", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ type: "s3", name: "Object storage" }] })
    });
    await expect(client.listStorageTypes()).resolves.toEqual([{ type: "s3", name: "Object storage", description: undefined, raw: { type: "s3", name: "Object storage" } }]);
  });

  it("lists storage locations paired with their hardware class", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ location: { id: 3, name: "New York" }, hardware: { id: 1, name: "fast" } }] })
    });
    const locations = await client.listStorageLocations();
    expect(locations).toHaveLength(1);
    expect(locations[0]?.hardware.name).toBe("fast");
  });
});

describe("storage buckets", () => {
  it("converts a bucket to an object store and returns the new id", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { objectStoreId: 77 } })
    });
    await expect(client.convertStorageBucketToStore(10)).resolves.toBe(77);
  });

  it("polls until a storage bucket is ready, without waiting in real time", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 200, data: { bucketId: 10, label: "test", ready: calls >= 3 } });
      }
    });
    const sleeps: number[] = [];
    await client.waitForStorageBucketReady(10, { sleep: async (ms) => { sleeps.push(ms); } });
    expect(calls).toBe(3);
    expect(sleeps).toEqual([10_000, 10_000]);
  });

  it("throws after the timeout elapses without the bucket becoming ready", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { bucketId: 10, label: "test", ready: false } })
    });
    let now = 0;
    const originalNow = Date.now;
    Date.now = () => now;
    try {
      await expect(
        client.waitForStorageBucketReady(10, { timeoutMs: 1000, intervalMs: 400, sleep: async (ms) => { now += ms; } })
      ).rejects.toThrow(/timeout waiting for storage bucket 10/);
    } finally {
      Date.now = originalNow;
    }
  });
});

describe("storage object stores", () => {
  it("creates, lists, gets, updates and deletes object stores", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET" && path === "/storage/object-stores") {
          return jsonResponse({ code: 200, data: [{ objectStoreId: 20, label: "store" }] });
        }
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: { objectStoreId: 20, label: "store", ready: true } });
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { objectStoreId: 20 } });
        }
        return jsonResponse({ code: 200, data: { objectStoreId: 20, label: "renamed" } });
      }
    });

    await expect(client.createStorageObjectStore({ locationId: 3, label: "store" })).resolves.toBe(20);
    await expect(client.listStorageObjectStores()).resolves.toMatchObject([{ metadata: { objectStoreId: 20 } }]);
    await expect(client.getStorageObjectStore(20)).resolves.toMatchObject({ metadata: { label: "store" } });
    await client.updateStorageObjectStore(20, { label: "renamed" });
    await client.deleteStorageObjectStore(20);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "GET", "PATCH", "DELETE"]);
  });

  it("deletes an already absent object store as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found" }, 404)
    });
    await expect(client.deleteStorageObjectStore(20)).resolves.toBeUndefined();
  });

  it("polls until a storage object store is ready", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 200, data: { objectStoreId: 20, label: "store", ready: calls >= 2 } });
      }
    });
    await client.waitForStorageObjectStoreReady(20, { sleep: async () => {} });
    expect(calls).toBe(2);
  });
});

describe("storage block namespaces", () => {
  it("creates, lists, gets, updates and deletes block namespaces", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET" && path === "/storage/block-namespaces") {
          return jsonResponse({ code: 200, data: [{ blockNamespaceId: 30, label: "namespace" }] });
        }
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: { blockNamespaceId: 30, label: "namespace", ready: true } });
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { blockNamespaceId: 30 } });
        }
        return jsonResponse({ code: 200, data: { blockNamespaceId: 30, label: "renamed" } });
      }
    });

    await expect(client.createStorageBlockNamespace({ locationId: 3, label: "namespace" })).resolves.toBe(30);
    await expect(client.listStorageBlockNamespaces()).resolves.toMatchObject([{ metadata: { blockNamespaceId: 30 } }]);
    await expect(client.getStorageBlockNamespace(30)).resolves.toMatchObject({ metadata: { label: "namespace" } });
    await client.updateStorageBlockNamespace(30, { label: "renamed" });
    await client.deleteStorageBlockNamespace(30);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "GET", "PATCH", "DELETE"]);
  });

  it("polls until a storage block namespace is ready", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 200, data: { blockNamespaceId: 30, label: "namespace", ready: calls >= 2 } });
      }
    });
    await client.waitForStorageBlockNamespaceReady(30, { sleep: async () => {} });
    expect(calls).toBe(2);
  });
});

describe("storage block volumes", () => {
  it("creates, lists, updates and deletes block volumes", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: [{ blockVolumeId: 40, label: "volume" }] });
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { blockVolumeId: 40 } });
        }
        return jsonResponse({ code: 200, data: { blockVolumeId: 40, label: "renamed" } });
      }
    });

    await expect(client.createStorageBlockVolume({ locationId: 3, label: "volume" })).resolves.toBe(40);
    await expect(client.listStorageBlockVolumes()).resolves.toMatchObject([{ metadata: { blockVolumeId: 40 } }]);
    await client.updateStorageBlockVolume(40, { label: "renamed" });
    await client.deleteStorageBlockVolume(40);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "PATCH", "DELETE"]);
  });

  it("fills in the requested id when the single-volume GET has the platform id defect", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { objectStoreId: 999, label: "volume", ready: true } })
    });
    const volume = await client.getStorageBlockVolume(40);
    expect(volume.metadata.blockVolumeId).toBe(40);
    expect(volume.metadata.label).toBe("volume");
  });

  it("trusts the id when the single-volume GET reports one correctly", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { blockVolumeId: 41, label: "volume" } })
    });
    await expect(client.getStorageBlockVolume(40)).resolves.toMatchObject({ metadata: { blockVolumeId: 41 } });
  });

  it("polls until a storage block volume is ready", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 200, data: { blockVolumeId: 40, label: "volume", ready: calls >= 2 } });
      }
    });
    await client.waitForStorageBlockVolumeReady(40, { sleep: async () => {} });
    expect(calls).toBe(2);
  });
});

describe("NKE clusters and addons", () => {
  it("creates access URLs for a cluster", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { api: "https://api.example", kubernetesDashboard: "https://dash.example" } })
    });
    await expect(client.createNkeAccessUrls(20)).resolves.toEqual({
      api: "https://api.example",
      prometheus: undefined,
      kubernetesDashboard: "https://dash.example"
    });
  });

  it("lists a cluster's activity log", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ recordedOn: "2026-01-01T00:00:00Z", message: "created" }] })
    });
    await expect(client.listNkeClusterLogs(20)).resolves.toEqual([{ recordedOn: "2026-01-01T00:00:00Z", message: "created" }]);
  });

  it("lists, gets, updates and deletes worker nodes, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "GET" && path.endsWith("/worker-nodes")) {
          return jsonResponse({ code: 200, data: [{ workerNodeId: 5, clusterId: 20, name: "worker-1" }] });
        }
        return jsonResponse({ code: 200, data: { workerNodeId: 5, clusterId: 20, name: "worker-1-renamed" } });
      }
    });

    await expect(client.listNkeWorkerNodes(20)).resolves.toMatchObject([{ workerNodeId: 5 }]);
    await expect(client.getNkeWorkerNode(20, 5)).resolves.toMatchObject({ name: "worker-1-renamed" });
    await expect(client.updateNkeWorkerNode(20, 5, { label: "renamed" })).resolves.toMatchObject({ name: "worker-1-renamed" });
    await expect(client.deleteNkeWorkerNode(20, 5)).resolves.toBeUndefined();
    expect(calls.map((call) => call.method)).toEqual(["GET", "GET", "PATCH", "DELETE"]);
  });

  it("polls until a cluster reports the minimum worker node count, without waiting in real time", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        const nodes = calls >= 2 ? [{ workerNodeId: 1, clusterId: 20, name: "a" }, { workerNodeId: 2, clusterId: 20, name: "b" }] : [];
        return jsonResponse({ code: 200, data: nodes });
      }
    });
    const sleeps: number[] = [];
    await client.waitForNkeWorkerNodes(20, 2, { sleep: async (ms) => { sleeps.push(ms); } });
    expect(calls).toBe(2);
    expect(sleeps).toEqual([60_000]);
  });

  it("returns immediately when waiting for zero or fewer worker nodes", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [] })
    });
    await expect(client.waitForNkeWorkerNodes(20, 0)).resolves.toBeUndefined();
  });

  it("polls until a cluster becomes healthy", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        return jsonResponse({ code: 200, data: { clusterId: 20, name: "c", status: { cluster: calls >= 2 ? "Healthy" : "Building" } } });
      }
    });
    await client.waitForNkeClusterHealthy(20, { sleep: async () => {} });
    expect(calls).toBe(2);
  });

  it("throws immediately when a cluster enters a failed state, without waiting out the timeout", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { clusterId: 20, name: "c", status: { cluster: "Failed" } } })
    });
    await expect(client.waitForNkeClusterHealthy(20, { sleep: async () => { throw new Error("should not sleep"); } })).rejects.toThrow(
      /entered failed state: Failed/
    );
  });

  it("throws after the timeout elapses without the cluster becoming healthy", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { clusterId: 20, name: "c", status: { cluster: "Building" } } })
    });
    let now = 0;
    const originalNow = Date.now;
    Date.now = () => now;
    try {
      await expect(
        client.waitForNkeClusterHealthy(20, { timeoutMs: 1000, intervalMs: 400, sleep: async (ms) => { now += ms; } })
      ).rejects.toThrow(/timeout waiting for NKE cluster 20 to become healthy/);
    } finally {
      Date.now = originalNow;
    }
  });

  it("lists the addon catalog and a cluster's installed addons, gets, creates, updates and deletes one", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (path === "/nke/addons") {
          return jsonResponse({ code: 200, data: [{ addonId: 1, addonType: "storage", version: "1.0.0" }] });
        }
        if (init.method === "GET" && path.endsWith("/addons")) {
          return jsonResponse({ code: 200, data: [{ id: 9, addonType: "storage", state: "Installed" }] });
        }
        return jsonResponse({ code: 200, data: { id: 9, addonType: "storage", state: "Installed" } });
      }
    });

    await expect(client.listNkeAddonCatalog()).resolves.toMatchObject([{ addonId: 1, addonType: "storage" }]);
    await expect(client.listNkeClusterAddons(20)).resolves.toMatchObject([{ id: 9, addonType: "storage" }]);
    await expect(client.getNkeClusterAddon(20, "storage")).resolves.toMatchObject({ id: 9 });
    await expect(client.createNkeClusterAddon(20, { addonType: "storage", config: { poolLabel: "pool-a" } })).resolves.toMatchObject({ id: 9 });
    await expect(client.updateNkeClusterAddon(20, "storage", { config: { poolLabel: "pool-b" } })).resolves.toMatchObject({ id: 9 });
    await expect(client.deleteNkeClusterAddon(20, "storage")).resolves.toBeUndefined();
  });

  it("lists a cluster's DNS zones", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ dnsZoneId: 3, clusterId: 20, zone: "example.com", mode: "sync" }] })
    });
    await expect(client.listNkeClusterDnsZones(20)).resolves.toMatchObject([{ dnsZoneId: 3, zone: "example.com" }]);
  });
});

describe("customer VLANs and server NICs", () => {
  it("lists VLANs, gets one by id, and lists VLANs at a location", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(new URL(url).pathname);
        if (url.includes("vlans/5")) {
          return jsonResponse({ result: "success", data: { id: 5, mbid: 1, private: 0, allow_sriov: 0 } });
        }
        return jsonResponse({ result: "success", data: [{ id: 5, mbid: 1, private: 0, allow_sriov: 0 }] });
      }
    });
    await expect(client.getVlans()).resolves.toHaveLength(1);
    await expect(client.getCustomerVlan(5)).resolves.toMatchObject({ id: 5 });
    await expect(client.listCustomerVlansAtLocation(3)).resolves.toHaveLength(1);
    expect(seenUrls).toEqual(["/cloud/networking/vlans", "/cloud/networking/vlans/5", "/cloud/networking/locations/3/vlans"]);
  });

  it("lists, attaches and updates server NICs with JSON bodies", async () => {
    const calls: Array<{ method: string; body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        calls.push({ method: init.method, body: init.body, contentType: init.headers["Content-Type"] });
        if (init.method === "GET") {
          return jsonResponse({ result: "success", data: [{ nic_id: 1, mbpkgid: 42, customer_vlan_id: 5, attach_order: 0 }] });
        }
        return jsonResponse({ result: "success", data: { nic_id: 2, mbpkgid: 42, customer_vlan_id: 5, attach_order: 1 } });
      }
    });
    await expect(client.getServerNics(42)).resolves.toHaveLength(1);

    const attached = await client.attachServerNic(42, { customerVlanId: 5 });
    expect(attached.nicId).toBe(2);
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ customer_vlan_id: 5 });
    expect(calls[1]?.contentType).toBe("application/json");

    const updated = await client.updateServerNic(2, { mbpkgid: 42, customerVlanId: 5, attachOrder: 1 });
    expect(updated.attachOrder).toBe(1);
    expect(JSON.parse(calls[2]?.body ?? "{}")).toEqual({ mbpkgid: 42, customer_vlan_id: 5, attach_order: 1 });
  });

  it("detaches a server NIC with the mbpkgid as a query parameter, treating an already absent NIC as success", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404);
      }
    });
    await expect(client.detachServerNic(42, 2)).resolves.toBeUndefined();
    expect(new URL(seenUrl).pathname).toBe("/cloud/networking/nics/2");
    expect(new URL(seenUrl).searchParams.get("mbpkgid")).toBe("42");
  });
});

describe("cloud floating IPv4", () => {
  it("creates, lists, grants, revokes and deletes floating IPv4 addresses", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET" && path.endsWith("/vms")) {
          return jsonResponse({ code: 200, data: [{ mbpkgid: 42, fqdn: "vm.example.com" }] });
        }
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: [{ floatingIpv4Id: 9, address: "203.0.113.9", vlanId: 5 }] });
        }
        if (path.endsWith("/floating-ips/ipv4")) {
          return jsonResponse({ code: 200, data: { floatingIpv4Id: 9, address: "203.0.113.9", vlanId: 5 } });
        }
        return jsonResponse({ code: 200, data: null });
      }
    });

    const created = await client.createCloudFloatingIpv4({ vlanId: 5 });
    expect(created.floatingIpv4Id).toBe(9);

    await expect(client.listCloudFloatingIpv4()).resolves.toHaveLength(1);
    await expect(client.listCloudFloatingIpv4Vms(9)).resolves.toEqual([{ mbpkgid: 42, fqdn: "vm.example.com", ip: undefined }]);

    await client.grantCloudFloatingIpv4Vms(9, { vms: [{ mbpkgid: 42 }] });
    await client.revokeCloudFloatingIpv4Vms(9, { vms: [{ mbpkgid: 42 }] });
    await client.deleteCloudFloatingIpv4(9);

    expect(calls.map((call) => call.method)).toEqual(["POST", "GET", "GET", "POST", "POST", "DELETE"]);
    expect(calls[3]?.path).toBe("/cloud/networking/floating-ips/ipv4/9/vms/mass-grant");
    expect(calls[4]?.path).toBe("/cloud/networking/floating-ips/ipv4/9/vms/mass-revoke");
  });

  it("treats deleting an already absent floating IPv4 address as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found" }, 404)
    });
    await expect(client.deleteCloudFloatingIpv4(9)).resolves.toBeUndefined();
  });

  it("lists cloud networking locations", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: [{ locationId: 3, datacenterId: 12 }] })
    });
    await expect(client.listCloudNetworkingLocations()).resolves.toEqual([{ locationId: 3, datacenterId: 12 }]);
  });
});

describe("OIDC clients", () => {
  it("creates, lists, gets, updates and deletes OIDC clients, merging list and detail fields", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "PATCH") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "POST" && path === "/oidc/clients") {
          return jsonResponse({ code: 200, data: { clientId: 7 } });
        }
        if (init.method === "GET" && path === "/oidc/clients") {
          return jsonResponse({
            code: 200,
            data: {
              tenant: 288,
              clients: {
                data: [{ clientId: 7, label: "list-label", accountDefault: true, defaultAudience: "aud", ttl: 3600, enforceAllowList: false }]
              }
            }
          });
        }
        if (init.method === "GET" && path === "/oidc/clients/7") {
          return jsonResponse({
            code: 200,
            data: {
              metadata: { createdOn: "2026-01-01", label: "detail-label", jwksUri: "https://example.com/jwks.json" },
              keys: { data: [{ keyId: 1, label: "key-1" }] },
              logs: { auth: { data: [] }, changes: { data: [] } }
            }
          });
        }
        throw new Error(`unexpected request ${init.method} ${path}`);
      }
    });

    const clientId = await client.createOidcClient({ accountDefault: false, enforceAllowList: false, label: "svc" });
    expect(clientId).toBe(7);

    const clients = await client.listOidcClients();
    expect(clients).toEqual([
      {
        clientId: 7,
        createdOn: undefined,
        lastUsedOn: undefined,
        label: "list-label",
        description: undefined,
        jwksUri: undefined,
        accountDefault: true,
        defaultAudience: "aud",
        ttl: 3600,
        enforceAllowList: false,
        tenant: "288"
      }
    ]);

    const fetched = await client.getOidcClient(7);
    expect(fetched.label).toBe("detail-label");
    expect(fetched.jwksUri).toBe("https://example.com/jwks.json");
    expect(fetched.accountDefault).toBe(true);
    expect(fetched.tenant).toBe("288");
    expect(fetched.keys).toEqual([
      {
        keyId: 1,
        label: "key-1",
        description: undefined,
        providedOn: undefined,
        revokedOn: undefined,
        type: undefined,
        value: undefined,
        publicKey: undefined
      }
    ]);

    await client.updateOidcClient(7, { label: "renamed" });
    await client.deleteOidcClient(7);

    expect(calls.map((call) => `${call.method} ${call.path}`)).toEqual([
      "POST /oidc/clients",
      "GET /oidc/clients",
      "GET /oidc/clients/7",
      "GET /oidc/clients",
      "PATCH /oidc/clients/7",
      "DELETE /oidc/clients/7"
    ]);
  });

  it("throws not found when an OIDC client id is absent from the list", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url) => {
        const path = new URL(url).pathname;
        if (path === "/oidc/clients/9") {
          return jsonResponse({ code: 200, data: { metadata: {}, keys: { data: [] }, logs: { auth: { data: [] }, changes: { data: [] } } } });
        }
        return jsonResponse({ code: 200, data: { tenant: 1, clients: { data: [] } } });
      }
    });
    await expect(client.getOidcClient(9)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    try {
      await client.getOidcClient(9);
    } catch (error) {
      expect(isNotFoundError(error)).toBe(true);
    }
  });

  it("creates, lists and updates OIDC client keys", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path, body: init.body });
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { keys: [{ keyId: 1, publicKey: "ssh-ed25519 AAAA" }] } });
        }
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: { keys: { data: [{ keyId: 1, publicKey: "ssh-ed25519 AAAA" }] } } });
        }
        return jsonResponse({ code: 200, data: null });
      }
    });

    const created = await client.createOidcClientKeys(7, [{ publicKey: "ssh-ed25519 AAAA" }]);
    expect(created).toHaveLength(1);
    expect(JSON.parse(calls[0]?.body ?? "{}")).toEqual({ keys: [{ publicKey: "ssh-ed25519 AAAA" }] });

    const keys = await client.getOidcClientKeys(7);
    expect(keys[0]?.keyId).toBe(1);

    await client.updateOidcClientKey(7, 1, { label: "renamed" });
    expect(calls[2]?.method).toBe("PATCH");
  });

  it("treats revoking an OIDC client key as idempotent on both not found and an already-revoked 400", async () => {
    const notFoundClient = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found" }, 404)
    });
    await expect(notFoundClient.deleteOidcClientKey(7, 1)).resolves.toBeUndefined();

    const revokedClient = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 400, message: "The key is revoked" }, 400)
    });
    await expect(revokedClient.deleteOidcClientKey(7, 1)).resolves.toBeUndefined();
  });

  it("throws for an unrelated 400 when revoking an OIDC client key", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 400, message: "malformed request" }, 400)
    });
    await expect(client.deleteOidcClientKey(7, 1)).rejects.toThrow(/malformed request/);
  });

  it("adds and removes OIDC client VM and bare metal server grants", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path, body: init.body });
        return jsonResponse({ code: 200, data: null });
      }
    });

    await client.addOidcClientVms(7, [42]);
    expect(JSON.parse(calls[0]?.body ?? "{}")).toEqual({ vms: [{ mbpkgid: 42 }] });

    await client.addOidcClientBareMetalServers(7, [43]);
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ servers: [{ mbpkgid: 43 }] });

    await client.removeOidcClientVm(7, 42);
    await client.removeOidcClientBareMetalServer(7, 43);

    expect(calls.map((call) => call.path)).toEqual([
      "/oidc/clients/7/allow-list/vms",
      "/oidc/clients/7/allow-list/bare-metal",
      "/oidc/clients/7/allow-list/vms/42",
      "/oidc/clients/7/allow-list/bare-metal/43"
    ]);
  });

  it("lists OIDC client VMs, bare metal servers, auth logs and change logs", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url) => {
        const path = new URL(url).pathname;
        if (path.endsWith("/allow-list/vms")) {
          return jsonResponse({ code: 200, data: { vms: [{ mbpkgid: 42 }] } });
        }
        if (path.endsWith("/allow-list/bare-metal")) {
          return jsonResponse({ code: 200, data: { servers: [123] } });
        }
        if (path.endsWith("/auth-logs")) {
          return jsonResponse({ code: 200, data: { logs: { data: [{ id: 1, jti: "abc" }] } } });
        }
        return jsonResponse({ code: 200, data: { logs: { data: [{ keyId: 1, type: "created" }] } } });
      }
    });

    await expect(client.getOidcClientVms(7)).resolves.toEqual([{ mbpkgid: 42, raw: { mbpkgid: 42 } }]);
    await expect(client.getOidcClientBareMetalServers(7)).resolves.toEqual([{ mbpkgid: 123, raw: 123 }]);
    await expect(client.getOidcClientAuthLogs(7)).resolves.toEqual([{ logId: 1, issuedOn: undefined, expiresOn: undefined, jti: "abc" }]);
    await expect(client.getOidcClientChangeLogs(7)).resolves.toEqual([{ keyId: 1, recordedOn: undefined, type: "created" }]);
  });
});

describe("server actions", () => {
  it("rebuilds a server with a form encoded body", async () => {
    const calls: Array<{ path: string; body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ path: new URL(url).pathname, body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { mbpkgid: 42, status: "queued", build: 9 } });
      }
    });
    const build = await client.buildServer(42, { plan: "plan-1", location: 1, image: 2, fqdn: "vm.example.com" });
    expect(build).toEqual({ serverId: 42, status: "queued", build: 9 });
    expect(calls[0]?.path).toBe("/cloud/server/build/42");
    expect(calls[0]?.contentType).toBe("application/x-www-form-urlencoded");
    const sentParams = new URLSearchParams(calls[0]?.body);
    expect(sentParams.get("plan")).toBe("plan-1");
    expect(sentParams.get("fqdn")).toBe("vm.example.com");
  });

  it("unlinks a server", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: null });
      }
    });
    await expect(client.unlinkServer(42)).resolves.toBeUndefined();
    expect(new URL(seenUrl).pathname).toBe("/cloud/server/42/unlink");
  });

  it("starts and stops a server, sending a force flag only when provided", async () => {
    const calls: Array<{ path: string; body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ path: new URL(url).pathname, body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: null });
      }
    });

    await client.startServer(42);
    expect(calls[0]?.path).toBe("/cloud/server/42/start");
    expect(calls[0]?.body).toBeUndefined();
    expect(calls[0]?.contentType).toBeUndefined();

    await client.stopServer(42, { force: true });
    expect(calls[1]?.path).toBe("/cloud/server/42/shutdown");
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ force: true });
    expect(calls[1]?.contentType).toBe("application/json");
  });

  it("queues a scale job and returns the job id", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: 991 });
      }
    });
    await expect(client.scaleServer(42, { pkgId: 5, allowReboot: true })).resolves.toBe(991);
    expect(JSON.parse(body)).toEqual({ pkg_id: 5, allow_reboot: true });
  });

  it("gets a job status by command and job id", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { id: 991, ts_insert: "2026-01-01", command: "scale_vm", status: 1 } });
      }
    });
    await expect(client.getJobStatus("scale_vm", 991)).resolves.toEqual({ id: 991, tsInsert: "2026-01-01", command: "scale_vm", status: 1 });
    expect(new URL(seenUrl).pathname).toBe("/cloud/jobs/scale_vm/991");
  });
});

describe("cloud compute: images and kernels", () => {
  it("lists base and private images", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        expect(new URL(url).pathname === "/cloud/images/base" || new URL(url).pathname === "/cloud/images/private").toBe(true);
        return jsonResponse({ result: "success", data: [{ id: 1, os: "Ubuntu 24.04", type: "linux", subtype: "ubuntu", bits: "64", tech: "kvm", size: "5G", category: "distro", script_bash: 1, script_cloudinit: 1, created: "2026-01-01", updated: "2026-01-01" }] });
      }
    });
    await expect(client.getBaseImages()).resolves.toHaveLength(1);
    await expect(client.getPrivateImages()).resolves.toHaveLength(1);
  });

  it("replaces an image with a JSON body", async () => {
    let seen: { path: string; body?: string; contentType?: string } | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen = { path: new URL(url).pathname, body: init.body, contentType: init.headers["Content-Type"] };
        return jsonResponse({ result: "success", data: { ok: true } });
      }
    });
    await client.replaceImage(10, 20);
    expect(seen?.path).toBe("/cloud/images/10/replace_image");
    expect(seen?.contentType).toBe("application/json");
    expect(JSON.parse(seen?.body ?? "{}")).toEqual({ replace_id: 20 });
  });

  it("lists boot kernels", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, name: "Default", description: null }] })
    });
    await expect(client.getKernels()).resolves.toEqual([{ id: 1, name: "Default", description: undefined }]);
  });

  it("lists boot profiles", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({
          result: "success",
          data: [
            {
              id: 11,
              name: "Standard",
              type: "linux",
              description: "Standard boot profile",
              builder: "hvm",
              kernel: "default",
              boot: "hd",
              serial: "1",
              disk_represent: "virtio",
              image_template: 0,
              last_updated: "2026-01-01",
              pae: 1,
              acpi: 1,
              apic: 1,
              xlocaltime: 0,
              sdl: 0,
              vnc: 1,
              vncconsole: 0,
              vncunused: 1,
              hide: 0,
              kvm: 1
            }
          ]
        });
      }
    });
    const profiles = await client.getBootProfiles();
    expect(new URL(seenUrl).pathname).toBe("/cloud/boot-profiles");
    expect(profiles).toHaveLength(1);
    expect(profiles[0]).toMatchObject({ bootProfileId: 11, name: "Standard", imageTemplate: 0, kvm: 1 });
  });

  it("lists server disks opaquely, matching gona's unmodeled ServerDisk type", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [{ some: "field" }] });
      }
    });
    const disks = await client.getServerDisks(42);
    expect(new URL(seenUrl).pathname).toBe("/cloud/disks/42");
    expect(disks).toEqual([{ some: "field" }]);
  });
});

describe("cloud compute: locations and pools", () => {
  it("gets a cloud location and throws not found on a null body", async () => {
    let responded = false;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => {
        responded = true;
        return jsonResponse({ result: "success", data: null });
      }
    });
    await expect(client.getCloudLocation(5)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    expect(responded).toBe(true);
  });

  it("decodes a cloud location", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { id: 5, name: "US East", location: "us-east", city: "Ashburn", country: "US", iata_code: "IAD", flag: "us", latitude: "1.0", longitude: "2.0" } })
    });
    await expect(client.getCloudLocation(5)).resolves.toMatchObject({ id: 5, city: "Ashburn", iataCode: "IAD" });
  });

  it("gets a cloud pool and throws not found on a null body", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: null })
    });
    await expect(client.getCloudPool(3)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("decodes a cloud pool's capabilities", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            id: 3,
            name: "general",
            description: "General purpose",
            required_vcpu: "EPYC-Milan",
            hard_capabilities: ["nvme"],
            soft_capabilities: [],
            private: 0,
            backup_cloud_pool_id: null,
            default_ram_price: "0.01",
            default_cpu_price: "0.02",
            default_disk_price: "0.03",
            last_updated: "2026-01-01",
            created: "2025-01-01",
            contract_id: null
          }
        })
    });
    const pool = await client.getCloudPool(3);
    expect(pool.requiredVcpu).toBe("EPYC-Milan");
    expect(pool.isPrivate).toBe(false);
    expect(pool.hardCapabilities).toEqual(["nvme"]);
  });
});

describe("cloud compute: server detail and status", () => {
  it("gets scaling options with true/false and integer query encoding", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { plans: [] } });
      }
    });
    await client.getScalingOptions(42, { includeCurrentPlan: true, minRam: 1024, maxCpus: 8 });
    const params = new URL(seenUrl).searchParams;
    expect(params.get("include_current_plan")).toBe("true");
    expect(params.get("min_ram")).toBe("1024");
    expect(params.get("max_cpus")).toBe("8");
  });

  it("gets a server build status and preserves the raw payload", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { id: 900, status: "running", percent: 42, response: "", extra_field: "kept" } })
    });
    const status = await client.getServerBuildStatus(900);
    expect(status).toMatchObject({ id: 900, status: "running", percent: 42 });
    expect(status.raw.extra_field).toBe("kept");
  });

  it("updates server options, omitting fields that were not set", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: {} });
      }
    });
    await client.updateServerOptions(42, { fqdn: "new.example.com" });
    expect(JSON.parse(body)).toEqual({ fqdn: "new.example.com" });
  });

  it("deletes a server with options and returns the deleted id", async () => {
    let seen: { path: string; body?: string } | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen = { path: new URL(url).pathname, body: init.body };
        return jsonResponse({ result: "success", data: { id: 42 } });
      }
    });
    await expect(client.deleteServerWithOptions(42, { cancelBilling: true })).resolves.toEqual({ id: 42 });
    expect(seen?.path).toBe("/cloud/server/42/delete");
    expect(JSON.parse(seen?.body ?? "{}")).toEqual({ cancel_billing: true });
  });

  it("lists server ipv4 addresses and preserves the raw payload", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, ip: "192.0.2.1", reverse: "host.example.com", extra: "kept" }] })
    });
    const addresses = await client.getServerIpv4(42);
    expect(addresses[0]).toMatchObject({ id: 1, ip: "192.0.2.1", reverse: "host.example.com" });
    expect(addresses[0]?.raw.extra).toBe("kept");
  });

  it("gets one server job and throws not found on a null body", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: null })
    });
    await expect(client.getServerJob(42, 7)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("gets server status and throws not found on a null body", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: null })
    });
    await expect(client.getServerStatus(42)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("gets the current server and throws not found on a null body", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: null })
    });
    await expect(client.getCurrentServer()).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("gets a virtual server contract and throws not found on a null body", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: null })
    });
    await expect(client.getVirtualServerContract(42)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });
});

describe("cloud compute: server actions", () => {
  it("resets the root password with a JSON body", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: {} });
      }
    });
    await client.resetServerRootPassword(42, { rootPass: "new-pass" });
    expect(JSON.parse(body)).toEqual({ rootpass: "new-pass", password: undefined });
  });

  it("reboots a server, sending a force flag only when provided", async () => {
    const calls: Array<{ body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        calls.push({ body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.rebootServer(42);
    expect(calls[0]?.body).toBeUndefined();
    await client.rebootServer(42, { force: true });
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ force: true });
  });

  it("starts rescue mode with a JSON body", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: {} });
      }
    });
    await client.startServerRescue(42, { rescuePass: "rescue-pass" });
    expect(JSON.parse(body)).toEqual({ rescue_pass: "rescue-pass", password: undefined });
  });

  it("gets server BGP sessions, sending group_type only when provided", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [] });
      }
    });
    await client.getServerBgpSessions(42);
    expect(new URL(seenUrl).searchParams.has("group_type")).toBe(false);
    await client.getServerBgpSessions(42, "customer");
    expect(new URL(seenUrl).searchParams.get("group_type")).toBe("customer");
  });

  it("attempts an SSH connection with the expected field names", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: {} });
      }
    });
    await client.attemptSshConnection({ mbPkgId: 42, username: "root", password: "secret" });
    expect(JSON.parse(body)).toEqual({ mbpkgid: 42, username: "root", password: "secret" });
  });
});

describe("cloud compute: sizes and firewall bindings", () => {
  it("gets a plan id by name with the name path-escaped", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: 7 });
      }
    });
    await client.getPlanId("Cloud VPS 1");
    expect(new URL(seenUrl).pathname).toBe("/cloud/sizes/plan-id/Cloud%20VPS%201");
  });

  it("lists deploy sizes with optional filters", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [{ plan_id: 1, plan: "1c1g", ram: "1024", disk: "25", transfer: "1000", price: "5.00", cpu: 1, port: "100", available: 1 }] });
      }
    });
    const sizes = await client.getDeploySizes("us-east", { minCpu: 2, minRam: 2048 });
    expect(sizes).toHaveLength(1);
    const parsed = new URL(seenUrl);
    expect(parsed.pathname).toBe("/cloud/sizes/us-east");
    expect(parsed.searchParams.get("min_cpu")).toBe("2");
    expect(parsed.searchParams.get("min_ram")).toBe("2048");
  });

  it("binds and unbinds a cloud firewall set", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        return jsonResponse({ result: "success", data: {} });
      }
    });
    await client.bindCloudFirewallSet(42, { firewallSetId: 5, interfaceId: 1, setPriority: 100 });
    expect(calls[0]).toMatchObject({ method: "POST", path: "/cloud/42/firewall-sets" });
    expect(JSON.parse(calls[0]?.body ?? "{}")).toEqual({ firewall_set_id: 5, interface_id: 1, set_priority: 100 });

    await client.unbindCloudFirewallSet(42, "5");
    expect(calls[1]).toMatchObject({ method: "DELETE", path: "/cloud/42/firewall-sets/5" });
  });

  it("creates a usage contract with the expected body", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: { mb_id: 9 } });
      }
    });
    await client.createUsageContract(9);
    expect(JSON.parse(body)).toEqual({ mb_id: 9 });
  });

  it("gets the account's aggregate contract usage", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { id: 1, mb_id: 9, max_cpus: 4 } });
      }
    });
    await expect(client.getContractUsage()).resolves.toMatchObject({ id: 1, mbId: 9, maxCpus: 4 });
    expect(new URL(seenUrl).pathname).toBe("/cloud/contract/usage");
  });

  it("gets a datacenter id from an IATA code", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { id: 5, name: "New York", iata: "NYC" } });
      }
    });
    await expect(client.getDatacenterByIata("NYC")).resolves.toBe(5);
    expect(new URL(seenUrl).pathname).toBe("/platform/datacenters-by-iata/NYC");
  });

  it("lists sizes and plans from the same underlying endpoint", async () => {
    const seenUrls: string[] = [];
    const row = { plan_id: 1, plan: "1c1g", ram: "1024", disk: "25", transfer: "1000", price: "5.00", cpu: 1, port: "100", available: 1 };
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(new URL(url).pathname);
        return jsonResponse({ result: "success", data: [row] });
      }
    });
    await expect(client.getSizes()).resolves.toEqual([
      { planId: 1, plan: "1c1g", ram: "1024", disk: "25", transfer: "1000", price: "5.00", cpu: 1, port: "100", available: 1 }
    ]);
    await expect(client.getPlans()).resolves.toEqual([
      { planId: 1, plan: "1c1g", ram: "1024", disk: "25", transfer: "1000", price: "5.00", cpu: 1, port: "100", available: 1 }
    ]);
    expect(seenUrls).toEqual(["/cloud/sizes", "/cloud/sizes"]);
  });
});

describe("cloud compute: cloud-init and opaque endpoints", () => {
  it("uploads a cloud-init script as multipart form data", async () => {
    let seen: { contentType?: string; body?: string } | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen = { contentType: init.headers["Content-Type"], body: init.body };
        return jsonResponse({ result: "success", data: { valid: true } });
      }
    });
    await client.parseCloudInit("init.yml", "#cloud-config\nruncmd: []");
    expect(seen?.contentType).toMatch(/^multipart\/form-data; boundary=/);
    expect(seen?.body).toContain('name="file"; filename="init.yml"');
    expect(seen?.body).toContain("#cloud-config");
  });

  it("passes bandwidth stats through without decoding, sending date only when provided", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { total: 123 } });
      }
    });
    await expect(client.getBandwidthStats(42)).resolves.toEqual({ total: 123 });
    expect(new URL(seenUrl).searchParams.has("date")).toBe(false);
    await client.getBandwidthStats(42, "2026-01-01");
    expect(new URL(seenUrl).searchParams.get("date")).toBe("2026-01-01");
  });

  it("updates cloud IPv4 and IPv6 reverse DNS with JSON bodies", async () => {
    const calls: Array<{ path: string; body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ path: new URL(url).pathname, body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.updateCloudIpv4ReverseDns(1, "host.example.com");
    expect(calls[0]).toMatchObject({ path: "/cloud/ipv4/1", contentType: "application/json" });
    expect(JSON.parse(calls[0]?.body ?? "{}")).toEqual({ reverse: "host.example.com" });

    await client.updateCloudIpv6ReverseDns(2, "host6.example.com");
    expect(calls[1]).toMatchObject({ path: "/cloud/ipv6/2", contentType: "application/json" });
  });
});

describe("account services", () => {
  it("lists account services", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, description: "colo" }] })
    });
    await expect(client.getServices()).resolves.toEqual([{ id: 1, description: "colo", raw: { id: 1, description: "colo" } }]);
  });

  it("lists colocation services with an optional service id filter and gets one by id", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(url);
        if (url.includes("/services/colocation/9")) {
          return jsonResponse({ result: "success", data: { id: 9, service_id: 1, datacenter_id: 2, rack_identifier: "R1" } });
        }
        return jsonResponse({ result: "success", data: [{ id: 9, service_id: 1, datacenter_id: 2 }] });
      }
    });
    await expect(client.getColocationServices()).resolves.toHaveLength(1);
    await client.getColocationServices(1);
    await expect(client.getColocationService(9)).resolves.toMatchObject({ id: 9, rackIdentifier: "R1" });
    expect(new URL(seenUrls[1] ?? "").searchParams.get("service_id")).toBe("1");
    expect(new URL(seenUrls[2] ?? "").pathname).toBe("/services/colocation/9");
  });

  it("throws not found for a missing colocation service", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404)
    });
    await expect(client.getColocationService(9)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("lists and gets IP transit services, IP addresses and ports", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(url);
        if (url.includes("/services/iptransit/5")) {
          return jsonResponse({ result: "success", data: { id: 5, service_id: 1, datacenter_id: 2, bgp_group_id: 3 } });
        }
        if (url.includes("/ips")) {
          return jsonResponse({ result: "success", data: [{ id: 1, service_iptransit_id: 5, ip: "192.0.2.1" }] });
        }
        if (url.includes("/ports")) {
          return jsonResponse({ result: "success", data: [{ id: 1, service_iptransit_id: 5, name: "port-1" }] });
        }
        return jsonResponse({ result: "success", data: [{ id: 5, service_id: 1, datacenter_id: 2 }] });
      }
    });
    await expect(client.getIpTransitServices(1)).resolves.toHaveLength(1);
    await expect(client.getIpTransitService(5)).resolves.toMatchObject({ bgpGroupId: 3 });
    await expect(client.getIpTransitIpAddresses(5)).resolves.toEqual([{ id: 1, serviceIptransitId: 5, ip: "192.0.2.1", raw: expect.any(Object) }]);
    await expect(client.getIpTransitPorts(5)).resolves.toEqual([{ id: 1, serviceIptransitId: 5, name: "port-1", raw: expect.any(Object) }]);
    expect(new URL(seenUrls[2] ?? "").searchParams.get("service_iptransit_id")).toBe("5");
  });

  it("lists and gets transport services and ports", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (url.includes("/services/transport/7")) {
          return jsonResponse({ result: "success", data: { id: 7, service_id: 1, datacenter_id: 2 } });
        }
        if (url.includes("/ports")) {
          return jsonResponse({ result: "success", data: [{ id: 1, service_transport_id: 7, name: "port-a" }] });
        }
        return jsonResponse({ result: "success", data: [{ id: 7, service_id: 1, datacenter_id: 2 }] });
      }
    });
    await expect(client.getTransportServices()).resolves.toHaveLength(1);
    await expect(client.getTransportService(7)).resolves.toMatchObject({ id: 7, datacenterId: 2 });
    await expect(client.getTransportPorts(7)).resolves.toEqual([{ id: 1, serviceTransportId: 7, name: "port-a", raw: expect.any(Object) }]);
  });
});

describe("platform", () => {
  it("flattens platform status into arrays sorted by service and location name", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            zzz: { component_id: "c2", locations: { west: { container_id: "w1", status: "up", last_updated: "t2" } } },
            aaa: {
              component_id: "c1",
              locations: {
                west: { container_id: "w0", status: "up", last_updated: "t0" },
                east: { container_id: "e0", status: "down", last_updated: "t1" }
              }
            }
          }
        })
    });
    await expect(client.getPlatformStatus()).resolves.toEqual([
      {
        service: "aaa",
        componentId: "c1",
        locations: [
          { location: "east", containerId: "e0", status: "down", lastUpdated: "t1" },
          { location: "west", containerId: "w0", status: "up", lastUpdated: "t0" }
        ]
      },
      { service: "zzz", componentId: "c2", locations: [{ location: "west", containerId: "w1", status: "up", lastUpdated: "t2" }] }
    ]);
  });

  it("lists and gets platform change log entries, coercing numeric ids to strings", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (url.includes("/change-log/12")) {
          return jsonResponse({ result: "success", data: { id: 12, title: "Upgrade", status: "resolved" } });
        }
        return jsonResponse({ result: "success", data: [{ id: 12, title: "Upgrade" }] });
      }
    });
    await expect(client.getPlatformChangeLog()).resolves.toEqual([
      { changeLogId: "12", title: "Upgrade", shortDescription: undefined, status: undefined, raw: { id: 12, title: "Upgrade" } }
    ]);
    await expect(client.getPlatformChangeLogEntry(12)).resolves.toMatchObject({ changeLogId: "12", status: "resolved" });
  });

  it("lists platform datacenters for a location", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [{ id: 1, name: "NYC", iata: "JFK" }] });
      }
    });
    await expect(client.getPlatformDatacenters("New York")).resolves.toEqual([{ id: 1, name: "NYC", iata: "JFK" }]);
    expect(new URL(seenUrl).pathname).toBe("/platform/datacenters/New%20York");
  });

  it("gets looking glass init options and executes an action with query parameters", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { ok: true } });
      }
    });
    await expect(client.getPlatformLookingGlassInit()).resolves.toEqual({ raw: { ok: true } });
    await client.executePlatformLookingGlass({ action: "ping", target: "1.1.1.1", location: "nyc", full: 1 });
    const params = new URL(seenUrl).searchParams;
    expect(params.get("action")).toBe("ping");
    expect(params.get("target")).toBe("1.1.1.1");
    expect(params.get("location")).toBe("nyc");
    expect(params.get("full")).toBe("1");
  });

  it("gets platform maintenance info by id", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { detail: "scheduled" } })
    });
    await expect(client.getPlatformMaintenanceInfo(5)).resolves.toEqual({ raw: { detail: "scheduled" } });
  });

  it("gets platform incidents and maintenance events, current and historic", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(new URL(url).pathname);
        return jsonResponse({
          result: "success",
          data: {
            active: [{ event_id: "1", type: "incident", name: "Outage", status: "active", components: ["api"], containers: ["c1"] }],
            upcoming: [],
            historic: []
          }
        });
      }
    });
    const events = await client.getPlatformIncidents("nyc");
    expect(events.active).toHaveLength(1);
    expect(events.active[0]).toMatchObject({ eventId: "1", components: ["api"], containers: ["c1"] });
    await client.getPlatformIncidentHistory("nyc");
    await client.getPlatformMaintenance("nyc");
    await client.getPlatformMaintenanceHistory("nyc");
    expect(seenUrls).toEqual([
      "/platform/incidents/nyc",
      "/platform/incidents/history/nyc",
      "/platform/maintenance/nyc",
      "/platform/maintenance/history/nyc"
    ]);
  });
});

describe("support tickets", () => {
  it("lists tickets with open and include_stats filters applied as query parameters", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [{ id: "1", subject: "help" }] });
      }
    });
    const tickets = await client.getTickets({ open: "1", includeStats: "1" });
    expect(tickets).toEqual([{ id: "1", subject: "help", raw: { id: "1", subject: "help" } }]);
    const params = new URL(seenUrl).searchParams;
    expect(params.get("open")).toBe("1");
    expect(params.get("include_stats")).toBe("1");
  });

  it("lists legacy and archived tickets", async () => {
    const seenPaths: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        const pathname = new URL(url).pathname;
        seenPaths.push(pathname);
        return jsonResponse({ result: "success", data: pathname === "/support/tickets-old/1" ? { id: "1" } : [{ id: "1" }] });
      }
    });
    await client.getLegacyTickets();
    await client.getOldTickets({ open: "1" });
    await client.getOldTicket("1");
    expect(seenPaths).toEqual(["/support/legacy-tickets", "/support/tickets-old", "/support/tickets-old/1"]);
  });

  it("creates a ticket with a JSON body", async () => {
    const seen: Array<{ body: string; contentType: string | undefined }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen.push({ body: init.body ?? "", contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { id: "9", subject: "help", status: "Open" } });
      }
    });
    const ticket = await client.createTicket({ subject: "help", message: "it broke", department: 2, urgency: "High" });
    expect(ticket).toMatchObject({ id: "9", subject: "help", status: "Open" });
    expect(seen[0]?.contentType).toBe("application/json");
    expect(JSON.parse(seen[0]?.body ?? "{}")).toEqual({ subject: "help", message: "it broke", department: 2, urgency: "High" });
  });

  it("lists ticket departments and a ticket's replies", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (new URL(url).pathname.endsWith("/departments")) {
          return jsonResponse({ result: "success", data: [{ id: 1, name: "Billing" }] });
        }
        return jsonResponse({ result: "success", data: [{ id: "r1", message: "on it" }] });
      }
    });
    const departments = await client.getTicketDepartments();
    expect(departments[0]).toMatchObject({ id: 1, name: "Billing" });
    const replies = await client.getTicketReplies("1");
    expect(replies[0]).toMatchObject({ id: "r1", message: "on it" });
  });

  it("gets a ticket by id and throws a distinguishable not found error when it is absent", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing" }, 404)
    });
    await expect(client.getTicket("999")).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("gets ticket attachment metadata with without_data applied as a query flag", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: { name: "log.txt", content_type: "text/plain", size: 12 } });
      }
    });
    const attachment = await client.getTicketAttachment("1", "ticket", "1", 0, { withoutData: true });
    expect(attachment).toMatchObject({ name: "log.txt", contentType: "text/plain", size: 12 });
    const url = new URL(seenUrl);
    expect(url.pathname).toBe("/support/tickets/1/attachment/ticket/1/0");
    expect(url.searchParams.get("without_data")).toBe("1");
  });

  it("downloads and previews ticket attachment binary content", async () => {
    const seenPaths: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenPaths.push(new URL(url).pathname);
        return binaryResponse([1, 2, 3]);
      }
    });
    const downloaded = await client.downloadTicketAttachment("1", "ticket", "1", 0);
    const previewed = await client.previewTicketAttachment("1", "ticket", "1", 0);
    expect(Array.from(downloaded)).toEqual([1, 2, 3]);
    expect(Array.from(previewed)).toEqual([1, 2, 3]);
    expect(seenPaths).toEqual([
      "/support/tickets/1/attachment/ticket/1/0/download",
      "/support/tickets/1/attachment/ticket/1/0/preview"
    ]);
  });

  it("throws a distinguishable not found error when a binary download 404s", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => textResponse("gone", 404)
    });
    await expect(client.downloadTicketAttachment("1", "ticket", "1", 0)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("throws a plain API error when a binary preview fails for another reason", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => textResponse("nope", 500)
    });
    await expect(client.previewTicketAttachment("1", "ticket", "1", 0)).rejects.toBeInstanceOf(NetActuateError);
  });

  it("closes tickets through both the direct and alias paths", async () => {
    const seenPaths: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenPaths.push(new URL(url).pathname);
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.closeTicket("1");
    await client.closeTicketAlias("2");
    expect(seenPaths).toEqual(["/support/tickets/1/close", "/support/tickets/close/2"]);
  });

  it("replies to tickets through both the direct and alias paths with a JSON body", async () => {
    const seen: Array<{ path: string; body: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen.push({ path: new URL(url).pathname, body: init.body ?? "" });
        return jsonResponse({ result: "success", data: { id: "r1", message: "on it" } });
      }
    });
    await client.replyToTicket("1", { message: "on it" });
    await client.replyToTicketAlias("2", { message: "on it too" });
    expect(seen[0]).toMatchObject({ path: "/support/tickets/1/reply" });
    expect(JSON.parse(seen[0]?.body ?? "{}")).toEqual({ message: "on it", files: undefined });
    expect(seen[1]).toMatchObject({ path: "/support/tickets/reply/2" });
  });
});

describe("secrets", () => {
  it("lists and gets secret lists", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, name: "prod" }] })
    });
    const lists = await client.getSecretLists();
    expect(lists).toEqual([{ id: 1, name: "prod" }]);
  });

  it("creates and updates a secret list with a form encoded body", async () => {
    const seen: Array<{ body: string; contentType: string | undefined }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen.push({ body: init.body ?? "", contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { id: 1, name: "prod" } });
      }
    });
    await client.createSecretList("prod");
    await client.updateSecretList(1, "prod-renamed");
    expect(seen[0]).toEqual({ body: "name=prod", contentType: "application/x-www-form-urlencoded" });
    expect(seen[1]).toEqual({ body: "name=prod-renamed", contentType: "application/x-www-form-urlencoded" });
  });

  it("throws a distinguishable not found error for a secret list id the platform rejects as invalid", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse(
          { result: "error", code: 422, message: "validation failed", fields: { secret_list_id: ["The secret list id must be a valid secret list id"] } },
          422
        )
    });
    await expect(client.getSecretList(999)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("deletes a secret list", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.deleteSecretList(1);
    expect(new URL(seenUrl).pathname).toBe("/secrets/lists/1");
  });

  it("lists values in a secret list and every value on the account", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({ result: "success", data: [{ id: 1, secret_list_id: "1", secret_key: "k", secret_value: "v" }] })
    });
    const values = await client.getSecretListValues(1);
    expect(values).toEqual([{ id: 1, secretListId: 1, secretKey: "k", secretValue: "v" }]);
    const all = await client.getAllSecretValues();
    expect(all).toEqual([{ id: 1, secretListId: 1, secretKey: "k", secretValue: "v" }]);
  });

  it("gets, creates, updates and deletes a secret list value with form encoded bodies", async () => {
    const seen: Array<{ path: string; body: string; contentType: string | undefined }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen.push({ path: new URL(url).pathname, body: init.body ?? "", contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { id: 2, secret_list_id: 1, secret_key: "k", secret_value: "v" } });
      }
    });
    await client.getSecretListValue(1, 2);
    await client.createSecretListValue(1, "k", "v");
    await client.updateSecretListValue(1, 2, "k", "v2");
    await client.deleteSecretListValue(1, 2);
    expect(seen[0]).toMatchObject({ path: "/secrets/lists/1/values/2" });
    expect(seen[1]).toEqual({ path: "/secrets/lists/1/values", body: "secret_key=k&secret_value=v", contentType: "application/x-www-form-urlencoded" });
    expect(seen[2]).toEqual({
      path: "/secrets/lists/1/values/2",
      body: "secret_key=k&secret_value=v2",
      contentType: "application/x-www-form-urlencoded"
    });
    expect(seen[3]).toMatchObject({ path: "/secrets/lists/1/values/2" });
  });
});

describe("dedicated servers", () => {
  it("filters dedicated devices from a bare array response", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        expect(url).toContain("dedicated/filter-dedicated-devices");
        expect(url).toContain("cpu_type=Xeon");
        expect(url).toContain("per_page=10");
        return jsonResponse({ result: "success", data: [{ id: 1, cpu_type: "Xeon" }] });
      }
    });
    const devices = await client.filterDedicatedDevices({ cpuType: "Xeon", perPage: 10 });
    expect(devices).toEqual([{ id: 1, cpu_type: "Xeon" }]);
  });

  it("filters dedicated devices from the nested paginator envelope", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: { devices: { paginator: { data: [{ id: 2 }] } }, columns: ["id"] }
        })
    });
    await expect(client.filterDedicatedDevices()).resolves.toEqual([{ id: 2 }]);
  });

  it("lists dedicated locations", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({ result: "success", data: [{ short_name: "nyc", pub_description: "New York", location_id: 3 }] })
    });
    await expect(client.listDedicatedLocations()).resolves.toEqual([{ shortName: "nyc", pubDescription: "New York", locationId: 3 }]);
  });

  it("lists dedicated device OS profiles, appending is_buyable only when given", async () => {
    const seen: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seen.push(url);
        return jsonResponse({
          result: "success",
          data: [
            {
              id: 9,
              name: "Ubuntu 22.04",
              group_name: "ubuntu",
              tags: ["lts"],
              disklayouts: { "2": "RAID1", "1": "Single" },
              scripts: ["cloud-init", { id: 5, name: "bash" }],
              default_disklayout: 1,
              default_scripts: [5],
              allow_ssh_keys: 1,
              set_root_password: 1,
              rescue_image: 0,
              public: 1,
              enabled: 1,
              created: "2024-01-01",
              last_updated: "2024-01-02",
              profile_id: 9,
              arch: "x86_64",
              flavor: "linux"
            }
          ]
        });
      }
    });
    const profiles = await client.listDedicatedDeviceOsProfiles(4);
    expect(seen[0]).not.toContain("is_buyable");
    expect(profiles[0]?.diskLayouts).toEqual([
      { id: 1, name: "Single" },
      { id: 2, name: "RAID1" }
    ]);
    expect(profiles[0]?.scripts).toEqual([
      { id: 0, name: "cloud-init" },
      { id: 5, name: "bash" }
    ]);
    expect(profiles[0]).toMatchObject({ allowSshKeys: true, rescueImage: false, public: true });

    await client.listDedicatedDeviceOsProfiles(4, true);
    expect(seen[1]).toContain("is_buyable=1");
    await client.listDedicatedDeviceOsProfiles(4, false);
    expect(seen[2]).toContain("is_buyable=0");
  });

  it("lists dedicated plans for a location", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        expect(url).toContain("dedicated/plans/7");
        return jsonResponse({ result: "success", data: [{ id: 1, name: "Bronze" }] });
      }
    });
    await expect(client.listDedicatedPlans(7)).resolves.toEqual([{ id: 1, name: "Bronze" }]);
  });

  it("deploys, buys and buy-deploys a dedicated server with a JSON body", async () => {
    const seen: { url: string; body?: string; contentType?: string }[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen.push({ url, body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { mbpkgid: 100, status: "queued", build: 55 } });
      }
    });
    const input = { fqdn: "host.example.com", profile: 9, sshKeyId: 3 };
    await expect(client.deployDedicatedServer(100, input)).resolves.toEqual({ mbPkgId: 100, status: "queued", build: 55 });
    expect(seen[0]?.url).toContain("dedicated/server/build/100");
    expect(seen[0]?.contentType).toBe("application/json");
    expect(JSON.parse(seen[0]?.body ?? "{}")).toEqual({ fqdn: "host.example.com", profile: 9, ssh_key_id: 3 });

    await client.buyDedicatedServer(42);
    expect(seen[1]?.url).toContain("dedicated/server/buy/42");
    expect(seen[1]?.body).toBeUndefined();

    await client.buyAndDeployDedicatedServer(42, input);
    expect(seen[2]?.url).toContain("dedicated/server/buy_build/42");
    expect(seen[2]?.contentType).toBe("application/json");
  });

  it("updates dedicated server IPv4 reverse DNS with a JSON body", async () => {
    let seen: { body?: string; contentType?: string; method: string } | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen = { body: init.body, contentType: init.headers["Content-Type"], method: init.method };
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.updateDedicatedServerIpv4Reverse({ mbPkgId: 1, id: 2, reverse: "host.example.com" });
    expect(seen).toEqual({ body: JSON.stringify({ mbpkgid: 1, id: 2, reverse: "host.example.com" }), contentType: "application/json", method: "PUT" });
  });

  it("soft resets a dedicated server on the special-cased path with no body", async () => {
    let seenUrl = "";
    let seenBody: string | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seenUrl = url;
        seenBody = init.body;
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.softResetDedicatedServer(9);
    expect(seenUrl).toContain("dedicated/server/soft-reset/9");
    expect(seenBody).toBeUndefined();
  });

  it("sends dedicated server action bodies only when force or password are given", async () => {
    const seen: Array<{ url: string; body?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seen.push({ url, body: init.body });
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.rebootDedicatedServer(9);
    await client.shutdownDedicatedServer(9, { force: true });
    await client.startDedicatedServer(9, { password: "secret" });
    expect(seen[0]?.body).toBeUndefined();
    expect(seen[0]?.url).toContain("/reboot");
    expect(JSON.parse(seen[1]?.body ?? "{}")).toEqual({ force: true });
    expect(seen[1]?.url).toContain("/shutdown");
    expect(JSON.parse(seen[2]?.body ?? "{}")).toEqual({ password: "secret" });
    expect(seen[2]?.url).toContain("/start");
  });

  it("gets dedicated server power status", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        expect(url).toContain("dedicated/server/9/status");
        return jsonResponse({ result: "success", data: { power: "on" } });
      }
    });
    await expect(client.getDedicatedServerPowerStatus(9)).resolves.toEqual({ power: "on" });
  });

  it("treats deleting an already absent dedicated server as success", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 404, message: "missing", data: [] }, 404)
    });
    await expect(client.deleteDedicatedServer(9)).resolves.toBeUndefined();
  });

  it("lists dedicated servers, decoding a numeric or string ob_id and an in-progress build", async () => {
    const row = {
      id: 1,
      datacenter_id: 2,
      canceling: 0,
      mbpkgid: 100,
      price: "199.00",
      hostname: "box.example.com",
      eth0_mac: "aa:bb",
      eth1_mac: null,
      ipmi_mac: "cc:dd",
      primary_ip: "192.0.2.1",
      primary_ipv6: null,
      nps_installed: 1,
      nps_os: "linux",
      mb_model: null,
      cpu0_model: "Xeon",
      cpu1_model: null,
      total_ram: 65536,
      ipmi_pubip: "192.0.2.2",
      ipmi_cxuser: null,
      ipmi_cxpass: null,
      ipmi_status: 1,
      locked: 0,
      locked_msg: null,
      ipmi_status_time: "2024-01-01",
      ob_id: 12345,
      info: "",
      title: "box",
      ipmi_refresh_enabled: 1,
      location: "NYC",
      ip_subnet_id: 5,
      ip_subnet_name: "subnet",
      package_status: "Active",
      building: { percent: 50 }
    };
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [row] })
    });
    const servers = await client.listDedicatedServers();
    expect(servers[0]?.obId).toBe("12345");
    expect(servers[0]?.building).toEqual({ percent: 50 });
    expect(servers[0]?.canceling).toBe(false);
  });

  const osProfileRow = {
    id: 9,
    name: "Ubuntu 22.04",
    group_name: "ubuntu",
    tags: ["lts"],
    disklayouts: { "1": "Single" },
    scripts: [],
    default_disklayout: 1,
    default_scripts: [],
    allow_ssh_keys: 1,
    set_root_password: 1,
    rescue_image: 0,
    public: 1,
    enabled: 1,
    created: "2024-01-01",
    last_updated: "2024-01-02",
    profile_id: 9,
    arch: "x86_64",
    flavor: "linux"
  };

  it("lists dedicated OS profiles", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [osProfileRow] });
      }
    });
    const profiles = await client.getDedicatedOsProfiles();
    expect(new URL(seenUrl).pathname).toBe("/dedicated/os");
    expect(profiles[0]).toMatchObject({ osId: 9, name: "Ubuntu 22.04" });
  });

  it("lists dedicated rescue OS profiles, sharing the OS profile shape", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [osProfileRow] });
      }
    });
    const profiles = await client.getDedicatedRescueOsProfiles();
    expect(new URL(seenUrl).pathname).toBe("/dedicated/os/rescue-system-list");
    expect(profiles[0]).toMatchObject({ osId: 9, name: "Ubuntu 22.04" });
  });

  it("lists disk layouts compatible with a dedicated OS profile", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({ result: "success", data: [{ id: 1, name: "RAID1", profile: "ubuntu", min_disks: 2 }] });
      }
    });
    const layouts = await client.getDedicatedDiskLayouts(9);
    expect(new URL(seenUrl).pathname).toBe("/dedicated/disklayouts/9");
    expect(layouts).toEqual([{ layoutId: 1, name: "RAID1", profile: "ubuntu", minDisks: 2 }]);
  });
});

describe("images", () => {
  it("lists and gets custom images, mapping the os field to name", async () => {
    const image = {
      id: 1,
      os: "Ubuntu 22.04",
      description: "custom",
      type: "linux",
      subtype: "ubuntu",
      bits: "64",
      tech: "kvm",
      size: "10G",
      category: "custom",
      os_enabled: 1,
      script_bash: 1,
      script_cloudinit: 0,
      created: "2024-01-01",
      updated: "2024-01-02",
      active_build: {
        id: 5,
        status: 2,
        command: "capture",
        ts_insert: "2024-01-01",
        mb_id: 10,
        mb_pkgid: 100,
        params: "{}",
        build_packet: "{}",
        response: "ok",
        created: "2024-01-01",
        last_updated: "2024-01-01"
      }
    };
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        if (url.includes("cloud/images/1")) {
          return jsonResponse({ result: "success", data: image });
        }
        return jsonResponse({ result: "success", data: [image] });
      }
    });
    const images = await client.getMyImages();
    expect(images[0]).toMatchObject({ id: 1, name: "Ubuntu 22.04", enabled: true });
    expect(images[0]?.activeBuild).toMatchObject({ id: 5, mbPkgId: 100 });
    const single = await client.getImage(1);
    expect(single.name).toBe("Ubuntu 22.04");
  });

  it("creates an image with a form-encoded body, omitting unset optional fields", async () => {
    let seen: { body?: string; contentType?: string } | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen = { body: init.body, contentType: init.headers["Content-Type"] };
        return jsonResponse({ result: "success", data: { queue_id: 7 } });
      }
    });
    await expect(client.createImage({ mbPkgId: 100, imageName: "snapshot" })).resolves.toEqual({ queueId: 7 });
    expect(seen?.contentType).toBe("application/x-www-form-urlencoded");
    expect(seen?.body).toBe("mbpkgid=100&image_name=snapshot");
  });

  it("creates an image with description and keep_ssh_userdirs when given", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        body = init.body ?? "";
        return jsonResponse({ result: "success", data: { queue_id: 8 } });
      }
    });
    await client.createImage({ mbPkgId: 100, imageName: "snapshot", imageDescription: "desc", keepSshUserdirs: true });
    expect(body).toBe("mbpkgid=100&image_name=snapshot&image_description=desc&keep_ssh_userdirs=1");
  });

  it("edits an image with a JSON body", async () => {
    let seen: { body?: string; contentType?: string; method: string } | undefined;
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (_url, init) => {
        seen = { body: init.body, contentType: init.headers["Content-Type"], method: init.method };
        return jsonResponse({ result: "success", data: null });
      }
    });
    await client.editImage(1, "renamed", "new description");
    expect(seen).toEqual({
      body: JSON.stringify({ os: "renamed", description: "new description" }),
      contentType: "application/json",
      method: "PATCH"
    });
  });

  it("deletes an image with the DELETE method and returns the queue id", async () => {
    let method = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        method = init.method;
        expect(url).toContain("cloud/images/1/delete");
        return jsonResponse({ result: "success", data: { queue_id: 9 } });
      }
    });
    await expect(client.deleteImage(1)).resolves.toEqual({ queueId: 9 });
    expect(method).toBe("DELETE");
  });

  it("gets image queue status", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            status: "Running",
            percent: 40,
            response: "",
            image_id: 1,
            image_name: "snapshot",
            image_help: "",
            location: "NYC",
            mb_pkgid: 100,
            fqdn: "host.example.com",
            os: "Ubuntu 22.04"
          }
        })
    });
    await expect(client.getImageQueueStatus(1)).resolves.toMatchObject({ status: "Running", percent: 40 });
  });

  it("waits for an image queue job to complete", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            status: "Complete",
            percent: 100,
            response: "done",
            image_id: 1,
            image_name: "snapshot",
            image_help: "",
            location: "NYC",
            mb_pkgid: 100,
            fqdn: "host.example.com",
            os: "Ubuntu 22.04"
          }
        })
    });
    const sleep = vi.fn(async () => undefined);
    await expect(client.waitForImageQueue(1, { sleep })).resolves.toMatchObject({ status: "Complete" });
    expect(sleep).not.toHaveBeenCalled();
  });

  it("throws when an image queue job fails", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            status: "Failed",
            percent: 10,
            response: "capture error",
            image_id: 1,
            image_name: "snapshot",
            image_help: "",
            location: "NYC",
            mb_pkgid: 100,
            fqdn: "host.example.com",
            os: "Ubuntu 22.04"
          }
        })
    });
    await expect(client.waitForImageQueue(1, { sleep: vi.fn() })).rejects.toThrow(/capture error/);
  });

  it("times out waiting for an image queue job", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            status: "Running",
            percent: 10,
            response: "",
            image_id: 1,
            image_name: "snapshot",
            image_help: "",
            location: "NYC",
            mb_pkgid: 100,
            fqdn: "host.example.com",
            os: "Ubuntu 22.04"
          }
        })
    });
    await expect(client.waitForImageQueue(1, { timeoutMs: 0, sleep: vi.fn() })).rejects.toThrow(/timeout/);
  });
});

describe("BGP", () => {
  it("binds and unbinds a firewall set on a BGP group interface", async () => {
    const calls: Array<{ method: string; path: string; body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body, contentType: init.headers["Content-Type"] });
        if (init.method === "DELETE") {
          return jsonResponse({ result: "success", data: null });
        }
        return jsonResponse({ result: "success", data: { id: 1, bgp2_group_id: 9, firewall_set_id: 3, interface_number: 0, set_priority: 1 } });
      }
    });

    await expect(
      client.bindBgpGroupFirewallSet(9, { id: 1, firewallSetId: 3, interfaceNumber: 0, setPriority: 1 })
    ).resolves.toEqual({ id: 1, bgpGroupId: 9, firewallSetId: 3, interfaceNumber: 0, setPriority: 1 });
    expect(calls[0]?.path).toBe("/bgp/bgp-groups/9/firewall-sets");
    expect(calls[0]?.contentType).toBe("application/json");
    expect(JSON.parse(calls[0]?.body ?? "{}")).toEqual({ id: 1, firewall_set_id: 3, interface_number: 0, set_priority: 1 });

    await expect(client.unbindBgpGroupFirewallSet(9, 3)).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "DELETE", path: "/bgp/bgp-groups/9/firewall-sets/3" });
  });

  it("refreshes, starts and stops BGP group and session actions", async () => {
    const paths: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        paths.push(new URL(url).pathname);
        return jsonResponse({ result: "success", data: null });
      }
    });

    await client.refreshBgpGroupSessions(9);
    await client.startBgpGroupSessions(9);
    await client.stopBgpGroupSessions(9);
    await client.refreshBgpSession(5);
    await client.startBgpSession(5);
    await client.stopBgpSession(5);

    expect(paths).toEqual([
      "/bgp/bgpgroup/9/refresh",
      "/bgp/bgpgroup/9/start",
      "/bgp/bgpgroup/9/stop",
      "/bgp/bgpsession/5/refresh",
      "/bgp/bgpsession/5/start",
      "/bgp/bgpsession/5/stop"
    ]);
  });

  it("gets the BGP summary and dashboard, encoding dashboard filters as query params", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(url);
        return jsonResponse({ result: "success", data: { total: 3 } });
      }
    });

    await expect(client.getBgpSummary()).resolves.toEqual({ total: 3 });
    expect(new URL(seenUrls[0] ?? "").pathname).toBe("/bgp/bgpsummary");

    await client.getBgpDashboard({ groupType: "anycast", flapWindow: 300 });
    const dashboardUrl = new URL(seenUrls[1] ?? "");
    expect(dashboardUrl.pathname).toBe("/bgp/dashboard");
    expect(dashboardUrl.searchParams.get("group_type")).toBe("anycast");
    expect(dashboardUrl.searchParams.get("flap_window")).toBe("300");
  });

  it("creates, gets and lists BGP groups, filtering the list by group type", async () => {
    const seenUrls: string[] = [];
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        seenUrls.push(url);
        if (init.method === "POST") {
          body = init.body ?? "";
          return jsonResponse({ result: "success", data: { id: 1, name: "prod", description: "d", group_type: "anycast" } });
        }
        if (new URL(url).pathname === "/bgp/bgpgroup/1") {
          return jsonResponse({ result: "success", data: { id: 1, name: "prod", description: "d", group_type: "anycast" } });
        }
        return jsonResponse({ result: "success", data: [{ id: 1, name: "prod", description: "d", group_type: "anycast" }] });
      }
    });

    await expect(client.createBgpGroup({ name: "prod", description: "d", groupType: "anycast" })).resolves.toEqual({
      id: 1,
      name: "prod",
      description: "d",
      groupType: "anycast"
    });
    expect(JSON.parse(body)).toEqual({ name: "prod", description: "d", group_type: "anycast" });

    await expect(client.getBgpGroup(1)).resolves.toMatchObject({ id: 1, name: "prod" });

    await client.listBgpGroups("anycast");
    expect(new URL(seenUrls[seenUrls.length - 1] ?? "").searchParams.get("group_type")).toBe("anycast");
  });

  it("buys BGP prefixes and gets one by id", async () => {
    let body = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        if (init.method === "POST") {
          body = init.body ?? "";
          return jsonResponse({ result: "success", data: { id: 1, name: "prefix-1", prefix: "192.0.2.0/24", group_id: 9, agreement_id: 4 } });
        }
        return jsonResponse({ result: "success", data: { id: 1, name: "prefix-1", prefix: "192.0.2.0/24" } });
      }
    });

    await expect(client.buyBgpPrefixes({ name: "prefix-1", groupId: 9, agreementId: 4 })).resolves.toMatchObject({
      id: 1,
      prefix: "192.0.2.0/24",
      groupId: 9,
      agreementId: 4
    });
    expect(JSON.parse(body)).toEqual({ name: "prefix-1", group_id: 9, asn_id: undefined, anycast_profile: undefined, agreement_id: 4 });

    await expect(client.getBgpPrefix(1)).resolves.toMatchObject({ id: 1, prefix: "192.0.2.0/24" });
  });

  it("lists BGP prefixes and ASNs filtered by group type, and gets one ASN by id query param", async () => {
    const seenUrls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrls.push(url);
        if (new URL(url).pathname === "/bgp/bgpasn") {
          return jsonResponse({ result: "success", data: { id: 2, asn: 65001, name: "asn-1" } });
        }
        return jsonResponse({ result: "success", data: [] });
      }
    });

    await client.listBgpPrefixes("anycast");
    expect(new URL(seenUrls[0] ?? "").searchParams.get("group_type")).toBe("anycast");

    await client.listBgpAsns("anycast");
    expect(new URL(seenUrls[1] ?? "").searchParams.get("group_type")).toBe("anycast");

    await expect(client.getBgpAsn(2)).resolves.toEqual({ id: 2, asn: 65001, name: "asn-1", groupType: undefined });
    expect(new URL(seenUrls[2] ?? "").searchParams.get("id")).toBe("2");
  });

  it("lists account agreements", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({ result: "success", data: [{ id: 1, name: "aup", title: "Acceptable Use Policy", version: "1.0" }] })
    });
    await expect(client.listAccountAgreements()).resolves.toEqual([
      { id: 1, name: "aup", title: "Acceptable Use Policy", description: undefined, version: "1.0" }
    ]);
  });
});

describe("magic mesh", () => {
  it("lists, creates, gets, updates and deletes a magic mesh, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { meshId: 5 } });
        }
        if (init.method === "PATCH") {
          return jsonResponse({ code: 200, data: null });
        }
        if (new URL(url).pathname === "/cloud-routing/meshes") {
          return jsonResponse({ code: 200, data: [{ meshId: 5, name: "mesh-a", description: "core mesh" }] });
        }
        return jsonResponse({ code: 200, data: { meshId: 5, name: "mesh-a", description: "core mesh" } });
      }
    });

    await expect(client.listMagicMeshes()).resolves.toEqual([{ meshId: 5, name: "mesh-a", description: "core mesh" }]);
    await expect(client.createMagicMesh({ name: "mesh-a", routers: [{ routerId: 1 }] })).resolves.toBe(5);
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ name: "mesh-a", routers: [{ routerId: 1 }] });
    await expect(client.getMagicMesh(5)).resolves.toEqual({ meshId: 5, name: "mesh-a", description: "core mesh" });
    await expect(client.updateMagicMesh(5, { name: "mesh-b" })).resolves.toBeUndefined();
    expect(JSON.parse(calls[3]?.body ?? "{}")).toEqual({ name: "mesh-b" });
    await expect(client.deleteMagicMesh(5)).resolves.toBeUndefined();
  });

  it("lists, adds and removes mesh routers, treating removing an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "GET") {
          return jsonResponse({ code: 200, data: [{ routerId: 1, name: "router-a", ipv4Address: "192.0.2.10" }] });
        }
        return jsonResponse({ code: 200, data: null });
      }
    });

    await expect(client.listMeshRouters(5)).resolves.toEqual([{ routerId: 1, name: "router-a", description: undefined, ipv4Address: "192.0.2.10" }]);
    await expect(client.addRouterToMesh(5, 1)).resolves.toBeUndefined();
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ routerId: 1 });
    await expect(client.removeRouterFromMesh(5, 1)).resolves.toBeUndefined();
    expect(calls[2]).toMatchObject({ method: "DELETE", path: "/cloud-routing/meshes/5/routers/1" });
  });
});

describe("cloud routers", () => {
  it("lists, gets, creates, updates and deletes a cloud router, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { routerId: 9 } });
        }
        if (new URL(url).pathname === "/cloud-routing/routers") {
          return jsonResponse({ code: 200, data: [{ name: "router-a", hasDefaultVrf: true, canJoinMagicMesh: false }] });
        }
        return jsonResponse({ code: 200, data: { name: "router-a", hasDefaultVrf: true, canJoinMagicMesh: false } });
      }
    });

    await expect(client.listRouters()).resolves.toEqual([
      { name: "router-a", description: undefined, readyOn: undefined, hasDefaultVrf: true, canJoinMagicMesh: false, meshId: undefined, build: undefined }
    ]);
    await expect(client.getRouter(9)).resolves.toMatchObject({ name: "router-a" });
    await expect(client.createRouter({ packageId: 1, locationId: 2, name: "router-a" })).resolves.toBe(9);
    expect(JSON.parse(calls[2]?.body ?? "{}")).toEqual({ packageId: 1, locationId: 2, name: "router-a" });
    await expect(client.updateRouter(9, { name: "router-b" })).resolves.toMatchObject({ name: "router-a" });
    await expect(client.deleteRouter(9)).resolves.toBeUndefined();
  });

  it("gets a router config, decoding its VRF map, service and metadata", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () =>
        jsonResponse({
          code: 200,
          data: {
            defaultVrfId: 1,
            service: { ntp: { enabled: true, upstreams: [{ domain: "pool.ntp.org" }] } },
            prefixLists: [],
            vrf: { "1": { vrfId: 1, name: "default", bgp: { routerId: "10.0.0.1", networks: [], neighbors: [] } } },
            ipSec: null,
            metadata: { status: "Active", name: "router-a", version: 3, hasDefaultVrf: true, canJoinMagicMesh: false }
          }
        })
    });
    const config = await client.getRouterConfig(9);
    expect(config.defaultVrfId).toBe(1);
    expect(config.service.ntp.upstreams).toEqual([{ domain: "pool.ntp.org" }]);
    expect(config.vrf["1"]).toMatchObject({ vrfId: 1, name: "default" });
    expect(config.vrf["1"]?.bgp.routerId).toBe("10.0.0.1");
    expect(config.metadata.status).toBe("Active");
  });

  it("returns the router-wide interface configuration and routing views as opaque payloads", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (new URL(url).pathname.endsWith("/overview")) {
          return jsonResponse({ code: 200, data: { routes: 12 } });
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { views: [{ name: "v4-full", rows: [] }] } });
        }
        return jsonResponse({ code: 200, data: { interfaces: [{ interfaceId: 1 }] } });
      }
    });

    await expect(client.listRouterConfigInterfaces(9)).resolves.toEqual({ interfaces: [{ interfaceId: 1 }] });
    await expect(client.getRouterRoutingViews(9, 1, { views: [{ ipVersion: 4, name: "v4-full" }] })).resolves.toEqual({
      views: [{ name: "v4-full", rows: [] }]
    });
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ views: [{ ipVersion: 4, name: "v4-full" }] });
    await expect(client.getRouterRoutingOverview(9, 1)).resolves.toEqual({ routes: 12 });
  });

  it("invalidates a router's configuration cache", async () => {
    let seenPath = "";
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url) => {
        seenPath = new URL(url).pathname;
        return jsonResponse({ code: 200, data: null });
      }
    });
    await expect(client.invalidateRouterConfigCache(9)).resolves.toBeUndefined();
    expect(seenPath).toBe("/cloud-routing/routers/9/config/invalidate-cache");
  });

  it("waits for a router to become ready once readyOn is set", async () => {
    let calls = 0;
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => {
        calls += 1;
        const readyOn = calls >= 2 ? "2026-01-01T00:00:00Z" : undefined;
        return jsonResponse({
          code: 200,
          data: { name: "router-a", hasDefaultVrf: true, canJoinMagicMesh: false, readyOn, build: [{ text: "step one", date: "2026-01-01T00:00:00Z" }] }
        });
      }
    });
    const sleeps: number[] = [];
    await client.waitForRouterReady(9, { sleep: async (ms) => { sleeps.push(ms); } });
    expect(calls).toBe(2);
    expect(sleeps).toEqual([10_000]);
  });

  it("throws naming the stuck step when a router build makes no progress", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () =>
        jsonResponse({
          code: 200,
          data: {
            name: "router-a",
            hasDefaultVrf: true,
            canJoinMagicMesh: false,
            build: [{ text: "provisioning" }, { text: "configuring interfaces" }]
          }
        })
    });
    await expect(
      client.waitForRouterReady(9, {
        stallAfterMs: 1,
        intervalMs: 5,
        timeoutMs: 10_000,
        sleep: async (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      })
    ).rejects.toThrow(/stuck on "provisioning"/);
  });

  it("lists, creates, gets, updates and deletes a router VRF, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { vrfId: 2 } });
        }
        if (init.method === "PUT") {
          return jsonResponse({ code: 200, data: { vrfId: 2 } });
        }
        if (new URL(url).pathname.endsWith("/vrfs")) {
          return jsonResponse({ code: 200, data: { "2": { vrfId: 2, name: "vrf-a" } } });
        }
        return jsonResponse({ code: 200, data: { vrfId: 2, name: "vrf-a" } });
      }
    });

    const vrfs = await client.listRouterVrfs(9);
    expect(vrfs["2"]).toMatchObject({ vrfId: 2, name: "vrf-a" });
    await expect(client.createRouterVrf(9, { name: "vrf-a" })).resolves.toBe(2);
    await expect(client.getRouterVrf(9, 2)).resolves.toMatchObject({ vrfId: 2, name: "vrf-a" });
    await expect(client.updateRouterVrf(9, 2, { name: "vrf-b" })).resolves.toBeUndefined();
    expect(JSON.parse(calls[3]?.body ?? "{}")).toEqual({ name: "vrf-b" });
    await expect(client.deleteRouterVrf(9, 2)).resolves.toBeUndefined();
  });

  it("gets and updates a VRF's BGP configuration", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "PUT") {
          return jsonResponse({ code: 200, data: { routerId: 9, networks: [{ subnet: "10.0.0.0/24" }], neighbors: [] } });
        }
        return jsonResponse({ code: 200, data: { routerId: "10.0.0.1", networks: [], neighbors: [] } });
      }
    });
    await expect(client.getRouterVrfBgp(9, 2)).resolves.toMatchObject({ routerId: "10.0.0.1" });
    const updated = await client.updateRouterVrfBgp(9, 2, { networks: [{ subnet: "10.0.0.0/24" }] });
    expect(updated).toMatchObject({ routerId: 9, networks: [{ subnet: "10.0.0.0/24" }] });
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ networks: [{ subnet: "10.0.0.0/24" }] });
  });

  it("lists, creates, gets, updates and deletes a VRF BGP neighbor, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const neighborInput = {
      address: "203.0.113.1",
      isShutdown: false,
      doAsOverride: false,
      doNextHelpSelf: false,
      enabledIpVersion: { ipv4: true, ipv6: false },
      asn: { remote: 65001 }
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { neighborId: 4 } });
        }
        if (init.method === "PUT") {
          return jsonResponse({ code: 200, data: { neighborId: 4 } });
        }
        if (new URL(url).pathname.endsWith("/neighbors")) {
          return jsonResponse({ code: 200, data: [{ neighborId: 4, ...neighborInput }] });
        }
        return jsonResponse({ code: 200, data: { neighborId: 4, ...neighborInput } });
      }
    });

    await expect(client.listRouterVrfBgpNeighbors(9, 2)).resolves.toEqual([expect.objectContaining({ neighborId: 4, address: "203.0.113.1" })]);
    await expect(client.createRouterVrfBgpNeighbor(9, 2, neighborInput)).resolves.toBe(4);
    await expect(client.getRouterVrfBgpNeighbor(9, 2, 4)).resolves.toMatchObject({ neighborId: 4 });
    await expect(client.updateRouterVrfBgpNeighbor(9, 2, 4, neighborInput)).resolves.toBeUndefined();
    await expect(client.deleteRouterVrfBgpNeighbor(9, 2, 4)).resolves.toBeUndefined();
    expect(calls[4]).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/bgp/neighbors/4" });
  });

  it("lists and creates static routes, finds one by id, and throws not found when absent", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { staticRouteId: 3 } });
        }
        return jsonResponse({ code: 200, data: [{ staticRouteId: 3, network: "10.1.0.0/24", via: { nextHop: "10.0.0.1" } }] });
      }
    });
    await expect(client.listRouterStaticRoutes(9, 2)).resolves.toHaveLength(1);
    await expect(client.createRouterStaticRoute(9, 2, { network: "10.1.0.0/24", via: { nextHop: "10.0.0.1" } })).resolves.toBe(3);
    await expect(client.getRouterStaticRoute(9, 2, 3)).resolves.toMatchObject({ staticRouteId: 3, network: "10.1.0.0/24" });
    await expect(client.getRouterStaticRoute(9, 2, 99)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    try {
      await client.getRouterStaticRoute(9, 2, 99);
    } catch (error) {
      expect(isNotFoundError(error)).toBe(true);
    }
  });

  it("updates and deletes a static route, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        return jsonResponse({ code: 200, data: { staticRouteId: 3 } });
      }
    });
    await expect(client.updateRouterStaticRoute(9, 2, 3, { network: "10.1.0.0/24", via: { nextHop: "10.0.0.2" } })).resolves.toBeUndefined();
    await expect(client.deleteRouterStaticRoute(9, 2, 3)).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/static-routes/3" });
  });

  it("creates and lists prefix lists, finds one by id, and throws not found when absent", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { prefixListId: 6 } });
        }
        return jsonResponse({
          code: 200,
          data: [{ prefixListId: 6, name: "allow-rfc1918", ipVersion: 4, rules: [{ action: "permit", prefix: "10.0.0.0/8" }] }]
        });
      }
    });
    await expect(
      client.createRouterPrefixList(9, { name: "allow-rfc1918", ipVersion: 4, rules: [{ action: "permit", prefix: "10.0.0.0/8" }] })
    ).resolves.toBe(6);
    await expect(client.listRouterPrefixLists(9)).resolves.toHaveLength(1);
    await expect(client.getRouterPrefixList(9, 6)).resolves.toMatchObject({ prefixListId: 6, name: "allow-rfc1918" });
    await expect(client.getRouterPrefixList(9, 99)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("updates and deletes a prefix list, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        return jsonResponse({ code: 200, data: { prefixListId: 6 } });
      }
    });
    await expect(
      client.updateRouterPrefixList(9, 6, { name: "allow-rfc1918", ipVersion: 4, rules: [{ action: "deny", prefix: "0.0.0.0/0" }] })
    ).resolves.toBeUndefined();
    await expect(client.deleteRouterPrefixList(9, 6)).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/prefix-lists/6" });
  });

  it("gets and updates a router's NTP configuration", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "PUT") {
          return jsonResponse({ code: 200, data: { routerId: 9 } });
        }
        return jsonResponse({ code: 200, data: { enabled: true, upstreams: [{ domain: "pool.ntp.org" }] } });
      }
    });
    await expect(client.getRouterNtpConfig(9)).resolves.toEqual({ enabled: true, interfaceId: undefined, upstreams: [{ domain: "pool.ntp.org" }] });
    await expect(client.updateRouterNtpConfig(9, { enabled: true, upstreams: [{ domain: "time.example.com" }] })).resolves.toBeUndefined();
    expect(JSON.parse(calls[1]?.body ?? "{}")).toEqual({ enabled: true, upstreams: [{ domain: "time.example.com" }] });
    expect(calls[1]).toMatchObject({ path: "/cloud-routing/routers/9/config/services/ntp" });
  });

  it("gets and updates a router's IPSec crypto configuration", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const ikeGroup = {
      doAutoRenegotiation: true,
      keyExchangeVersion: 2,
      lifetimeSeconds: 28800,
      dhGroupNumber: 14,
      encryption: "aes256",
      hash: "sha256",
      prf: "sha256"
    };
    const espGroup = { lifetimeSeconds: 3600, encryption: "aes256", hash: "sha256" };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        return jsonResponse({ code: 200, data: { ikeGroup, espGroup } });
      }
    });
    await expect(client.getRouterIpSecConfig(9)).resolves.toEqual({ ikeGroup, espGroup });
    await expect(client.updateRouterIpSecConfig(9, { ikeGroup, espGroup })).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "PUT", path: "/cloud-routing/routers/9/config/ipSec" });
  });

  it("lists, creates, gets, updates and deletes a router VRF IPSec peer, throwing not found when absent", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const peer = {
      ipSecPeerId: 5,
      name: "peer-a",
      remoteId: "peer.example.com",
      pskSecret: "secret",
      doInitiateConnection: true,
      peerAddress: "203.0.113.5",
      localId: "router.example.com",
      overlayNetwork: { ipv4: "10.10.0.0/30" }
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST" || init.method === "PUT") {
          return jsonResponse({ code: 200, data: { ipSecPeerId: 5 } });
        }
        return jsonResponse({ code: 200, data: [peer] });
      }
    });
    await expect(client.listRouterVrfIpSecPeers(9, 2)).resolves.toEqual([peer]);
    await expect(
      client.createRouterVrfIpSecPeer(9, 2, {
        name: "peer-a",
        remoteId: "peer.example.com",
        pskSecret: "secret",
        doInitiateConnection: true,
        peerAddress: "203.0.113.5",
        overlayNetwork: { ipv4: "10.10.0.0/30" }
      })
    ).resolves.toBe(5);
    await expect(client.getRouterVrfIpSecPeer(9, 2, 5)).resolves.toMatchObject({ ipSecPeerId: 5 });
    await expect(client.getRouterVrfIpSecPeer(9, 2, 99)).rejects.toBeInstanceOf(NetActuateNotFoundError);
    await expect(
      client.updateRouterVrfIpSecPeer(9, 2, 5, {
        name: "peer-a",
        remoteId: "peer.example.com",
        pskSecret: "secret",
        doInitiateConnection: true,
        overlayNetwork: {}
      })
    ).resolves.toBeUndefined();
    await expect(client.deleteRouterVrfIpSecPeer(9, 2, 5)).resolves.toBeUndefined();
    expect(calls.at(-1)).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/ipSec/peers/5" });
  });

  it("lists, creates, gets, updates and deletes a router VRF interface, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST" || init.method === "PUT") {
          return jsonResponse({ code: 200, data: { interfaceId: 7 } });
        }
        if (new URL(url).pathname.endsWith("/interfaces")) {
          return jsonResponse({ code: 200, data: { "7": { interfaceId: 7, vrfId: 2, type: "ethernet", name: "eth-a", staticRoutes: [] } } });
        }
        return jsonResponse({ code: 200, data: { interfaceId: 7, vrfId: 2, type: "ethernet", name: "eth-a", staticRoutes: [] } });
      }
    });
    const interfaces = await client.listRouterVrfInterfaces(9, 2);
    expect(interfaces["7"]).toMatchObject({ interfaceId: 7, name: "eth-a" });
    await expect(client.createRouterVrfInterface(9, 2, { type: "ethernet", name: "eth-a" })).resolves.toBe(7);
    await expect(client.getRouterVrfInterface(9, 2, 7)).resolves.toMatchObject({ interfaceId: 7, name: "eth-a" });
    await expect(client.updateRouterVrfInterface(9, 2, 7, { type: "ethernet", name: "eth-b" })).resolves.toBeUndefined();
    await expect(client.deleteRouterVrfInterface(9, 2, 7)).resolves.toBeUndefined();
    expect(calls.at(-1)).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/interfaces/7" });
  });

  it("creates, gets and deletes a router VRF interface wireguard peer, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const peer = {
      wireguardPeerId: 3,
      allowedIps: [{ network: "10.20.0.0/30" }],
      publicKey: "peer-public-key",
      privateKey: "peer-private-key"
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { wireguardPeerId: 3 } });
        }
        return jsonResponse({ code: 200, data: peer });
      }
    });
    await expect(
      client.createRouterVrfInterfaceWireguardPeer(9, 2, 7, { allowedIps: [{ network: "10.20.0.0/30" }] })
    ).resolves.toBe(3);
    await expect(client.getRouterVrfInterfaceWireguardPeer(9, 2, 7, 3)).resolves.toMatchObject({
      wireguardPeerId: 3,
      publicKey: "peer-public-key"
    });
    await expect(client.deleteRouterVrfInterfaceWireguardPeer(9, 2, 7, 3)).resolves.toBeUndefined();
    expect(calls.at(-1)).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/interfaces/7/wireguard-peers/3" });
  });

  it("creates and lists router VRF SNAT rules, finds one by id, and throws not found when absent", async () => {
    const rule = {
      snatRuleId: 11,
      ipVersion: 4,
      protocol: "tcp",
      name: "snat-a",
      description: "",
      match: { interfaceId: 1, network: "10.0.0.0/24" },
      translation: { network: "203.0.113.1/32" }
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { snatRuleId: 11 } });
        }
        return jsonResponse({ code: 200, data: [rule] });
      }
    });
    await expect(
      client.createRouterVrfSnatRule(9, 2, {
        ipVersion: 4,
        protocol: "tcp",
        match: { interfaceId: 1, network: "10.0.0.0/24" },
        translation: { network: "203.0.113.1/32" }
      })
    ).resolves.toBe(11);
    await expect(client.listRouterVrfSnatRules(9, 2)).resolves.toHaveLength(1);
    await expect(client.getRouterVrfSnatRule(9, 2, 11)).resolves.toMatchObject({ snatRuleId: 11, name: "snat-a" });
    await expect(client.getRouterVrfSnatRule(9, 2, 99)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("updates and deletes a router VRF SNAT rule, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        return jsonResponse({ code: 200, data: { snatRuleId: 11 } });
      }
    });
    await expect(client.updateRouterVrfSnatRule(9, 2, 11, { ipVersion: 4, protocol: "tcp" })).resolves.toBeUndefined();
    await expect(client.deleteRouterVrfSnatRule(9, 2, 11)).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/snat-rules/11" });
  });

  it("creates and lists router VRF DNAT rules, finds one by id, and throws not found when absent", async () => {
    const rule = {
      dnatRuleId: 12,
      ipVersion: 4,
      protocol: "tcp",
      name: "dnat-a",
      description: "",
      match: { interfaceId: 1, network: "0.0.0.0/0" },
      translation: { network: "10.0.0.5/32" }
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (_url, init) => {
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { dnatRuleId: 12 } });
        }
        return jsonResponse({ code: 200, data: [rule] });
      }
    });
    await expect(
      client.createRouterVrfDnatRule(9, 2, {
        ipVersion: 4,
        protocol: "tcp",
        match: { interfaceId: 1, network: "0.0.0.0/0" },
        translation: { network: "10.0.0.5/32" }
      })
    ).resolves.toBe(12);
    await expect(client.listRouterVrfDnatRules(9, 2)).resolves.toHaveLength(1);
    await expect(client.getRouterVrfDnatRule(9, 2, 12)).resolves.toMatchObject({ dnatRuleId: 12, name: "dnat-a" });
    await expect(client.getRouterVrfDnatRule(9, 2, 99)).rejects.toBeInstanceOf(NetActuateNotFoundError);
  });

  it("updates and deletes a router VRF DNAT rule, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        return jsonResponse({ code: 200, data: { dnatRuleId: 12 } });
      }
    });
    await expect(client.updateRouterVrfDnatRule(9, 2, 12, { ipVersion: 4, protocol: "tcp" })).resolves.toBeUndefined();
    await expect(client.deleteRouterVrfDnatRule(9, 2, 12)).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/dnat-rules/12" });
  });

  it("lists, gets, creates, updates and deletes a router VRF tunnel, treating deleting an absent one as success", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const tunnel = {
      tunnelId: 4,
      name: "tunnel-a",
      ipKey: 1,
      mtu: "1400",
      ipVersion: 4,
      endpointAddress: { source: "203.0.113.1", remote: "198.51.100.1" }
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 404, message: "not found" }, 404);
        }
        if (init.method === "POST" || init.method === "PUT") {
          return jsonResponse({ code: 200, data: { tunnelId: 4 } });
        }
        if (new URL(url).pathname.endsWith("/tunnels")) {
          return jsonResponse({ code: 200, data: [tunnel] });
        }
        return jsonResponse({ code: 200, data: tunnel });
      }
    });
    await expect(client.listRouterVrfTunnels(9, 2)).resolves.toEqual([tunnel]);
    await expect(client.getRouterVrfTunnel(9, 2, 4)).resolves.toMatchObject({ tunnelId: 4, mtu: "1400" });
    await expect(
      client.createRouterVrfTunnel(9, 2, { ipKey: 1, name: "tunnel-a", mtu: 1400, endpointAddress: { remote: "198.51.100.1" } })
    ).resolves.toBe(4);
    await expect(
      client.updateRouterVrfTunnel(9, 2, 4, { ipKey: 1, name: "tunnel-b", mtu: 1400, endpointAddress: { remote: "198.51.100.1" } })
    ).resolves.toBeUndefined();
    await expect(client.deleteRouterVrfTunnel(9, 2, 4)).resolves.toBeUndefined();
    expect(calls.at(-1)).toMatchObject({ method: "DELETE", path: "/cloud-routing/routers/9/config/vrfs/2/tunnels/4" });
  });

  it("gets and updates a router VRF's DHCP service configuration", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const dhcp = {
      enabled: true,
      interfaceId: 7,
      subnet: "10.20.0.0/24",
      defaultRouterAddress: "10.20.0.1",
      clientDomainName: "internal.example.com",
      leaseTimeout: 3600,
      doPingCheck: true,
      domainNameServers: [{ address: "10.20.0.1" }],
      ntpServers: [],
      staticRoutes: []
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "PUT") {
          return jsonResponse({ code: 200, data: { routerId: 9 } });
        }
        return jsonResponse({ code: 200, data: dhcp });
      }
    });
    await expect(client.getRouterVrfDhcp(9, 2)).resolves.toMatchObject({ enabled: true, subnet: "10.20.0.0/24" });
    await expect(
      client.updateRouterVrfDhcp(9, 2, {
        enabled: true,
        interfaceId: 7,
        subnet: "10.20.0.0/24",
        leaseTimeout: 3600,
        doPingCheck: true,
        domainNameServers: [{ address: "10.20.0.1" }],
        ntpServers: [],
        staticRoutes: []
      })
    ).resolves.toBeUndefined();
    expect(calls[1]).toMatchObject({ method: "PUT", path: "/cloud-routing/routers/9/config/vrfs/2/services/dhcp" });
  });
});

describe("SSL certificates", () => {
  it("creates, lists, gets, updates and deletes an SSL certificate", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const cert = {
      sslCertificateId: 1,
      name: "example",
      description: "example cert",
      fingerprint: "ab:cd",
      domains: ["example.com"],
      isActive: true,
      status: "active",
      dates: { created: "2026-01-01" }
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "POST") {
          return jsonResponse({ code: 200, data: { sslCertificateId: 1 } });
        }
        if (init.method === "PATCH" || init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (new URL(url).pathname === "/ssl-certificates") {
          return jsonResponse({ code: 200, data: [cert] });
        }
        return jsonResponse({ code: 200, data: cert });
      }
    });

    await expect(
      client.createSslCertificate({ name: "example", certificate: "PEM", privateKey: "KEY" })
    ).resolves.toEqual({ sslCertificateId: 1 });
    await expect(client.getSslCertificates()).resolves.toEqual([cert]);
    await expect(client.getSslCertificate(1)).resolves.toEqual(cert);
    await expect(client.updateSslCertificate(1, { name: "renamed" })).resolves.toBeUndefined();
    await expect(client.deleteSslCertificate(1)).resolves.toBeUndefined();

    expect(calls[0]).toMatchObject({ method: "POST", path: "/ssl-certificates" });
    expect(calls[2]).toMatchObject({ method: "GET", path: "/ssl-certificates/1" });
    expect(calls[3]).toMatchObject({ method: "PATCH", path: "/ssl-certificates/1" });
    expect(calls[4]).toMatchObject({ method: "DELETE", path: "/ssl-certificates/1" });
  });

  it("treats deleting an already absent certificate as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found", data: null }, 404)
    });
    await expect(client.deleteSslCertificate(99)).resolves.toBeUndefined();
  });
});

describe("network load balancer groups", () => {
  const group = {
    networkGroupId: 1,
    name: "web",
    description: "web tier",
    ipVersion: 4,
    algorithm: "round-robin",
    isOnline: true,
    match: { address: "203.0.113.1" },
    healthCheck: { enabled: true, method: "tcp", interval: 10, retries: 3, delay: 5, timeout: 5 },
    rules: [{ protocol: "tcp", networkRuleId: 5, ports: { match: 443, internal: 8443 } }],
    backends: [{ name: "web-1", internalAddress: "10.0.0.5", isOnline: true, networkBackendId: 7 }]
  };

  it("creates, gets, lists, replaces and deletes a network load balancer group", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (init.method === "DELETE") {
          return jsonResponse({ code: 200, data: null });
        }
        if (init.method === "GET" && new URL(url).pathname.endsWith("/groups")) {
          return jsonResponse({ code: 200, data: [group] });
        }
        return jsonResponse({ code: 200, data: group });
      }
    });

    const input = {
      name: "web",
      ipVersion: 4,
      algorithm: "round-robin",
      match: { address: "203.0.113.1" },
      healthCheck: { enabled: true, method: "tcp", interval: 10, retries: 3, delay: 5, timeout: 5 },
      rules: [{ protocol: "tcp", ports: { match: 443, internal: 8443 } }],
      backends: [{ name: "web-1", internalAddress: "10.0.0.5" }]
    };

    await expect(client.createNlbGroup(10, input)).resolves.toEqual(group);
    await expect(client.getNlbGroup(10, 1)).resolves.toEqual(group);
    await expect(client.listNlbGroups(10)).resolves.toEqual([group]);
    await expect(client.replaceNlbGroup(10, 1, input)).resolves.toEqual(group);
    await expect(client.deleteNlbGroup(10, 1)).resolves.toBeUndefined();

    expect(calls[0]).toMatchObject({ method: "POST", path: "/network-loadbalancers/10/groups" });
    expect(calls[1]).toMatchObject({ method: "GET", path: "/network-loadbalancers/10/groups/1" });
    expect(calls[2]).toMatchObject({ method: "GET", path: "/network-loadbalancers/10/groups" });
    expect(calls[3]).toMatchObject({ method: "PUT", path: "/network-loadbalancers/10/groups/1" });
    expect(calls[4]).toMatchObject({ method: "DELETE", path: "/network-loadbalancers/10/groups/1" });
  });

  it("treats deleting an already absent group as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found", data: null }, 404)
    });
    await expect(client.deleteNlbGroup(10, 99)).resolves.toBeUndefined();
  });
});

describe("statistics and metrics", () => {
  it("queries statistics, networking statistics and anycast statistics", async () => {
    const calls: Array<{ path: string; body?: string }> = [];
    const result = { metric: { cpu_usage: {} }, service: "compute", data: [{ count: 1, resources: 2, avg: 3, sum: 4 }] };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        calls.push({ path: new URL(url).pathname, body: init.body });
        return jsonResponse({ code: 200, data: [result] });
      }
    });

    await expect(client.queryStatistics(["cpu_usage"])).resolves.toEqual([{ metric: "cpu_usage", service: "compute", data: [{ count: 1, resources: 2, avg: 3, sum: 4 }] }]);
    await expect(client.queryNetworkingStatistics(["cpu_usage"])).resolves.toHaveLength(1);
    await expect(client.queryAnycastStatistics(["cpu_usage"])).resolves.toHaveLength(1);

    expect(calls[0]?.path).toBe("/cloud/statistics");
    expect(calls[1]?.path).toBe("/cloud/networking/statistics");
    expect(calls[2]?.path).toBe("/cloud/networking/anycast/statistics");
    expect(JSON.parse(calls[0]?.body ?? "{}")).toEqual({ metrics: [{ metric: { cpu_usage: {} } }] });
  });

  it("gets metric names, separating the shared time window from the metric entries", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () =>
        jsonResponse({
          code: 200,
          data: {
            __timeWindow: { start: "2026-01-01T00:00:00Z", end: "2026-01-01T01:00:00Z", seconds: 3600 },
            cpu_usage: {
              service: "compute",
              resources: 4,
              avg: { sum: 1, avg: 2, min: 0, max: 3 },
              last: { sum: 1, avg: 2, min: 0, max: 3 },
              sum: { sum: 1, avg: 2, min: 0, max: 3 }
            }
          }
        })
    });
    const names = await client.getMetricNames();
    expect(names.timeWindow).toEqual({ start: "2026-01-01T00:00:00Z", end: "2026-01-01T01:00:00Z", seconds: 3600 });
    expect(names.metrics).toEqual([
      { metric: "cpu_usage", service: "compute", resources: 4, avg: { sum: 1, avg: 2, min: 0, max: 3 }, last: { sum: 1, avg: 2, min: 0, max: 3 }, sum: { sum: 1, avg: 2, min: 0, max: 3 } }
    ]);
  });
});

describe("ddos", () => {
  it("lists all and active attacks", async () => {
    const calls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        calls.push(new URL(url).pathname);
        return jsonResponse({
          result: "success",
          data: [
            {
              id: 1,
              date_start: "2026-01-01T00:00:00Z",
              date_end: "",
              status: 1,
              ip: "203.0.113.1",
              prefix: "203.0.113.0/24",
              direction: "inbound",
              pps: 100000,
              rule_id: 5,
              rule_type: "auto",
              ban_duration: 300,
              rule_name: "default"
            }
          ]
        });
      }
    });
    await expect(client.getDdosAttacks()).resolves.toHaveLength(1);
    await expect(client.getDdosActiveAttacks()).resolves.toMatchObject([{ attackId: 1, ruleName: "default" }]);
    expect(calls).toEqual(["/ddos/attacks", "/ddos/attacks/active"]);
  });

  it("gets the dashboard with query options", async () => {
    let seenUrl = "";
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        seenUrl = url;
        return jsonResponse({
          result: "success",
          data: { total_attacks: 2, active_rules: 1, longest_attack_seconds: 60, top_attacks: [], period: 3600 }
        });
      }
    });
    const dashboard = await client.getDdosDashboard({ period: 3600, includeEnded: true, limit: 5 });
    expect(dashboard).toEqual({ totalAttacks: 2, activeRules: 1, longestAttackSeconds: 60, topAttacks: [], period: 3600 });
    const params = new URL(seenUrl).searchParams;
    expect(params.get("period")).toBe("3600");
    expect(params.get("include_ended")).toBe("true");
    expect(params.get("limit")).toBe("5");
  });

  it("lists and gets DDoS rules with their prefixes and actions", async () => {
    const rule = {
      id: 9,
      rule_name: "syn-flood",
      description: "SYN flood mitigation",
      prefixes: [{ id: 1, prefix: "203.0.113.0/24", prefix_type: "customer", description: "web", allowed_pps: 50000 }],
      rules: [{ name: "rate-limit", action_type: "mitigate", run_order: 1, action_name: "Rate Limit", action_description: "Limits pps" }]
    };
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [rule] })
    });
    await expect(client.getDdosRules()).resolves.toHaveLength(1);

    const single = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: rule })
    });
    await expect(single.getDdosRule(9)).resolves.toMatchObject({
      ruleId: 9,
      ruleName: "syn-flood",
      prefixes: [{ prefixId: 1, allowedPps: 50000 }],
      rules: [{ name: "rate-limit", runOrder: 1 }]
    });
  });
});

describe("access control subnets", () => {
  it("lists, gets, creates, updates and deletes a subnet", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        if (calls.length === 1) {
          return jsonResponse({ result: "success", data: [{ id: 4, label: "office", subnet: "203.0.113.0/24" }] });
        }
        return jsonResponse({ result: "success", data: { id: 4, label: "office", subnet: "203.0.113.0/24" } });
      }
    });
    await expect(client.getAccessControlSubnets()).resolves.toEqual([{ id: "4", label: "office", subnet: "203.0.113.0/24" }]);
    await expect(client.getAccessControlSubnet("4")).resolves.toEqual({ id: "4", label: "office", subnet: "203.0.113.0/24" });
    await expect(client.createAccessControlSubnet({ label: "office", subnet: "203.0.113.0/24" })).resolves.toMatchObject({ id: "4" });
    await expect(client.updateAccessControlSubnet("4", { label: "office-2" })).resolves.toMatchObject({ id: "4" });
    await expect(client.deleteAccessControlSubnet("4")).resolves.toBeUndefined();

    expect(calls[1]).toMatchObject({ method: "GET", path: "/account/user-access-control-subnet/4" });
    expect(calls[2]).toMatchObject({ method: "POST", path: "/account/user-access-control-subnet" });
    expect(calls[3]).toMatchObject({ method: "PATCH", path: "/account/user-access-control-subnet/4" });
    expect(calls[4]).toMatchObject({ method: "DELETE", path: "/account/user-access-control-subnet/4" });
  });

  it("normalizes a numeric subnet id to a string", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { id: 7, label: "l", subnet: "s" } })
    });
    await expect(client.getAccessControlSubnet("7")).resolves.toMatchObject({ id: "7" });
  });
});

describe("legacy dedicated metal endpoints", () => {
  it("gets a dedicated server and its build status", async () => {
    const calls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        calls.push(new URL(url).pathname);
        if (calls.length === 1) {
          return jsonResponse({
            result: "success",
            data: {
              id: 1,
              datacenter_id: 3,
              mbpkgid: 100,
              price: "10.00",
              hostname: "box1",
              eth0_mac: "00:00:00:00:00:01",
              ipmi_mac: "00:00:00:00:00:02",
              primary_ip: "203.0.113.1",
              nps_os: "debian12",
              cpu0_model: "EPYC-7302",
              total_ram: 32768,
              ipmi_pubip: "203.0.113.2",
              ipmi_status: 1,
              locked: 0,
              ipmi_status_time: "2026-01-01T00:00:00Z",
              ob_id: 55,
              info: "",
              title: "box1",
              location: "NYC1",
              ip_subnet_id: 1,
              ip_subnet_name: "sub1",
              package_status: "Active"
            }
          });
        }
        return jsonResponse({ result: "success", data: { mbpkgid: 100, response: "ok", status: "building", percent: 40, image_name: "debian12" } });
      }
    });
    await expect(client.getMetal(1)).resolves.toMatchObject({ id: 1, obId: "55" });
    await expect(client.getMetalBuildStatus(77)).resolves.toEqual({
      mbPkgId: 100,
      response: "ok",
      status: "building",
      percent: 40,
      imageName: "debian12"
    });
    expect(calls).toEqual(["/dedicated/servers/1", "/dedicated/server/build_status/77"]);
  });

  it("purchases and rebuilds through the legacy form-encoded endpoints", async () => {
    const calls: Array<{ path: string; body?: string; contentType?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ path: new URL(url).pathname, body: init.body, contentType: init.headers["Content-Type"] });
        return jsonResponse({ result: "success", data: { mbpkgid: 100, status: "queued", build: 1 } });
      }
    });
    await expect(client.createMetal({ location: 3, deviceId: 9, profile: 1, hostname: "box2.example.com" })).resolves.toEqual({
      mbPkgId: 100,
      status: "queued",
      build: 1
    });
    await expect(client.buildMetal(9, { mbPkgId: 100, profile: 2, hostname: "box2.example.com" })).resolves.toEqual({
      mbPkgId: 100,
      status: "queued",
      build: 1
    });

    expect(calls[0]?.path).toBe("/dedicated/server/buy_build");
    expect(calls[0]?.contentType).toBe("application/x-www-form-urlencoded");
    expect(new URLSearchParams(calls[0]?.body).get("device_id")).toBe("9");
    expect(calls[1]?.path).toBe("/dedicated/server/re_build/9");
    expect(new URLSearchParams(calls[1]?.body).get("mbpkgid")).toBe("100");
  });
});

describe("bgp sessions", () => {
  it("gets, creates and deletes a session", async () => {
    const sessionRow = {
      id: 1,
      customer_peer_ip: "203.0.113.5",
      group_id: 2,
      locked: 0,
      description: "primary",
      config_status: 1,
      prefixes: [],
      export_list: "",
      provider_peer_ip: "203.0.113.1",
      location: "NYC",
      latitude: "40.7",
      longitude: "-74.0",
      group_name: "default",
      provider_ip_type: "ipv4",
      provider_asn: "64512",
      customer_asn: "64513"
    };
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: sessionRow })
    });
    await expect(client.getBgpSession(1)).resolves.toMatchObject({ id: 1, providerAsn: 64512, customerAsn: 64513 });
    await expect(client.createBgpSessions({ mbPkgId: 100, groupId: 2, redundant: true })).resolves.toMatchObject({ id: 1 });
  });

  it("treats deleting an already absent session as success", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "error", code: 422, message: "invalid", data: [], fields: { id: ["The bgp id could not be found"] } }, 422)
    });
    await expect(client.deleteBgpSession(1)).resolves.toBeUndefined();
  });

  it("lists sessions for a server by matching its known IPs, including an expanded IPv6 form", async () => {
    const sessionRow = (id: number, ip: string) => ({
      id,
      customer_peer_ip: ip,
      group_id: 2,
      locked: 0,
      description: "s",
      config_status: 1,
      prefixes: [],
      export_list: "",
      provider_peer_ip: "203.0.113.1",
      location: "NYC",
      latitude: "0",
      longitude: "0",
      group_name: "default",
      provider_ip_type: "ipv6",
      provider_asn: "64512",
      customer_asn: "64513"
    });
    const calls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        const path = new URL(url).pathname;
        calls.push(path);
        if (path === "/bgp/bgpsessions") {
          return jsonResponse({
            result: "success",
            data: [sessionRow(1, "2001:0db8:0000:0000:0000:0000:0000:0001"), sessionRow(2, "198.51.100.9")]
          });
        }
        if (path === "/cloud/networkips/100") {
          return jsonResponse({ result: "success", data: { IPv4: [], IPv6: [{ id: 1, primary: 1, reverse: "", ip: "2001:db8::1", gateway: "", netmask: "", broadcast: "" }] } });
        }
        return jsonResponse({ result: "success", data: sessionRow(1, "2001:db8:0:0:0:0:0:1") });
      }
    });
    const sessions = await client.getBgpSessions(100);
    expect(sessions.map((s) => s.id)).toEqual([1]);
  });
});

describe("capacity", () => {
  it("gets billing packages", async () => {
    const calls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        calls.push(new URL(url).pathname);
        return jsonResponse({
          result: "success",
          data: [
            {
              id: 1,
              name: "pkg",
              packageid: 2,
              domain: "d",
              amount: "10",
              billingcycle: "monthly",
              domainstatus: "Active",
              nextduedate: "2026-01-01",
              dedicatedip: "n"
            }
          ]
        });
      }
    });
    await expect(client.getBillingPackages()).resolves.toHaveLength(1);
    expect(calls[0]).toBe("/cloud/billing-packages");
  });

  it("gets cloud pools and cloud capacity", async () => {
    const calls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        calls.push(new URL(url).pathname + new URL(url).search);
        return jsonResponse({
          result: "success",
          data: [
            {
              id: 1,
              name: "pool",
              description: "d",
              hard_capabilities: [],
              soft_capabilities: [],
              private: 0,
              default_ram_price: "0.01",
              default_cpu_price: "0.02",
              default_disk_price: "0.03",
              last_updated: "2026-01-01T00:00:00Z",
              created: "2025-01-01T00:00:00Z"
            }
          ]
        });
      }
    });
    await expect(client.getCloudPools()).resolves.toMatchObject([{ id: 1, name: "pool" }]);
  });

  it("gets cloud capacity for a pool and location", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: [{ pkg_id: 1, pkg_name: "p", pkg_cpu: 1, pkg_ram: 1024, pkg_disk: 20, pkg_net: 1, pkg_port: 1, monthly_price: 5, available: 3 }]
        })
    });
    await expect(client.getCloudCapacity(1, 2)).resolves.toEqual([
      { packageId: 1, packageName: "p", packageCpu: 1, packageRam: 1024, packageDisk: 20, packageNet: 1, packagePort: 1, monthlyPrice: 5, available: 3 }
    ]);
  });

  it("gets dedicated capacity", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: [{ device_id: 1, location_id: 2, looking_glass: "lg.example.com", mbpkgid: 0, name: "d", nps_enabled: 1, pub_description: "desc" }]
        })
    });
    await expect(client.getDedicatedCapacity()).resolves.toEqual([
      { deviceId: 1, locationId: 2, lookingGlass: "lg.example.com", mbPkgId: 0, name: "d", npsEnabled: true, pubDescription: "desc" }
    ]);
  });
});

describe("colocation and transit packages", () => {
  it("lists colocation and transit packages sorted by server package id, and gets one of each", async () => {
    const details = {
      dc_name: "NYC1",
      iata_code: "JFK",
      bw_commit: "100M",
      overage_type: "flat",
      overage_rate: "0.10",
      agg_bw_mbpkgid: "500"
    };
    const packageRow = (mbpkgid: number) => ({
      mbpkgid,
      package_status: "Active",
      fqdn: `box${mbpkgid}.example.com`,
      billingcycle: "monthly",
      nextduedate: "2026-01-01",
      amount: "100",
      details,
      status: "Active"
    });
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { "2": packageRow(200), "1": packageRow(100) } })
    });
    await expect(client.getColocationPackages()).resolves.toMatchObject([{ mbPkgId: 100 }, { mbPkgId: 200 }]);
    await expect(client.getTransitPackages()).resolves.toMatchObject([{ mbPkgId: 100 }, { mbPkgId: 200 }]);

    const single = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: packageRow(100) })
    });
    await expect(single.getColocationPackage(100)).resolves.toMatchObject({ mbPkgId: 100, details: { dcName: "NYC1" } });
    await expect(single.getTransitPackage(100)).resolves.toMatchObject({ mbPkgId: 100, details: { dcName: "NYC1" } });
  });
});

describe("cloud packages", () => {
  it("lists, gets and cancels a cloud package", async () => {
    const calls: Array<{ method: string; path: string; body?: string }> = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        return jsonResponse({ result: "success", data: [{ mbpkgid: 100, package_status: "Active", locked: 0, name: "plan-a", installed: 1 }] });
      }
    });
    await expect(client.getCloudPackages()).resolves.toEqual([{ id: 100, status: "Active", locked: false, planName: "plan-a", installed: true }]);

    const single = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: { mbpkgid: "100", package_status: "Active", locked: "1", name: "plan-a", installed: "0" } })
    });
    await expect(single.getCloudPackage(100)).resolves.toEqual({ id: 100, status: "Active", locked: true, planName: "plan-a", installed: false });

    const canceler = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url, init) => {
        calls.push({ method: init.method, path: new URL(url).pathname, body: init.body });
        return jsonResponse({ result: "success", data: { cancelled: true } });
      }
    });
    await expect(canceler.cancelCloudPackage({ mbPkgId: 100, cancelType: "immediate", agree: 1 })).resolves.toEqual({ cancelled: true });
    const cancelCall = calls[calls.length - 1];
    expect(cancelCall?.path).toBe("/cloud/package/cancel/");
    expect(JSON.parse(cancelCall?.body ?? "{}")).toMatchObject({ mbpkgid: 100, cancel_type: "immediate", agree: 1 });
  });
});

describe("longtail, locations, os and network ips", () => {
  it("gets the current-IP location and a switch port graph", async () => {
    const calls: string[] = [];
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async (url) => {
        calls.push(url);
        if (calls.length === 1) {
          return jsonResponse({ result: "success", data: { ip: "203.0.113.9", location: "NYC1" } });
        }
        return jsonResponse({ result: "success", data: { series: [1, 2, 3] } });
      }
    });
    await expect(client.getLocationByCurrentIp()).resolves.toMatchObject({ ip: "203.0.113.9", location: "NYC1" });
    await expect(client.getGraph({ port: 12, time: "daily" })).resolves.toEqual({ raw: { series: [1, 2, 3] } });
    const params = new URL(calls[1] ?? "").searchParams;
    expect(params.get("port")).toBe("12");
    expect(params.get("time")).toBe("daily");
  });

  it("lists deployment locations", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, name: "New York", iata_code: "JFK", continent: "NA", flag: "us", disabled: 0 }] })
    });
    await expect(client.getLocations()).resolves.toEqual([{ id: 1, name: "New York", iataCode: "JFK", continent: "NA", flag: "us", disabled: false }]);
  });

  it("lists OS catalog entries", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () => jsonResponse({ result: "success", data: [{ id: 1, os: "Debian 12", type: "linux", subtype: "debian", size: "20", bits: "64", tech: "kvm" }] })
    });
    await expect(client.getOss()).resolves.toEqual([{ id: 1, os: "Debian 12", type: "linux", subtype: "debian", size: "20", bits: "64", tech: "kvm" }]);
  });

  it("gets network IPs for a server package", async () => {
    const client = new Client({
      apiKey: "test-key",
      baseUrl: "https://api.test/",
      transport: async () =>
        jsonResponse({
          result: "success",
          data: {
            IPv4: [{ id: 1, primary: 1, reverse: "host.example.com", ip: "203.0.113.9", gateway: "203.0.113.1", netmask: "255.255.255.0", broadcast: "203.0.113.255" }],
            IPv6: []
          }
        })
    });
    const ips = await client.getNetworkIps(100);
    expect(ips.ipv4).toEqual([
      { id: 1, primary: true, reverse: "host.example.com", ip: "203.0.113.9", gateway: "203.0.113.1", netmask: "255.255.255.0", broadcast: "203.0.113.255" }
    ]);
    expect(ips.ipv6).toEqual([]);
  });
});

describe("HTTP load balancer groups", () => {
  it("creates, lists, gets, replaces and deletes a group", async () => {
    const calls: Array<{ method: string; path: string }> = [];
    const group = {
      httpGroupId: 1,
      name: "web",
      description: "",
      algorithm: "round-robin",
      stickySessionsEnabled: false,
      sslToBackendEnabled: false,
      internalPort: 8080,
      isOnline: true,
      match: { address: "203.0.113.1", ports: "80,443" },
      healthCheck: { active: { enabled: true, timeout: 5, path: "/" }, passive: { enabled: false } },
      rules: [{ httpsRedirectEnabled: true, match: { domain: "example.com", path: "/" }, ssl: { enabled: true, sslCertificateId: 1 } }],
      backends: [{ name: "web-1", internalAddress: "10.0.0.5" }]
    };
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        const path = new URL(url).pathname;
        calls.push({ method: init.method, path });
        if (init.method === "GET" && /\/groups$/.test(path)) {
          return jsonResponse({ code: 200, data: [group] });
        }
        return jsonResponse({ code: 200, data: group });
      }
    });

    const input = {
      name: "web",
      algorithm: "round-robin",
      stickySessionsEnabled: false,
      sslToBackendEnabled: false,
      internalPort: 8080,
      match: { address: "203.0.113.1", ports: "80,443" },
      healthCheck: { active: { enabled: true, timeout: 5, path: "/" }, passive: { enabled: false } },
      rules: [{ httpsRedirectEnabled: true, match: { domain: "example.com", path: "/" }, ssl: { enabled: true, sslCertificateId: 1 } }],
      backends: [{ name: "web-1", internalAddress: "10.0.0.5" }]
    };

    await expect(client.createHttpLbGroup(10, input)).resolves.toEqual(group);
    await expect(client.getHttpLbGroup(10, 1)).resolves.toEqual(group);
    await expect(client.getHttpLbGroups(10)).resolves.toEqual([group]);
    await expect(client.replaceHttpLbGroup(10, 1, input)).resolves.toEqual(group);
    await expect(client.deleteHttpLbGroup(10, 1)).resolves.toBeUndefined();

    expect(calls[0]).toMatchObject({ method: "POST", path: "/http-loadbalancers/10/groups" });
    expect(calls[1]).toMatchObject({ method: "GET", path: "/http-loadbalancers/10/groups/1" });
    expect(calls[2]).toMatchObject({ method: "GET", path: "/http-loadbalancers/10/groups" });
    expect(calls[3]).toMatchObject({ method: "PUT", path: "/http-loadbalancers/10/groups/1" });
    expect(calls[4]).toMatchObject({ method: "DELETE", path: "/http-loadbalancers/10/groups/1" });
  });

  it("treats deleting an already absent group as success", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 404, message: "not found", data: null }, 404)
    });
    await expect(client.deleteHttpLbGroup(10, 99)).resolves.toBeUndefined();
  });
});

describe("VPC nameservers", () => {
  it("reads nameservers embedded in the VPC object", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () =>
        jsonResponse({
          code: 200,
          data: { id: 1, label: "vpc-1", status: "Running", dhcp: { nameservers: { ipv4: ["203.0.113.53"], ipv6: ["2001:db8::53"] } } }
        })
    });
    await expect(client.getVpcNameservers(1)).resolves.toEqual({
      ipv4: [{ server: "203.0.113.53" }],
      ipv6: [{ server: "2001:db8::53" }]
    });
  });

  it("returns empty nameserver lists when the VPC has no DHCP block", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { id: 1, label: "vpc-1", status: "Running" } })
    });
    await expect(client.getVpcNameservers(1)).resolves.toEqual({ ipv4: [], ipv6: [] });
  });

  it("replaces nameservers with a flat list", async () => {
    let sawBody = "";
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async (url, init) => {
        sawBody = init.body ?? "";
        return jsonResponse({ code: 200, data: { nameservers: [{ server: "192.0.2.53" }] } });
      }
    });
    const result = await client.replaceVpcNameservers(1, { nameservers: [{ server: "192.0.2.53" }] });
    expect(result).toEqual({ nameservers: [{ server: "192.0.2.53" }] });
    expect(JSON.parse(sawBody)).toEqual({ nameservers: [{ server: "192.0.2.53" }] });
  });

  it("returns an empty list when replace responds with no body", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => textResponse("", 204)
    });
    await expect(client.replaceVpcNameservers(1, { nameservers: [] })).resolves.toEqual({ nameservers: [] });
  });

  it("updates nameservers split by IP version", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () => jsonResponse({ code: 200, data: { ipv4: [{ server: "192.0.2.53" }], ipv6: [] } })
    });
    const result = await client.updateVpcNameservers(1, { ipv4: [{ server: "192.0.2.53" }], ipv6: [] });
    expect(result).toEqual({ ipv4: [{ server: "192.0.2.53" }], ipv6: [] });
  });
});

describe("account limits", () => {
  it("gets account limits keyed by resource type", async () => {
    const client = new V3Client({
      apiKey: "test-key",
      baseUrl: "https://api.test",
      transport: async () =>
        jsonResponse({
          code: 200,
          data: { vm: { used: 3, max: 10, allowedPlans: ["standard"] }, dedicated: { used: 0, max: 2, allowedPlans: [] } }
        })
    });
    const limits = await client.getAccountLimits();
    expect(limits).toEqual({
      vm: { used: 3, max: 10, allowedPlans: ["standard"] },
      dedicated: { used: 0, max: 2, allowedPlans: [] }
    });
  });
});
