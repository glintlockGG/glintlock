export interface TrackTimeParams {
    action: "status" | "add" | "tick" | "remove" | "reset";
    name?: string;
    starting_die?: number;
    category?: string;
    note?: string;
}
export interface TrackTimeResult {
    action: string;
    countdown_dice: Array<{
        name: string;
        current_die: string;
        category: string;
    }>;
    tick_result?: {
        name: string;
        rolled: number;
        die_size: number;
        stepped_down: boolean;
        new_die: string;
        exhausted: boolean;
    };
    warnings: string[];
}
export declare function trackTime(params: TrackTimeParams): TrackTimeResult;
//# sourceMappingURL=timer.d.ts.map