# [Webhooks](https://expofp.com/client/profile)

When configured, ExpoFP will perform `HTTP POST` requests to the webhook URL with JSON payload.
You can use one of helper online tools to see coming data from webhooks. e.g. `https://requestbin.com/`

## Delivery format

Every delivery is an `HTTP POST` with `Content-Type: application/json; charset=utf-8`.

Real events arrive as a **single JSON object**, one event per request. The **Test webhook** button on your profile page instead sends a **JSON array** holding one event object — it is the only delivery shaped as an array, and it is usually the first delivery an integration ever sees:

```json
[
    {
        "Type": "booth_reserved",
        "ExpoId": 900001,
        "ExhibitorId": 0,
        "BoothId": null,
        "BoothKey": null,
        "IsOnHold": null
    }
]
```

Write your handler to accept both shapes: if the parsed body is an array, handle every element; otherwise handle the single object.

::: warning Field names are not cased the same way for every event
Booth events are serialised **PascalCase** — `"Type"`, `"ExpoId"`, `"BoothId"`. Exhibitor events are serialised **camelCase** — `"type"`, `"exhibitorId"`. Copy the field names from the examples below exactly; there is no single convention covering the whole page.
:::

Two more things worth knowing before writing a handler:

- **A field with no value is sent as `null`, not left out.**
- **One booth assignment produces two requests** — `booth_assigned` first, then `booth_reserved`, from the same change.

The payloads below are formatted for readability. On the wire the body is compact JSON on a single line; when you verify a signature, hash the bytes exactly as they arrived.

## Events

### booth_reserved

Example payload:

```json
{
    "Type": "booth_reserved",
    "ExpoId": 900001,
    "ExhibitorId": 700002,
    "BoothId": 800003,
    "BoothKey": "A-101",
    "IsOnHold": false
}
```

### booth_on_hold

Example payload:

```json
{
    "Type": "booth_on_hold",
    "ExpoId": 900001,
    "ExhibitorId": null,
    "BoothId": 800003,
    "BoothKey": "A-101",
    "IsOnHold": true
}
```
### booth_assigned

Example payload:

```json
{
    "Type": "booth_assigned",
    "ExpoId": 900001,
    "ExhibitorId": 700002,
    "BoothId": 800003,
    "BoothKey": "A-101",
    "IsOnHold": false
}
```

This request is always followed by a second one carrying the same values with `"Type": "booth_reserved"`.

### booth_unassigned

Example payload:

```json
{
    "Type": "booth_unassigned",
    "ExpoId": 900001,
    "ExhibitorId": 700002,
    "BoothId": 800003,
    "BoothKey": "A-101",
    "IsOnHold": false
}
```
### exhibitor_upserted

Example payload:

```json
{
    "type": "exhibitor_upserted",
    "exhibitorId": 700002,
    "externalId": null
}
```
### exhibitor_deleted

Example payload:

```json
{
    "type": "exhibitor_deleted",
    "exhibitorId": 700002,
    "externalId": "EXT-EXHIBITOR-4242"
}
```

## Securing webhooks

Once your account has a webhook secret, ExpoFP signs every delivery it sends you, so you can prove the request came from ExpoFP and that the body was not altered on the way.

Signing is enabled per account by generating a secret, and turned off again by removing it. Until you generate one, deliveries are sent unsigned, exactly as before — the signature is additive and no existing integration has to change.

### Headers ExpoFP sends

```
POST /your/endpoint
Content-Type: application/json; charset=utf-8
X-ExpoFP-Signature-256: sha256=<64 lowercase hex chars>
X-ExpoFP-Delivery: <uuid>
X-ExpoFP-Timestamp: <unix seconds>
```

- `X-ExpoFP-Signature-256` — the signature. Present only when your account has a secret.
- `X-ExpoFP-Delivery` — one UUID per event, stable if the same event is ever re-sent. Useful as an idempotency key in your own logs.
- `X-ExpoFP-Timestamp` — the time the delivery was sent, in Unix seconds. **Informational only.**

::: warning The timestamp is not replay protection
`X-ExpoFP-Timestamp` is not covered by the signature, so it can be changed by anyone who can change the request. It proves nothing on its own. Log it if it is useful to you, but do not reject or accept a delivery on the basis of it.
:::

### How the signature is computed

```
signature = HMAC-SHA256(
    key     = the UTF-8 bytes of your secret string,
    message = the raw request body bytes
)
```

The result is rendered as lowercase hexadecimal and sent prefixed with `sha256=`. This is the same shape as GitHub's `X-Hub-Signature-256`.

The key is the UTF-8 bytes of the secret **as a printable string** — including its `whsec_` prefix. Do not decode it from hex or base64 first.

### Three rules that decide whether this works

1. **Hash the raw body, never a re-serialised object.** Parsing the JSON and stringifying it again will change key order, spacing or number formatting and the signature will not match. Capture the body as bytes before any JSON middleware touches it.
2. **Compare in constant time.** A plain `==` on the hex string leaks timing information. Use your platform's fixed-time comparison.
3. **Accept a list of secrets, not one.** During rotation ExpoFP gives you the new secret first and switches to it afterwards. If you accept both for that window, rotation costs you no downtime and no failed deliveries.

### Verifying a delivery

Receiver code for Node.js, Python, C# and PHP, an offline vector to check your implementation against before ExpoFP has sent you anything, and the order the steps have to be done in, are in [Receiving webhooks](./receiving-webhooks). Build your receiver against that page; this one is the reference for what a delivery contains.

### Getting, rotating and removing your secret

- A secret is generated for your account and shown to you **once**, at the moment it is created. ExpoFP cannot show it again. If it is lost, generate a new one.
- Rotation is done in two steps and costs no downtime:
  1. A replacement secret is generated and shown to you once. ExpoFP is still signing with the current one.
  2. You add the replacement to your accepted list, so your receiver accepts both, and confirm. ExpoFP then activates the replacement and signs with it from that point on. Once you see deliveries verifying against the new secret, drop the old one.

  ExpoFP always signs with exactly one secret; the overlap lives on your side, which is why rule 3 above asks you to accept a list.
- Removing the secret turns signing off. Deliveries go back to unsigned — the same bytes they carried before the secret existed, with no `X-ExpoFP-Signature-256`, `X-ExpoFP-Delivery` or `X-ExpoFP-Timestamp` header on them.

  ::: warning A receiver that requires a signature will reject every delivery after a removal
  That is the point of requiring one: an unsigned delivery is indistinguishable from an unsigned request by anyone else. Removing a secret is a deliberate act with an immediate, visible consequence on your side, not a cleanup step.
  :::

- Removing is not one way. A new secret can be generated afterwards and signing resumes — but it is a **different value**, and unlike a rotation there is no overlap: deliveries are signed with it from the moment it is generated. Add it to your accepted list as soon as you are shown it.

- Treat the secret as a credential: an environment variable or a secret store, never in source control, never in a log line, never in a client-side bundle.
