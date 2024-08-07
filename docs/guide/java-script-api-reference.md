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

    onBoothClick: (e: FloorPlanBoothClickEvent) => void;

    onBookmarkClick: (e: FloorPlanBookmarkClickEvent) => void;

    onFpConfigured: () => void;

    onDirection: (e: FloorPlanDirectionEvent) => void;

    onDetails: (e: FloorPlanDetailsEvent) => void;

    onExhibitorCustomButtonClick: (e: FloorPlanCustomButtonEvent) => void;

    onGetCoordsClick: (e: FloorPlanGetCoordsEvent) => void;

    selectBooth(nameOrExternalId: string): void;

    selectExhibitor(nameOrExternalId: string): void;

    selectCurrentPosition(
        // z- layer name (string) or layer index
        point: { x: number; y: number; angle?: number; z?: string | number; lat?: number; lng?: number },
        focus?: boolean,
        icon?: number // 0- blue dot, 1- YAH icon
    ): void;

    // name: exhibitor name
    setBookmarks(bookmarks: { name: string; bookmarked: boolean }[]): void;

    updateLayerVisibility(layer: string, visible: boolean): void;

    selectRoute(from: string | CurrentPosition, to: string | CurrentPosition): void

    exhibitorsList(): FloorPlanExhibitor[];

    boothsList(): FloorPlanBooth[];

    categoriesList(): FloorPlanCategory[];

    selectCategory(nameOrSlug: string): void

    unstable_destroy(): void;
}

interface FloorPlanOptions {
    element?: HTMLDivElement;
    eventId?: string;
    dataUrl?: string;
    noOverlay?: boolean;
    offHistory?: boolean;
    allowConsent?: boolean;
    onBoothClick?: (e: FloorPlanBoothClickEvent) => void;
    onBookmarkClick: (e: FloorPlanBookmarkClickEvent) => void;
    onFpConfigured?: () => void;
    onDirection?: (e: FloorPlanDirectionEvent) => void;
    onDetails?: (e: FloorPlanDetailsEvent) => void;
    onExhibitorCustomButtonClick?: (e: FloorPlanCustomButtonEvent) => void;
    onGetCoordsClick?: (e: FloorPlanGetCoordsEvent) => void;
}

interface Layer {
    name: string;
    description: string;
}

interface FloorPlanBoothBase {
    id: number;
    name: string;
    layer: Layer;
}

interface FloorPlanBooth extends FloorPlanBoothBase {
    externalId: string;
    isSpecial: boolean;
    exhibitors: number[];
}

interface FloorPlanBoothClickEvent {
    target: FloorPlanBoothBase;
}

interface Point {
    x: number;
    y: number;
}

interface FloorPlanBookmarkClickEvent {
    // name: exhibitor name.
    name: string;
    bookmarked: boolean;
}

interface FloorPlanDirectionEvent {
    from: FloorPlanBoothBase;
    to: FloorPlanBoothBase;
    lines: { p0: Point; p1: Point }[];
    distance: string;
    time: number;
}

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

interface FloorPlanCustomButtonEvent {
    externalId: string;
    buttonNumber: number;
    buttonUrl: string;
    preventDefault: () => void;
}

interface FloorPlanGetCoordsEvent extends Point {
    z: string | null;
}

interface FloorPlanExhibitor {
    id: number;
    name: string;
    externalId: string;
    booths: number[];
}

interface FloorPlanCategory {
    id: number;
    name: string;
    exhibitors: number[];
}

interface ExpoData {
    booths: FloorPlanBooth[];
    exhibitors: FloorPlanExhibitor[];
    categories: FloorPlanCategory[];
}

interface CurrentPosition {
    x: number;
    y: number;
    z?: string | number;
}

const ExpoFP: {
    FloorPlan: FloorPlanOptions;
};

```
