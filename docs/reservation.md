---
title: Booth Reservation
description: Embed an ExpoFP floor plan as a booth picker. Visitors click free booths, and your page owns the cart, the prices and the checkout.
---

# Booth Reservation

Reservation mode turns a floor plan into a booth picker for your own sales page.
The plan drops its chrome down to the zoom controls and the floor selector.
Booths that the event cannot sell stop responding to clicks. A click on a free
booth adds it to a selection or removes it, and the plan reports that selection
to your page. The list, the prices, the total, the Reserve button and the request
to your back office stay on your page. The SDK never calls a server of yours and
books nothing.

Embed the plan directly. In an `<iframe>` none of the calls below can reach it.

## See it working

<iframe
  class="reservation-demo"
  src="/examples/reservation.html"
  title="ExpoFP floor plan in reservation mode"
  loading="lazy"
></iframe>

<a class="reservation-demo-link" href="/examples/reservation.html" target="_blank">Open the bare plan in a new tab</a>

For the whole flow, open the
<a href="/examples/reservation-demo.html" target="_blank">booth reservation demo</a>:
a selection panel, prices, a total, a Reserve button, and booths that carry the
name of the buyer afterwards. It is one self-contained HTML file with no build
step, and every call on this page appears in it with a comment. The
<a href="/examples/reservation-demo.html?exhibitorId=6149205" target="_blank">same page with <code>?exhibitorId=6149205</code></a>
books as BioCycle Africa, an exhibitor of the demo event, instead of a stand-in
company.

## Before you start

ExpoFP publishes each event at `https://<expoKey>.expofp.com`. The expoKey (the
short name of the event) is the part before the first dot, and `manifest.json`
next to the plan is the first argument of `load()`. Ask the organizer of your
show for the expoKey. The examples here use the public demo event, whose expoKey
is `demo`.

Get the SDK from a CDN, or from npm if you use a bundler. Pin a version, because
a URL with no version always serves the newest release.

```js
import { load } from "https://unpkg.com/@expofp/floorplan@3"; // 3.x, newest patch
```

```bash
npm i @expofp/floorplan
```

The package ships its TypeScript types:

```ts
import type { ReservationBooth, ReservationBoothOwner } from "@expofp/floorplan";
```

## Quick start

This is a complete page. Copy it, change the manifest URL, and open it.

```html
<div id="floorplan"></div>
<ul id="picked"></ul>

<style>
  /* The plan mounts as a full-screen `position: fixed` box by default. Your
     rule must override `position`, not only the size. */
  #floorplan {
    position: relative;
    isolation: isolate;
    width: 100%;
    height: 600px;
  }
</style>

<script type="module">
  import { load } from "https://unpkg.com/@expofp/floorplan@3";

  const fp = await load(
    { $ref: "https://demo.expofp.com/manifest.json" },
    {
      element: document.querySelector("#floorplan"),
      reservation: true,
      // Leave the address bar and the tab title of the host page alone.
      ignoreQuery: true,
      onReservationSelectionChange: e => {
        document.querySelector("#picked").innerHTML = e.booths
          .map(booth => `<li>${booth.name} — ${booth.price}</li>`)
          .join("");
      },
    },
  );

  // `load()` returns before the plan can be used.
  await fp.ready;
</script>
```

The SDK reads `reservation: true` once, at boot. You cannot switch the mode on
and off while the plan runs.

## Four rules for the embed

1. Override `position` on the host element. The SDK styles it `position: fixed`
   and full-screen by default. If you set only `width` and `height`, the plan
   covers your whole page. Add `isolation: isolate` as well, or the controls of
   the plan (`z-index: 30`) paint over your own modals.
2. Pass `ignoreQuery: true`. Without it the SDK owns the page URL. It re-encodes
   your own parameters, so `?exhibitorId=6149205` becomes `?exhibitorId%3D6149205`
   and `URLSearchParams.get()` returns `null`. It also rewrites `document.title`
   with the name of the event. The option stops the SDK from reading the query as
   well, so set everything through options. If you want the deep links of the SDK
   instead, read your own parameters twice, first as written and then from the
   decoded query, the way `pageParam()` does in the demo.
3. Wait for `fp.ready`. `load()` returns before the plan has loaded, and until
   the plan is ready every method throws `FloorPlan not ready`. Inside
   `<script type="module">` that failure is quiet: the module stops, and the page
   looks half-built. `onReservationSelectionChange` is the exception, because it
   is an option and starts to fire on its own.
4. Call `destroy()` when your view closes. A plan holds a canvas, timers and
   listeners, so every remount of a component leaves another live plan behind.
   `destroy()` empties the host element. To show the plan again, call `load()`
   again with the same element.

```js
useEffect(() => {
  let plan;
  const options = { element: hostRef.current, reservation: true, ignoreQuery: true };
  load(manifest, options).then(fp => (plan = fp), console.error);

  return () => plan?.destroy();
}, []);
```

If your page sends a Content Security Policy, the plan needs these sources. The
SDK fetches the data of the event and evaluates it as JavaScript, which is why it
needs `'unsafe-eval'`. Replace `https://unpkg.com` with your own origin when you
bundle the package from npm. Drop the `cartocdn.com` entries for an event that
does not render on a map background.

```
default-src 'self';
script-src  'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com;
style-src   'self' 'unsafe-inline' https://unpkg.com;
font-src    'self' data: https://unpkg.com;
img-src     'self' data: blob: https://unpkg.com https://*.expofp.com https://*.cartocdn.com;
connect-src 'self' https://*.expofp.com https://*.cartocdn.com;
worker-src  blob:;
```

A policy without them fails in a way that hides its cause. The plan reports
`NetworkError` or `Failed to fetch` from the loader, because the browser blocks
the request for `manifest.json` before it leaves the page.

## Read the selection

`onReservationSelectionChange` fires when the visitor clicks a booth, when you
call `setReservationSelection()` or `clearReservationSelection()`, and when a
booth leaves the selection because it stopped being bookable. A call that changes
nothing stays quiet. Every event carries the whole selection, in the order in
which the visitor clicked. `fp.getReservationSelection()` returns the same array
on demand, for the moment the visitor submits.

```ts
interface ReservationBooth {
  name: string;
  externalId: string;
  type: string;
  size: string;
  price: string;
  layer: { name: string; description: string };
}
```

| Field        | What it holds                                                             |
| ------------ | ------------------------------------------------------------------------- |
| `name`       | The booth number as printed on the plan. Every booth has one.             |
| `externalId` | The identifier of the organizer, or `''` when the organizer set none.     |
| `type`       | The text the organizer wrote, for example `'STANDARD'`.                   |
| `size`       | The text the organizer wrote, for example `'9 x 11 / 99 m²'`. Often `''`. |
| `price`      | The text the organizer wrote, for example `'$9,900'`.                     |
| `layer`      | The floor that the booth is on.                                           |

Address a booth by `name` or by `externalId`. The internal numeric booth id never
leaves the SDK, and it is not stable between loads.

The SDK parses no prices, because only your page knows the currency and the
separators. `'0'` and `''` both mean that the event publishes no price, and many
booths have none: on the demo event, 44 of the 82 free booths are quoted on
request. Add up what you can parse, and name the rest instead of hiding the
total.

```js
/** The price of a booth as a number, or null when the plan publishes none. */
function priceOf(booth) {
  const value = Number.parseFloat(
    booth.price.replace(/[^\d.,]/g, "").replace(/,/g, ""),
  );
  return Number.isFinite(value) && value > 0 ? value : null;
}
```

In `size`, the part after the slash is the floor area. Add up areas only when
every booth in the selection has one.

## Drive the selection from your page

```js
// Replace the selection. A key is a `name` or an `externalId`. Mix them freely.
fp.setReservationSelection(["10.1-21", "A-118"]);

// Drop everything.
fp.clearReservationSelection();
```

`setReservationSelection()` replaces the selection instead of adding to it. It
drops a key that matches no booth, and a key that matches a booth that nobody can
book. Duplicate keys collapse. A remove button in your own list calls the same
method with the booths that are left:

```js
const keyOf = booth => booth.externalId || booth.name;

fp.setReservationSelection(
  selection.map(keyOf).filter(key => key !== removedKey),
);
```

A selection can span floors, and the plan shows one floor at a time. `zoomTo()`
moves the camera but does not switch the floor, so switch the floor first:

```js
function showOnMap(booth) {
  fp.updateLayerVisibility(booth.layer.name, true);
  fp.zoomTo({ booths: [{ name: booth.name }] });
}
```

## Tell the plan what is taken

The plan knows what the data of the event says. It does not know what your back
office sold five minutes ago. Two methods carry that in, and both replace the
whole list on every call. A booth that you leave out is on offer again, and a
page that polls its back office can send the same list every few seconds without
a repaint.

```js
// Not available, with no reason shown on the plan.
fp.setUnavailableBooths(["A-118", "A-120"]);

// Sold to a named company. The plan prints the name on the booth.
fp.setBoothOwners([{ booth: "10.1-21", company: "Acme Systems" }]);
```

Both calls take the booth out of the selection and report the new selection
through the callback. A booth with an owner is sold: it stops being bookable and
loses the size and the price it was on offer at, so you do not have to list it as
unavailable as well. An owner with an empty `company` drops out, which is how you
hand a booth back. An owner gets a name on a booth and nothing else: no logo, no
exhibitor card, no place in search. The name lives in the browser tab that set
it, and the SDK writes nothing back to the event.

Keep your own state keyed by booth, because the method takes the whole truth
about ownership every time:

```js
// The whole "reserve" step of the demo.
for (const booth of selection) owned.set(keyOf(booth), company);
fp.setBoothOwners([...owned].map(([booth, company]) => ({ booth, company })));
fp.clearReservationSelection();
```

`setUnavailableBooths()` needs one warning. The plan keeps the intent of the
visitor, so a booth that a later call releases returns to the selection it was
picked into. Send the truth, not a draft.

A visitor can pick a booth when all of these are true. The event sells it. It has
no exhibitor in the event data. Its status is neither `onhold` nor `reserved`. It
has a `type`, or a published price other than `'0'`. You have not declared it
unavailable and have not given it an owner. Every other booth is dimmed and takes
no clicks. Four CSS custom properties hold the colors of the mode:
`--color-reservation-available`, `--color-reservation-available-border`,
`--color-reservation-selected` and `--color-reservation-selected-border`.

## What the mode does not do

| Call or feature                               | In reservation mode                                                        |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `onBoothClick`                                | Never fires. A click is the selection. Use `onReservationSelectionChange`.  |
| `selectBooth()`, `selectExhibitor()`          | Do nothing. This mode has no details card.                                  |
| `highlightBooths()`, `highlightExhibitors()`  | No visible effect. Availability takes over the dim that they work through.  |
| Search, filters and category lists            | Removed. Build your own on `search()`, `boothsList()` and `zoomTo()`.       |
| Exhibitor cards, bookmarks, routes            | Out of reach. The chrome that opens them is gone.                           |
| Intercom, Google Analytics, the cookie banner | Not loaded.                                                                 |
| `zoomTo()`, `fitBounds()`, floor switching    | Work as usual. The camera stays yours.                                      |

`zoomTo()` takes lists, and it drops a selector of the wrong shape without a
message:

```js
fp.zoomTo({ booths: [{ name: "10.1-21" }] }); // works
fp.zoomTo({ booth: "10.1-21" }); // does nothing, and says nothing
```

The SDK does not know who is looking at the plan. Every visitor gets the same
bytes, and a company name reaches the plan only through `setBoothOwners()`.
Identity is the job of your page. The
<a href="/examples/reservation-demo.html?exhibitorId=6149205" target="_blank">demo</a>
reads an `?exhibitorId=` parameter and resolves it against `fp.exhibitorsList()`,
the way a real integration does after its own login. Prices reach your page only
through the selection payload, because `boothsList()` returns identity and
geometry, not commercial data.

When a call gets a bad argument, the SDK writes one line to the browser console.
This mode shows nothing on screen, so watch the console while you integrate:

```
Error calling "setReservationSelection" SDK method. Parameter must be an array
of strings. More information at
https://js-sdk.expofp.com/api/packages#error-EFP002000
```

To try the mode against an existing plan without writing code, add
`?reservation=true` to the URL of that plan. In a real page use the option.
`ignoreQuery: true` switches the URL form off, together with the rest of the
query handling.

## Where to go next

The full SDK reference covers every method, option and event outside this mode:
[js-sdk.expofp.com](https://js-sdk.expofp.com/). To move booth and exhibitor data
between ExpoFP and your own system, read the [JSON API](/guide/json-api).
