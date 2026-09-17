# NetActuate TypeScript SDK

TypeScript client for the NetActuate vAPI2 and vAPI3 APIs. It covers the SDK foundation plus servers, DNS zones and records, VPCs, storage buckets and NKE clusters.

## Install

```sh
npm install @netactuate/sdk
```

## Authenticate

Pass an API key explicitly, or set `NETACTUATE_API_KEY`.

```ts
import { Client, V3Client } from "@netactuate/sdk";

const v2 = new Client();
const v3 = new V3Client();
```

An empty base URL uses production. `Client` talks to vAPI2 at `https://vapi2.netactuate.com/api/`. `V3Client` talks to vAPI3 at `https://vapi3.netactuate.com`.

## vAPI2 and vAPI3

vAPI2 covers cloud servers and DNS in this release:

```ts
const servers = await v2.getServers();
const zone = await v2.createZone({ name: "example.com", type: "NATIVE" });
```

vAPI3 covers VPCs, storage buckets and NKE clusters:

```ts
const vpcs = await v3.listVpcs();
const clusters = await v3.listNkeClusters();
```

Both clients accept a custom transport for tests and integrations that need to intercept requests. The SDK never opens a platform socket in its unit tests.

API documentation is available at https://netactuate.com/docs.
