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

    onFpConfigured: () => void;

    onDirection: (e: FloorPlanDirectionEvent) => void;

    onDetails: (e: FloorPlanDetailsEvent) => void;

    onExhibitorCustomButtonClick: (e: FloorPlanCustomButtonEvent) => void;

    onGetCoordsClick: (e: FloorPlanGetCoordsEvent) => void;

    selectBooth(nameOrExternalId: string): void;

    selectExhibitor(nameOrExternalId: string): void;

    selectCurrentPosition(
        point: { x: number; y: number; angle?: number; z?: string; lat?: number; lng?: number },
        focus?: boolean,
        icon?: number // 0- blue dot, 1- YAH icon
    ): void;

    updateLayerVisibility(layer: string, visible: boolean): void;

    selectRoute(from: string, to: string, onlyAccessible: boolean): void;

    exhibitorsList(): FloorPlanExhibitor[];

    boothsList(): FloorPlanBooth[];

    categoriesList(): FloorPlanCategory[];

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
    onFpConfigured?: () => void;
    onDirection?: (e: FloorPlanDirectionEvent) => void;
    onDetails?: (e: FloorPlanDetailsEvent) => void;
    onExhibitorCustomButtonClick?: (e: FloorPlanCustomButtonEvent) => void;
    onGetCoordsClick?: (e: FloorPlanGetCoordsEvent) => void;
}

interface FloorPlanBoothBase {
    id: number;
    name: string;
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

interface RoutePoint extends Point {
    layer: string;
}

interface FloorPlanDirectionEvent {
    from: FloorPlanBoothBase;
    to: FloorPlanBoothBase;
    lines: { p0: RoutePoint; p1: RoutePoint }[];
    distance: string;
    time: number;
}

interface FloorPlanDetailsEvent {
    type: "booth" | "exhibitor" | "route";
    id: string;
    name: string;
    externalId: string;
    /// Value depends on the type of event
    /// if the type is 'booth' this value contains the same value as 'id'
    /// if the type is 'exhibitor' this value contains the  assigned booths ids (the first booth id takes from the onBoothClick event)
    /// if the the type is 'route' this value contains from and to booths ids
    boothsIds: number[];
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

const ExpoFP: {
    FloorPlan: FloorPlanOptions;
};
```
