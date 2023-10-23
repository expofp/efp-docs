
ExpoFP webhooks are a simple way to get notified when event occurred on ExpoFP.com.

## [Configure webhooks](https://expofp.com/client/profile)

When configured, ExpoFP will perform `HTTP POST` requests to the webhook URL with JSON payload.
You can use one of helper online tools to see coming data from webhooks. e.g. `https://requestbin.com/`

### booth_reserved

Example payload:

```json
{
    "type": "booth_reserved",
    "exhibitorId": 123,
    "expoId": 123
}
```

### booth_onhold

Example payload:

```json
{
    "type": "booth_onhold",    
    "expoId": 123,
    "boothId": 123,
    "isOnHold": true
}
```
### booth_assigned

Example payload:

```json
{
    "type": "booth_assigned",
    "exhibitorId": 123,
    "expoId": 123,
    "boothId": 123,
    "isOnHold": true
}
```
### booth_unassigned

Example payload:

```json
{
    "type": "booth_unassigned",
    "exhibitorId": 123,
    "expoId": 123,
    "boothId": 123,
    "isOnHold": false
}
```
### exhibitor_upserted

Example payload:

```json
{
    "type": "exhibitor_upserted",
    "exhibitorId": 123
}
```
### exhibitor_deleted

Example payload:

```json
{
    "type": "exhibitor_deleted",
    "exhibitorId": 123,
    "externalid": "text"
}
```
