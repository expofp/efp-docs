
ExpoFP webhooks are a simple way to get notified when event occurred on ExpoFP.com.

## [Configure webhooks](https://expofp.com/client/profile)

When configured, ExpoFP will perform `HTTP POST` requests to the webhook URL with JSON payload.
You can use one of helper online tools to see coming data from webhooks. e.g. `https://requestbin.com/`

### booth_reserved

Example payload:

```json
{
    "type": "booth_reserved",
    "exhibitorId": 123
}
```
