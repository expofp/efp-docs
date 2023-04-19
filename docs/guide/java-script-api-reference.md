# JavaScript API Reference

See type definitions (TypeScript):

```ts
class FloorPlan {
    constructor(options?: FloorPlanOptions);

    readonly ready: Promise<void>;
    readonly element: HTMLDivElement;
    readonly eventId: string;
    readonly dataUrl: string;
    readonly noOverlay: boolean;

    onBoothClick: (e: FloorPlanBoothClickEvent) => void;

    onFpConfigured: () => void;

    onDirection: (e: FloorPlanDirectionEvent) => void;

    onDetails: (e: FloorPlanDetailsEvent) => void;

    selectBooth(nameOrExternalId: string): void;

    selectExhibitor(nameOrExternalId: string): void;

    selectCurrentPosition(
        //
        point: { x: number; y: number; angle?: number; z?: string; lat?: number; lng?: number },
        focus?: boolean
    ): void;

    updateLayerVisibility(layer: string, visible: boolean): void;

    selectRoute(from: string, to: string, exceptUnaccessible: boolean): void;
}

interface FloorPlanOptions {
    element?: HTMLDivElement;
    eventId?: string;
    dataUrl?: string;
    noOverlay?: boolean;
    onBoothClick?: (e: FloorPlanBoothClickEvent) => void;
    onDetails?: (e: FloorPlanDetailsEvent) => void;
    onFpConfigured?: () => void;
    onDirection?: (e: FloorPlanDirectionEvent) => void;
}

interface FloorPlanBooth {
    id: number;
    name: string;
}

interface FloorPlanBoothClickEvent {
    target: FloorPlanBooth;
}

interface FloorPlanDetailsEvent {
    type: "booth" | "exhibitor" | "route";
    id: string;
    name: string;
    externalId: string;
}

interface Point {
    x: number;
    y: number;
}

interface FloorPlanDirectionEvent {
    from: FloorPlanBooth;
    to: FloorPlanBooth;
    lines: { p0: Point; p1: Point }[];
    distance: string;
    time: number;
}

const ExpoFP: {
    FloorPlan: FloorPlanOptions;
};

```

[View Example](pathname:///examples/no-overlay.html)
