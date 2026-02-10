export interface RollOracleParams {
    table: string;
    subtype?: string;
}
export declare function rollOracle(params: RollOracleParams): {
    table: string;
    roll: Record<string, number>;
    result: Record<string, string>;
} | {
    table: string;
    roll: number;
    result: any;
} | {
    subtype?: string | undefined;
    table: string;
    roll: number;
    result: unknown;
};
//# sourceMappingURL=oracle.d.ts.map