# Offline Data API

Prepare and retrieve versioned offline archives of an Expo floor plan for mobile/offline use.

- **Base URL:** `https://app.expofp.com`
- **Format:** JSON over HTTPS
- **Authentication:** Not required (public).

## How it works

An offline archive is a versioned ZIP of an Expo floor plan. Each Expo has a single state that describes the latest archive and its build progress.

- **`version`** — the latest successfully built archive version.
- **`versionActual`** — an ever-incrementing counter. When it moves ahead of `version` (e.g. the map is saved or a booth is reserved), a new archive needs to be built.

Typical flow:

1. Call **get-or-create** to fetch the latest state and start (or continue) a build if `versionActual` is ahead of `version`.
2. Poll until the archive is current — `status` is `2` (Completed) and `version` equals `versionActual` — then download `fileUrl`.

Responses are cached server-side for about 120 seconds, so poll at roughly that interval — polling faster just returns the same cached state.

## Endpoints

### Get or create

```
GET /api/v2/expo-offline/{expoKey}/get-or-create/latest
```

Returns the latest state. If no build exists or is running, starts one and returns the `InProgress` state.

```bash
curl -s "https://app.expofp.com/api/v2/expo-offline/demo/get-or-create/latest"
```

### Get

```
GET /api/v2/expo-offline/{expoKey}/get/latest
```

Returns the latest known state. Never starts a build; may return `null` if nothing has been built yet.

```bash
curl -s "https://app.expofp.com/api/v2/expo-offline/demo/get/latest"
```

### Increment actual version

```
GET /api/v2/expo-offline/{expoKey}/version-actual-increment
```

Bumps `versionActual`, signalling that a new archive should be built on the next **get-or-create**. Returns `200 OK` with no body.

```bash
curl -s "https://app.expofp.com/api/v2/expo-offline/demo/version-actual-increment"
```

## State object

| Field                 | Type                     | Description                                                       |
| --------------------- | ------------------------ | ----------------------------------------------------------------- |
| `expoId`              | `int`                    | Expo identifier.                                                  |
| `expoKey`             | `string`                 | Expo key (path segment).                                          |
| `startDate`           | `string (ISO 8601, UTC)` | Start time of the current/last build.                             |
| `finishDate`          | `string (ISO 8601, UTC)` | Finish time of the current/last build.                            |
| `version`             | `int`                    | Last successfully completed archive version.                      |
| `versionActual`       | `int`                    | Current actual version counter.                                   |
| `fileName`            | `string`                 | Archive filename, pattern `{expoKey}_{version}.zip` (cache key).  |
| `fileHash`            | `string`                 | S3 object eTag/hash of the archive.                               |
| `fileUrl`             | `string`                 | Direct URL to the ZIP archive.                                    |
| `jobId`               | `string`                 | Background job handling the build.                                |
| `status`              | `int`                    | `0=None`, `1=InProgress`, `2=Completed`.                          |
| `statusStr`           | `string`                 | Human-readable status.                                            |
| `executorState`       | `string`                 | Runtime state of the current build.                               |
| `executorProgress`    | `string`                 | Latest progress message of the current build.                     |
| `executorErrorMessage`| `string`                 | Error message if the current build failed.                        |
| `lockStartDate`       | `string (ISO 8601, UTC)` | When the current build lock was acquired.                         |
| `lockDuration`        | `int`                    | Build lock duration, in seconds.                                  |
| `error`               | `string`                 | Request-level error detail; `null` on success.                    |
| `retryAfter`          | `int`                    | Suggested seconds to wait before polling again.                   |

**Example**

```json
{
  "expoId": 23207,
  "expoKey": "demo",
  "startDate": "2026-02-07T19:43:24.983039Z",
  "finishDate": "2026-02-07T19:44:12.957037Z",
  "versionActual": 23,
  "version": 18,
  "fileName": "demo_18.zip",
  "fileHash": "64e518a791b2f30fee0206d9d8920766",
  "fileUrl": "https://demo.expofp.com/data/offline/data_18.zip",
  "jobId": "375226",
  "status": 2,
  "statusStr": "Completed",
  "executorState": "Running",
  "executorProgress": "DownloadAllFiles file downloaded. FileCount = 26/58",
  "executorErrorMessage": null,
  "lockStartDate": "2026-02-07T19:43:24.983039Z",
  "lockDuration": 60,
  "error": null,
  "retryAfter": 120
}
```

## Caching

Use `fileName` (`{expoKey}_{version}.zip`) as a stable cache key on devices. When `version` advances, `fileName` changes, so the cache invalidates naturally.

## Change history

### 2026-06-09

- **Removed** `POST /{expoKey}/reset-state`. Use `version-actual-increment` to force a rebuild instead.
- **Removed** the `waitseconds` query parameter (server-side polling). Poll **get** from the client.
- **Changed** the public `get-or-create` and `get` endpoints to always return the **latest** version.
