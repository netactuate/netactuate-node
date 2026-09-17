import { describe, expect, it } from "vitest";
import {
  Client,
  NetActuateContractError,
  NetActuateNotFoundError,
  V3Client,
  decodeDnsRecord,
  decodeDnsZone,
  decodeNkeCluster,
  decodeServer,
  decodeStorageBucket,
  decodeVpc,
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
  });

  it("decodes NKE clusters from flat and nested shapes", () => {
    expect(decodeNkeCluster({ clusterId: 20, name: "flat" }).clusterId).toBe(20);
    expect(decodeNkeCluster({ clusterId: 21, metadata: { name: "nested" } }).name).toBe("nested");
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
