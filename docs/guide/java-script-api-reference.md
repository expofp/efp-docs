```ts
class FloorPlan {
    constructor(options?: FloorPlanOptions);

    readonly ready: Promise<void>;
    readonly element: HTMLDivElement;
    readonly eventId: string;
    readonly dataUrl: string;
    readonly noOverlay: boolean;
    readonly offHistory: boolean;

    onBoothClick: (e: FloorPlanBoothClickEvent) => void;

    onFpConfigured: () => void;

    onDirection: (e: FloorPlanDirectionEvent) => void;

    onDetails: (e: FloorPlanDetailsEvent) => void;

    onExhibitorCustomButtonClick: (e: FloorPlanCustomButtonEvent) => void;

    onGetCoordsClick: (e: FloorPlanGetCoordsEvent) => void;

    selectBooth(nameOrExternalId: string): void;

    selectExhibitor(nameOrExternalId: string): void;

    selectCurrentPosition(
        //
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
    onBoothClick?: (e: FloorPlanBoothClickEvent) => void;
    onFpConfigured?: () => void;
    onDirection?: (e: FloorPlanDirectionEvent) => void;
    onDetails?: (e: FloorPlanDetailsEvent) => void;
    onExhibitorCustomButtonClick?: (e: FloorPlanCustomButtonEvent) => void;
    onGetCoordsClick: (e: FloorPlanGetCoordsEvent) => void;
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

const ExpoFP: {
    FloorPlan: FloorPlanOptions;
};
```
