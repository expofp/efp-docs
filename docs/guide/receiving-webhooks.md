---
description: "Build a receiver for ExpoFP webhooks step by step: keep the raw body, verify the signature, answer 2xx fast — there are no retries — and deduplicate."
---

# Receiving webhooks

A build order for a receiver of ExpoFP webhooks: what to do, in which order, and what goes wrong
when it is done in another one. Written for an engineer who has been given a webhook URL to
register and, once signing is enabled for the account, a secret to verify deliveries with.

It does not repeat the [Webhooks](./webhooks) reference. The headers, the event types and their
exact payloads live there; this page links to them rather than copying them.

## Before any code: keep the raw body

**Your handler has to see the exact bytes of the request body, before any JSON middleware touches
them.**

The signature covers those bytes. Parse the body and serialise it again and you hold a different
byte string — a different key order, different spacing, `1.0` where the wire carried `1` — and no
digest over it will ever match. Not intermittently: never. A receiver broken this way looks from
the inside exactly like one under attack, which is what makes it expensive to diagnose.

Every framework can hand you the raw bytes, and in none of them is it the default:

| Framework | Raw body |
| --- | --- |
| Express | `express.raw({ type: '*/*' })` on the webhook route, mounted before any `express.json()` |
| Flask | `request.get_data()` — not `request.json` |
| ASP.NET Core | copy `HttpRequest.Body` into a buffer before model binding |
| PHP | `file_get_contents('php://input')` |

Hold on to that buffer. Everything below parses the copy you already have, never the stream a
second time.

## The order of operations

1. **Read the raw body bytes** — as above, before anything parses them.
2. **Recompute the signature.** `HMAC-SHA256`, keyed with your secret, over those exact bytes;
   lowercase hex, prefixed `sha256=`. The header, and what exactly is used as the key, are in
   [Securing webhooks](./webhooks#securing-webhooks).
3. **Compare in constant time** with `X-ExpoFP-Signature-256`. A plain `==` on the hex string
   leaks timing; use your platform's fixed-time comparison.
4. **Reject on a mismatch — and on an absence.** If you require signatures, a delivery arriving
   without `X-ExpoFP-Signature-256` fails the same check as one with the wrong value, and gets the
   same `401`. An unsigned delivery is not a signed one, and nothing else about the request tells
   you it came from ExpoFP.
5. **Parse the JSON now**, and not one line earlier.
6. **Answer `2xx` immediately**, then do your work asynchronously. See
   [There are no retries](#there-are-no-retries) — this is the step that decides whether a slow
   database costs you an event.
7. **Deduplicate.** `X-ExpoFP-Delivery` is one UUID per event and is the natural key while it is
   present; it is absent on unsigned deliveries, so a receiver that must work both ways needs a
   fallback key of its own.

::: warning `X-ExpoFP-Timestamp` is not replay protection
It travels outside the signature, so anyone who can alter the request can alter it. Log it if it
is useful; never accept or reject a delivery on the strength of it.
:::

## Verifying a delivery

::: code-group

```js [Node.js (Express)]
const crypto = require('crypto');
const express = require('express');
const app = express();

// raw body, before any JSON parsing
app.use('/webhooks/expofp', express.raw({ type: '*/*' }));

const SECRETS = (process.env.EXPOFP_WEBHOOK_SECRETS || '').split(',').filter(Boolean);

function verify(rawBody, header) {
  if (!header) return false;
  const received = Buffer.from(header, 'utf8');
  return SECRETS.some((secret) => {
    const expected = Buffer.from(
      'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex'),
      'utf8'
    );
    return expected.length === received.length && crypto.timingSafeEqual(expected, received);
  });
}

app.post('/webhooks/expofp', (req, res) => {
  if (!verify(req.body, req.get('X-ExpoFP-Signature-256'))) {
    return res.status(401).send('invalid signature');
  }
  const event = JSON.parse(req.body.toString('utf8'));  // parse only after verifying
  res.sendStatus(200);
});
```

```python [Python (Flask)]
import hmac, hashlib, os
from flask import Flask, request, abort

app = Flask(__name__)
SECRETS = [s for s in os.environ.get("EXPOFP_WEBHOOK_SECRETS", "").split(",") if s]

def verify(raw_body: bytes, header: str | None) -> bool:
    if not header:
        return False
    for secret in SECRETS:
        expected = "sha256=" + hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
        if hmac.compare_digest(expected, header):
            return True
    return False

@app.post("/webhooks/expofp")
def webhook():
    raw = request.get_data()          # raw bytes, not request.json
    if not verify(raw, request.headers.get("X-ExpoFP-Signature-256")):
        abort(401)
    payload = request.get_json()      # parse only after verifying
    return "", 200
```

```csharp [C# (ASP.NET Core)]
using System.Security.Cryptography;
using System.Text;

static bool Verify(byte[] rawBody, string header, IEnumerable<string> secrets)
{
    if (string.IsNullOrEmpty(header)) return false;

    foreach (var secret in secrets)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var expected = "sha256=" + Convert.ToHexString(hmac.ComputeHash(rawBody)).ToLowerInvariant();

        if (CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(header)))
            return true;
    }
    return false;
}

// read the raw body before model binding
app.MapPost("/webhooks/expofp", async (HttpRequest req) =>
{
    using var ms = new MemoryStream();
    await req.Body.CopyToAsync(ms);
    var raw = ms.ToArray();

    if (!Verify(raw, req.Headers["X-ExpoFP-Signature-256"], secrets))
        return Results.Unauthorized();

    return Results.Ok();
});
```

```php [PHP]
<?php
$raw    = file_get_contents('php://input');
$header = $_SERVER['HTTP_X_EXPOFP_SIGNATURE_256'] ?? '';
$secrets = array_filter(explode(',', getenv('EXPOFP_WEBHOOK_SECRETS') ?: ''));

$ok = false;
foreach ($secrets as $secret) {
    $expected = 'sha256=' . hash_hmac('sha256', $raw, $secret);
    if (hash_equals($expected, $header)) { $ok = true; break; }
}

if (!$ok) { http_response_code(401); exit('invalid signature'); }
$payload = json_decode($raw, true);   // parse only after verifying
```

:::

Each of them accepts a **list** of secrets rather than a single value. That is not defensive
coding; it is what makes [rotation](#accept-a-list-of-secrets-not-one) cost you nothing.

## Checking your implementation offline

Two vectors, in this order. You can run both before ExpoFP has ever sent you anything.

**One — the algorithm.** GitHub's published vector. Any correct HMAC-SHA256 implementation
reproduces it, so if yours does not, the problem is in your crypto call and not in your handler.

```
secret = It's a Secret to Everybody
body   = Hello, World!
sha256 = 757107ea0eb2509fc211221cce984b8a37570b6d7586c22c46f4379c8b043e17
```

**Two — real bytes.** The exact body of a `booth_assigned` delivery, captured off the wire.

```
secret = whsec_test_secret_do_not_use
body   = {"Type":"booth_assigned","ExpoId":900001,"ExhibitorId":700002,"BoothId":800003,"BoothKey":"A-101","IsOnHold":false}
sha256 = 58637d32fd92e9385d210eb1dd2e6264f013de0b5a092472153a207866f503d2
```

Feed the body to your verifier as bytes, exactly as printed — one line, no trailing newline, no
re-indentation. Reproducing this digest proves your receiver handles what ExpoFP genuinely sends,
including the field names, rather than a tidied-up version of it. If vector one passes and vector
two does not, something between the socket and your HMAC call is still touching the body.

## Accept a list of secrets, not one

Read your accepted secrets from configuration as a list and try each one. A receiver built that
way rotates with no downtime and no failed deliveries; a receiver holding a single string has to
be redeployed at the exact moment ExpoFP switches, and loses whatever arrives in between.

The sequence, once your side accepts a list:

1. You are given the new secret. ExpoFP is still signing with the current one.
2. You add it to the list, so both are accepted, and say you are ready.
3. ExpoFP activates the new secret and signs with it from that point on.
4. Once you see deliveries verifying against the new one, drop the old one.

ExpoFP always signs with exactly one secret. The overlap lives entirely on your side — which is
the whole reason step 1 comes before step 3. Details of getting and rotating a secret are in
[Getting, rotating and removing your secret](./webhooks#getting-rotating-and-removing-your-secret).

## When signing is switched off

Signing is switched off by removing the account's secret, and it is worth knowing what your
receiver sees when that happens, because it is not only the signature that goes.

- **All three headers disappear** — `X-ExpoFP-Signature-256`, `X-ExpoFP-Delivery` and
  `X-ExpoFP-Timestamp`. The body is unchanged, byte for byte.
- **A receiver that requires a signature rejects everything from that moment.** That is intended
  and is the correct behaviour: see step 4 of the order of operations.
- **If you keyed idempotency on `X-ExpoFP-Delivery`, that key is gone too.** This is the one that
  breaks quietly rather than loudly, so do not assume the header is always there.

The same holds in the other direction: before your account has a secret, deliveries arrive
unsigned with none of the three headers. A receiver written to require a signature will reject
them, so switch it to required only once you know signing is on.

## What goes wrong in the payloads

Every one of these has cost somebody a bug report. The payloads themselves are in
[Events](./webhooks#events) — what follows is what to expect from them.

### Field names are cased differently per event type

Booth events are **PascalCase** — `"Type"`, `"ExpoId"`, `"BoothId"`, `"BoothKey"`, `"IsOnHold"`.
Exhibitor events are **camelCase** — `"type"`, `"exhibitorId"`, `"externalId"`.

This is the real format, not a documentation slip, and it is fixed: the bytes on the wire are
covered by the signature, so they cannot be tidied without breaking every receiver that verifies
one. Bind your models per event type, or match keys case-insensitively. Do not write one model
with one convention and expect it to cover both.

### The Test webhook button sends an array, real events send an object

A real event arrives as a **single JSON object**, one event per request. The **Test webhook**
button sends a **JSON array holding one object**.

That button is normally the first delivery an integration ever sees, so it is the shape people
write their handler against — and then the handler breaks on the first genuine booth assignment,
in production, on somebody else's schedule. Handle both from the start: if the parsed body is an
array, iterate it; otherwise treat it as a single event. The array shape is shown in
[Delivery format](./webhooks#delivery-format).

### One booth assignment produces two deliveries

A single change sends `booth_assigned` first and then `booth_reserved`, in that order, carrying
the same values. They are two events describing one change, not a duplicate delivery, so they
carry different delivery ids and no idempotency key will collapse them for you. Decide which one
your integration acts on, or make acting on both harmless.

### Absent values are sent as `null`, not left out

Fields are always present. `"ExhibitorId": null`, `"externalId": null` — an absent value is an
explicit `null`, so a parser configured to reject nulls will reject valid deliveries.

### `booth_unassigned` always reports `"IsOnHold": false`

On that event the field is a constant, whatever the booth's real state. Do not read a hold status
out of an unassignment.

### Exhibitor payloads carry no expo id

`exhibitor_upserted` and `exhibitor_deleted` have three fields — `type`, `exhibitorId`,
`externalId` — and no expo id of any kind. If your integration is scoped per event, you cannot
route an exhibitor delivery by expo; key it on `exhibitorId` or on the `externalId` you set.

## There are no retries

**A delivery that fails is not sent again.** If your endpoint is down, slow enough to time out, or
answers non-2xx, that event is gone: there is no retry, no backoff, no dead-letter queue, and
nothing in your ExpoFP account that will show you it happened.

That has three consequences for how you build:

- **Answer fast, work later.** Verify, enqueue, return `2xx`. Anything you do before responding —
  a database write, a call to your own downstream service — is time your endpoint can spend
  failing. This is the single change that prevents most lost deliveries.
- **Do not assume at-least-once delivery.** Webhooks here are a fast path, not a guaranteed one.
  If your data must be complete, reconcile periodically against the [JSON API](./json-api) rather
  than trusting that every event arrived.
- **Be idempotent regardless.** The `booth_assigned` / `booth_reserved` pair above means one
  change legitimately reaches you twice, and a replay of a request you already handled must not
  double-apply.

## Before you go live

The **Test webhook** button on your ExpoFP profile page delivers to any URL you give it, signed
with your account's secret. It is the whole loop — signature included — without waiting for a real
booth assignment, so use it as the last check on a receiver you are about to point at production.
Remember that its payload is the array shape.

A receiver is ready when:

- [ ] the raw body is captured before any JSON parsing, and the parse happens after verification;
- [ ] the signature is compared in constant time, and a missing header is treated as a failure;
- [ ] both offline vectors above reproduce;
- [ ] the accepted secrets are a list, read from configuration or a secret store — never from
      source control, a log line or a client-side bundle;
- [ ] the handler accepts both the single object and the one-element array;
- [ ] booth events are read as PascalCase and exhibitor events as camelCase;
- [ ] the endpoint answers `2xx` before doing its work;
- [ ] handling the same event twice is harmless.
