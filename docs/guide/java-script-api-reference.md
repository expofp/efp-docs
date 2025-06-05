# JavaScript API Reference

## FloorPlan

```ts
class FloorPlan {
    constructor(options?: FloorPlanOptions);

    readonly ready: Promise<void>;
    readonly element: HTMLDivElement;
    readonly eventId: string;
    readonly dataUrl: string;
    readonly noOverlay: boolean;
    readonly offHistory: boolean;
    readonly allowConsent: boolean;
    readonly onInit: (fp: FloorPlan) => void;

    onBoothClick(e: FloorPlanBoothClickEvent): void;

    onBookmarkClick(e: FloorPlanBookmarkClickEvent): void;

    onCategoryClick(e: FloorPlanCategoryClickEvent): void;

    /** 
     * @deprecated 
     * The onFpConfigured method is deprecated. Use onInit instead. 
     */
    onFpConfigured(): void;

    onDirection(e: FloorPlanDirectionEvent): void;

    onDetails(e: FloorPlanDetailsEvent): void;

    onExhibitorCustomButtonClick(e: FloorPlanCustomButtonEvent): void;

    onGetCoordsClick(e: FloorPlanGetCoordsEvent): void;

    onMarkerClick(e: FloorPlanMarkerEvent): void;

    selectBooth(nameOrExternalId: string): void;

    selectExhibitor(nameOrExternalId: string): void;

    selectRoute(from: RouteWaypoint, to: RouteWaypoint): void;
    
    /**
     * @note
     * Max 8 waypoints allowed (total: from + 8 waypoints + to = 10).
     */
    selectRoute(waypoints: RouteWaypoint[]): void;

    /**
     * @note
     * Experimental feature: functionality may be unstable or subject to change.
     */
    getOptimizedRoutes(waypoints: RouteWaypoint[]): RouteInfo[];

    selectCurrentPosition(point: CurrentPosition, focus: boolean, icon?: number): void

    setBookmarks(bookmarks: { name?: string; externalId?: string; bookmarked: boolean }[]): void;

    setMarkers(markersData: MarkersData): void;

    updateLayerVisibility(layer: string, visible: boolean): void;

    getCenterCoordinates(): FloorPlanGetCoordsEvent;

    applyParameters(queryRaw: string): void;

    exhibitorsList(): FloorPlanExhibitor[];

    boothsList(): FloorPlanBooth[];

    categoriesList(): FloorPlanCategory[];

    selectCategory(nameOrSlug?: string): void;

    getVisibility(): Visibility;

    setVisibility(visibility: Visibility): void;

    findLocation(): void;

    zoomIn(): void;

    zoomOut(): void;

    switchView(): void;

    fitBounds(): void;

    getBoothRect(name: string): Rect;

    convertToGeo(x: number, y: number): [number, number] | never;

    unstable_destroy(): void;

    highlightExhibitors(externalIds: string[]): void;

    highlightBooths(externalIds: string[]): void;

    onCurrentPositionChanged(point: CurrentPosition): void;

    /**
     * Performs a fuzzy search.
     * @param term Search query
     * @returns Promise with [{ item, score }] (lower score = better match)
     */
    search(term: string): Promise<{ item: unknown, score: number }[]>;
}
```

## ExpoFP

```ts
const ExpoFP: {
  FloorPlan: FloorPlanOptions;
};
```

## FloorPlanOptions

```ts
interface FloorPlanOptions {
    element?: HTMLDivElement;
    eventId?: string;
    previewMode?: boolean;
    dataUrl?: string;
    noOverlay?: boolean;
    offHistory?: boolean;
    allowConsent?: boolean;
    onBoothClick?: (e: FloorPlanBoothClickEvent) => void;
    onBookmarkClick?: (e: FloorPlanBookmarkClickEvent) => void;
    onCategoryClick?: (e: FloorPlanCategoryClickEvent) => void;
    /**
     * @deprecated 
     * The onFpConfigured method is deprecated. Use onInit instead. 
     */
    onFpConfigured?: () => void;
    onDirection?: (e: FloorPlanDirectionEvent) => void;
    onDetails?: (e: FloorPlanDetailsEvent) => void;
    onExhibitorCustomButtonClick?: (e: FloorPlanCustomButtonEvent) => void;
    onMarkerClick?: (e: FloorPlanMarkerEvent | undefined) => void;
    onGetCoordsClick?: (e: FloorPlanGetCoordsEvent) => void;
    onInit?: (fp: FloorPlan) => void;
}
```

## Layer

```ts
interface Layer {
  name: string;
  description: string;
}
```

## FloorPlanBoothBase

```ts
interface FloorPlanBoothBase {
    id: number;
    externalId: string;
    name: string;
    layer: Layer;
}
```

## FloorPlanBooth

```ts
interface FloorPlanBooth extends FloorPlanBoothBase {
    externalId: string;
    isSpecial: boolean;
    exhibitors: number[];
    meta: Record<string, string>;
    description: string;
}
```

## FloorPlanBoothClickEvent

```ts
interface FloorPlanBoothClickEvent {
  target: FloorPlanBoothBase;
}
```

## Point

```ts
interface Point {
  x: number;
  y: number;
}
```

## FloorPlanBookmarkClickEvent

```ts
interface FloorPlanBookmarkClickEvent {
  // name: exhibitor name.
  name: string;
  bookmarked: boolean;
  externalId: string;
}
```

## FloorPlanCategoryClickEvent

```ts
interface FloorPlanCategory {
    id: number;
    name: string;
    exhibitors: number[];
}

interface FloorPlanCategoryClickEvent extends FloorPlanCategory {}
```

## FloorPlanDirectionEvent

```ts
interface FloorPlanDirectionEvent {
  from: FloorPlanBoothBase;
  to: FloorPlanBoothBase;
  lines: { p0: Point; p1: Point }[];
  distance: string;
  time: number;
}
```

## FloorPlanDetailsEvent

```ts
interface FloorPlanDetailsEvent {
  type: "booth" | "exhibitor" | "route";
  id: string;
  name: string;
  externalId: string;
  /// Value depends on the type of event
  /// If the type is 'booth' this value contains the same value as 'name'
  /// If the type is 'exhibitor' this value contains the  assigned booth names (the first booth name takes from the onBoothClick event)
  /// If the the type is 'route' this value contains "from" and "to" booth names.
  boothsNames: string[];
}
```

## FloorPlanCustomButtonEvent

```ts
interface FloorPlanCustomButtonEvent {
  externalId: string;
  buttonNumber: number;
  buttonUrl: string;
  preventDefault: () => void;
}
```

## FloorPlanGetCoordsEvent

```ts
interface FloorPlanGetCoordsEvent extends Point {
  z: string | null;
}
```

## FloorPlanMarkerEvent

```ts
interface FloorPlanMarkerEvent extends Point {
    id: string;
    z?: number | string;
}
```

## FloorPlanExhibitor

```ts
interface FloorPlanExhibitor {
  id: number;
  name: string;
  externalId: string;
  booths: number[];
}
```

## FloorPlanCategory

```ts
interface FloorPlanCategory {
  id: number;
  name: string;
  exhibitors: number[];
}
```

## ExpoData

```ts
interface ExpoData {
  booths: FloorPlanBooth[];
  exhibitors: FloorPlanExhibitor[];
  categories: FloorPlanCategory[];
}
```

## CurrentPosition

```ts
interface CurrentPosition {
  x: number;
  y: number;
  z?: string | number;
}
```

## Visibility

```ts
interface Visibility {
  controls?: boolean;
  levels?: boolean;
  header?: boolean;
  overlay?: boolean;
}
```

## Rect

```ts
interface Rect {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  h: number;
  w: number;
  cx: number;
  cy: number;
  contains(r: Rect): boolean;
  intersects(r: Rect): boolean;
  getIntersection(r: Rect): Rect;
  getRotated90(): Rect;
  normalize(width: number, height: number): Rect;
  withPadding(x: number, y: number): Rect;
  scale(s: number): Rect;
  getArea(): number;
  clone(): Rect;
  translate(dx: number, dy: number): Rect;
  equals(r: Rect): boolean;
  toString(): string;
  containsPoint(x: number, y: number): boolean;
}
```

## RouteWaypoint

```ts
type RouteWaypoint = string | CurrentPosition;
```

## RouteInfo

```ts
interface RouteInfo {
    waypoints: RouteWaypoint[];
}
```
