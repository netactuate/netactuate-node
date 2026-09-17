# Upgrading from `hostvirtual/hostvirtual-nodejs-sdk`

`@netactuate/sdk` replaces the 2018 `hostvirtual/hostvirtual-nodejs-sdk` generation. The new
client is TypeScript, ships ESM and CommonJS builds, and exposes separate clients for vAPI2 and
vAPI3.

## What to edit

| Old | New |
| --- | --- |
| `hostvirtual/hostvirtual-nodejs-sdk` | `@netactuate/sdk` |
| Old HostVirtual import | `import { Client, V3Client } from "@netactuate/sdk"` |
| Old API endpoint configuration | `Client` for vAPI2 or `V3Client` for vAPI3 |
| Old API key environment, if used | `NETACTUATE_API_KEY` |

## Call mapping

The old Node repository is not present in this checkout, and no local mirror was available to
verify its method names. The old call to new call mapping is therefore not established. Do not
publish a row that claims a one to one method rename until the archived source has been checked.

Use these current calls when migrating code:

| Resource | New call |
| --- | --- |
| Cloud servers | `client.getServers()`, `client.getServer(id)`, `client.createServer(input)`, `client.deleteServer(id)` |
| DNS zones | `client.listZones(type)`, `client.getZone(id)`, `client.createZone(input)`, `client.deleteZone(id)` |
| DNS records | `client.listRecords(zoneId)`, `client.getRecord(id)`, `client.createRecord(input)`, `client.updateRecord(input)`, `client.deleteRecord(id)` |
| VPCs | `v3.listVpcs()`, `v3.getVpc(id)`, `v3.createVpc(input)`, `v3.updateVpc(id, input)`, `v3.deleteVpc(id)` |
| Storage buckets | `v3.listStorageBuckets()`, `v3.getStorageBucket(id)`, `v3.createStorageBucket(input)`, `v3.updateStorageBucket(id, input)`, `v3.deleteStorageBucket(id)` |
| NKE clusters | `v3.listNkeVersions()`, `v3.listNkeClusters()`, `v3.getNkeCluster(id)`, `v3.createNkeCluster(input)`, `v3.updateNkeCluster(id, input)`, `v3.deleteNkeCluster(id)`, `v3.generateNkeKubeconfig(id, expirationSeconds)` |

## Example

```ts
import { Client, V3Client } from "@netactuate/sdk";

const v2 = new Client();
const servers = await v2.getServers();

const v3 = new V3Client();
const vpcs = await v3.listVpcs();
```

The new SDK redacts API keys from error text and raises distinct not found and contract gated
errors.
