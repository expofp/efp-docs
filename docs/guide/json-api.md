---
description: "Manage ExpoFP floor plans and exhibitor data over a REST API: what the JSON API covers, how to authenticate and where to find the full json-api-v1 reference."
---

# JSON API

The ExpoFP JSON API is a REST API that lets you programmatically manage your event floor plans and exhibitor data. Use it to integrate ExpoFP with your existing event management platform, CRM, or registration system — keeping booth assignments, exhibitor profiles, and floor plan data in sync without manual imports.

The complete reference is published as **`json-api-v1`** on `app.expofp.com` and **requires an ExpoFP account** — the button below opens a sign-in screen if you are not signed in already. This page is the part that needs no account: it carries what you need to decide whether the API fits before you have one.

<div class="doc-cta-row">
  <a class="doc-cta-button primary" href="https://app.expofp.com/api-docs/json-api-v1" target="_blank" rel="noopener">JSON API reference</a>
  <a class="doc-cta-button alt" href="https://app.expofp.com/profile/" target="_blank" rel="noopener">Get your API key</a>
</div>

::: warning The reference is no longer on Apiary
This reference used to be published on Apiary; it is not published there any more. Oracle is shutting that service down — its Service Changes page records **"End-of-Life (EOL) for Apiary Cloud Service effective October 31, 2026"**, after which "all remaining instances will be permanently deleted". Source: [Oracle Cloud Infrastructure Service Changes](https://docs.oracle.com/en-us/iaas/Content/servicechanges.htm#oracle-apiary), section *Oracle Apiary*.

If you came from an older link, the reference is now [`json-api-v1` on `app.expofp.com`](https://app.expofp.com/api-docs/json-api-v1), and opening it requires an ExpoFP account.
:::

## What you can do with the API

- **Manage exhibitors** — create, update, and delete exhibitor profiles including company details, logos, descriptions, and contact information.
- **Assign booths** — add or remove booth assignments for exhibitors, mark booths as reserved or sold.
- **Manage extras** — assign sponsorship packages, booth extras, and featured listings to exhibitors.
- **Manage sessions** — create and update conference sessions, session tracks, and speakers.
- **Read floor plan data** — retrieve event configuration and floor plan data (booths, exhibitors, and categories).

## Authentication

Authentication is a single API token, sent with **every** request as a `token` field in the request body. There is no login call, no session to keep alive: one credential, on each call.

Get your token from [your ExpoFP profile page](https://app.expofp.com/profile/) — the **Get your API key** button above goes straight there, and the key on that page is the value you send as `token`.

The token identifies you as the partner it belongs to. It authenticates you against your own expos, exhibitors, booths and sessions, and reaches nothing belonging to anyone else. It grants full read and write access over that data, so treat it as a credential: keep it on your server, out of client-side code and out of version control.

## The full reference

Every method of `json-api-v1` — its parameters, its responses and a worked example — is in the [JSON API reference](https://app.expofp.com/api-docs/json-api-v1). **Opening it requires signing in with an ExpoFP account.** If you do not have one yet, [contact us](https://expofp.com/#contact) and we will get you set up.

Signing in and the API token are two different things: the account is how a person reads the reference, the token is how your code calls the API. There is a third way in, and it reuses the second: the same token, sent in the `X-API-Token` header, is how a tool fetches the [machine-readable document](#the-machine-readable-document). One token, two places it travels — the request body when you call the API, a header when you download the document.

## The machine-readable document

The same reference is published as an OpenAPI 3.0.1 document, so you can import the API into Postman or generate a client for it instead of writing every request by hand.

- **YAML** — `https://app.expofp.com/api-docs/json-api-v1.yaml`
- **JSON** — `https://app.expofp.com/api-docs/json-api-v1.json`

Both are authenticated with your ExpoFP API token — the same token as above, sent in the **`X-API-Token`** request header rather than in the request body. A request with no credential answers `401` instead of redirecting to the sign-in page, so a generator gets a status code it can act on.

```bash
curl -H "X-API-Token: YOUR_API_TOKEN" \
  -o json-api-v1.yaml \
  "https://app.expofp.com/api-docs/json-api-v1.yaml"
```

**In the header, never in the URL.** There is no `?token=` form of these addresses, and that is deliberate: a token in a URL is written into browser history, into proxy and server access logs and into `Referer` headers, and this token grants full read and write access to your data.

Then point `openapi-generator` at the file you downloaded — that is the client generator this document is tested against.
