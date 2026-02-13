interface LightSource {
    type: string;
    rounds_remaining: number;
}
export interface TrackTimeParams {
    action: "status" | "advance" | "light" | "set_danger" | "reset";
    rounds?: number;
    light_type?: string;
    light_rounds?: number;
    danger_level?: "safe" | "unsafe" | "risky" | "deadly";
    note?: string;
}
export interface TrackTimeResult {
    action: string;
    rounds_elapsed: number;
    time_elapsed: string;
    danger_level: string;
    light_sources: LightSource[];
    has_light: boolean;
    encounter_checks?: Array<{
        round: number;
        due: boolean;
    }>;
    expired_lights?: string[];
    warnings: string[];
}
export declare function trackTime(params: TrackTimeParams): TrackTimeResult;
export {};
//# sourceMappingURL=timer.d.ts.map