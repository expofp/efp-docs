# Expo Offline Data API

Prepare and retrieve versioned offline archives of an Expo floor plan (“**ExpoFloorPlan**”) for mobile/offline usage.

* **Base URL:** `https://app.expofp.com`
* **Format:** JSON over HTTPS
* **Authentication:** Not required (public) unless restricted by ExpoFP environment policies.

---

## Overview

This API exposes the **ExpoOfflineData** lifecycle:

* **ExpoOfflineData** — a versioned ZIP archive of an Expo floor plan, stored on S3/CloudFront.
* **ExpoOfflineState** — the status and metadata describing the creation and availability of a given archive version.

### High-level flow

1. A client calls **Get-or-Create** to retrieve the latest (or a specific) offline archive **state**.

   * If the archive exists, the API returns its **ExpoOfflineState** with a direct `fileUrl`.
   * If it does not exist yet, the API **starts** an asynchronous creation job and returns the **running** state.
2. Clients may **poll** (client-side or via server-side polling using `waitseconds`) until the state becomes `Completed`.
3. A **Reset State** endpoint is available to explicitly reset the state for an Expo (without bumping version numbers).

---

## Key Concepts

* **version** (`int`) — the latest **successfully built** archive version.
* **versionActual** (`int`) — an **ever-incrementing counter** reflecting any change that requires a new archive (e.g., map saved, booth reserved/purchased, explicit reset, app restart re-queues any `InProgress` states).
* **Versioning starts at 0**. Until the first `get-or-create` call, nothing is persisted.

When `versionActual` increments, the server **may** start building a new archive if needed. Upon completion, versions are re-checked and another build may be queued if the actual version advanced during the build.

---

## Data Model

### `ExpoOfflineState` (object)

| Field              | Type                     | Description                                                                                  |
| ------------------ | ------------------------ | -------------------------------------------------------------------------------------------- |
| `expoId`           | `int`                    | Expo identifier.                                                                             |
| `expoKey`          | `string`                 | Human-readable expo key (path segment).                                                      |
| `startDate`        | `string (ISO 8601, UTC)` | Start timestamp of the current/last archive build for this version.                          |
| `finishDate`       | `string (ISO 8601, UTC)` | Finish timestamp of the current/last archive build for this version.                         |
| `version`          | `int`                    | **Last successfully completed** archive version.                                             |
| `versionActual`    | `int`                    | Current **actual** version counter (increments on relevant changes).                         |
| `fileName`         | `string`                 | Archive filename used by **mobile clients for caching**, pattern: `{expoKey}_{version}.zip`. |
| `fileHash`         | `string`                 | S3 object eTag/hash of the archive.                                                          |
| `fileUrl`          | `string`                 | Direct URL to the archive (S3 in dev, CloudFront in prod).                                   |
| `jobId`            | `string`                 | Background job identifier handling the build.                                                |
| `status`           | `int`                    | Numeric status: `0=None`, `1=InProgress`, `2=Completed`.                                     |
| `statusStr`        | `string`                 | Human-readable status string.                                                                |
| `executorState`    | `string`                 | Runtime execution state detail for the current build.                                        |
| `executorProgress` | `string`                 | Last notable progress message for the current build.                                         |

**Field freshness notes**

* `versionActual` always reflects the current **actual** value.
* `executorState` and `executorProgress` reflect the **current** building process (if any).
* All other fields default to the **latest known result**.

**Example**

```json
{
  "expoId": 23207,
  "expoKey": "sltest2",
  "startDate": "2025-02-07T19:43:24.983039Z",
  "finishDate": "2025-02-07T19:44:12.957037Z",
  "versionActual": 23,
  "version": 18,
  "fileName": "sltest2_18.zip",
  "fileHash": "64e518a791b2f30fee0206d9d8920766",
  "fileUrl": "https://efp-data-dev.s3.amazonaws.com/expos/sltest2/data/offline/data_18.zip",
  "jobId": "375226",
  "status": 2,
  "statusStr": "Completed",
  "executorState": "Running",
  "executorProgress": "DownloadAllFiles file downloaded. FileCount = 26/58, FileKey = expos/sltest2/data/exhibitors/5482682/media/7-robotics_3vl2lfvr__tiny.webp"
}
```

### Status Enum

* `0` = `None` — no build is active and no completed archive is available for the requested version.
* `1` = `InProgress` — the archive build is currently running.
* `2` = `Completed` — the archive build finished successfully; `fileUrl` points to the ZIP.

---

## Endpoints

### 1) Get or Create Offline Archive State

Retrieve the offline archive state for a specific **version**. If the archive does not exist and the requested version is **latest**, the server **starts** the creation process and returns the state.

```
GET /api/v2/expo-offline/{expoKey}/get-or-create/{version}?waitseconds={int}
```

* **Path params**

  * `expoKey` — the expo key slug (e.g., `sltest2`).
  * `version` — one of:

    * An integer (e.g., `0`, `18`)
    * `"latest"` or `"l"`
* **Query params**

  * `waitseconds` *(optional, int)* — enables **server-side polling** for up to N seconds.
    The request will block and poll the current build until either:

    * the build completes, or
    * the specified time elapses.
      In both cases the endpoint returns the **current** `ExpoOfflineState`.

**Behavior**

* If `version` is **less than** the latest completed version:

  * The server **looks up** `state_{version}.json` on S3.
  * Returns that state if found; otherwise returns `null`.
* If `version` is **equal to** the latest (or is `"latest"` / `"l"`):

  * If a build is already running, returns its **current state**.
  * If no build is running, **starts the build** and returns the new **InProgress** state.
* **First call** to bootstrap persistence should be with `0` or `"latest"` / `"l"`.

**Responses**

* `200 OK` with `ExpoOfflineState` or `null`.

**Examples**

```bash
curl -s \
  "https://app.expofp.com/api/v2/expo-offline/sltest2/get-or-create/latest"
```

```bash
# Block up to 10 seconds waiting for completion progress (server-side polling)
curl -s \
  "https://app.expofp.com/api/v2/expo-offline/sltest2/get-or-create/l?waitseconds=10"
```

```bash
# Request an old, specific version (returns null if never built)
curl -s \
  "https://app.expofp.com/api/v2/expo-offline/sltest2/get-or-create/5"
```

---

### 2) Get Offline Archive State (No Create)

Lightweight retrieval that **never** starts a build.

```
GET /api/v2/expo-offline/{expoKey}/get/{version}
```

* **Path params**

  * `expoKey` — the expo key.
  * `version` — integer or `"latest"` / `"l"`.

**Behavior**

* Returns the current known `ExpoOfflineState` for the specified version **if available**.
* If the archive/state does not exist yet, **does not** start a build and may return `null`.

**Responses**

* `200 OK` with `ExpoOfflineState` or `null`.

**Examples**

```bash
curl -s \
  "https://app.expofp.com/api/v2/expo-offline/sltest2/get/latest"
```

```bash
curl -s \
  "https://app.expofp.com/api/v2/expo-offline/sltest2/get/18"
```

---

### 3) Reset State

Explicitly reset the Expo’s offline state (without incrementing versions).

```
POST /api/v2/expo-offline/{expoKey}/reset-state
```

* **Path params**

  * `expoKey` — the expo key.

**Responses**

* `204 No Content` — on success.
* No response body.

**Example**

```bash
curl -X POST -s -o /dev/null -w "%{http_code}\n" \
  "https://app.expofp.com/api/v2/expo-offline/sltest2/reset-state"
```

---

## Client Guidance & Caching

* Use `fileName` (`{expoKey}_{version}.zip`) as a **stable cache key** on devices.
  When `version` advances, the `fileName` changes, allowing straightforward cache invalidation.
* Prefer requesting `"latest"` (or `"l"`) to ensure you track the most current archive lifecycle.
* For tighter UX during creation, use `waitseconds` to reduce polling loops from the client.

---

## Error Handling

Archive build errors **do not** block the overall flow:

* On build error, the system **resets** to the prior state **without** incrementing `version` (unless versions changed due to other reasons like a map update).
* Error metadata is uploaded to S3 adjacent to other states (with a crash date suffix) and logged:

  * Progress messages (`executorProgress`) will include error info.
  * Detailed logs and metrics are available (e.g., Grafana).
* Since some errors may be intermittent, clients can safely re-invoke **Get-or-Create** to retry the build.

**Typical HTTP statuses**

* `200 OK` — successful state fetch (possibly `null`).
* `204 No Content` — successful reset.
* `4xx/5xx` — transport or unexpected server errors (rare; build errors are surfaced via state/progress rather than HTTP errors).

---

## Versioning Rules (Server-side)

* `versionActual` increments when:

  * The map is changed and saved.
  * A booth is bought/reserved.
  * The reset API is called explicitly.
  * The application restarts (all `InProgress` states are re-queued).
* When `versionActual` increments, the server **may** immediately start a new build if necessary.
* On build completion, if `versionActual` moved ahead during the build, another build **may** be started.

---