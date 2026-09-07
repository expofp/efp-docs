# Online, Offline, Preload and Caching

Four words come up in almost every mobile integration conversation, and they are
routinely used as if they were four names for the same feature. They are not.
This page defines each one, shows how they combine, and states what you get and
what you give up in each case.

Everything here applies to the ExpoFP mobile SDK v5 on **iOS**, **Android** and
**React Native**. The API names differ per platform; the model is identical.

## The short version

| Term | What it actually is | Lives where | Survives app restart? | Survives no network? |
| --- | --- | --- | --- | --- |
| **Online** | The plan is loaded from `https://<expoKey>.expofp.com` when the view opens | Nowhere — it is fetched each time | n/a | No |
| **Offline** | A versioned ZIP snapshot of the plan, fetched ahead of time and served from local files | App cache directory on the device | Yes, until removed or reclaimed | Yes |
| **Preload** | A live, already-loaded plan instance kept in memory so the next screen opens instantly | Process memory | No — dies with the process | Only if it finished loading earlier |
| **Caching** | Side effects of HTTP and storage layers that you do not control | Various | Unreliable | **No** |

The single sentence that resolves most of the confusion:

> **Online / offline** answers *where the plan comes from*.
> **Preload** answers *when it was loaded*.
> They are independent choices. **Caching is not a choice at all** — it is
> something that happens to you, and you must never design against it.

## Two independent axes

Because the source and the timing are independent, there are four real
combinations, and all four are supported:

|  | **Not preloaded** | **Preloaded** |
| --- | --- | --- |
| **Online** (`expoKey`) | Simplest. Always current. Needs the network at the moment the screen opens. | Opens instantly. Still needed the network *at preload time*, and still needs it for anything fetched later. |
| **Offline** (downloaded plan) | Opens with no network. Content is frozen at the archive version. | Opens instantly and with no network. The recommended setup for an on-site event app. |

::: warning Preload is not offline support
Preloading an **online** plan does not make it work offline. The preloaded
instance is a WebView that already fetched `https://<expoKey>.expofp.com`; if it
never got the chance to fetch it, or if it later needs anything else from the
network, it fails exactly as a fresh online plan would. Offline capability comes
from downloading an archive, and from nothing else.

The nuance worth keeping: a plan that *finished* preloading while the network was
up does keep working after the signal drops — but only that instance, and only
until the process dies. That is a nice bonus, not a design you can ship.
:::

## Online

The default. You give the SDK an expo key, and it loads
`https://<expoKey>.expofp.com`, appending any plan parameters you set as query
items.

::: code-group

```tsx [React Native]
<ExpofpView expoKey="demo" style={{ flex: 1 }} />
```

```kotlin [Android]
val presenter = ExpoFpPlan.createPlanPresenter(
    planLink = ExpoFpLinkType.ExpoKey("demo")
)
```

```swift [iOS]
let presenter = ExpoFpPlan.createPlanPresenter(with: .expoKey("demo"))
```

:::

**Use it when** connectivity is reliable, or when being current matters more than
being resilient — a pre-event browsing screen, a sales portal, a web-like
directory.

**What you get:** whatever the organizer published a moment ago. No storage to
manage, no version to track, no cleanup code.

**What you give up:** with no network the plan does not load at all — the status
callback reports an error and the view shows the WebView's failure page. A bad
venue Wi-Fi network is the normal case at an event, not the exceptional one.

## Offline

An offline plan is a **versioned ZIP archive** of the whole plan — its HTML, its
assets and its data — that you fetch ahead of time and that the SDK then serves
from local files. The plan's own JavaScript cannot tell the difference: it sees
the same absolute paths it would see online.

Archives are named `<expoKey>_<version>.zip`, and `version` is the identity of
the snapshot. `demo_18` and `demo_23` are two different, independently stored
plans.

### Downloading one

::: code-group

```ts [React Native]
const info = await ExpofpViewModule.downloadPlan("demo");
// then, on the view:
// <ExpofpView downloadedExpoKey="demo" style={{ flex: 1 }} />
```

```kotlin [Android]
val result = ExpoFpPlan.downloader.downloadPlan("demo")
val downloadedPlanInfo = result.getOrNull()

val presenter = ExpoFpPlan.createPlanPresenter(
    planLink = ExpoFpLinkType.DownloadedPlanInfo(downloadedPlanInfo)
)
```

```swift [iOS]
let result = await ExpoFpPlan.downloader.downloadPlan(withExpoKey: "demo")
let downloadedPlanInfo = try result.get()

let presenter = ExpoFpPlan.createPlanPresenter(
    with: .downloadedPlanInfo(downloadedPlanInfo)
)
```

:::

Under the hood, `downloadPlan` calls the public
[Offline Data API](/guide/offline-api): it asks
`GET /api/v2/expo-offline/{expoKey}/get-or-create/latest` for the current state,
waits for a build if one is needed, and then downloads the archive named in
`fileUrl`. If the device already holds that exact `expoKey` + `version`, nothing
is re-downloaded.

::: tip The first download of a never-built archive is slow
`get-or-create` *starts* a build if the latest archive is out of date, and the
SDK polls until it completes — up to roughly four minutes. Trigger the download
well before the user needs the plan, not while they are staring at a spinner.
Subsequent downloads of an already-built archive are a plain file transfer.
:::

### Shipping an archive inside your app

You can also bundle an archive in the app and unpack it at first run, so the very
first launch works offline with no download at all. The file must keep the
`<expoKey>_<version>.zip` name — that is how the SDK identifies it.

::: code-group

```ts [React Native]
// android/app/src/main/assets/demo_18.zip  ·  iOS: added to the app bundle
await ExpofpViewModule.unzipPlan("demo_18");
```

```kotlin [Android]
val result = ExpoFpPlan.downloader.downloadPlanFromZip(zipFile.absolutePath)
```

```swift [iOS]
let path = Bundle.main.path(forResource: "demo_18", ofType: "zip")!
let result = await ExpoFpPlan.downloader.downloadPlan(withZipFilePath: path)
```

:::

### Where archives live, and why that matters

Archives are unpacked into your app's **cache directory** —
`Library/Caches/expoFpPlan/` on iOS (excluded from iCloud backup),
`cacheDir/expoFpPlan/archives/` on Android.

That is a deliberate choice: it keeps plans out of the user's backup and lets the
system reclaim the space instead of the app being killed for using too much of
it. The consequence is the part integrators miss:

::: warning A downloaded plan is durable, not permanent
Both platforms may clear cache directories when the device runs low on storage.
An archive that was there yesterday may be gone — or partially gone — today.
Check `getDownloadedPlansInfo` before you rely on a plan being present, and keep
an online path as a fallback.
:::

The number of downloaded plans is not limited by the SDK. Removing them is your
responsibility:

::: code-group

```ts [React Native]
const plans = await ExpofpViewModule.getDownloadedPlansInfo("demo");
ExpofpViewModule.removeOldVersionsOfDownloadedPlans("demo");
```

```kotlin [Android]
val plans = ExpoFpPlan.downloader.getDownloadedPlansInfo("demo")
ExpoFpPlan.downloader.removeOldVersionsOfDownloadedPlans("demo")
```

```swift [iOS]
let plans = await ExpoFpPlan.downloader.getDownloadedPlansInfo(withExpoKey: "demo")
await ExpoFpPlan.downloader.removeOldVersionsOfDownloadedPlans(withExpoKey: "demo")
```

:::

### Keeping a downloaded plan fresh

An archive is a snapshot. Booths reserved, exhibitors edited or sessions added
after the build are simply not in it. Refreshing is a loop you own:

1. Call `downloadPlan(expoKey)` again — on a schedule, on app start, or on a
   pull-to-refresh. It is a no-op if the newest archive is already on the device.
2. Point the view at the new version.
3. Call `removeOldVersionsOfDownloadedPlans(expoKey)` to reclaim the space.

If you need to see the version without downloading anything, read it from the
Offline Data API directly: `version` is the newest built archive, and
`versionActual` running ahead of it means a newer one is pending. Poll the API no
faster than about every two minutes — responses are cached server-side for
roughly that long, so a faster loop just re-reads the same answer.

## Preload

Preloading creates the plan **now** and keeps the live instance in memory, so
that when the screen finally opens, the map is already there. Nothing is written
to disk.

::: code-group

```ts [React Native]
const id = await ExpofpViewModule.preloadPlan({ expoKey: "demo" });
// later, on the view:
// <ExpofpView preloadedPlanId={id} style={{ flex: 1 }} />
```

```kotlin [Android]
val info = ExpoFpPlan.preloader.preloadPlan(
    planLink = ExpoFpLinkType.ExpoKey("demo")
)
val presenter = ExpoFpPlan.preloader.getPreloadedPlanPresenter(info)
```

```swift [iOS]
let info = ExpoFpPlan.preloader.preloadPlan(with: .expoKey("demo"))
let presenter = ExpoFpPlan.preloader.getPreloadedPlanPresenter(with: info)
```

:::

The link you preload can be either kind, and this is the important part:

::: code-group

```ts [React Native]
// Preload an online plan — needs the network right now.
await ExpofpViewModule.preloadPlan({ expoKey: "demo" });

// Preload a downloaded plan — needs nothing but the archive on disk.
await ExpofpViewModule.preloadPlan({ downloadedExpoKey: "demo" });
```

```kotlin [Android]
// Preload an online plan — needs the network right now.
ExpoFpPlan.preloader.preloadPlan(planLink = ExpoFpLinkType.ExpoKey("demo"))

// Preload a downloaded plan — needs nothing but the archive on disk.
ExpoFpPlan.preloader.preloadPlan(
    planLink = ExpoFpLinkType.DownloadedPlanInfo(downloadedPlanInfo)
)
```

```swift [iOS]
// Preload an online plan — needs the network right now.
ExpoFpPlan.preloader.preloadPlan(with: .expoKey("demo"))

// Preload a downloaded plan — needs nothing but the archive on disk.
ExpoFpPlan.preloader.preloadPlan(with: .downloadedPlanInfo(downloadedPlanInfo))
```

:::

Things to know about preloaded plans:

- **They are not disposed for you.** A preloaded plan survives the Activity,
  Fragment or screen that created it, on purpose, so you can reuse it. You must
  call `disposePreloadedPlan` / `removeAllPreloadedPlans` when you are done, or
  it holds its memory for the life of the process.
- **They do not survive the process.** Kill the app and every preloaded plan is
  gone. Preload again on the next launch.
- **One instance renders on one screen at a time.** A preloaded plan is a single
  rendering engine; attaching it to a second screen moves it there.
- **They cost memory.** Each one is a live WebView. Preload the two or three
  plans a user is about to open, not the whole catalogue.

**Use it when** the delay of opening a map is the problem you are solving — a
tab bar where the map tab must be instant, a list of halls the user pages
through, a splash screen you want to spend usefully.

## Caching

"Caching" is the word that causes the most damage, because it names three
unrelated mechanisms, none of which is a feature you can rely on.

**1. The WebView's HTTP cache.** An online plan is a web page, and the platform
WebView caches its responses under ordinary HTTP rules. This is why a second
open sometimes feels faster, and why it *occasionally* half-works on a flaky
network. It is sized, expired and evicted by the operating system. It is not a
guarantee and it is not addressable from the SDK.

**2. The SDK's archive store.** The unpacked downloaded plans described above.
This one is real and addressable — but it lives in a cache directory, so the OS
may still reclaim it (see the warning above).

**3. The Offline Data API's server-side cache.** `get-or-create` and `get`
responses are cached for about 120 seconds. This affects how fast you learn that
a new version exists; it has nothing to do with what is on the device.

::: danger Never plan for "it will be cached"
If an attendee must be able to open the map inside a hall with no signal, the
only supported answer is a downloaded archive. Designing around the HTTP cache
produces an app that works on every developer's desk and fails on the show floor.
:::

## What works in each mode

| Capability | Online | Offline (downloaded) |
| --- | --- | --- |
| Render the plan, switch floors, zoom, 2D/3D | ✅ | ✅ |
| Booth, exhibitor and category lists; search | ✅ | ✅ *(as of the archive version)* |
| Wayfinding, routes, optimized routes | ✅ | ✅ |
| Bookmarks, highlighting, selection, all view commands | ✅ | ✅ |
| Plan events (`onBoothClick`, `onFloorActivated`, …) | ✅ | ✅ |
| Blue dot / positioning | provider-dependent | provider-dependent |
| Content edited after the archive was built | ✅ | ❌ until a newer archive is downloaded |
| Links out of the plan (exhibitor website, custom buttons) | ✅ | ❌ — these open the system browser |
| Opens with no network at all | ❌ | ✅ |
| Requires a prior `downloadPlan` / bundled archive | ❌ | ✅ |
| Requires storage on the device | ❌ | ✅ |

A note on the blue dot: it does not come from the plan. Positions are pushed into
the plan by the location provider you install, and whether that provider works
without a network is a property of the provider, not of the plan — check its own
documentation. A location provider failing never blocks the plan: the map keeps
loading and stays usable, just without a blue dot.

## Choosing

| Situation | Use |
| --- | --- |
| Pre-event browsing, sales portal, marketing site | **Online** |
| On-site attendee app, venue with unreliable Wi-Fi | **Offline**, refreshed on app start |
| Map tab that must open instantly | **Preload**, on top of whichever source you chose |
| Kiosk or signage on a wired network | **Online**, or **offline** if the network is the thing that fails |
| Demo or trade-show device with no SIM | **Offline** from a **bundled archive** |
| Multi-day event where content changes nightly | **Offline** + a daily `downloadPlan` refresh |

## Recipe: offline first, online fallback

The setup most event apps actually want. Note that the fallback is *your* code —
the SDK does not chain sources for you, and passing both keys does not create a
chain.

```tsx
import { useEffect, useState } from "react";
import { ExpofpView, ExpofpViewModule } from "@expofp/react-native-efp-sdk";

const EXPO_KEY = "demo";

export function PlanScreen() {
  const [source, setSource] = useState<
    { downloadedExpoKey: string } | { expoKey: string } | null
  >(null);

  useEffect(() => {
    (async () => {
      // 1. Drop versions left over from previous runs, while nothing is on screen.
      ExpofpViewModule.removeOldVersionsOfDownloadedPlans(EXPO_KEY);

      // 2. Is a copy already on the device? Open it immediately, network or not.
      const local = await ExpofpViewModule.getDownloadedPlansInfo(EXPO_KEY);
      setSource(
        local.length > 0 ? { downloadedExpoKey: EXPO_KEY } : { expoKey: EXPO_KEY },
      );

      // 3. Refresh in the background. A no-op when the newest archive is present.
      try {
        await ExpofpViewModule.downloadPlan(EXPO_KEY);
        setSource({ downloadedExpoKey: EXPO_KEY }); // resolves to the newest version
      } catch {
        // Offline, or the build is still running. Step 2's choice stands.
      }
    })();
  }, []);

  if (!source) return null;
  return <ExpofpView {...source} style={{ flex: 1 }} />;
}
```

Note the order: superseded versions are removed at start-up, not right after the
refresh. Deleting the files of an archive that is currently on screen is asking
for trouble; leaving one extra version on disk until the next launch is not.

The same steps apply on native: `getDownloadedPlansInfo` to decide,
`downloadPlan` to refresh, `removeOldVersionsOfDownloadedPlans` to clean up. Add
`preloadPlan` on top if the screen must also open instantly.

## Common misconceptions

**"Preload means it works offline."**
No. Preload replays whatever link you gave it. Preloading an expo key needs the
network at preload time, and the instance is gone when the process dies. Only a
downloaded archive gives you offline capability.

**"The plan is cached after the first open, so the second one works offline."**
No. That is the WebView's HTTP cache — opportunistic, evictable, and outside your
control. It will work in testing and fail at the venue.

**"Once downloaded, the plan is up to date."**
No. An archive is frozen at its version. Re-run `downloadPlan` to pick up a newer
one.

**"Offline is a flag on the view."**
No. There is no `offline: true`. You pass a *different kind of link* — an expo key
for online, a downloaded plan for offline.

**"`downloadPlan` downloads the plan for a particular view."**
No. It writes into app-wide storage keyed by expo key and version. Any view, any
screen, can then open it.

**"Setting both `expoKey` and `downloadedExpoKey` gives me an automatic
fallback."**
No — and this one bites people. When both are set, `expoKey` wins and you get the
online plan. Choose one, and implement the fallback yourself: check
`getDownloadedPlansInfo` first, and pass `downloadedExpoKey` when there is a copy
on the device.

**"A downloaded plan stays on the device until I delete it."**
Usually, but not guaranteed. Archives live in a cache directory the system may
reclaim under storage pressure. Verify before you depend on it.

## Diagnosing a failure

The plan reports its state through the plan status callback —
`onPlanStatus` in React Native, `planStatusFlow` on Android,
`planStatusPublisher` on iOS — as *Initialization*, *Loading(percentage)*,
*Ready* or *Error*. The error usually tells you which of the four concepts went
wrong:

| What you see | What it usually means |
| --- | --- |
| `PlanLoadingError` with `ERR_NAME_NOT_RESOLVED` or a similar network error | An **online** plan with no network. Preloading it will not help; download it instead. |
| `InvalidPlanLink(DownloadedPlanInfo(...))` | You asked for a **downloaded** plan that is not (or is no longer) on the device. Download it, or fall back to online. |
| `InvalidZipFilePath` | A bundled archive is not named `<expoKey>_<version>.zip`, or the path is wrong. |
| `PlanInfoRequestTimeout` | The Offline Data API did not finish building an archive in time. Retry later; the build continues server-side. |
| `DownloadingPlanError` | The archive could not be fetched or unpacked — network, disk space, or a partially cleared cache. |
| A location-provider error, plan still `Ready` | Expected. Positioning is independent of plan loading. |

## See also

- [Offline Data API](/guide/offline-api) — the endpoints behind `downloadPlan`,
  for building your own refresh logic
- [iOS SDK reference](https://expofp.github.io/expofp-sdk-ios/documentation/expofp/)
- [Android SDK reference](https://expofp.github.io/expofp-fplan-android/)
- [React Native SDK reference](https://expofp.github.io/react-native-efp-sdk/)
